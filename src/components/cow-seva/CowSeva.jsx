import React, { memo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { CowSevaCollection } from "./index";

// Extracted components for better organization
const SectionTitle = memo(({ title, headingStyles }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center mb-8">
      <h2 className={headingStyles}>{t(title)}</h2>
      <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
    </div>
  );
});

const ServiceCard = memo(({ method, languageFontClass, paragraphStyles }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-gradient-to-br from-white to-orange-50 shadow-lg p-6 md:p-8 rounded-lg border-t-4 border-[#FD7D01]">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-orange-100 to-red-50 rounded-full flex items-center justify-center shadow-inner">
          {method.icon}
        </div>
        <h3 className={`text-lg md:text-xl font-bold text-gray-800 ${languageFontClass}`}>
          {t(method.title)}
        </h3>
      </div>
      <p className={`${paragraphStyles} pl-16`}>
        {t(method.description)}
      </p>
    </div>
  );
});

const DonateButton = memo(({ languageFontClass }) => {
  const { t } = useTranslation();
  return (
    <Link to="/contact-us">
      <button className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full opacity-60 blur-sm group-hover:opacity-100 transition duration-300"></div>
        <div className={`relative w-full bg-[#FD7D01] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-semibold shadow-lg group-hover:shadow-xl transition-all text-lg md:text-xl ${languageFontClass}`}>
          {t('cowSeva.donateButton')}
        </div>
      </button>
    </Link>
  );
});

const CowSeva = () => {
  const { t, i18n } = useTranslation();

  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";
  const hindiTextClass =
    i18n.language === "hi" ? "text-base lg:text-lg" : "text-sm lg:text-base";

  // reusable styles
  const sectionStyles = "mb-8 md:mb-16";
  const cardStyles =
    "bg-white rounded-lg p-4 md:p-8 shadow-md border-l-4 border-orange-700";
  const headingStyles = `text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 md:mb-4 ${languageFontClass}`;
  const paragraphStyles = `text-gray-700 leading-relaxed text-sm md:text-base lg:text-lg ${languageFontClass}`;

  const howToServe = [
    {
      title: 'cowSeva.methods.cowDonation.title',
      description: 'cowSeva.methods.cowDonation.description',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-orange-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: 'cowSeva.methods.fodderDonation.title',
      description: 'cowSeva.methods.fodderDonation.description',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-orange-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
          />
        </svg>
      ),
    },
    {
      title: 'cowSeva.methods.volunteer.title',
      description: 'cowSeva.methods.volunteer.description',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-orange-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
    {
      title: 'cowSeva.methods.buyProducts.title',
      description: 'cowSeva.methods.buyProducts.description',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-orange-700"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
  ];

  // Additional styles
  const decorativeStyles = {
    gradientBg: "bg-gradient-to-br from-orange-50 via-white to-orange-50",
    patternOverlay: `absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay`,
  };

  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>{t('cowSeva.title')}</title>
        <meta
          name="description"
          content={t('cowSeva.description')}
        />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative w-full bg-orange-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/cowseva-hero.webp"
          alt="CowSeva Background"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="p-3 md:p-5 bg-white/10 rounded-full w-20 h-20 mx-auto mb-6 backdrop-blur-sm">
              <svg 
                xmlns="http://www.w3.org/2000/svg"
                className="h-full w-full text-white"
                fill="none" 
                viewBox="0 0 48 48"
                preserveAspectRatio="xMidYMid meet"
              >
                <path fill="#fff" d="M27.9999 29.0001H25.9999C25.9999 31.7615 28.6862 34.0001 31.9999 34.0001C33.7484 34.0001 35.3222 33.3768 36.4188 32.3824L34.5431 31.3105C33.8949 31.7256 33.0405 32.0001 31.9999 32.0001C29.4338 32.0001 27.9999 30.331 27.9999 29.0001Z"></path>
                <path fill="#fff" fillRule="evenodd" d="M19.466 12.8761C20.1009 12.3161 20.6229 11.5595 20.8031 10.8375C20.9053 10.4284 20.9524 9.77949 20.5 9.25516C20.0367 8.71817 19.3523 8.65892 18.8127 8.7273C18.3875 8.78118 18.0833 8.79189 17.8115 8.80131C17.7973 8.8018 17.783 8.80229 17.7685 8.80278C17.4586 8.81325 17.0889 8.82575 16.6807 8.95823C16.2561 9.09598 15.8537 9.33874 15.3731 9.69267C15.0498 9.93076 14.751 10.1869 14.486 10.4517C12.8574 9.2929 10.7604 8.83945 7.46885 9.00044C6.65472 9.01693 5.99981 9.68205 5.99981 10.5001C5.99981 11.3286 6.67138 12.0001 7.49981 12.0001H8.93671C9.02319 12.0587 9.10484 12.1157 9.18219 12.1713L6.9112 15.0101C5.04532 15.1606 3.74623 16.9948 4.27718 18.8327L4.56607 19.8327C4.93692 21.1164 6.11204 22.0001 7.44822 22.0001H10.5701C10.7876 22.0001 10.9992 22.071 11.1728 22.2021L13.1159 23.6696C13.2856 23.7978 13.4638 23.9053 13.6479 23.9926C14.8046 27.1221 16.0505 29.7887 17.4601 31.5651L17.7809 35.4146C17.3059 35.7801 16.9998 36.354 16.9998 37.0002C16.9998 38.1047 17.8953 39.0002 18.9998 39.0002H21.9998C22.5521 39.0002 22.9998 38.5524 22.9998 38.0002V30.0002H30.4106C31.7723 31.2672 33.3477 32.313 35.5657 32.8323L35.7809 35.4146C35.3058 35.7801 34.9998 36.3539 34.9998 37.0001C34.9998 38.1047 35.8952 39.0001 36.9998 39.0001H39.9998C40.5521 39.0001 40.9998 38.5524 40.9998 38.0001V21.0001C40.9998 18.0808 40.2309 16.0464 38.9633 14.741C37.6965 13.4365 36.0678 13.0001 34.6347 13.0001L21.4998 13.0001C20.7492 13.0001 20.0769 12.9545 19.466 12.8761ZM11.1444 11.1787C11.1831 11.2129 11.2211 11.247 11.2584 11.281C11.6476 11.6363 11.6943 12.2327 11.3651 12.6443L8.18066 16.6248C7.99089 16.862 7.70357 17.0001 7.39979 17.0001H7.15933C6.49373 17.0001 6.01388 17.6382 6.19861 18.2776L6.4875 19.2776C6.61112 19.7055 7.00282 20.0001 7.44822 20.0001H10.5701C11.2227 20.0001 11.8574 20.2129 12.3781 20.6061L14.3212 22.0736C14.4386 22.1623 14.5593 22.2177 14.6777 22.2481C14.9978 22.3303 15.2566 22.5654 15.3691 22.8761C16.617 26.3216 17.8799 28.9697 19.195 30.5275C19.3289 30.6862 19.4102 30.8826 19.4274 31.0895L19.8308 35.9307C19.874 36.449 19.5127 36.9138 19 37L20.9998 37.0002V29.0002C20.9998 28.4479 21.4475 28.0002 21.9998 28.0002H30.8106C31.0713 28.0002 31.3217 28.1019 31.5084 28.2838C32.8876 29.6273 34.3703 30.6282 36.6656 31.014C37.1164 31.0897 37.4584 31.4615 37.4964 31.9171L37.8308 35.9307C37.874 36.449 37.5127 36.9138 37 36.9999L38.9998 37.0001V21.0001C38.9998 18.4195 38.3243 16.9539 37.5284 16.1343C36.7317 15.3138 35.6779 15.0001 34.6347 15.0001L21.4998 15.0001C19.2107 15.0001 17.5296 14.6169 16.1261 14.1383C15.7007 13.9932 15.4244 13.5822 15.4506 13.1335C15.4768 12.6848 15.7991 12.3087 16.2385 12.2142C16.9207 12.0674 17.568 11.8127 17.9633 11.5216C18.1933 11.3522 18.4064 11.1337 18.5726 10.9061C18.6111 10.8535 18.6454 10.8025 18.6759 10.7539C18.3497 10.7839 18.0916 10.7928 17.8838 10.8L17.8808 10.8001C17.5205 10.8126 17.4158 10.8223 17.2979 10.8606C17.1773 10.8997 16.9791 10.9938 16.5591 11.3031C16.0468 11.6804 15.6634 12.0815 15.4388 12.4117C15.2739 12.6541 15.0109 12.8119 14.7195 12.8434C14.4281 12.875 14.1375 12.777 13.9246 12.5755C13.2337 11.9217 12.4126 11.4366 11.1444 11.1787Z" clipRule="evenodd"></path>
                <path fill="#fff" d="M43.9999 26.0001C43.9999 27.1047 43.5522 28.0001 42.9999 28.0001C42.4476 28.0001 41.9999 27.1047 41.9999 26.0001C41.9999 24.8955 42.4476 24.0001 42.9999 24.0001C43.5522 24.0001 43.9999 24.8955 43.9999 26.0001Z"></path>
                <path fill="#fff" fillRule="evenodd" d="M32.4999 15.0001V13.0001C32.5554 13.0001 37.6372 13.0006 37.7132 13.0019C39.7299 13.0359 41.369 13.4404 42.4857 14.5134C43.6171 15.6004 43.9999 17.1658 43.9999 19.0001H41.9999C41.9999 17.3923 41.6573 16.491 41.1001 15.9556C40.5282 15.4061 39.5156 15.0325 37.6795 15.0016C37.6805 15.0016 37.6695 15.0016 37.6459 15.0016C37.6108 15.0015 37.5481 15.0014 37.4564 15.0014L32.4999 15.0001Z" clipRule="evenodd"></path>
                <path fill="#fff" d="M41.9999 19.0001H43.9999L43.4999 26.0001H42.4999L41.9999 19.0001Z"></path>
                <path fill="#fff" fillRule="evenodd" d="M25.3263 30.4835L27.0738 29.7686 27.8311 31.6197 26.0835 32.3346 25.3263 30.4835zM27.8762 33.8584L28.9348 31.8888 30.6965 32.8356 29.6379 34.8052 27.8762 33.8584zM32.4338 35.1138L32.0091 32.9184 33.9727 32.5386 34.3974 34.7339 32.4338 35.1138zM30.3261 28.2842C30.0336 28.5427 29.9999 28.8671 29.9999 29.0001H31.9999C31.9999 29.1643 31.9583 29.511 31.6502 29.7831 31.3473 30.0508 31.0053 30.0519 30.8527 30.0364 30.587 30.0093 30.378 29.8843 30.3139 29.8459L30.3104 29.8438C30.1202 29.7302 29.9037 29.5575 29.7009 29.3846 29.2744 29.0208 28.7145 28.4872 28.1404 27.9096 27.0107 26.7733 25.6972 25.3375 25.1716 24.5604L26.8282 23.4398C27.2351 24.0414 28.4215 25.3556 29.5588 26.4996 30.118 27.0622 30.6334 27.5513 30.9986 27.8628 31.1808 28.0181 31.2877 28.0963 31.3294 28.1227 31.2895 28.1026 31.1903 28.0604 31.0553 28.0466 30.9327 28.0342 30.6137 28.0302 30.3261 28.2842zM31.3362 28.1269C31.3341 28.1257 31.3319 28.1243 31.3294 28.1227 31.3517 28.134 31.3553 28.1384 31.3362 28.1269z" clipRule="evenodd"></path>
              </svg>
            </div>
            <h1
              className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 ${languageFontClass}`}
            >
              {t('cowSeva.title')}
            </h1>
            <p
              className={`text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto ${languageFontClass}`}
            >
              {t('cowSeva.hero.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 max-w-6xl -mt-6 md:-mt-10">
        {/* Main Content Card */}
        <div
          className={`bg-white rounded-lg shadow-lg p-5 md:p-8 mb-6 md:mb-10 relative ${decorativeStyles.gradientBg}`}
        >
          <img
            src="/decorative-pattern.png"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-5"
            aria-hidden="true"
          />

          {/* Introduction Section with Decorative Elements */}
          <div className={`${sectionStyles} relative`}>
            {/* Introduction Card */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-gradient-to-br from-orange-50 to-white p-6 md:p-8 rounded-lg border-l-4 border-[#FD7D01] shadow-lg relative overflow-hidden">
                <img
                  src="/decorative-pattern.png"
                  alt=""
                  className={decorativeStyles.patternOverlay}
                  aria-hidden="true"
                />
                <p
                  className={`relative z-10 ${paragraphStyles} ${
                    i18n.language === "hi"
                      ? "leading-[1.8] tracking-wide text-justify"
                      : "leading-normal text-left"
                  }`}
                >
                  {t('cowSeva.description')}
                </p>
              </div>
            </div>
          </div>

          {/*  How to Serve Section */}
          <div className={sectionStyles}>
            <SectionTitle
              title="cowSeva.title"
              headingStyles={headingStyles}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {howToServe.map((method, index) => (
                <ServiceCard
                  key={index}
                  method={method}
                  languageFontClass={languageFontClass}
                  paragraphStyles={paragraphStyles}
                />
              ))}
            </div>
          </div>
        </div>

        {/*CowSevaCollection Component*/}
        <div className="mb-6 md:mb-10">
          <CowSevaCollection />
        </div>

        {/* Donate Section */}
        <div className="bg-gradient-to-r from-red-800 to-red-900 rounded-2xl p-8 text-center text-white relative overflow-hidden mb-12">
          <img
            src="/decorative-pattern.png"
            alt=""
            className={decorativeStyles.patternOverlay}
            aria-hidden="true"
          />
          <div className="relative z-10">
            <h2
              className={`text-3xl font-bold mb-4 ${languageFontClass}`}
            >
              {t('cowSeva.donate.title')}
            </h2>
            <p
              className={`text-lg mb-6 max-w-2xl mx-auto ${languageFontClass}`}
            >
              {t('cowSeva.donate.description')}
            </p>
            <Link to="/contact-us">
              <button className="bg-white text-red-800 px-8 py-4 rounded-lg font-semibold hover:bg-red-50 transition-colors text-lg">
                {t('cowSeva.donate.button')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CowSeva);
