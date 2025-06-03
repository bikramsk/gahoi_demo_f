import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaLandmark, FaHistory, FaUsers, FaAward, FaQuoteRight, FaHandHoldingHeart, FaBookReader } from 'react-icons/fa';

const CulturalHeritageSection = () => {
  const { t, i18n } = useTranslation();

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  const heritageItems = [
    {
      icon: <FaLandmark className="w-8 h-8 text-orange-600" />,
      title: t('home.heritage.items.traditions.title'),
      description: t('home.heritage.items.traditions.description')
    },
    {
      icon: <FaHistory className="w-8 h-8 text-orange-600" />,
      title: t('home.heritage.items.legacy.title'),
      description: t('home.heritage.items.legacy.description')
    },
    {
      icon: <FaUsers className="w-8 h-8 text-orange-600" />,
      title: t('home.heritage.items.values.title'),
      description: t('home.heritage.items.values.description')
    },
    {
      icon: <FaAward className="w-8 h-8 text-orange-600" />,
      title: t('home.heritage.items.achievements.title'),
      description: t('home.heritage.items.achievements.description')
    }
  ];
  

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-red-800 mb-4 ${languageFontClass}`}>
            {t('home.heritage.title')}
          </h2>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto mb-8 ${languageFontClass}`}>
            {t('home.heritage.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {heritageItems.map((item, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  {item.icon}
                </div>
              </div>
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${languageFontClass}`}>
                {item.title}
              </h3>
              <p className={`text-gray-600 ${languageFontClass}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Cultural Story */}
        <div className="bg-gradient-to-r from-orange-50 via-white to-orange-50 rounded-2xl shadow-lg p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Main Story */}
            <div className="text-center mb-12">
              <div className="inline-block p-4 bg-orange-100 rounded-full mb-6">
                <FaQuoteRight className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className={`text-2xl md:text-3xl font-bold text-red-800 mb-6 ${languageFontClass}`}>
                {t('home.heritage.story.title')}
              </h3>
              <p className={`text-gray-600 text-lg mb-8 ${languageFontClass}`}>
                {t('home.heritage.story.description')}
              </p>
            </div>

            {/* Cultural Highlights */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <FaHandHoldingHeart className="w-6 h-6 text-orange-600 mr-3" />
                  <h4 className={`text-xl font-semibold text-gray-900 ${languageFontClass}`}>
                    {t('home.heritage.highlights.values.title')}
                  </h4>
                </div>
                <p className={`text-gray-600 ${languageFontClass}`}>
                  {t('home.heritage.highlights.values.description')}
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <FaBookReader className="w-6 h-6 text-orange-600 mr-3" />
                  <h4 className={`text-xl font-semibold text-gray-900 ${languageFontClass}`}>
                    {t('home.heritage.highlights.education.title')}
                  </h4>
                </div>
                <p className={`text-gray-600 ${languageFontClass}`}>
                  {t('home.heritage.highlights.education.description')}
                </p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <div className="h-1 w-12 bg-orange-200 rounded-full"></div>
                <div className="h-1 w-24 bg-red-800 rounded-full"></div>
                <div className="h-1 w-12 bg-orange-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CulturalHeritageSection; 