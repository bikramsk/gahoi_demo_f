import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaHandHoldingHeart, FaLeaf, FaHome, FaMedkit } from 'react-icons/fa';

const CowSevaSection = () => {
  const { t, i18n } = useTranslation();

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  const sevaActivities = [
    {
      icon: <FaHandHoldingHeart className="w-8 h-8 text-orange-600" />,
      translationKey: 'dailyCare'
    },
    {
      icon: <FaHome className="w-8 h-8 text-orange-600" />,
      translationKey: 'shelter'
    },
    {
      icon: <FaMedkit className="w-8 h-8 text-orange-600" />,
      translationKey: 'medical'
    },
    {
      icon: <FaLeaf className="w-8 h-8 text-orange-600" />,
      translationKey: 'products'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold text-red-800 mb-4 ${languageFontClass}`}>
            {t('home.cowSeva.title')}
          </h2>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto mb-8 ${languageFontClass}`}>
            {t('home.cowSeva.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {sevaActivities.map((activity, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  {activity.icon}
                </div>
              </div>
              <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${languageFontClass}`}>
                {t(`home.cowSeva.activities.${activity.translationKey}.title`)}
              </h3>
              <p className={`text-gray-600 ${languageFontClass}`}>
                {t(`home.cowSeva.activities.${activity.translationKey}.description`)}
              </p>
            </div>
          ))}
        </div>

        {/* Donation Call to Action */}
        <div className="bg-orange-100 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className={`text-2xl md:text-3xl font-bold text-red-800 mb-4 ${languageFontClass}`}>
              {t('home.cowSeva.donate.title')}
            </h3>
            <p className={`text-gray-700 mb-6 ${languageFontClass}`}>
              {t('home.cowSeva.donate.description')}
            </p>
            <button 
              className={`inline-flex items-center justify-center px-8 py-4 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl ${languageFontClass}`}
              onClick={() => window.location.href = '/contact-us'}
            >
              <FaHandHoldingHeart className="w-5 h-5 mr-2" />
              <span>
                {t('home.cowSeva.donate.button')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CowSevaSection; 