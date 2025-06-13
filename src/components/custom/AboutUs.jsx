import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AboutUs = () => {
  const { t, i18n } = useTranslation();

  // Font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  // reusable styles
  const sectionStyles = "mb-8 md:mb-16";
  const headingStyles = `text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 ${languageFontClass}`;
  const paragraphStyles = `text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg ${languageFontClass}`;

  //  default values
  const values = [
    {
      title: t("aboutUs.values.truth.title"),
      description: t("aboutUs.values.truth.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: t("aboutUs.values.dharma.title"),
      description: t("aboutUs.values.dharma.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      title: t("aboutUs.values.service.title"),
      description: t("aboutUs.values.service.description"),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  // Additional styles
  const decorativeStyles = {
    gradientBg: "bg-gradient-to-br from-orange-50 via-white to-orange-50",
    patternOverlay: `bg-repeat opacity-10 absolute inset-0`,
  };

  const SectionTitle = ({ title }) => (
    <div className="text-center mb-8">
      <h2 className={headingStyles}>{title}</h2>
      <div className="w-24 h-1 bg-red-700 mx-auto rounded-full"></div>
    </div>
  );

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>{t("aboutUs.meta.title")}</title>
        <meta name="description" content={t("aboutUs.meta.description")} />
      </Helmet>

      {/* Hero Banner with Background Image */}
      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black/50"></div>
        <img
          src="/aboutus-hero.webp"
          alt={t("aboutUs.hero.imageAlt")}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center">
            <div className="p-3 md:p-5 bg-white/10 rounded-full w-20 h-20 mx-auto mb-6 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 ${languageFontClass}`}>
              {t("aboutUs.hero.title")}
            </h1>
            <p className={`text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto ${languageFontClass}`}>
              {t("aboutUs.hero.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 max-w-6xl -mt-6 md:-mt-10">
        <div className={`bg-white rounded-lg shadow-lg p-5 md:p-8 mb-6 md:mb-10 relative ${decorativeStyles.gradientBg}`}>
          <div className={`${sectionStyles} pt-6 md:pt-8`}>
            <SectionTitle title={t("aboutUs.purpose.title")} />
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 p-6 md:p-8 rounded-lg border-l-4 border-red-700">
                <p className={`text-gray-700 text-lg md:text-xl ${languageFontClass} leading-relaxed`}>
                  {t("aboutUs.purpose.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className={sectionStyles}>
            <SectionTitle title={t("aboutUs.programs.title")} />
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {t("aboutUs.programs.list", { returnObjects: true }).map((program, index) => (
                  <div key={index} className="flex items-start group bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="flex-shrink-0 mt-1 mr-3 w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-lg font-bold group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      {index + 1}
                    </span>
                    <span className={`text-gray-800 group-hover:text-gray-900 transition-colors ${languageFontClass} text-lg`}>
                      {program}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className={sectionStyles}>
            <SectionTitle title={t("aboutUs.values.title")} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-white shadow-md p-6 rounded-lg border-t-4 border-red-700 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                      {value.icon}
                    </div>
                    <h3 className={`text-xl font-bold text-gray-800 ${languageFontClass}`}>
                      {value.title}
                    </h3>
                  </div>
                  <p className={paragraphStyles}>
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities Section */}
          <div className={sectionStyles}>
            <SectionTitle title={t("aboutUs.responsibilities.title")} />
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 gap-4">
                {t("aboutUs.responsibilities.list", { returnObjects: true }).map((responsibility, index) => (
                  <div key={index} className="flex items-start bg-gray-50 p-5 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="flex-shrink-0 w-10 h-10 bg-red-700 text-white rounded-full flex items-center justify-center mr-4 font-bold">
                      {index + 1}
                    </span>
                    <span className={`text-gray-800 ${languageFontClass} text-lg leading-relaxed`}>
                      {responsibility}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-10 text-center border-t-4 border-red-700">
          <h2 className={`text-2xl md:text-3xl font-bold text-red-700 mb-4 ${languageFontClass}`}>
            {t("aboutUs.cta.title")}
          </h2>
          <p className={`text-gray-700 mb-6 max-w-2xl mx-auto text-lg ${languageFontClass}`}>
            {t("aboutUs.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact-us">
              <button className={`w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all text-lg ${languageFontClass}`}>
                {t("aboutUs.cta.contactButton")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
