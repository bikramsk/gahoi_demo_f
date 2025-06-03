import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaNewspaper, FaShareAlt, FaUsers, FaHandshake } from 'react-icons/fa';

const NewsSubmissionSection = () => {
  const { t, i18n } = useTranslation();

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  const features = [
    {
      icon: <FaNewspaper className="w-8 h-8 text-red-600" />,
      translationKey: 'shareNews'
    },
    {
      icon: <FaShareAlt className="w-8 h-8 text-red-600" />,
      translationKey: 'awareness'
    },
    {
      icon: <FaUsers className="w-8 h-8 text-red-600" />,
      translationKey: 'connect'
    },
    {
      icon: <FaHandshake className="w-8 h-8 text-red-600" />,
      translationKey: 'partnerships'
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4 ${languageFontClass}`}>
            {t('home.newsSubmission.title')}
          </h2>
          <p className={`text-base sm:text-lg text-gray-600 max-w-2xl mx-auto mb-8 ${languageFontClass}`}>
            {t('home.newsSubmission.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12">
          {/* Left side - Image */}
          <div className="relative">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/News-add.webp" 
                alt={t('home.newsSubmission.imageAlt')}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-100 rounded-full opacity-20 z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-red-100 rounded-full opacity-20 z-0"></div>
          </div>

          {/* Right side - Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-red-50 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-lg font-bold text-gray-900 mb-2 ${languageFontClass}`}>
                  {t(`home.newsSubmission.features.${feature.translationKey}.title`)}
                </h3>
                <p className={`text-gray-600 ${languageFontClass}`}>
                  {t(`home.newsSubmission.features.${feature.translationKey}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <a 
            href="mailto:gahloishakti@gmail.com"
            className={`inline-flex items-center justify-center px-8 py-4 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-colors duration-300 shadow-lg hover:shadow-xl text-base sm:text-lg ${languageFontClass}`}
          >
            <span>
              {t('home.newsSubmission.submitButton')}
            </span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default NewsSubmissionSection; 