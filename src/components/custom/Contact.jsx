import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    subject: "",
    message: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  // Language-specific font class
  const languageFontClass = i18n.language === "hi" ? "font-hindi" : "font-english";

  const API_URL = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;

 
  const contact1 = {
    name: t('contact.addresses.primary.name'),
    address1: t('contact.addresses.primary.address1'),
    address2: t('contact.addresses.primary.address2'),
    phone: "+91-9303872220",
    email1: "gahoishakti@gmail.com",
    email2: ""
  };

  const contact2 = {
    name: t('contact.addresses.secondary.name'),
    address1: t('contact.addresses.secondary.address1'),
    address2: t('contact.addresses.secondary.address2'),
    phone: "+91-9826260742",
    email1: "gahoishakti@gmail.com"
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error and status messages
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    if (submitStatus.message) {
      setSubmitStatus({ type: '', message: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.name.error');
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = t('contact.form.mobile.error');
    } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = t('contact.form.mobile.invalidError');
    }
    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.email.error');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.email.invalidError');
    }
    if (!formData.subject.trim()) {
      newErrors.subject = t('contact.form.subject.error');
    }
    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.message.error');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/api/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: formData })
      });

      if (!response.ok) {
        throw new Error();
      }

      // Reset form
      setFormData({
        name: "",
        mobile: "",
        email: "",
        subject: "",
        message: ""
      });

   
      setSubmitStatus({
        type: 'success',
        message: t('contact.form.success')
      });
    } catch {
      setSubmitStatus({
        type: 'error',
        message: t('contact.form.error')
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // reusable styles
  const sectionStyles = "mb-8 md:mb-16";
  const cardStyles = "bg-white rounded-lg p-6 md:p-8 shadow-md border-l-4 border-red-700";
  const headingStyles = `text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 md:mb-4 ${languageFontClass}`;

  const SectionTitle = ({ translationKey }) => (
    <div className="text-center mb-8">
      <h2 className={headingStyles}>{t(translationKey)}</h2>
      <div className="w-24 h-1 bg-red-700 mx-auto rounded-full"></div>
    </div>
  );

  // Additional styles
  const decorativeStyles = {
    gradientBg: "bg-gradient-to-br from-orange-50 via-white to-orange-50",
    patternOverlay: `bg-repeat opacity-10 absolute inset-0`,
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Helmet>
        <title>{t('contact.meta.title')}</title>
        <meta name="description" content={t('contact.meta.description')} />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative w-full bg-red-800 pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <img
          src="/contactus-hero.webp"
          alt="Contact Us Background"
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
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 ${languageFontClass}`}>
              {t('contact.title')}
            </h1>
            <p className={`text-xl md:text-2xl text-white opacity-90 max-w-3xl mx-auto ${languageFontClass}`}>
              {t('contact.subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 md:px-4 max-w-6xl -mt-6 md:-mt-10">
        <div
          className={`bg-white rounded-lg shadow-lg p-5 md:p-8 mb-6 md:mb-10  relative ${decorativeStyles.gradientBg}`}
        >
          {/* Contact Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-10 md:mb-16 pt-6 md:pt-8">
            <div
              className={`${cardStyles} transition-all duration-300 hover:shadow-lg`}
            >
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-lg md:text-xl font-bold text-gray-800 ${languageFontClass}`}
                >
                  {t('contact.contactInfo.contact1.name')}
                </h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <span
                    className={`text-gray-800 font-medium ${languageFontClass}`}
                  >
                    {contact1.name}
                  </span>
                </li>
              
                <li className="flex items-start">
                  <span className={`text-gray-700 ${languageFontClass}`}>
                    {contact1.address1}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className={`text-gray-700 ${languageFontClass}`}>
                    {contact1.address2}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center">
                    <svg
                      className="h-5 w-5 text-red-700 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${contact1.phone}`}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      {contact1.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center">
                    <svg
                      className="h-5 w-5 text-red-700 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${contact1.email1}`}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      {contact1.email1}
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center">
                    <svg
                      className="h-5 w-5 text-transparent mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${contact1.email2}`}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      {contact1.email2}
                    </a>
                  </span>
                </li>
              </ul>
            </div>

            <div
              className={`${cardStyles} transition-all duration-300 hover:shadow-lg`}
            >
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3
                  className={`text-lg md:text-xl font-bold text-gray-800 ${languageFontClass}`}
                >
                    {t('contact.contactInfo.contact2.name')}
                </h3>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start">
                  <span
                    className={`text-gray-800 font-medium ${languageFontClass}`}
                  >
                    {contact2.name}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className={`text-gray-700 ${languageFontClass}`}>
                    {contact2.address1}
                  </span>
                </li>
                <li className="flex items-start">
                  <span className={`text-gray-700 ${languageFontClass}`}>
                    {contact2.address2}
                  </span>
                </li>
              
                <li className="flex items-start">
                  <span className="inline-flex items-center">
                    <svg
                      className="h-5 w-5 text-red-700 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <a
                      href={`tel:${contact2.phone}`}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      {contact2.phone}
                    </a>
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center">
                    <svg
                      className="h-5 w-5 text-red-700 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <a
                      href={`mailto:${contact2.email1}`}
                      className="text-red-600 hover:text-red-700 transition-colors"
                    >
                      {contact2.email1}
                    </a>
                  </span>
                </li>
              </ul>
            </div>
          </div>

  {/* Contact Form Section */}
  <div className={sectionStyles}>
            <SectionTitle
              translationKey="contact.form.title"
            />

            <div className="bg-white shadow-md p-6 rounded-lg border-l-4 border-red-700">
              {submitStatus.message && (
                <div className={`mb-4 p-3 rounded-lg ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className={`block text-gray-700 mb-2 font-medium ${languageFontClass}`}>
                      {t('contact.form.name.label')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
                      } focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-colors duration-200`}
                      placeholder={t('contact.form.name.placeholder')}
                    />
                    {errors.name && (
                      <p className={`text-red-500 text-sm mt-1.5 ${languageFontClass}`}>
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className={`block text-gray-700 mb-2 font-medium ${languageFontClass}`}>
                      {t('contact.form.mobile.label')}
                    </label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.mobile ? "border-red-400 bg-red-50" : "border-gray-300"
                      } focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-colors duration-200`}
                      placeholder={t('contact.form.mobile.placeholder')}
                    />
                    {errors.mobile && (
                      <p className={`text-red-500 text-sm mt-1.5 ${languageFontClass}`}>
                        {errors.mobile}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className={`block text-gray-700 mb-2 font-medium ${languageFontClass}`}>
                      {t('contact.form.email.label')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
                      } focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-colors duration-200`}
                      placeholder={t('contact.form.email.placeholder')}
                    />
                    {errors.email && (
                      <p className={`text-red-500 text-sm mt-1.5 ${languageFontClass}`}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="relative">
                  <label className={`block text-gray-700 mb-2 font-medium ${languageFontClass}`}>
                    {t('contact.form.subject.label')}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.subject ? "border-red-400 bg-red-50" : "border-gray-300"
                    } focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-colors duration-200`}
                    placeholder={t('contact.form.subject.placeholder')}
                  />
                  {errors.subject && (
                    <p className={`text-red-500 text-sm mt-1.5 ${languageFontClass}`}>
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label className={`block text-gray-700 mb-2 font-medium ${languageFontClass}`}>
                    {t('contact.form.message.label')}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.message ? "border-red-400 bg-red-50" : "border-gray-300"
                    } focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 transition-colors duration-200 resize-none`}
                    placeholder={t('contact.form.message.placeholder')}
                  ></textarea>
                  {errors.message && (
                    <p className={`text-red-500 text-sm mt-1.5 ${languageFontClass}`}>
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <button 
                    type="submit" 
                    className="relative group"
                    disabled={isSubmitting}
                  >
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-red-600 to-amber-500 rounded-full blur-sm transition duration-300 ${
                      isSubmitting ? 'opacity-30' : 'opacity-60 group-hover:opacity-100'
                    }`}></div>
                    <div className={`relative bg-[#FD7D01] text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : 'group-hover:shadow-xl'
                    } ${languageFontClass}`}>
                      {isSubmitting 
                        ? t('contact.form.submitting') 
                        : t('contact.form.submit')}
                    </div>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Google Maps Section */}
          <div className={sectionStyles}>
            <SectionTitle
              translationKey="contact.location.title"
            />

            <div className="bg-white shadow-md p-5 rounded-lg border-l-4 border-red-700 overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3571.902579839127!2d78.1901808!3d26.2052578!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3976c5b473dae069%3A0x52092015bef7d67b!2sGahoi%20Samaj%20India!5e0!3m2!1sen!2sin!4v1648123456789!5m2!1sen!2sin"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
