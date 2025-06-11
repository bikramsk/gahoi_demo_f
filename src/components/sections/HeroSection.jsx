import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [bannerImages, setBannerImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        // Try different API endpoints based on what works
        let response;
        let apiUrl;
        
        // Try multiple API patterns for Strapi v5
        const apiEndpoints = [
          `${API_URL}/api/banner-images?populate=*&filters[isActive][$eq]=true&sort=order:asc`,
          `${API_URL}/api/banner-images?populate=*&filters[isActive]=true`,
          `${API_URL}/api/banner-images?populate=*`,
          `${API_URL}/api/banner-images`
        ];

        for (const endpoint of apiEndpoints) {
          try {
            response = await fetch(endpoint, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                // Only include Authorization if token exists
                ...(import.meta.env.VITE_API_TOKEN && {
                  'Authorization': `Bearer ${import.meta.env.VITE_API_TOKEN}`
                })
              }
            });

            if (response.ok) {
              apiUrl = endpoint;
              break;
            }
          } catch (err) {
            // Continue to next endpoint
          }
        }

        if (!response || !response.ok) {
          const errorText = await response?.text() || 'No response received';
          throw new Error(`All API endpoints failed. Status: ${response?.status || 'Unknown'}`);
        }

        const responseData = await response.json();
        const { data } = responseData;

        if (!Array.isArray(data)) {
          throw new Error('Invalid response format - expected data array');
        }

        const activeBanners = data
          .filter(item => {
            // Filter for active banners with required images
            // In Strapi v5, fields are directly on the item, not nested under attributes
            return item.isActive === true && 
                   item.desktopImage && 
                   item.mobileImage;
          })
          .map(item => {
            // In Strapi v5, image objects are directly available (not nested under data.attributes)
            const desktopUrl = item.desktopImage.url;
            const mobileUrl = item.mobileImage.url;
            
            return {
              id: item.id,
              desktop: desktopUrl.startsWith('http') ? desktopUrl : `${API_URL}${desktopUrl}`,
              mobile: mobileUrl.startsWith('http') ? mobileUrl : `${API_URL}${mobileUrl}`,
              altText: item.altText || `Banner ${item.id}`,
              order: item.order
            };
          })
          .sort((a, b) => a.order - b.order); // Sort by order field
        
        if (activeBanners.length === 0) {
          throw new Error('No active banners found. Check that banners are published and isActive=true');
        }

        setBannerImages(activeBanners);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (bannerImages.length === 0) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === bannerImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerImages.length]);

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  if (isLoading) {
    return (
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[80vh] lg:h-screen w-full overflow-hidden bg-gray-200 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading banners...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || bannerImages.length === 0) {
    return (
      <section className="relative h-[40vh] sm:h-[50vh] md:h-[80vh] lg:h-screen w-full overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-red-500 mb-2 font-medium">
            {error || 'No active banners available'}
          </p>
          
        </div>
      </section>
    );
  }

  const currentBanner = bannerImages[currentImageIndex];
  const imagePath = isMobile ? currentBanner.mobile : currentBanner.desktop;

  return (
    <section className="relative h-[40vh] sm:h-[50vh] md:h-[80vh] lg:h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{ 
          backgroundImage: `url("${imagePath}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        role="img"
        aria-label={currentBanner.altText}
      />
{/* 
      Optional overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-black/10" /> */}

      {/* Carousel Dots */}
      {bannerImages.length > 1 && (
        <div className="absolute right-2 sm:right-4 md:right-8 top-[65%] md:top-1/2 transform -translate-y-1/2 z-20 flex flex-col space-y-1.5 sm:space-y-2 md:space-y-4">
          {bannerImages.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-4 md:h-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/50 ${
                index === currentImageIndex 
                  ? 'bg-yellow-300 scale-125 shadow-md' 
                  : 'bg-white/40 hover:bg-white/60 hover:scale-110'
              }`}
              aria-label={`Go to slide ${index + 1} of ${bannerImages.length}`}
            />
          ))}
        </div>
      )}


    </section>
  );
};

export default HeroSection;