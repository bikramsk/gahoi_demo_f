import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

// Custom Arrow 
const PrevArrow = (props) => (
  <button
    {...props}
    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-full shadow-lg hover:shadow-xl p-3 transition-all duration-300 transform hover:scale-110 border border-red-100"
    aria-label="Previous testimonial"
    style={{ display: props.currentSlide === 0 ? 'none' : 'block' }}
  >
    <FaChevronLeft className="w-5 h-5" />
  </button>
);

const NextArrow = (props) => (
  <button
    {...props}
    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white hover:bg-red-600 hover:text-white text-red-600 rounded-full shadow-lg hover:shadow-xl p-3 transition-all duration-300 transform hover:scale-110 border border-red-100"
    aria-label="Next testimonial"
    style={{ display: props.currentSlide === props.slideCount - props.slidesToShow ? 'none' : 'block' }}
  >
    <FaChevronRight className="w-5 h-5" />
  </button>
);

const OurTestimonialsSection = () => {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/testimonials?populate=*`)
      .then(res => res.json())
      .then(result => {
        if (result.data && Array.isArray(result.data)) {
          setTestimonials(result.data.map(item => {
            const testimonial = item.attributes || item;
            return {
              id: item.id,
              name: testimonial.name,
              designation: testimonial.designation || '',
              review: testimonial.review || '',
              image: testimonial.image?.url
                ? testimonial.image.url.startsWith('http')
                  ? testimonial.image.url
                  : `${API_URL}${testimonial.image.url}`
                : '/user-placeholder.jpg',
              rating: testimonial.rating || 5,
            };
          }));
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching testimonials:', err);
        setIsLoading(false);
      });
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // dotsClass: 'slick-dots custom-dots',
    // appendDots: dots => (
    //   <ul className="hidden sm:flex">{dots}</ul>
    // ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: false
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          centerMode: false,
          centerPadding: '0px'
        }
      }
    ]
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-white via-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-red-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-red-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/*  Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-red-600"></div>
              <FaQuoteLeft className="text-red-600 text-2xl" />
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-red-600"></div>
            </div>
          </div>
         <h2 className="text-3xl md:text-4xl font-bold text-red-700 mb-4 font-english">
            {t('home.testimonials.title')}
          </h2>
          <p className="text-gray-700 text-base max-w-2xl mx-auto">
            {t('home.testimonials.description')}
          </p>
        </div>

        {/*  Slider */}
        <div className="relative max-w-7xl mx-auto">
          <style jsx>{`
            .custom-dots li button:before {
              font-size: 12px;
              color: #dc2626;
              opacity: 0.5;
            }
            .custom-dots li.slick-active button:before {
              opacity: 1;
              color: #dc2626;
            }
          `}</style>
          
          <Slider {...sliderSettings}>
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="px-3 h-full">
                <div className="group bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center h-[420px] min-h-[400px] transition-all duration-500 relative overflow-hidden border border-red-50 hover:border-red-200 transform ">
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                

                  {/*  Image */}
                  <div className="relative mt-4 mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-orange-400 rounded-full blur-sm opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="relative w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-all duration-300"
                    />
                  </div>

                  {/* Review */}
                  <div className="flex-1 flex items-center justify-center mb-2 relative z-10">
                    <p className="text-gray-700 text-center font-english font-small text-sm leading-snug line-clamp-8 overflow-hidden">
                      "{testimonial.review}"
                    </p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-4 relative z-10">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 transition-all duration-300 ${
                            i < testimonial.rating 
                              ? 'text-yellow-400 drop-shadow-sm' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Name and Designation */}
                  <div className="text-center relative z-10">
                    <div className="text-lg font-bold text-red-800 mb-1 group-hover:text-red-700 transition-colors duration-300">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {testimonial.designation}
                    </div>
                  </div>

                  
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

      
      </div>
    </section>
  );
};

export default OurTestimonialsSection;