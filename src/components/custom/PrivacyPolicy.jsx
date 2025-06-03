import React from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const heroImage = "/privay-policy-herobg.webp";

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>{t('privacyPolicy.title')}</title>
        <meta
          name="description"
          content={t('privacyPolicy.subtitle')}
        />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src={heroImage}
          alt={t('privacyPolicy.title')}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white my-4">
              {t('privacyPolicy.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              {t('privacyPolicy.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            <div className="border-l-4 border-red-800 pl-4">
              <p className="text-gray-600">
                {t('privacyPolicy.intro')}
              </p>
            </div>

            {/* Information Collection Section */}
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">{t('privacyPolicy.sections.infoCollection.title')}</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <ul className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-800 mr-2">•</span>
                      <span>{t(`privacyPolicy.sections.infoCollection.items.${index}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SMS Permission Section */}
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">{t('privacyPolicy.sections.smsPermission.title')}</h2>
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-gray-700">
                  {t('privacyPolicy.sections.smsPermission.intro')}
                </p>
                <ul className="mt-3 space-y-2">
                  {[1, 2, 3].map((index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-red-800 mr-2">•</span>
                      <span>{t(`privacyPolicy.sections.smsPermission.items.${index}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Information Usage Section */}
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">{t('privacyPolicy.sections.infoUsage.title')}</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="mb-4">{t('privacyPolicy.sections.infoUsage.intro')}</p>
                <ul className="space-y-4">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-800 mr-2">•</span>
                      <span>{t(`privacyPolicy.sections.infoUsage.items.${index}`)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Information Sharing Section */}
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">{t('privacyPolicy.sections.infoSharing.title')}</h2>
              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-gray-700 mb-6">
                  {t('privacyPolicy.sections.infoSharing.intro')}
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">{t('privacyPolicy.sections.infoSharing.serviceProviders.title')}</h3>
                    <p className="text-gray-700">
                      {t('privacyPolicy.sections.infoSharing.serviceProviders.content')}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-red-800 mb-2">{t('privacyPolicy.sections.infoSharing.legal.title')}</h3>
                    <p className="text-gray-700">
                      {t('privacyPolicy.sections.infoSharing.legal.content')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Policy Updates Section */}
            <div>
              <h2 className="text-2xl font-bold text-red-800 mb-4">{t('privacyPolicy.sections.policyUpdates.title')}</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700">
                  {t('privacyPolicy.sections.policyUpdates.content')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 