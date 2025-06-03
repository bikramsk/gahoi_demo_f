import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { useState } from 'react';

const GotraAankna = () => {
  const { t, i18n } = useTranslation();
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";
  const [activeGotra, setActiveGotra] = useState(null);

  
  const gotraAnknaData = t('gotraAankna.data', { returnObjects: true }) || [];


  const gotraPoints = t('gotraAankna.content.importance.gotra.points', { returnObjects: true }) || [];
  const aanknaPoints = t('gotraAankna.content.importance.aankna.points', { returnObjects: true }) || [];

  return (
    <div className="min-h-screen bg-[#FFF7ED]">
      <Helmet>
        <title>{t('gotraAankna.meta.title')}</title>
        <meta name="description" content={t('gotraAankna.meta.description')} />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative w-full bg-red-800 h-[300px] sm:h-[400px] md:h-[500px]">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/gotra-bg.webp"
          alt="Gotra & Aankna Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
          <div className="text-center w-full pt-12 sm:pt-16 md:pt-20">
            <div className="p-3 md:p-5 bg-white/10 rounded-full w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 backdrop-blur-sm">
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
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 sm:mb-4 ${languageFontClass}`}>
              {t('gotraAankna.title')}
            </h1>
            <p className={`text-lg sm:text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto px-4 ${languageFontClass}`}>
              {t('gotraAankna.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {Array.isArray(gotraAnknaData) && gotraAnknaData.map((gotra, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden">
              {/* Card Header */}
              <div className="bg-red-700 px-4 sm:px-6 py-3 sm:py-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className={`text-base sm:text-xl font-bold ${languageFontClass} leading-tight`}>
                    {t('gotraAankna.content.gotraLabel')} {gotra.mainGotra}
                  </h2>
                  <span className="bg-white/20 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-6">
                <div className="space-y-2 mb-4">
                  <p className={`text-gray-800 ${languageFontClass}`}>
                    {t('gotraAankna.content.rishiLabel')} {gotra.rishi}
                  </p>
                  <p className={`text-gray-800 ${languageFontClass}`}>
                    {t('gotraAankna.content.kulDeviLabel')} {gotra.kulDevi}
                  </p>
                </div>

                {/* Aankna List */}
                <div>
                  <button
                    onClick={() => setActiveGotra(activeGotra === index ? null : index)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeGotra === index
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {activeGotra === index ? t('gotraAankna.content.hideAanknaList') : t('gotraAankna.content.viewAanknaList')}
                  </button>

                  {activeGotra === index && (
                    <div className="mt-4 space-y-2">
                      <h3 className={`font-medium text-gray-900 ${languageFontClass}`}>
                        {t('gotraAankna.content.aanknaListLabel')}:
                      </h3>
                      {Array.isArray(gotra.anknaList) && gotra.anknaList.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {gotra.anknaList.map((aankna, idx) => (
                            <li key={idx} className={`text-gray-700 ${languageFontClass}`}>
                              {aankna}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={`text-gray-500 italic ${languageFontClass}`}>
                          {t('gotraAankna.content.noAankna')}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Information Section */}
        <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Importance of Gotra */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-red-700 px-4 sm:px-6 py-3 sm:py-4">
              <h3 className={`text-xl sm:text-2xl font-bold text-white ${languageFontClass}`}>
                {t('gotraAankna.content.importance.gotra.title')}
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <p className={`text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 ${languageFontClass}`}>
                {t('gotraAankna.content.importance.gotra.description')}
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {Array.isArray(gotraPoints) && gotraPoints.map((item, idx) => (
                  <li key={idx} className={`flex items-center text-sm sm:text-base text-gray-700 ${languageFontClass}`}>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Importance of Aankna */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="bg-red-700 px-4 sm:px-6 py-3 sm:py-4">
              <h3 className={`text-xl sm:text-2xl font-bold text-white ${languageFontClass}`}>
                {t('gotraAankna.content.importance.aankna.title')}
              </h3>
            </div>
            <div className="p-4 sm:p-6">
              <p className={`text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 ${languageFontClass}`}>
                {t('gotraAankna.content.importance.aankna.description')}
              </p>
              <ul className="space-y-2 sm:space-y-3">
                {Array.isArray(aanknaPoints) && aanknaPoints.map((item, idx) => (
                  <li key={idx} className={`flex items-center text-sm sm:text-base text-gray-700 ${languageFontClass}`}>
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GotraAankna; 