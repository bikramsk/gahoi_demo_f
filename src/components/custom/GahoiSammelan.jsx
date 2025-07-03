import React, { useState } from 'react';
import { Calendar, MapPin, Phone, Heart, Users, Star, FileText, Camera, Upload, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1340';

const GahoiSammelanPage = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    gotra: '',
    aankna: '',
    gan: '',
    birthDate: '',
    birthPlace: '',
    birthTime: '',
    height: '',
    color: '',
    mama: '',
    nationality: '',
    education: '',
    mobile: '',
    occupation: '',
    position: '',
    company: '',
    annualIncome: '',
    currentAddress: '',
    currentStatus: '',
    previousSpouseName: '',
    marriageDate: '',
    marriageEndDate: '',
    endReason: '',
    childrenCount: '',
    childrenDetails: '',
    kundliAvailable: false,
    kundliMatching: false,
    agePreference: '',
    educationPreference: '',
    partnerType: '',
    acceptChildrenPartner: false,
    cityPreference: '',
    motherName: '',
    fatherName: '',
    siblings: ''
  });

  const [activeSection, setActiveSection] = useState('event');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState({
    fullSizePhoto: null,
    aadharCard: null,
    divorceDeath: null,
    kundaliFile: null
  });
  const [selectedDocTypes, setSelectedDocTypes] = useState({
    fullSizePhoto: false,
    aadharCard: false,
    divorceDeath: false,
    kundaliFile: false
  });

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    
    let finalValue = value;
    if (type === 'radio') {
      if (name === 'gender') {
        finalValue = value; 
      } else {
        finalValue = value === 'true'; 
      }
    } else if (type === 'date') {
      // Format date as yyyy-MM-dd without time component
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        finalValue = `${year}-${month}-${day}`;
      }
    } else if (type === 'number') {
      finalValue = value === '' ? '' : parseInt(value, 10);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    const updatedFiles = { ...selectedFiles };
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }
      
      Object.keys(selectedDocTypes).forEach(docType => {
        if (selectedDocTypes[docType] && !updatedFiles[docType]) {
          updatedFiles[docType] = file;
        }
      });
    }
    
    setSelectedFiles(updatedFiles);
  };

  const handleRemoveFile = (docType) => {
    setSelectedFiles(prev => ({
      ...prev,
      [docType]: null
    }));
  };

  const handleDocTypeChange = (docType) => {
    setSelectedDocTypes(prev => ({
      ...prev,
      [docType]: !prev[docType]
    }));
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('files', file);

    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }

    const data = await response.json();
    return data[0].id; // Return the file ID
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const fileIds = {};
      for (const [docType, file] of Object.entries(selectedFiles)) {
        if (file) {
          fileIds[docType] = await uploadFile(file);
        }
      }

      // Format all date fields to ensure yyyy-MM-dd format
      const formatDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const formattedData = {
        ...formData,
        birthDate: formatDate(formData.birthDate),
        marriageDate: formatDate(formData.marriageDate),
        marriageEndDate: formatDate(formData.marriageEndDate),
        birthTime: formData.birthTime ? `${formData.birthTime}:00.000` : null
      };

      // Remove any undefined or null values
      Object.keys(formattedData).forEach(key => {
        if (formattedData[key] === undefined || formattedData[key] === null) {
          delete formattedData[key];
        }
      });

      const submitData = {
        ...formattedData,
        selectedDocuments: selectedDocTypes,
        fullSizePhoto: fileIds.fullSizePhoto,
        aadharCard: fileIds.aadharCard,
        divorceDeath: fileIds.divorceDeath,
        kundaliFile: fileIds.kundaliFile
      };

      console.log('Submitting data:', submitData); // Debug log

      const response = await fetch(`${API_BASE}/api/gahoi-sammelans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: submitData })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to submit form');
      }

    setIsSubmitted(true);
      // Reset form and files
      setFormData({
        name: '',
        gender: '',
        gotra: '',
        aankna: '',
        gan: '',
        birthDate: '',
        birthPlace: '',
        birthTime: '',
        height: '',
        color: '',
        mama: '',
        nationality: '',
        education: '',
        mobile: '',
        occupation: '',
        position: '',
        company: '',
        annualIncome: '',
        currentAddress: '',
        currentStatus: '',
        previousSpouseName: '',
        marriageDate: '',
        marriageEndDate: '',
        endReason: '',
        childrenCount: '',
        childrenDetails: '',
        kundliAvailable: false,
        kundliMatching: false,
        agePreference: '',
        educationPreference: '',
        partnerType: '',
        acceptChildrenPartner: false,
        cityPreference: '',
        motherName: '',
        fatherName: '',
        siblings: ''
      });
      setSelectedFiles({
        fullSizePhoto: null,
        aadharCard: null,
        divorceDeath: null,
        kundaliFile: null
      });
      setSelectedDocTypes({
        fullSizePhoto: false,
        aadharCard: false,
        divorceDeath: false,
        kundaliFile: false
      });
      
    setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const contacts = [
    { name: 'प्रदीप पहरिया', phone: '9803872220' },
    { name: 'सुधीर रावत', phone: '9826260742' },
    { name: 'भानु चपरा', phone: '8251980900' },
    { name: 'भाईजी सियाशरण कस्तवार', phone: '9826513272' },
    { name: 'नितेश सेठ', phone: '9560100097' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-[url('/sammelan-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        <div className="relative pt-16 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-xl">
              <Heart className="w-8 h-8 text-white" />
              </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {t('gahoiSammelan.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('gahoiSammelan.subtitle')}
            </p>
              </div>
            </div>
      </div>

      {/* Navigation Section */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Section Tabs with Enhanced Styling */}
            <nav className="flex space-x-6 w-full md:w-auto justify-center">
              <button 
                onClick={() => setActiveSection('event')}
                className={`px-6 py-3 rounded-full transition-all relative group ${
                  activeSection === 'event' 
                    ? 'bg-red-100 text-red-800 font-semibold' 
                    : 'text-gray-600 hover:text-red-800'
                }`}
              >
                <span className="relative z-10">{t('gahoiSammelan.eventDetails.title')}</span>
                {activeSection === 'event' && (
                  <span className="absolute inset-0 bg-red-100 rounded-full transform scale-100 transition-transform duration-200"></span>
                )}
                <span className="absolute inset-0 bg-red-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200"></span>
              </button>
              <button 
                onClick={() => setActiveSection('form')}
                className={`px-6 py-3 rounded-full transition-all relative group ${
                  activeSection === 'form' 
                    ? 'bg-red-100 text-red-800 font-semibold' 
                    : 'text-gray-600 hover:text-red-800'
                }`}
              >
                <span className="relative z-10">{t('gahoiSammelan.form.title')}</span>
                {activeSection === 'form' && (
                  <span className="absolute inset-0 bg-red-100 rounded-full transform scale-100 transition-transform duration-200"></span>
                )}
                <span className="absolute inset-0 bg-red-50 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-200"></span>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => setActiveSection('event')}
              className={`py-3 text-center rounded-xl transition-all relative overflow-hidden ${
                activeSection === 'event' 
                  ? 'bg-red-100 text-red-800 font-semibold' 
                  : 'text-gray-600'
              }`}
            >
              <div className="relative z-10">{t('gahoiSammelan.eventDetails.title')}</div>
            </button>
            <button 
              onClick={() => setActiveSection('form')}
              className={`py-3 text-center rounded-xl transition-all relative overflow-hidden ${
                activeSection === 'form' 
                  ? 'bg-red-100 text-red-800 font-semibold' 
                  : 'text-gray-600'
              }`}
            >
              <div className="relative z-10">{t('gahoiSammelan.form.title')}</div>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {activeSection === 'event' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-8">
              {/* Event Details Header */}
              <div className="relative py-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative z-10 inline-block">
                  {t('gahoiSammelan.eventDetails.title')}
                </h2>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-32 h-1 bg-red-800/20 rounded-full"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-0 w-16 h-1 bg-red-800/40 rounded-full"></div>
              </div>
            </div>

            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-6 h-6 text-red-800" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('gahoiSammelan.eventDetails.date')}</h3>
                      <p className="text-gray-600">{t('gahoiSammelan.eventDetails.dateValue')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-6 h-6 text-red-800" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{t('gahoiSammelan.eventDetails.location')}</h3>
                      <p className="text-gray-600">{t('gahoiSammelan.eventDetails.locationValue')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-800 mb-3">{t('gahoiSammelan.eventDetails.registrationFee')}</h3>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-red-800">{t('gahoiSammelan.eventDetails.feeAmount')}</p>
                      <p className="text-sm text-gray-600">{t('gahoiSammelan.eventDetails.perRegistration')}</p>
                      <p className="text-sm text-gray-600">{t('gahoiSammelan.eventDetails.optionalFee')}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">{t('gahoiSammelan.eventDetails.lastDate')}</p>
                    <p className="text-lg font-semibold text-red-600">{t('gahoiSammelan.eventDetails.lastDateValue')}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Event Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('gahoiSammelan.whyEvent.title')}</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    key: 'support',
                    icon: <Users className="w-6 h-6 text-red-800" />
                  },
                  {
                    key: 'match',
                    icon: <Heart className="w-6 h-6 text-red-800" />
                  },
                  {
                    key: 'break',
                    icon: <Star className="w-6 h-6 text-red-800" />
                  },
                  {
                    key: 'stability',
                    icon: <Check className="w-6 h-6 text-red-800" />
                  }
                ].map((item) => (
                  <div key={item.key} className="p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <div className="flex items-center space-x-3 mb-3">
                      {item.icon}
                      <h3 className="font-semibold text-gray-800">{t(`gahoiSammelan.whyEvent.reasons.${item.key}.title`)}</h3>
                    </div>
                    <p className="text-gray-600">{t(`gahoiSammelan.whyEvent.reasons.${item.key}.desc`)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Souvenir Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-6">
                <FileText className="w-8 h-8 text-blue-500" />
                <h2 className="text-3xl font-bold text-gray-800">{t('gahoiSammelan.souvenir.title')}</h2>
              </div>
              <p className="text-gray-600 mb-6">{t('gahoiSammelan.souvenir.description')}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('gahoiSammelan.souvenir.fullPage')}</h3>
                  <p className="text-2xl font-bold text-blue-600">₹5,000/-</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-semibold text-gray-800 mb-2">{t('gahoiSammelan.souvenir.halfPage')}</h3>
                  <p className="text-2xl font-bold text-blue-600">₹3,000/-</p>
                </div>
              </div>
            </div>

             {/* WhatsApp Group Section */}
             <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
               <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                 {/* Text Content - Left Side */}
                 <div className="flex-1 space-y-6">
                   <div className="space-y-4">
                     <h2 className="text-3xl font-bold text-red-600 border-b-2 border-red-200/20 pb-4">
                       अखिल भारतीय गहोई वैश्य परिचय सम्मेलन 2025
                     </h2>
                     <h3 className="text-2xl font-semibold text-red-800">
                       WhatsApp Group
                     </h3>
                   </div>
                   <div className="text-red-800 space-y-6">
                     <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 text-white px-4 py-2 rounded-lg">
                       आइए जुड़े इस पावन पहल से!
                     </p>
                     <p className="text-lg leading-relaxed">
                       जो भी समाजबंधु इस संदेश को पढ़ रहे हैं, उनसे विनम्र अनुरोध है कि कृपया इस जानकारी को अपने परिचितों,
                       रिश्तेदारों एवं सोशल मीडिया के माध्यम से पुरे भारतवर्ष में सभी गहोई वैश्य तक पहुँचाने का कष्ट करें।
                     </p>
                   </div>
                 </div>

                 {/* QR Code - Right Side */}
                 <div className="md:w-72 flex-shrink-0">
                   <div className="bg-white p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300">
                     <img 
                       src="/whatsapp.jpg" 
                       alt="WhatsApp Group QR Code" 
                       className="w-full h-auto object-contain rounded-xl"
                     />
                     <p className="text-center mt-4 text-gray-600 font-medium">
                       Scan to Join
                     </p>
                   </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t('gahoiSammelan.contact.title')}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {contacts.map((contact, index) => (
                  <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
                    <Phone className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-800">{contact.name}</p>
                      <p className="text-gray-600">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">{t('gahoiSammelan.contact.phonepeTitle')}</p>
                <p className="text-2xl font-bold text-green-600">8251980900</p>
                <p className="text-sm text-gray-500 mt-2">{t('gahoiSammelan.contact.paymentNote')}</p>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'form' && (
          <div className="animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              {/* Form Header */}
              <div className="text-center mb-12 relative">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-red-100 transform -translate-y-1/2"></div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 relative inline-block bg-white px-6">
                  {t('gahoiSammelan.form.title')}
                </h2>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
                  <Check className="w-6 h-6 text-green-500" />
                  <p className="text-green-700">आपका फॉर्म सफलतापूर्वक सबमिट हो गया है!</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <div className="text-red-700">{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.personalInfo.title')}</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('gahoiSammelan.form.personalInfo.fullName')} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('gahoiSammelan.form.personalInfo.gender')} *
                      </label>
                      <div className="flex space-x-6">
                        <label className="relative flex items-center space-x-3 cursor-pointer group">
                            <input
                              type="radio"
                              name="gender"
                            value="male"
                              onChange={handleInputChange}
                            className="form-radio text-red-600 focus:ring-red-500 h-5 w-5"
                            />
                          <span className="text-gray-700 group-hover:text-red-700 transition-colors">
                            {t('gahoiSammelan.form.personalInfo.male')}
                          </span>
                          </label>
                        <label className="relative flex items-center space-x-3 cursor-pointer group">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            onChange={handleInputChange}
                            className="form-radio text-red-600 focus:ring-red-500 h-5 w-5"
                          />
                          <span className="text-gray-700 group-hover:text-red-700 transition-colors">
                            {t('gahoiSammelan.form.personalInfo.female')}
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.gotra')}</label>
                      <input
                        type="text"
                        name="gotra"
                        value={formData.gotra}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.aankna')}</label>
                      <input
                        type="text"
                        name="aankna"
                        value={formData.aankna}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.gan')}</label>
                      <input
                        type="text"
                        name="gan"
                        value={formData.gan}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('gahoiSammelan.form.personalInfo.birthDate')} *
                      </label>
                      <div className="relative">
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300 cursor-pointer"
                        required
                          onClick={(e) => e.target.showPicker()}
                      />
                    </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.birthPlace')}</label>
                      <input
                        type="text"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.birthTime')}</label>
                      <input
                        type="time"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.height')}</label>
                      <input
                        type="text"
                        name="height"
                        value={formData.height}
                        onChange={handleInputChange}
                        // placeholder={t('gahoiSammelan.form.personalInfo.heightPlaceholder')}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.color')}</label>
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.mama')}</label>
                      <input
                        type="text"
                        name="mama"
                        value={formData.mama}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.nationality')}</label>
                      <input
                        type="text"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleInputChange}
                        // placeholder={t('gahoiSammelan.form.personalInfo.nationalityPlaceholder')}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.mobile')} *</label>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.personalInfo.education')}</label>
                    <select
                      name="education"
                      value={formData.education}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="postGraduate">{t('gahoiSammelan.form.personalInfo.educationOptions.postGraduate')}</option>
                      <option value="graduate">{t('gahoiSammelan.form.personalInfo.educationOptions.graduate')}</option>
                      <option value="diploma">{t('gahoiSammelan.form.personalInfo.educationOptions.diploma')}</option>
                      <option value="class12">{t('gahoiSammelan.form.personalInfo.educationOptions.12th')}</option>
                      <option value="class10">{t('gahoiSammelan.form.personalInfo.educationOptions.10th')}</option>
                      <option value="other">{t('gahoiSammelan.form.personalInfo.educationOptions.other')}</option>
                    </select>
                  </div>

                  <div className="space-y-6">
                    {/* Kundli Available */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('gahoiSammelan.form.personalInfo.kundliAvailable')}
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="kundliAvailable"
                            value="true"
                            checked={formData.kundliAvailable === true}
                            onChange={handleInputChange}
                            className="form-radio text-red-600 focus:ring-red-500"
                          />
                          <span>{t('common.yes')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="kundliAvailable"
                            value="false"
                            checked={formData.kundliAvailable === false}
                            onChange={handleInputChange}
                            className="form-radio text-red-600 focus:ring-red-500"
                          />
                          <span>{t('common.no')}</span>
                        </label>
                      </div>
                    </div>

                    {/* Kundli Matching */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {t('gahoiSammelan.form.personalInfo.kundliMatching')}
                      </label>
                      <div className="flex space-x-6">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="kundliMatching"
                            value="true"
                            checked={formData.kundliMatching === true}
                            onChange={handleInputChange}
                            className="form-radio text-red-600 focus:ring-red-500"
                          />
                          <span>{t('common.yes')}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="kundliMatching"
                            value="false"
                            checked={formData.kundliMatching === false}
                            onChange={handleInputChange}
                            className="form-radio text-red-600 focus:ring-red-500"
                          />
                          <span>{t('common.no')}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.professionalInfo.title')}</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.professionalInfo.occupation')}</label>
                      <input
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.professionalInfo.position')}</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.professionalInfo.companyName')}</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.professionalInfo.annualIncome')}</label>
                    <input
                      type="text"
                      name="annualIncome"
                      value={formData.annualIncome}
                      onChange={handleInputChange}
                      // placeholder={t('gahoiSammelan.form.professionalInfo.incomePlaceholder')}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.addressInfo.title')}</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.addressInfo.currentAddress')} *</label>
                    <textarea
                      name="currentAddress"
                      value={formData.currentAddress}
                      onChange={handleInputChange}
                      rows="3"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300 resize-none"
                      required
                    />
                  </div>
                  </div>
                </div>

                {/* Previous Marriage Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.previousMarriage.title')}</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.previousMarriage.marriageDate')}
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="marriageDate"
                        value={formData.marriageDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300 cursor-pointer"
                        onClick={(e) => e.target.showPicker()}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.previousMarriage.children')}
                    </label>
                      <input
                        type="number"
                        name="childrenCount"
                        value={formData.childrenCount}
                        onChange={handleInputChange}
                        min="0"
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.previousMarriage.childrenDetails')}
                    </label>
                      <input
                        type="text"
                        name="childrenDetails"
                        value={formData.childrenDetails}
                        onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                  </div>
                </div>

                {/* Partner Preferences */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.partnerPreferences.title')}</span>
                  </h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.partnerPreferences.ageRange')}
                          </label>
                      <input
                        type="text"
                        name="agePreference"
                        value={formData.agePreference}
                        onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.partnerPreferences.education')}
                    </label>
                      <input
                        type="text"
                        name="educationPreference"
                        value={formData.educationPreference}
                        onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.partnerPreferences.occupation')}
                    </label>
                    <select
                      name="partnerType"
                      value={formData.partnerType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                    >
                      <option value="">{t('common.select')}</option>
                      <option value="business">{t('gahoiSammelan.form.partnerPreferences.business')}</option>
                      <option value="service">{t('gahoiSammelan.form.partnerPreferences.service')}</option>
                      <option value="housewife">{t('gahoiSammelan.form.partnerPreferences.housewife')}</option>
                      <option value="any">{t('gahoiSammelan.form.partnerPreferences.any')}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.partnerPreferences.location')}
                          </label>
                      <input
                        type="text"
                        name="cityPreference"
                        value={formData.cityPreference}
                        onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                  </div>

                  {/* Accept Children Partner */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {t('gahoiSammelan.form.partnerPreferences.acceptChildren')}
                    </label>
                    <div className="flex space-x-6">
                      <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="acceptChildrenPartner"
                          value="true"
                          checked={formData.acceptChildrenPartner === true}
                              onChange={handleInputChange}
                          className="form-radio text-red-600 focus:ring-red-500"
                            />
                        <span>{t('common.yes')}</span>
                          </label>
                      <label className="flex items-center space-x-2">
                      <input
                          type="radio"
                          name="acceptChildrenPartner"
                          value="false"
                          checked={formData.acceptChildrenPartner === false}
                        onChange={handleInputChange}
                          className="form-radio text-red-600 focus:ring-red-500"
                      />
                        <span>{t('common.no')}</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Family Information */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.familyInfo.title')}</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.familyInfo.motherName')}</label>
                      <input
                        type="text"
                        name="motherName"
                        value={formData.motherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.familyInfo.fatherName')}</label>
                      <input
                        type="text"
                        name="fatherName"
                        value={formData.fatherName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">{t('gahoiSammelan.form.familyInfo.siblingsInfo')}</label>
                    <textarea
                      name="siblings"
                      value={formData.siblings}
                      onChange={handleInputChange}
                      rows="2"
                      // placeholder={t('gahoiSammelan.form.familyInfo.siblingsPlaceholder')}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all shadow-sm hover:border-red-300 resize-none"
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.documents.title')}</span>
                  </h3>
                  
                  <div className="bg-gray-50 rounded-2xl p-8 border-2 border-dashed border-gray-200">
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {[
                        { type: 'fullSizePhoto', icon: Camera, label: t('gahoiSammelan.form.documents.fullSizePhoto') },
                        { type: 'aadharCard', icon: FileText, label: t('gahoiSammelan.form.documents.aadharCard') },
                        { type: 'divorceDeath', icon: FileText, label: t('gahoiSammelan.form.documents.divorceOrDeath') },
                        { type: 'kundaliFile', icon: Star, label: t('gahoiSammelan.form.documents.kundali') }
                      ].map((doc) => (
                        <div key={doc.type} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-red-200 transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedDocTypes[doc.type]}
                            onChange={() => handleDocTypeChange(doc.type)}
                            className="form-checkbox h-5 w-5 text-red-600 rounded border-gray-300 focus:ring-red-500"
                          />
                          <div className="flex-1 flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <doc.icon className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700">{doc.label}</span>
                      </div>
                            {selectedFiles[doc.type] && (
                      <div className="flex items-center space-x-2">
                                <span className="text-sm text-green-600">
                                  {selectedFiles[doc.type].name}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFile(doc.type)}
                                  className="p-1 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </button>
                      </div>
                            )}
                      </div>
                      </div>
                      ))}
                    </div>
                    
                    <div className="relative group cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                        disabled={!Object.values(selectedDocTypes).some(type => type)}
                      />
                      <div className={`text-center p-8 border-2 border-dashed rounded-xl transition-colors ${
                        Object.values(selectedDocTypes).some(type => type)
                          ? 'border-gray-200 group-hover:border-red-300'
                          : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                      }`}>
                        <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors ${
                          Object.values(selectedDocTypes).some(type => type)
                            ? 'text-gray-400 group-hover:text-red-500'
                            : 'text-gray-300'
                        }`} />
                        <p className={`transition-colors ${
                          Object.values(selectedDocTypes).some(type => type)
                            ? 'text-gray-600 group-hover:text-red-600'
                            : 'text-gray-400'
                        }`}>
                          {Object.values(selectedDocTypes).some(type => type)
                            ? t('gahoiSammelan.form.documents.dragDrop')
                            : t('gahoiSammelan.form.documents.selectDocFirst')}
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          {t('gahoiSammelan.form.documents.maxSize')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consent Section */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-gray-800 flex items-center space-x-3 pb-4 border-b border-red-100">
                    <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
                      <FileText className="w-4 h-4 text-white" />
                    </div>
                    <span>{t('gahoiSammelan.form.consent.title')}</span>
                  </h3>

                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {t('gahoiSammelan.form.consent.declaration')}
                    </p>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        className="mt-1"
                        required
                      />
                      <label htmlFor="consent" className="text-gray-700">
                        {t('gahoiSammelan.form.consent.agree')}
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col items-center space-y-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 text-white text-lg font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl ${
                      loading ? 'opacity-50 cursor-not-allowed' : 'hover:from-red-700 hover:to-red-600'
                    }`}
                  >
                    {loading ? t('common.submitting') : t('gahoiSammelan.form.submit')}
                  </button>
                  <p className="text-gray-500 text-sm text-center">
                    {t('gahoiSammelan.footer.note')}
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-red-800 to-red-700 rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800">{t('gahoiSammelan.footer.title')}</h3>
          </div>
          <p className="text-gray-600 mb-4">{t('gahoiSammelan.footer.tagline')}</p>
          <p className="text-sm text-gray-500">{t('gahoiSammelan.footer.note')}</p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GahoiSammelanPage;