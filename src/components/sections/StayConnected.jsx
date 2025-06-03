import React from "react";
import { useTranslation } from "react-i18next";

const StayConnected = () => {
  const { t } = useTranslation();

  return (
    <div
      className="w-full relative overflow-hidden"
      style={{ 
        backgroundImage: 'url("/stayconnected-bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Decorative bg elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full filter blur-3xl"></div>
      </div>

      {/* Decorative border  */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

      <div className="container mx-auto flex flex-col md:flex-row items-center py-8 px-4 relative">
        {/* Left side  */}
        <div className="w-full md:w-1/2 text-white space-y-6">
          <div className="relative">
            <p className="uppercase tracking-wider text-sm md:text-base font-light">
              {t('home.stayConnected.heading')}
            </p>
            <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-white/60"></div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif relative">
            {t('home.stayConnected.title')}
            <div className="absolute -bottom-2 left-0 w-24 h-0.5 bg-white/60"></div>
          </h2>

          <p className="text-sm md:text-base leading-relaxed opacity-90 max-w-xl font-light">
            {t('home.stayConnected.description')}
          </p>

          <div className="max-w-lg h-[1px] bg-white/60 w-full"></div>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <p className="font-medium text-base">{t('home.stayConnected.moreInfo')}</p>
              <a
                href="https://play.google.com/store/apps/details?id=com.gahoisamaj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block transform hover:scale-105 transition-transform duration-300"
              >
                <img
                  src="/app_download.png"
                  alt={t('home.stayConnected.playStoreAlt')}
                  className="h-12"
                />
              </a>
            </div>

            <a
              href="#"
              className="inline-block text-sm border-b border-white/50 hover:border-white transition-colors duration-300 hover:text-white/90"
            >
              {t('home.stayConnected.viewMoreApps')}
            </a>
          </div>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 flex justify-center mt-8 md:mt-0">
          <div className="relative w-[280px] md:w-[320px]">
            <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-xl"></div>
            <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-3 shadow-2xl">
              <img
                src="/app.png"
                alt={t('home.stayConnected.appImageAlt')}
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayConnected;


