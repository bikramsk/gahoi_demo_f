import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaQuoteLeft, FaCircle } from 'react-icons/fa';

const AboutSection = () => {
  const { t, i18n } = useTranslation();
  
  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";
  
  return (
    <div className="py-16 bg-gradient-to-b from-white to-red-50 relative overflow-hidden">
     
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="w-full md:w-1/2 mb-8 md:mb-0 pr-0 md:pr-12 relative">
            {/* Decorative quote icon */}
            <div className="absolute -top-6 -left-2 text-red-200/50">
              <FaQuoteLeft className="w-12 h-12" />
            </div>
            
            {/* Section Title with decorative line */}
            <div className="relative mb-6">
              <h2 className={`text-3xl md:text-4xl font-bold text-red-800 mb-4 ${languageFontClass}`}>
                {t('home.about.title')}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-red-800 to-red-300 rounded-full"></div>
            </div>

            <p className={`text-gray-600 mb-6 relative z-10 ${languageFontClass}`}>
              {t('home.about.description')}
            </p>

            {/* Decorative dots */}
            <div className="flex gap-1.5 text-red-300/50">
              <FaCircle className="w-2 h-2" />
              <FaCircle className="w-2 h-2" />
              <FaCircle className="w-2 h-2" />
            </div>
          </div>

          {/* Right Images with enhanced styling */}
          <div className="w-full md:w-1/2">
            <div className="relative w-full h-[400px]">
              {/* First image with subtle hover effect */}
              <div className="absolute top-0 left-0 w-3/4 h-3/4 shadow-lg rounded-lg overflow-hidden transition-transform duration-500 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <img 
                  src="/about-02.webp" 
                  alt={t('home.about.images.communityGathering')} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Second image with subtle hover effect */}
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 shadow-lg rounded-lg overflow-hidden transition-transform duration-500 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <img 
                  src="/about-01.webp" 
                  alt={t('home.about.images.culturalEvent')} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative corner accents */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-red-800/20 rounded-tl-lg"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-red-800/20 rounded-br-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection; 