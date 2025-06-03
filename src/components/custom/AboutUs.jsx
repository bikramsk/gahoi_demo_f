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
  const cardStyles =
    "bg-white rounded-lg p-4 md:p-8 shadow-md border-l-4 border-red-700";
  const headingStyles = `text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 ${languageFontClass}`;
  const paragraphStyles = `text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg ${languageFontClass}`;

  //  default values
  const values = [
    {
      title: t("aboutUs.values.truth.title"),
      description: t("aboutUs.values.truth.description"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      title: t("aboutUs.values.dharma.title"),
      description: t("aboutUs.values.dharma.description"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: t("aboutUs.values.service.title"),
      description: t("aboutUs.values.service.description"),
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-red-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
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
        <meta
          name="description"
          content={t("aboutUs.meta.description")}
        />
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 ${languageFontClass}`}
            >
              {t("aboutUs.hero.title")}
            </h1>
            <p
              className={`text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto ${languageFontClass}`}
            >
              {t("aboutUs.hero.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 max-w-6xl -mt-6 md:-mt-10">
        <div
          className={`bg-white rounded-lg shadow-lg p-5 md:p-8 mb-6 md:mb-10  relative ${decorativeStyles.gradientBg}`}
        >
          <div className={`${sectionStyles} pt-6 md:pt-8`}>
            <SectionTitle title={t("aboutUs.purpose.title")} />

            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 p-4 md:p-6 rounded-lg border-l-4 border-red-700 text-center">
                <p
                  className={`
      text-gray-700 
      text-base md:text-lg
      ${languageFontClass} 
      ${
        i18n.language === "hi"
          ? "leading-[1.8] tracking-wide text-justify"
          : "leading-normal text-left"
      }
    `}
                >
                  {t("aboutUs.purpose.description")}
                </p>
              </div>
            </div>
          </div>

          {/* Programs & Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-10 md:mb-16">
            <div className={cardStyles}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-6 md:w-6 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-lg md:text-xl font-bold text-gray-800 ${languageFontClass}`}
                >
                  {t("aboutUs.programs.title")}
                </h3>
              </div>

              <ul className="space-y-2 md:space-y-3">
                {t("aboutUs.programs.list", { returnObjects: true }).map((program, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 mt-1 mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6 rounded-full bg-purple-100 text-[#FD7D01] flex items-center justify-center text-xs md:text-sm font-bold group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      {index + 1}
                    </span>
                    <span
                      className={`text-gray-800 group-hover:text-gray-900 transition-colors ${languageFontClass}`}
                    >
                      {program}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={cardStyles}>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 md:h-6 md:w-6 text-red-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-lg md:text-xl font-bold text-gray-800 ${languageFontClass}`}
                >
                  {t("aboutUs.benefits.title")}
                </h3>
              </div>

              <ul className="space-y-2 md:space-y-3">
                {t("aboutUs.benefits.list", { returnObjects: true }).map((benefit, index) => (
                  <li key={index} className="flex items-start group">
                    <span className="flex-shrink-0 mt-1 mr-2 md:mr-3 w-5 h-5 md:w-6 md:h-6 rounded-full bg-purple-100 text-[#FD7D01] flex items-center justify-center text-xs md:text-sm font-bold group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span
                      className={`text-gray-800 group-hover:text-gray-900 transition-colors ${languageFontClass}`}
                    >
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Values Section */}
          <div className={sectionStyles}>
            <SectionTitle title={t("aboutUs.values.title")} />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white shadow-md p-6 rounded-lg border-t-4 border-red-700"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-red-50 rounded-full flex items-center justify-center">
                      {value.icon}
                    </div>
                    <h3
                      className={`text-lg md:text-xl font-bold text-gray-800 ${languageFontClass}`}
                    >
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

            <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-red-700">
              <ul className="space-y-4">
                {t("aboutUs.responsibilities.list", { returnObjects: true }).map((responsibility, index) => (
                  <li
                    key={index}
                    className="flex items-start bg-gray-50 p-4 rounded-lg"
                  >
                    <span className="flex-shrink-0 w-8 h-8 bg-red-700 text-white rounded-full flex items-center justify-center mr-3 font-bold">
                      {index + 1}
                    </span>
                    <span className={`text-gray-800 ${languageFontClass}`}>
                      {responsibility}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-5 md:p-8 mb-6 md:mb-10 text-center border-l-4 border-red-700">
          <h2
            className={`text-xl md:text-2xl lg:text-3xl font-bold text-red-700 mb-3 md:mb-4 ${languageFontClass}`}
          >
            {t("aboutUs.cta.title")}
          </h2>
          <p
            className={`text-gray-700 mb-4 md:mb-6 max-w-2xl mx-auto text-base md:text-lg ${languageFontClass}`}
          >
            {t("aboutUs.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
            <Link to="/login" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-full opacity-60 blur-sm group-hover:opacity-100 transition duration-300"></div>
                <div
                  className={`relative w-full bg-[#FD7D01] text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg group-hover:shadow-xl transition-all text-base md:text-lg ${languageFontClass}`}
                >
                  {t("aboutUs.cta.memberButton")}
                </div>
              </button>
            </Link>
            <Link to="/contact-us" className="w-full sm:w-auto">
              <button
                className={`w-full bg-red-700 hover:bg-red-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold shadow-lg transition-all text-base md:text-lg ${languageFontClass}`}
              >
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
