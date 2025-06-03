import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { FaCalendar, FaMapMarkerAlt, FaImages, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL || "http://localhost:1337";

const LatestNews = () => {
  const { t, i18n } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentNewsItem, setCurrentNewsItem] = useState(null);
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const newsPerPage = 6;

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(
          `${API_URL}/api/latest-news-items?populate[0]=Title&populate[1]=Description&populate[2]=Images`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }

        const result = await response.json();
        console.log('Raw API response:', result);

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error('Invalid data structure received');
        }

        const fetchedNews = result.data.map((item) => {
          // Get both language versions for title and description
          const hiTitle = item.Title?.[0]?.hi || '';
          const enTitle = item.Title?.[0]?.en || '';
          
          // Process description properly to get full text
          const hiDesc = item.Description?.[0]?.hi?.map(block => 
            block.children?.map(child => child.text).join('')
          ).join('\n') || '';
          
          const enDesc = item.Description?.[0]?.en?.map(block => 
            block.children?.map(child => child.text).join('')
          ).join('\n') || '';
          
          return {
            id: item.id,
            title: {
              hi: hiTitle,
              en: enTitle || hiTitle 
            },
            description: {
              hi: hiDesc,
              en: enDesc || hiDesc 
            },
            date: item.Date ? new Date(item.Date) : new Date(0),
            formattedDate: item.Date ? new Date(item.Date).toLocaleDateString() : '',
            location: item.Location || '',
            images: item.Images?.map(img => {
              const url = img.url;
              return url ? (url.startsWith('http') ? url : `${API_URL}${url}`) : '';
            }) || []
          };
        });

        // Sort news by date in descending order (newest first)
        fetchedNews.sort((a, b) => b.date - a.date);

        console.log('Processed news:', fetchedNews);
        setNews(fetchedNews);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Calculate pagination
  const totalPages = Math.ceil(news.length / newsPerPage);
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = news.slice(indexOfFirstNews, indexOfLastNews);

  const openModal = (image, newsItem) => {
    setSelectedImage(image);
    setCurrentNewsItem(newsItem);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedImage(null);
    setCurrentNewsItem(null);
    document.body.style.overflow = "unset";
  };

  const navigateImage = (direction) => {
    if (!currentNewsItem) return;
    const currentIndex = currentNewsItem.images.indexOf(selectedImage);
    let newIndex;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % currentNewsItem.images.length;
    } else {
      newIndex = (currentIndex - 1 + currentNewsItem.images.length) % currentNewsItem.images.length;
    }

    setSelectedImage(currentNewsItem.images[newIndex]);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") navigateImage("next");
      if (e.key === "ArrowLeft") navigateImage("prev");
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedImage, currentNewsItem]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-red-50/30 to-gray-50">
      <Helmet>
        <title>{t('latestNews.meta.title')}</title>
        <meta name="description" content={t('latestNews.meta.description')} />
      </Helmet>

      {/* Hero Section */}
      <div className="relative w-full bg-red-800 pt-32 md:pt-40 pb-20 md:pb-32">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-900/30 to-red-900/70"></div>
        <img
          src="/latestnews-hero.webp"
          alt={t('latestNews.hero.backgroundAlt')}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full w-20 h-20 mx-auto mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H14"
                />
              </svg>
            </div>
            <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 ${languageFontClass}`}>
              {t('latestNews.hero.title')}
            </h1>
            <p className={`text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto ${languageFontClass}`}>
              {t('latestNews.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* News Content Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-red-200 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-red-600 rounded-full animate-spin absolute top-0 left-0 border-t-transparent"></div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${languageFontClass}`}>
                {t('latestNews.error.title')}
              </h3>
              <p className={`text-gray-600 ${languageFontClass}`}>{error}</p>
            </div>
          ) : news.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${languageFontClass}`}>
                {t('latestNews.empty.title')}
              </h3>
              <p className={`text-gray-600 ${languageFontClass}`}>
                {t('latestNews.empty.description')}
              </p>
            </div>
          ) : (
            <>
              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {currentNews.map((newsItem) => (
                  <div
                    key={newsItem.id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-300 "
                  >
                    {/* News Images */}
                    {newsItem.images.length > 0 && (
                      <div className="relative h-64 overflow-hidden">
                        <img
                          src={newsItem.images[0]}
                          alt={newsItem.title[i18n.language]}
                          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                          onClick={() => openModal(newsItem.images[0], newsItem)}
                        />
                        {newsItem.images.length > 1 && (
                          <button
                            onClick={() => openModal(newsItem.images[0], newsItem)}
                            className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 hover:bg-black/80"
                          >
                            <FaImages className="w-4 h-4" />
                            <span>{newsItem.images.length} {t('latestNews.moreImages')}</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* News Content */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FaCalendar className="w-4 h-4 text-red-500" />
                          <span className={languageFontClass}>{newsItem.formattedDate}</span>
                        </div>
                        {newsItem.location && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                            <span className={languageFontClass}>{newsItem.location}</span>
                          </div>
                        )}
                      </div>
                      <h2 className={`text-2xl font-bold text-gray-900 mb-4 ${languageFontClass}`}>
                        {newsItem.title[i18n.language]}
                      </h2>
                      <p className={`text-gray-600 mb-6 whitespace-pre-line ${languageFontClass}`}>
                        {newsItem.description[i18n.language]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-full ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    } transition-colors`}
                  >
                    <FaChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full ${
                        currentPage === page
                          ? "bg-red-600 text-white"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      } transition-colors`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    } transition-colors`}
                  >
                    <FaChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/95 z-50">
          <div className="absolute inset-0 flex items-center justify-center p-4">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
            >
              <FaTimes className="w-8 h-8" />
            </button>

            {/* Navigation Buttons */}
            {currentNewsItem && currentNewsItem.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("prev");
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50"
                >
                  <FaChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage("next");
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white transition-colors z-50"
                >
                  <FaChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div className="relative max-w-7xl w-full mx-auto" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedImage}
                alt={currentNewsItem?.title[i18n.language]}
                className="max-h-[85vh] mx-auto object-contain rounded-lg"
              />
              
              {/* Image Info */}
              {currentNewsItem && (
                <div className="absolute left-0 right-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <h3 className={`text-2xl font-bold mb-2 ${languageFontClass}`}>
                    {currentNewsItem.title[i18n.language]}
                  </h3>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FaCalendar className="w-4 h-4" />
                      <span>{currentNewsItem.formattedDate}</span>
                    </div>
                    {currentNewsItem.location && (
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        <span>{currentNewsItem.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestNews;
