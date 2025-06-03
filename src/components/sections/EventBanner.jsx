import React from "react";
import { useTranslation } from "react-i18next";
import { HandHeart, Leaf, Calendar } from 'lucide-react';

const EventBanner = () => {
  const { t, i18n } = useTranslation();

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  return (
    <section className="py-12 bg-gradient-to-b from-white to-red-50">
      <div className="container mx-auto px-4">
      
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-red-500 rounded-lg p-6 text-white text-center">
            <div className="flex justify-center mb-4">
              <HandHeart className="w-12 h-12" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${languageFontClass}`}>
              {t('home.events.community.title')}
            </h3>
            <p className={`${languageFontClass}`}>{t('home.events.community.description')}</p>
          </div>
          <div className="bg-[#FD7C00] rounded-lg p-6 text-white text-center">
            <div className="flex justify-center mb-4">
              <Leaf className="w-12 h-12" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${languageFontClass}`}>
              {t('home.events.gauSeva.title')}
            </h3>
            <p className={`${languageFontClass}`}>{t('home.events.gauSeva.description')}</p>
          </div>
          <div className="bg-red-500 rounded-lg p-6 text-white text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="w-12 h-12" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${languageFontClass}`}>
              {t('home.events.cultural.title')}
            </h3>
            <p className={`${languageFontClass}`}>{t('home.events.cultural.description')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventBanner;
