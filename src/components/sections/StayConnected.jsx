import React from 'react';
import { Download, Star, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function StayConnected() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-100 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Content */}
          <div className="flex-1 text-white max-w-2xl">
            <div className="mb-4">
              <p className="text-lg font-medium mb-2 opacity-90">{t('home.stayConnected.heading')}</p>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              {t('home.stayConnected.title')}
            </h1>
            
            <div className="w-16 h-1 bg-white mb-8"></div>
            
            <p className="text-xl leading-relaxed mb-12 opacity-90">
              {t('home.stayConnected.description')}
            </p>
            
            <div className="mb-8">
              <p className="text-lg font-medium mb-6">{t('home.stayConnected.moreInfo')}</p>
              
              {/* Google Play Button */}
              <a
                href="https://play.google.com/store/apps/details?id=com.gahoisamaj"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('home.stayConnected.playStoreAlt')}
              >
                <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors mb-6">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                  </svg>
                  <div className="text-left">
                    <div className="text-xs">{t('home.stayConnected.getItOn')}</div>
                    <div className="text-sm font-semibold">{t('home.stayConnected.googlePlay')}</div>
                  </div>
                </button>
              </a>
              
              <p className="text-base opacity-80 underline cursor-pointer hover:opacity-100 transition-opacity">
                {t('home.stayConnected.viewMoreApps')}
              </p>
            </div>
          </div>

          {/* Right - Mobile Mockup */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-80 h-[600px] bg-white rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-gray-900 rounded-2xl overflow-hidden relative">
                  
                  {/* Status Bar */}
                  <div className="bg-gray-800 px-4 py-2 flex justify-between items-center text-white text-sm">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="w-4 h-4 rotate-180" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                      <div className="w-1 h-1 bg-white rounded-full"></div>
                    </div>
                  </div>

                  {/* App Content */}
                  <div className="p-6 text-white">
                    {/* App Icon and Title */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{t('home.stayConnected.appTitle')}</h3>
                        <h4 className="font-bold text-lg">{t('home.stayConnected.appSubtitle')}</h4>
                        <p className="text-green-400 text-sm">{t('home.stayConnected.appDeveloper')}</p>
                      </div>
                    </div>

                    {/* Download and Rating */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <Download className="w-6 h-6 mx-auto mb-1" />
                        <div className="text-sm">{t('home.stayConnected.appSize')}</div>
                      </div>
                      <div className="text-center">
                        <Star className="w-6 h-6 mx-auto mb-1 fill-current" />
                        <div className="text-sm">{t('home.stayConnected.appRating')}</div>
                      </div>
                    </div>

                    {/* Install Button */}
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold text-lg mb-6 hover:bg-green-700 transition-colors">
                      {t('home.stayConnected.installButton')}
                    </button>

                    {/* Screenshots */}
                    <div className="flex gap-2 mb-6">
                      <div className="w-20 h-32 bg-gray-700 rounded-lg"></div>
                      <div className="w-20 h-32 bg-red-600 rounded-lg"></div>
                      <div className="w-20 h-32 bg-red-700 rounded-lg"></div>
                    </div>

                    {/* About Section */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold">{t('home.stayConnected.aboutApp')}</h4>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

