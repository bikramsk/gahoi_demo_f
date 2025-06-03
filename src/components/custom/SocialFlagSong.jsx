import React from "react";
import { Helmet } from "react-helmet-async";
import flagImage from "/flag.png";
import { useTranslation } from "react-i18next";

const SocialFlagSong = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{t('flagSong.meta.title')}</title>
        <meta
          name="description"
          content={t('flagSong.meta.description')}
        />
      </Helmet>

      {/* Hero Banner with Background Image */}
      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/flagsong-hero.webp"
          alt={t('flagSong.hero.backgroundAlt')}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="p-3 md:p-5 bg-white/10 rounded-full w-20 h-20 mx-auto mb-6 backdrop-blur-sm">
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
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              {t('flagSong.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto">
              {t('flagSong.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            {/* Flag Image */}
            <div className="w-full md:w-1/4 flex-shrink-0 order-first md:order-2 mb-8 md:mb-0">
              <div className="sticky top-8">
                <img
                  src={flagImage}
                  alt={t('flagSong.flag.imageAlt')}
                  className="w-full h-[500px] object-contain max-w-[250px] mx-auto"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Left Side Lyrics */}
            <div className="w-full md:w-1/3 space-y-6 order-2 md:order-1">
              <div className="bg-red-50 rounded-xl p-6">
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="text-center bg-white rounded-lg p-4">
                      <p className={`text-${t(`flagSong.lyrics.left.${index}.color`)} font-semibold text-lg leading-relaxed`}>
                        {t(`flagSong.lyrics.left.${index}.line1`)}<br />
                        <span className={index % 2 === 1 ? "text-red-600" : ""}>
                          {t(`flagSong.lyrics.left.${index}.line2`)}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Lyrics */}
            <div className="w-full md:w-1/3 space-y-6 order-3">
              <div className="bg-red-50 rounded-xl p-6">
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div key={index} className="text-center bg-white rounded-lg p-4">
                      <p className={`text-${t(`flagSong.lyrics.right.${index}.color`)} font-semibold text-lg leading-relaxed`}>
                        {t(`flagSong.lyrics.right.${index}.line1`)}<br />
                        <span className={index % 2 === 0 ? "text-red-600" : ""}>
                          {t(`flagSong.lyrics.right.${index}.line2`)}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <div className="inline-block bg-red-800 rounded-full px-8 py-3">
              <p className="text-2xl font-bold text-yellow-200">
                {t('flagSong.footer.text')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialFlagSong;