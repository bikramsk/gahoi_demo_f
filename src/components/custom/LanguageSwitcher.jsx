import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  const toggleLanguage = () => {
    i18n.changeLanguage(isHindi ? 'en' : 'hi');
  };

  return (
    <div 
      onClick={toggleLanguage}
      className="flex items-center cursor-pointer rounded-full hover:bg-red-800/20 transition-colors px-2 py-1.5 bg-white/10"
      title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
    >
      <span 
        className={`text-xs font-semibold w-5 text-center font-english ${
          !isHindi ? "text-[#FD7D01] font-bold" : "text-red-800"
        }`}
      >
        EN
      </span>
      <div 
        className="relative inline-flex h-5 w-8 mx-1.5 items-center rounded-full transition-colors"
        style={{
          backgroundColor: isHindi ? '#dc2626' : '#991b1b'
        }}
      >
        <span className="sr-only">Toggle language</span>
        <span
          className={`${
            isHindi ? 'translate-x-[18px]' : 'translate-x-[2px]'
          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm`}
        />
      </div>
      <span 
        className={`text-xs font-semibold w-5 text-center font-hindi ${
          isHindi ? "text-[#FD7D01] font-bold" : "text-red-800"
        }`}
      >
        हिं
      </span>
    </div>
  );
};

export default LanguageSwitcher;