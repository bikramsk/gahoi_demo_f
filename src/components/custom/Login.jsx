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


const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337'; 

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6Lc4VVkrAAAAAIxY8hXck_UVMmmIqNxjFWaLqq3u';

console.log('Using API BASE:', API_BASE);

// Check if user exists and has MPIN
const checkUserAndMPIN = async (mobileNumber) => {
  try {
    const response = await fetch(`${API_BASE}/api/check-user-mpin/${mobileNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      credentials: 'include'
    });

    const responseText = await response.text();
    console.log('Check User Response:', response.status, responseText);

    if (!response.ok) {
      throw new Error('Failed to check user status');
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error checking user:', error);
    throw error;
  }
};



const sendWhatsAppOTP = async (mobileNumber) => {
  try {
    const response = await fetch('https://api.gahoishakti.in/api/send-whatsapp-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mobileNumber })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    // Store OTP in sessionStorage if we're in development and OTP is returned
    if (import.meta.env.MODE === 'development' && data.otp) {
      console.log('Development OTP:', data.otp);
      sessionStorage.setItem('currentOTP', data.otp);
      sessionStorage.setItem('otpTimestamp', Date.now().toString());
      sessionStorage.setItem('otpMobile', mobileNumber);
    }

    return data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

const verifyOTP = async (mobileNumber, otp) => {
  try {
    const response = await fetch('https://api.gahoishakti.in/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mobileNumber,
        otp
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || data.message || 'Failed to verify OTP');
    }

    // Clear OTP data after successful verification
    sessionStorage.removeItem('currentOTP');
    sessionStorage.removeItem('otpTimestamp');
    sessionStorage.removeItem('otpMobile');

    return data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

// Add MPIN verification function
const verifyMPIN = async (mobileNumber, mpin) => {
  try {
    const response = await fetch(`${API_BASE}/api/verify-mpin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      credentials: 'include',
      body: JSON.stringify({
        mobileNumber: mobileNumber,
        mpin: mpin
      })
    });

    const responseText = await response.text();
    if (!response.ok) {
      let errorMessage = 'MPIN verification failed';
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return JSON.parse(responseText);
  } catch (error) {
    console.error('Error verifying MPIN:', error);
    throw error;
  }
};

// Check if user has MPIN
const checkUserMPIN = async (mobileNumber) => {
  try {
    const response = await fetch(`${API_BASE}/api/check-user-mpin/${mobileNumber}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to check user status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking user MPIN:', error);
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
    otp: '',
    mpin: ''
  });

  
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [authMode, setAuthMode] = useState('otp'); // 'otp' or 'mpin'
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showMpinInput, setShowMpinInput] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [userHasMPIN, setUserHasMPIN] = useState(false);
  const [hasMpin, setHasMpin] = useState(false);
  const recaptchaRef = useRef(null);
  const [processSteps, setProcessSteps] = useState([
    { 
      id: 1,
      name: 'login.steps.login',
      description: t('login.steps.login'),
      completed: false 
    },
    { 
      id: 2,
      name: 'login.steps.otpVerification',
      description: t('login.steps.otpVerification'),
      completed: false 
    },
    { 
      id: 3,
      name: 'login.steps.registration',
      description: t('login.steps.registration'),
      completed: false 
    },
    { 
      id: 4,
      name: 'login.steps.completion',
      description: t('login.steps.completion'),
      completed: false 
    }
  ]);
  const [currentStep, setCurrentStep] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [showMpinCreation, setShowMpinCreation] = useState(false);
  const [mpinData, setMpinData] = useState({
    mpin: '',
    confirmMpin: ''
  });

  React.useEffect(() => {
    const loadPageData = async () => {
      try {
        const response = await getLoginPageData();
        if (response?.data?.[0]) {
          const data = response.data[0];
        
          const logoUrl = data.logo?.url ? 
            (data.logo.url.startsWith('http') ? data.logo.url : `${API_BASE}/uploads${data.logo.url}`) : 
            '/logo.png';          
            
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

  // Check user status when mobile number is complete
  useEffect(() => {
    const checkUser = async () => {
      if (formData.mobileNumber.length === 10) {
        try {
          const result = await checkUserAndMPIN(formData.mobileNumber);
          setUserExists(result.exists);
          setUserHasMPIN(result.hasMPIN);
          
          // If user exists and has MPIN, show MPIN option
          if (result.exists && result.hasMPIN) {
            // User can choose between OTP or MPIN
            setAuthMode('mpin'); // Default to MPIN for existing users
          } else {
            // New user or user without MPIN - use OTP
            setAuthMode('otp');
          }
        } catch (error) {
          console.error('Error checking user:', error);
          // Default to OTP if check fails
          setAuthMode('otp');
        }
      }
    };

    if (formData.mobileNumber.length === 10) {
      checkUser();
    }
  }, [formData.mobileNumber]);

  // Check user MPIN status when mobile number is complete
  useEffect(() => {
    const checkUser = async () => {
      if (formData.mobileNumber.length === 10) {
        try {
          const result = await checkUserMPIN(formData.mobileNumber);
          setHasMpin(result.hasMpin);
          if (result.hasMpin) {
            setShowMpinInput(true);
            setShowOtpInput(false);
          }
        } catch (error) {
          console.error('Error checking user:', error);
          setHasMpin(false);
          setShowMpinInput(false);
        }
      }
    };

    if (formData.mobileNumber.length === 10) {
      checkUser();
    }
  }, [formData.mobileNumber]);

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

    // Reset states when mobile number changes
    if (name === 'mobileNumber') {
      setShowOtpInput(false);
      setShowMpinInput(false);
      setOtpSent(false);
      setCurrentStep(1);
      setUserExists(false);
      setUserHasMPIN(false);
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

  const handleMpinChange = (e) => {
    const { name, value } = e.target;
    
    // Only allow 4 digit numbers
    if (!/^\d*$/.test(value) || value.length > 4) {
      return;
    }
    
    setMpinData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMpinInput = (e) => {
    const { value } = e.target;
    if (!/^\d*$/.test(value) || value.length > 4) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      mpin: value
    }));
    if (errors.mpin) {
      setErrors(prev => ({ ...prev, mpin: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = t('login.errors.mobileRequired');
    } else if (formData.mobileNumber.length !== 10) {
      newErrors.mobileNumber = t('login.errors.mobileLength');
    }

    if (hasMpin && showMpinInput) {
      if (!formData.mpin) {
        newErrors.mpin = t('login.errors.mpinRequired');
      } else if (formData.mpin.length !== 4) {
        newErrors.mpin = t('login.errors.mpinLength');
      }
    } else if (showOtpInput) {
      if (!formData.otp) {
        newErrors.otp = t('login.errors.otpRequired');
      } else if (formData.otp.length !== 4) {
        newErrors.otp = t('login.errors.otpLength');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateMpin = () => {
    const newErrors = {};
    
    if (!mpinData.mpin) {
      newErrors.mpin = t('login.errors.mpinRequired');
    } else if (mpinData.mpin.length !== 4) {
      newErrors.mpin = t('login.errors.mpinLength');
    }

    if (!mpinData.confirmMpin) {
      newErrors.confirmMpin = t('login.errors.confirmMpinRequired');
    } else if (mpinData.confirmMpin !== mpinData.mpin) {
      newErrors.confirmMpin = t('login.errors.mpinMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMpin = async (mpin) => {
    try {
      const response = await fetch(`${API_BASE}/api/create-mpin`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          mobileNumber: formData.mobileNumber,
          mpin: mpin
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create MPIN');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating MPIN:', error);
      throw error;
    }
  };

  // Add countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Modified handleSubmit to include MPIN creation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setErrors({});
    
    if (showMpinCreation) {
      if (validateMpin()) {
        setLoading(true);
        try {
          await createMpin(mpinData.mpin);
          // After MPIN creation, navigate to dashboard
          navigate('/registration');
        } catch (error) {
          setErrors({
            mpin: error.message || 'Failed to create MPIN'
          });
        } finally {
          setLoading(false);
        }
      }
      return;
    }

    if (!validateForm()) return;

    if (hasMpin && showMpinInput) {
      // MPIN Login
      setLoading(true);
      try {
        const response = await verifyMPIN(formData.mobileNumber, formData.mpin);
        if (response.jwt) {
          localStorage.setItem('token', response.jwt);
          localStorage.setItem('verifiedMobile', formData.mobileNumber);
          navigate('/registration');
        } else {
          throw new Error('Invalid MPIN');
        }
      } catch (error) {
        setErrors({
          mpin: error.message || 'Invalid MPIN'
        });
        setFormData(prev => ({ ...prev, mpin: '' }));
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!showOtpInput) {
      // Sending OTP
      if (!recaptchaVerified) {
        setErrors({ mobileNumber: t('login.errors.recaptcha') });
        return;
      }
      
      setLoading(true);
      try {
        const result = await sendWhatsAppOTP(formData.mobileNumber);
        
        if (result.success !== false && (result.success || result.data || result.message)) {
          setShowOtpInput(true);
          setOtpSent(true);
          setCurrentStep(2);
          setCountdown(60);
          setErrors({});
          
          if (recaptchaRef.current) {
            recaptchaRef.current.reset();
            setRecaptchaVerified(false);
          }
        } else {
          throw new Error(result.message || 'Failed to send OTP');
        }
      } catch (error) {
        setErrors({ 
          mobileNumber: error.message || t('login.errors.otpSendFailed')
        });
      } finally {
        setLoading(false);
      }
    } else {
      // Verifying OTP
      setLoading(true);
      try {
        const response = await verifyOTP(formData.mobileNumber, formData.otp);
        
        const token = response.jwt || response.token || response.data?.jwt || response.data?.token;
        
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('verifiedMobile', formData.mobileNumber);
          
          if (!response.hasMpin) {
            // Show MPIN creation form if user doesn't have MPIN
            setShowMpinCreation(true);
            setCurrentStep(3);
          } else {
            // User already has MPIN, go to dashboard
            navigate('/registration');
          }
        } else {
          throw new Error(response.message || 'Invalid OTP');
        }
      } catch (error) {
        setErrors({ 
          otp: error.message || t('login.errors.invalidOtp')
        });
        setFormData(prev => ({ ...prev, otp: '' }));
      } finally {
        setLoading(false);
      }
    }
  };

  // Updated resend OTP function
  const handleResendOtp = async () => {
    if (countdown > 0 || loading) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      const result = await sendWhatsAppOTP(formData.mobileNumber);
      
      if (result.success !== false && (result.success || result.data || result.message)) {
        setCountdown(30);
        setFormData(prev => ({ ...prev, otp: '' }));
        setErrors({});
      } else {
        throw new Error(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      setErrors({ 
        otp: error.message || t('login.errors.otpSendFailed') || 'Failed to resend OTP'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaVerified(!!value);
    if (errors.mobileNumber && errors.mobileNumber.includes('captcha')) {
      setErrors(prev => ({
        ...prev,
        mobileNumber: ''
      }));
    }
  };

  const handleAuthModeChange = (mode) => {
    setAuthMode(mode);
    setShowOtpInput(false);
    setShowMpinInput(false);
    setOtpSent(false);
    setCurrentStep(1);
    setFormData(prev => ({ ...prev, otp: '', mpin: '' }));
    setErrors({});
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

  // Add switch to OTP option
  const switchToOTP = () => {
    setShowMpinInput(false);
    setShowOtpInput(false);
    setFormData(prev => ({ ...prev, mpin: '', otp: '' }));
    setErrors({});
  };

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
      
      {/* Back to Home */}
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
        {/* Left section */}
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
                style={{ width: `${(currentStep / processSteps.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between px-1 sm:px-2 text-xs mb-3 sm:mb-5">
              {processSteps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`flex flex-col items-center ${
                    step.completed ? 'text-red-700' : 
                    (index + 1 === currentStep ? 'text-red-600' : 'text-gray-400')
                  }`}
                >
                  <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center mb-1 ${
                    step.completed ? 'bg-red-700 text-white' : 
                    (index + 1 === currentStep ? 'bg-red-200 text-red-700 border-2 border-red-700' : 'bg-gray-300 text-gray-500')
                  }`}>
                    {step.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-2 w-2 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-center text-[10px] sm:text-xs">{t(step.name)}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100">
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                {/* Authentication Mode Selection */}
                {userExists && userHasMPIN && !showOtpInput && !showMpinInput && (
                  <div className="bg-slate-50 p-2 sm:p-3 rounded-lg border border-slate-200">
                    <div className="flex justify-center space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-3 w-3 sm:h-4 sm:w-4 text-red-700"
                          name="authType"
                          value="mpin"
                          checked={authMode === 'mpin'}
                          onChange={() => handleAuthModeChange('mpin')}
                        />
                        <span className="ml-2 text-gray-700 font-medium text-xs sm:text-sm">{t('login.mpinAuth')}</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio h-3 w-3 sm:h-4 sm:w-4 text-red-700"
                          name="authType"
                          value="otp"
                          checked={authMode === 'otp'}
                          onChange={() => handleAuthModeChange('otp')}
                        />
                        <span className="ml-2 text-gray-700 font-medium text-xs sm:text-sm">{t('login.otpAuth')}</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Single auth mode display for new users */}
                {(!userExists || !userHasMPIN) && (
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
                )}
                
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

                {/* CAPTCHA - Only show if OTP input is not shown */}
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

                {/* MPIN Input for Existing Users */}
                {hasMpin && showMpinInput && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        {t('login.enterMpin')}
                      </label>
                      <button
                        type="button"
                        onClick={switchToOTP}
                        className="text-xs text-red-700 hover:text-red-800 hover:underline"
                      >
                        {t('login.useWhatsAppOtp')}
                      </button>
                    </div>
                    <input
                      type="password"
                      name="mpin"
                      value={formData.mpin}
                      onChange={handleMpinInput}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm text-center tracking-widest ${
                        hasError('mpin') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder={t('login.mpinPlaceholder')}
                      autoComplete="current-password"
                    />
                    {hasError('mpin') && (
                      <p className="text-red-500 text-[10px] sm:text-xs">{errors.mpin}</p>
                    )}
                  </div>
                )}

                {/* OTP Input */}
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
                        <div className="flex space-x-2 items-center">
                          <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={loading || countdown > 0}
                            className={`text-[10px] sm:text-xs font-medium ${
                              countdown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-red-700 hover:text-red-800 hover:underline'
                            }`}
                          >
                            {countdown > 0 ? `${t('login.resendOtp')} (${countdown}s)` : t('login.resendOtp')}
                          </button>
                        </div>
                      )}
                    </div>
                    <input
                      type="tel"
                      name="otp"
                      value={formData.otp}
                      onChange={handleOtpChange}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm text-center tracking-widest ${
                        hasError('otp') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder={t('login.otpPlaceholder')}
                      disabled={loading}
                      autoComplete="one-time-code"
                    />
                    {hasError('otp') && (
                      <p className="text-red-500 text-[10px] sm:text-xs">{errors.otp}</p>
                    )}
                    {otpSent && !errors.otp && (
                      <p className="text-[10px] sm:text-xs text-gray-600">
                        {t('login.otpSentMessage')} <span className="font-medium">WhatsApp</span>
                      </p>
                    )}
                  </div>
                )}

                {/* MPIN Creation Form */}
                {showMpinCreation && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        {t('login.setupMpin')}
                      </label>
                      <input
                        type="password"
                        name="mpin"
                        value={mpinData.mpin}
                        onChange={handleMpinChange}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm text-center tracking-widest ${
                          hasError('mpin') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder={t('login.newMpinPlaceholder')}
                        autoComplete="new-password"
                      />
                      {hasError('mpin') && (
                        <p className="text-red-500 text-[10px] sm:text-xs">{errors.mpin}</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs sm:text-sm font-medium text-gray-700 flex items-center">
                        {t('login.confirmMpin')}
                      </label>
                      <input
                        type="password"
                        name="confirmMpin"
                        value={mpinData.confirmMpin}
                        onChange={handleMpinChange}
                        className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm text-center tracking-widest ${
                          hasError('confirmMpin') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                        }`}
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder={t('login.confirmMpinPlaceholder')}
                        autoComplete="new-password"
                      />
                      {hasError('confirmMpin') && (
                        <p className="text-red-500 text-[10px] sm:text-xs">{errors.confirmMpin}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center justify-between pt-1">
                  <button 
                    type="submit" 
                    disabled={loading || (!showOtpInput && !showMpinCreation && !recaptchaVerified)}
                    className={`w-full bg-red-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 font-medium text-xs sm:text-sm flex items-center justify-center ${
                      loading || (!showOtpInput && !showMpinCreation && !recaptchaVerified) ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {loading && (
                      <svg className="animate-spin -ml-1 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {loading ? (
                      showMpinCreation ? t('login.setting') || 'Setting MPIN...' :
                      showOtpInput ? t('login.verifying') || 'Verifying...' : 
                      t('login.sending') || 'Sending...'
                    ) : (
                      showMpinCreation ? t('login.setMpin') || 'Set MPIN' :
                      showOtpInput ? t('login.verifyOtp') || 'Verify OTP' :
                      showMpinInput ? t('common.submit') || 'Submit' :
                      t('login.sendOtp') || 'Send OTP'
                    )}
                  </button>
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