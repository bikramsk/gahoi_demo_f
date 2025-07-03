import { useTranslation } from 'react-i18next';
import { Helmet } from "react-helmet-async";
import { useState } from 'react';
import { Users } from 'lucide-react';

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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-[url('/gotra-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        <div className="relative pt-16 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-xl">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {t('gotraAankna.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
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