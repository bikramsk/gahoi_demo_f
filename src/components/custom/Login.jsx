import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getLoginPageData } from "../../data/loader";


console.log('Environment Variables:', {
  MODE: import.meta.env.MODE,
  RECAPTCHA_SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY
});

// Use direct URLs in production, proxy in development
const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : '/api';

const WPSENDERS_BASE = import.meta.env.MODE === 'production'
  ? 'https://www.wpsenders.in/api'
  : '/wpsenders';

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

console.log('Using API BASE:', API_BASE);


const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Lc4VVkrAAAAAIxY8hXck_UVMmmIqNxjFWaLqq3u';

const sendWhatsAppOTP = async (mobileNumber) => {
  try {
    console.log('Attempting to send WhatsApp OTP for:', mobileNumber);
    
    const otp = Math.floor(1000 + Math.random() * 9000);
    const formattedNumber = mobileNumber;
    
    console.log('Sending OTP request for:', formattedNumber);

    // Send WhatsApp message and ignore response due to CORS
    await fetch(`${WPSENDERS_BASE}/sendMessage`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        api_key: 'S4YKGP5ZB9Q2J8LIDNM6OACTX',
        number: formattedNumber,
        message: `Your OTP for Gahoi Shakti login is: ${otp}. Valid for 10 minutes.`,
        route: 1,
        country_code: 91
      })
    }).catch(error => {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
        console.log('CORS error occurred, but the message might have been sent');
        return new Response(JSON.stringify({ status: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      throw error;
    });

    // Store OTP in backend regardless of CORS error
    const storeOtpResponse = await fetch(`${API_BASE}/user-mpins/store-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        mobileNumber,
        otp: otp.toString()
      })
    });

    if (!storeOtpResponse.ok) {
      const storeResponseText = await storeOtpResponse.text();
      throw new Error(`Failed to store OTP: ${storeResponseText}`);
    }

    if (import.meta.env.DEV) {
      console.log('Development OTP:', otp);
    }

    return { 
      success: true,
      message: 'OTP has been sent to your WhatsApp. Please wait a moment to receive it.'
    };
  } catch (error) {
    console.error('Error in sendWhatsAppOTP:', error);
    
    // For CORS errors in production, continue with the flow
    if (import.meta.env.PROD && error.name === 'TypeError' && error.message === 'Failed to fetch') {
      console.log('Production CORS error - assuming WhatsApp message was sent');
      return {
        success: true,
        message: 'OTP has been sent to your WhatsApp. Please wait a moment to receive it.'
      };
    }
    throw error;
  }
};

const verifyOTP = async (mobileNumber, otp) => {
  try {
    const response = await fetch(`${API_BASE}/user-mpins/verify-otp`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      body: JSON.stringify({
        mobileNumber,
        otp
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'OTP verification failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

const Login = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [pageData, setPageData] = useState({
    logoUrl: null,
    welcomeMessage: '',
    slogan: ''
  });
  const [formData, setFormData] = useState({
    mobileNumber: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const recaptchaRef = useRef(null);
  const [processSteps, setProcessSteps] = useState([
    { name: t('login.steps.login'), completed: false },
    { name: t('login.steps.otpVerification'), completed: false },
    { name: t('login.steps.registration'), completed: false },
    { name: t('login.steps.completion'), completed: false }
  ]);
  const [currentStep, setCurrentStep] = useState(1);

  
  React.useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await getLoginPageData();
        if (response?.data?.[0]) {
          const data = response.data[0];
          const logoUrl = data.logo?.url ? 
            (data.logo.url.startsWith('http') ? data.logo.url : `${API_BASE}${data.logo.url}`) : 
            null;
          
          setPageData({
            logoUrl,
            welcomeMessage: data.welcomeMessage || '',
            slogan: data.slogan || ''
          });
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    loadPageData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'mobileNumber' && !/^\d*$/.test(value)) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Reset OTP state when mobile number changes
    if (name === 'mobileNumber') {
      setShowOtpInput(false);
      setOtpSent(false);
    }
  };

  const handleOtpChange = (e) => {
    const { value } = e.target;
    
    // Only allow 4 digit numbers
    if (!/^\d*$/.test(value) || value.length > 4) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      otp: value
    }));
    
    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = t('login.errors.mobileRequired');
    } else if (formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = t('login.errors.mobileLength');
    }

    if (showOtpInput && !formData.otp) {
      newErrors.otp = t('login.errors.otpRequired');
    } else if (showOtpInput && formData.otp.length !== 4) {
      newErrors.otp = t('login.errors.otpLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors({});
    
    if (validateForm()) {
      if (!showOtpInput) {
        if (!recaptchaVerified) {
          setErrors({ mobileNumber: t('login.errors.recaptcha') });
          return;
        }
        setLoading(true);
        try {
          const result = await sendWhatsAppOTP(formData.mobileNumber);
          if (result.success) {
            setShowOtpInput(true);
            setOtpSent(true);
            setCurrentStep(2); // Move to OTP step
          }
        } catch (error) {
          console.error('Error sending WhatsApp OTP:', error);
          // For CORS errors in production, still show OTP input
          if (import.meta.env.PROD && error.name === 'TypeError' && error.message === 'Failed to fetch') {
            setShowOtpInput(true);
            setOtpSent(true);
            setCurrentStep(2);
          } else {
            setErrors({ 
              mobileNumber: t('login.errors.otpSendFailed') || 'Failed to send OTP. Please try again.'
            });
          }
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(true);
        try {
          // Verify OTP
          const response = await verifyOTP(formData.mobileNumber, formData.otp);
          
          if (response.jwt) {
            localStorage.setItem('token', response.jwt);
            localStorage.setItem('verifiedMobile', formData.mobileNumber);
            
            // Update steps progress
            const updatedSteps = [...processSteps];
            updatedSteps[1].completed = true;
            setProcessSteps(updatedSteps);
            
            navigate('/registration', { 
              state: { 
                mobileNumber: formData.mobileNumber,
                fromLogin: true,
                processSteps: updatedSteps
              } 
            });
          } else {
            throw new Error('No token received');
          }
        } catch (error) {
          console.error('Error verifying OTP:', error);
          setErrors({ 
            otp: t('login.errors.invalidOtp') || 'Invalid OTP. Please try again.'
          });
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaVerified(!!value);
  };

  const hasError = (fieldName) => {
    return submitted && errors[fieldName];
  };

  // Update processSteps when currentStep changes
  useEffect(() => {
    const updatedSteps = processSteps.map((step, index) => ({
      ...step,
      completed: index + 1 < currentStep
    }));
    setProcessSteps(updatedSteps);
  }, [currentStep]);

  return (
    <div 
      className="min-h-screen py-4 sm:py-6 px-2 sm:px-4 flex items-center justify-center relative"
      style={
        {
          backgroundImage: 'url("/decorative-bg.webp")',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundColor: '#1e293b',
         
        }
      }
    >
      

<Helmet>
        <title>{t('login.pageTitle')}</title>
       
      </Helmet>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
      
      {/* Back to Home  */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-red-700 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-red-800 transition-colors duration-200 z-20 flex items-center text-xs sm:text-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        {t('login.backToHome')}
      </button>

      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl overflow-hidden mt-10 md:mt-4 sm:mt-8 border border-2 border-[#DE7D37] relative z-10">
        {/* Left section  */}
        <div className="bg-red-800 text-white p-4 sm:p-6 flex flex-col items-center justify-center w-full md:w-1/3">
          <div className="w-full flex flex-col justify-center items-center h-full py-2 sm:py-4">
            <div className="p-2 sm:p-4 rounded-xl inline-block">
              <img src={pageData.logoUrl} alt={t('login.logoAlt')} className="w-32 sm:w-40 md:w-48 h-auto drop-shadow-lg" loading="lazy" />
            </div>
            <h2 className="text-white text-base sm:text-xl font-semibold text-center mt-2 sm:mt-1">{t('login.welcomeMessage')}</h2>
            <p className="text-white/80 text-center mt-1 sm:mt-2 text-xs">{t('login.slogan')}</p>
          </div>
        </div>
        
        {/* Right section - login form */}
        <div className="bg-white p-4 sm:p-6 w-full md:w-2/3">
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-center mb-2 sm:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 sm:h-7 w-5 sm:w-7 text-red-700 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">{t('login.title')}</h1>
            </div>
            
            {/* Progress Tracker */}
            <div className="w-full bg-gray-200 h-1.5 sm:h-2 mt-2 sm:mt-3 mb-3 sm:mb-4 rounded-full overflow-hidden">
              <div 
                className="bg-red-700 h-1.5 sm:h-2 transition-all duration-500 ease-in-out"
                style={{ width: processSteps[0].completed ? '25%' : (processSteps[1].completed ? '50%' : '10%') }}
              ></div>
            </div>
            
            <div className="flex justify-between px-1 sm:px-2 text-xs mb-3 sm:mb-5">
              {processSteps.map((step, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col items-center ${step.completed ? 'text-red-700' : 'text-gray-400'}`}
                >
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mb-1 ${
                    step.completed ? 'bg-red-700 text-white' : 'bg-gray-300 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-center text-[10px] sm:text-xs">{step.name}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Authentication - OTP */}
                <div className="bg-slate-50 p-2 sm:p-3 rounded-lg flex justify-center border border-slate-200">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio h-3 w-3 sm:h-4 sm:w-4 text-red-700"
                      name="authType"
                      value="otp"
                      checked={true}
                      readOnly
                    />
                    <span className="ml-2 text-gray-700 font-medium text-xs sm:text-sm">{t('login.otpAuth')}</span>
                  </label>
                </div>
                
                {/* Mobile Number Input */}
                <div className="space-y-1 sm:space-y-2">
                  <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {t('login.mobileNumber')}
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleInputChange}
                    className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm ${
                      hasError('mobileNumber') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder={t('login.mobilePlaceholder')}
                    disabled={showOtpInput || loading}
                  />
                  {hasError('mobileNumber') && (
                    <p className="text-red-500 text-[10px] sm:text-xs">{errors.mobileNumber}</p>
                  )}
                </div>

                {/* CAPTCHA - Only show if user doesn't exist and OTP input is not shown */}
                {!showOtpInput && (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-center transform scale-90 sm:scale-100 origin-top">
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleRecaptchaChange}
                        size="normal"
                      />
                    </div>
                  </div>
                )}

                {/* OTP Input - Only show if user doesn't exist */}
                {showOtpInput && (
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        {t('login.enterOtp')}
                      </label>
                      {otpSent && (
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-[10px] sm:text-xs text-red-700 hover:text-red-800"
                          >
                            {t('login.resendOtp')}
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="otp"
                      value={formData.otp}
                      onChange={handleOtpChange}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm ${
                        hasError('otp') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder={t('login.otpPlaceholder')}
                      disabled={loading}
                    />
                    {hasError('otp') && (
                      <p className="text-red-500 text-[10px] sm:text-xs">{errors.otp}</p>
                    )}
                    {otpSent && (
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        {t('login.otpSentMessage')}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  {!showOtpInput && (
                    <div className="flex w-full justify-between gap-2">
                      <button 
                        type="submit" 
                        disabled={loading || (!showOtpInput && !recaptchaVerified)}
                        className={`bg-red-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium text-xs sm:text-sm ${
                          loading || (!showOtpInput && !recaptchaVerified) ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {loading ? t('login.sending') : t('login.sendOtp')}
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
            
            <div
              className="text-center mt-3 sm:mt-4 text-[10px] sm:text-xs text-gray-600"
              dangerouslySetInnerHTML={{
                __html: t('login.termsAgreement')
                  .replace('Terms of Service', `<a href="/" class="text-red-700">${t('login.termsOfService')}</a>`)
                  .replace('Privacy Policy', `<a href="/privacy-policy" class="text-red-700">${t('login.privacyPolicy')}</a>`)
                  .replace('सेवा की शर्तों', `<a href="/" class="text-red-700">${t('login.termsOfService')}</a>`)
                  .replace('गोपनीयता नीति', `<a href="/privacy-policy" class="text-red-700">${t('login.privacyPolicy')}</a>`)
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;





