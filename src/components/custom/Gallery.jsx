import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar, Image, Maximize2, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  STATES, 
  STATE_TO_DISTRICTS,
  ASHOKNAGAR_LOCAL_BODIES,
  ALIRAJPUR_LOCAL_BODIES,
  ANUPPUR_LOCAL_BODIES,
  BALAGHAT_LOCAL_BODIES,
  BARWANI_LOCAL_BODIES,
  BETUL_LOCAL_BODIES,
  BHIND_LOCAL_BODIES,
  BHOPAL_LOCAL_BODIES,
  BURHANPUR_LOCAL_BODIES,
  CHHATARPUR_LOCAL_BODIES,
  CHHINDWARA_LOCAL_BODIES,
  DAMOH_LOCAL_BODIES,
  DATIA_LOCAL_BODIES,
  DEWAS_LOCAL_BODIES,
  DHAR_LOCAL_BODIES,
  DINDORI_LOCAL_BODIES,
  GUNA_LOCAL_BODIES,
  GWALIOR_LOCAL_BODIES,
  HARDA_LOCAL_BODIES,
  INDORE_LOCAL_BODIES,
  JABALPUR_LOCAL_BODIES,
  JHABUA_LOCAL_BODIES,
  KATNI_LOCAL_BODIES,
  KHANDWA_LOCAL_BODIES,
  KHARGONE_LOCAL_BODIES,
  MANDLA_LOCAL_BODIES,
  MANDSAUR_LOCAL_BODIES,
  MORENA_LOCAL_BODIES,
  NARSINGHPUR_LOCAL_BODIES,
  NEEMUCH_LOCAL_BODIES,
  PANNA_LOCAL_BODIES,
  RAISEN_LOCAL_BODIES,
  RAJGARH_LOCAL_BODIES,
  RATLAM_LOCAL_BODIES
} from '../../constants/locationData';
import { STATE_TO_ASSEMBLIES } from '../../constants/formConstants';

const API_URL = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1340';

// Import required components and utilities from Registration
const GOTRA_OPTIONS = [
  "Garg",
  "Gautam",
  "Jamadagni",
  "Bharadwaj",
  "Vishvamitra",
  "Vashishtha",
  "Kashyap",
  "Atri"
];

const AAKNA_OPTIONS = [
  "Agarwal",
  "Barnwal",
  "Gahoi",
  "Maheshwari",
  "Khandelwal"
];

// Local panchayat data
const LOCAL_PANCHAYATS = {
  "Chambal Regional Assembly": ["Morena", "Bhind", "Gwalior"],
  "Central Malwa Regional Assembly": ["Indore", "Dewas", "Ujjain", "Bhopal", "Vidisha", "Raisen"],
  "Mahakaushal Regional Assembly": ["Jabalpur", "Katni", "Rewa"],
  "Vindhya Regional Assembly": ["Satna", "Shahdol", "Sidhi", "Chhatarpur", "Panna", "Rewa"],
  "Bundelkhand Regional Assembly": ["Sagar", "Damoh", "Chhatarpur"],
  "Chaurasi Regional Assembly": ["Bhopal", "Vidisha", "Raisen"],
  "Southern Regional Assembly": ["Pune", "Mumbai", "Nagpur", "Amravati", "Chalisgaon", "Dhuliya"]
};

const SUB_LOCAL_PANCHAYATS = {
  Pune: ["Pune", "Pimpri-Chinchwad", "Khadki", "Hadapsar"],
  Mumbai: ["South Mumbai", "Andheri", "Borivali", "Thane", "Navi Mumbai"],
  Nagpur: ["Nagpur", "Kamptee", "Hingna"],
  Amravati: ["Amravati", "Badnera", "Achalpur"],
  Chalisgaon: ["Chalisgaon"],
  Dhuliya: ["Dhuliya"],
  Morena: ["Morena", "Ambah", "Porsa"],
  Bhind: ["Bhind", "Ater", "Lahar", "Daboh", "Tharet", "Mihona", "Aswar", "Lahar", "Gohad", "Machhand", "Raun"],
  Gwalior: ["Gwalior", "Dabra", "Madhavganj", "Khasgi Bazaar", "Daulatganj", "Kampoo", "Lohia Bazaar", "Phalka Bazaar", "Lohamandi", "Bahodapur", "Naka Chandravadni", "Harishankarpuram", "Thatipur", "Morar", "Dabra", "Pichhore Dabra", "Behat"],
  Indore: ["Indore"],
  Ujjain: ["Ujjain"],
  Bhopal: ["Bhopal", "Berasia"],
  Vidisha: ["Vidisha"],
  Raisen: ["Begamganj"]
};

// Helper function to get local bodies based on district
const getLocalBodies = (district) => {
  const localBodiesMap = {
    'Ashoknagar': ASHOKNAGAR_LOCAL_BODIES,
    'Alirajpur': ALIRAJPUR_LOCAL_BODIES,
    'Anuppur': ANUPPUR_LOCAL_BODIES,
    'Balaghat': BALAGHAT_LOCAL_BODIES,
    'Barwani': BARWANI_LOCAL_BODIES,
    'Betul': BETUL_LOCAL_BODIES,
    'Bhind': BHIND_LOCAL_BODIES,
    'Bhopal': BHOPAL_LOCAL_BODIES,
    'Burhanpur': BURHANPUR_LOCAL_BODIES,
    'Chhatarpur': CHHATARPUR_LOCAL_BODIES,
    'Chhindwara': CHHINDWARA_LOCAL_BODIES,
    'Damoh': DAMOH_LOCAL_BODIES,
    'Datia': DATIA_LOCAL_BODIES,
    'Dewas': DEWAS_LOCAL_BODIES,
    'Dhar': DHAR_LOCAL_BODIES,
    'Dindori': DINDORI_LOCAL_BODIES,
    'Guna': GUNA_LOCAL_BODIES,
    'Gwalior': GWALIOR_LOCAL_BODIES,
    'Harda': HARDA_LOCAL_BODIES,
    'Indore': INDORE_LOCAL_BODIES,
    'Jabalpur': JABALPUR_LOCAL_BODIES,
    'Jhabua': JHABUA_LOCAL_BODIES,
    'Katni': KATNI_LOCAL_BODIES,
    'Khandwa': KHANDWA_LOCAL_BODIES,
    'Khargone': KHARGONE_LOCAL_BODIES,
    'Mandla': MANDLA_LOCAL_BODIES,
    'Mandsaur': MANDSAUR_LOCAL_BODIES,
    'Morena': MORENA_LOCAL_BODIES,
    'Narsinghpur': NARSINGHPUR_LOCAL_BODIES,
    'Neemuch': NEEMUCH_LOCAL_BODIES,
    'Panna': PANNA_LOCAL_BODIES,
    'Raisen': RAISEN_LOCAL_BODIES,
    'Rajgarh': RAJGARH_LOCAL_BODIES,
    'Ratlam': RATLAM_LOCAL_BODIES
  };

  const districtData = localBodiesMap[district];
  if (!districtData) return [];

  return [...districtData.NAGAR_PALIKA, ...districtData.JANPAD_PANCHAYAT];
};

const getLocalPanchayats = (regionalAssembly) => {
  return LOCAL_PANCHAYATS[regionalAssembly] || [];
};

const getSubLocalPanchayats = (localPanchayat) => {
  return SUB_LOCAL_PANCHAYATS[localPanchayat] || [];
};

const Gallery = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [mpin, setMpin] = useState('');
  const [mpinError, setMpinError] = useState('');
  const [verifyingMpin, setVerifyingMpin] = useState(false);
  const [userMobile, setUserMobile] = useState('');

  // Quick registration form state
  const [showQuickRegister, setShowQuickRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    nationality: '',
    isGahoi: '',
    gotra: '',
    aakna: '',
    state: '',
    district: '',
    localBody: '',
    gramPanchayat: '',
    regionalAssembly: '',
    localPanchayatTrust: '',
    localPanchayat: '',
    subLocalPanchayat: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Add effect to manage body overflow
  useEffect(() => {
    if (showQuickRegister) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showQuickRegister]);
 
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const verifiedMobile = localStorage.getItem('verifiedMobile');
      if (token && verifiedMobile) {
        setIsAuthenticated(true);
        setUserMobile(verifiedMobile);
        
   
        const pendingEventId = sessionStorage.getItem('pendingEventId');
        if (pendingEventId) {
          const event = events.find(e => e.id === parseInt(pendingEventId));
          if (event) {
            setSelectedEvent(event);
            setSelectedImageIdx(0);
            document.body.style.overflow = 'hidden';
          }
          sessionStorage.removeItem('pendingEventId');
        }
      }
    };

    checkAuth();
  }, [events]);

  const openLightbox = useCallback((event, imageIdx = 0) => {
    const token = localStorage.getItem('token');
    const verifiedMobile = localStorage.getItem('verifiedMobile');
    const isUserAuthenticated = !!token && !!verifiedMobile;
    
    if (!isUserAuthenticated) {
      
      localStorage.setItem('returnTo', '/gallery');
      localStorage.setItem('pendingEventId', event.id);
      
      navigate('/login');
      return;
    }
    
    setSelectedEvent(event);
    setSelectedImageIdx(imageIdx);
    document.body.style.overflow = 'hidden';
  }, [navigate]);

  // Handle MPIN verification
  const handleMpinVerify = async (e) => {
    e.preventDefault();
    if (mpin.length !== 4) {
      setMpinError(t('gallery.mpinLengthError') || 'MPIN must be 4 digits');
      return;
    }

    try {
      setVerifyingMpin(true);
      setMpinError('');

      const response = await fetch(`${API_URL}/api/verify-mpin`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobileNumber: userMobile,
          mpin: mpin
        })
      });

      const data = await response.json();
      
      if (response.ok && data.jwt) {
        localStorage.setItem('token', data.jwt);
        localStorage.setItem('verifiedMobile', userMobile);
        setIsAuthenticated(true);
        setShowLoginModal(false);
        setMpin('');
        
        if (selectedEvent) {
          setSelectedImageIdx(0);
          document.body.style.overflow = 'hidden';
        }
      } else if (response.status === 404) {
       
        localStorage.setItem('returnTo', '/gallery');
        if (selectedEvent) {
          localStorage.setItem('pendingEventId', selectedEvent.id);
        }
        navigate('/login');
      } else {
        setMpinError(t('gallery.mpinError') || 'Invalid MPIN');
      }
    } catch (error) {
      console.error('MPIN verification error:', error);
      setMpinError(t('gallery.mpinVerificationError') || 'Failed to verify MPIN');
    } finally {
      setVerifyingMpin(false);
    }
  };

  useEffect(() => {
    const returnPath = localStorage.getItem('returnPath');
    if (returnPath === '/gallery') {
      localStorage.removeItem('returnPath');
      const token = localStorage.getItem('token');
      const verifiedMobile = localStorage.getItem('verifiedMobile');
      if (token && verifiedMobile) {
        setIsAuthenticated(true);
        setUserMobile(verifiedMobile);
      }
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/api/gallery-events?populate=*`, {
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.error?.message || `Server responded with status ${response.status}`);
        }

        const { data } = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from server');
        }

        // transform data
        const transformedEvents = data.map(event => ({
          id: event.id,
          documentId: event.documentId,
          name: event.Name,
          description: event.Description,
          date: event.Date,
          images: event.Images || [],
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          publishedAt: event.publishedAt
        }));

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching gallery events:', err);
        setError(err.message || 'Failed to load gallery events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedEvent(null);
    setSelectedImageIdx(0);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!selectedEvent) return;
    
    const totalImages = selectedEvent.images.length;
    setSelectedImageIdx(prev => {
      if (direction === 'next') {
        return (prev + 1) % totalImages;
      } else {
        return (prev - 1 + totalImages) % totalImages;
      }
    });
  }, [selectedEvent]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedEvent) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'Escape':
          closeLightbox();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedEvent, navigateImage, closeLightbox]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-rose-100">
      {/* Hero Section - Always visible */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-800 to-orange-800"></div>
        <div className="absolute inset-0 bg-[url('/gallery-bg.webp')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40"></div>
        
        <div className="relative pt-16 pb-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full mb-6 shadow-xl">
              <Image className="w-8 h-8 text-white" />
            </div>
             <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              {t('gallery.title')}
            </h1>
             <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              {t('gallery.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Login/MPIN Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              {t('gallery.enterMpin')}
            </h3>
            
            <form onSubmit={handleMpinVerify}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('gallery.mpinLabel')}
                  </label>
                  <input
                    type="password"
                    value={mpin}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 4 && /^\d*$/.test(value)) {
                        setMpin(value);
                        setMpinError('');
                      }
                    }}
                    className={`w-full px-4 py-2 text-center text-lg tracking-widest border rounded-lg ${
                      mpinError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    maxLength={4}
                    placeholder="••••"
                    autoFocus
                  />
                  {mpinError && (
                    <p className="mt-1 text-sm text-red-600">{mpinError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginModal(false);
                      setMpin('');
                      setMpinError('');
                    }}
                    className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={verifyingMpin}
                  >
                    {t('common.back')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                    disabled={verifyingMpin || mpin.length !== 4}
                  >
                    {verifyingMpin ? (
                      <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    ) : (
                      t('common.verify')
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Registration Form Modal */}
      {showQuickRegister && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden" onClick={() => setShowQuickRegister(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-[95%] max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Fixed Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h3 className="text-2xl font-bold text-gray-900">Quick Registration</h3>
              <button
                onClick={() => setShowQuickRegister(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form 
                id="quick-registration-form"
                onSubmit={async (e) => {
                  e.preventDefault();
                  
                  // Validate form
                  const errors = {};
                  if (!formData.name) errors.name = 'Name is required';
                  if (!formData.gender) errors.gender = 'Gender is required';
                  if (!formData.nationality) errors.nationality = 'Nationality is required';
                  if (!formData.isGahoi) errors.isGahoi = 'Please specify if you are Gahoi';
                  if (!formData.gotra) errors.gotra = 'Gotra is required';
                  if (!formData.aakna) errors.aakna = 'Aakna is required';
                  if (!formData.state) errors.state = 'State is required';
                  if (!formData.district) errors.district = 'District is required';
                  if (!formData.localBody) errors.localBody = 'Local Body is required';
                  if (!formData.regionalAssembly) errors.regionalAssembly = 'Regional Assembly is required';
                  if (!formData.localPanchayat) errors.localPanchayat = 'Local Panchayat is required';

                  if (Object.keys(errors).length > 0) {
                    setFormErrors(errors);
                    return;
                  }

                  try {
                    // Submit form data to backend
                    const response = await fetch(`${API_URL}/api/quick-registrations`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        data: formData
                      }),
                    });

                    if (!response.ok) {
                      throw new Error('Registration failed');
                    }

                    const data = await response.json();
                    
                    // Set authentication state
                    setIsAuthenticated(true);
                    localStorage.setItem('token', data.jwt);
                    
                    // Close registration form
                    setShowQuickRegister(false);
                    setFormErrors({});
                    
                    // Reset form data
                    setFormData({
                      name: '',
                      gender: '',
                      nationality: '',
                      isGahoi: '',
                      gotra: '',
                      aakna: '',
                      state: '',
                      district: '',
                      localBody: '',
                      gramPanchayat: '',
                      regionalAssembly: '',
                      localPanchayatTrust: '',
                      localPanchayat: '',
                      subLocalPanchayat: ''
                    });
                  } catch (error) {
                    console.error('Registration error:', error);
                    setFormErrors({
                      submit: 'Failed to register. Please try again.'
                    });
                  }
                }} 
                className="space-y-6"
              >
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    />
                    {formErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={e => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                    <input
                      type="text"
                      value={formData.nationality}
                      onChange={e => setFormData(prev => ({ ...prev, nationality: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Are you Gahoi?</label>
                    <select
                      value={formData.isGahoi}
                      onChange={e => setFormData(prev => ({ ...prev, isGahoi: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gotra</label>
                    <select
                      value={formData.gotra}
                      onChange={e => setFormData(prev => ({ ...prev, gotra: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Gotra</option>
                      {GOTRA_OPTIONS.map(gotra => (
                        <option key={gotra} value={gotra}>{gotra}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Aakna</label>
                    <select
                      value={formData.aakna}
                      onChange={e => setFormData(prev => ({ ...prev, aakna: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Aakna</option>
                      {AAKNA_OPTIONS.map(aakna => (
                        <option key={aakna} value={aakna}>{aakna}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Regional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <select
                      value={formData.state}
                      onChange={e => {
                        const newState = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          state: newState,
                          district: '',
                          localBody: '',
                        }));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.state ? 'border-red-500' : 'border-gray-300'}`}
                      required
                    >
                      <option value="">Select State</option>
                      {STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {formErrors.state && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                    <select
                      value={formData.district}
                      onChange={e => {
                        const newDistrict = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          district: newDistrict,
                          localBody: '',
                        }));
                      }}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.district ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      disabled={!formData.state}
                    >
                      <option value="">Select District</option>
                      {formData.state && STATE_TO_DISTRICTS[formData.state]?.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                    {formErrors.district && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.district}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local Body</label>
                    <select
                      value={formData.localBody}
                      onChange={e => setFormData(prev => ({ ...prev, localBody: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    >
                      <option value="">Select Local Body</option>
                      {getLocalBodies(formData.district).map((body) => (
                        <option key={body} value={body}>{body}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gram Panchayat</label>
                    <input
                      type="text"
                      value={formData.gramPanchayat}
                      onChange={e => setFormData(prev => ({ ...prev, gramPanchayat: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regional Assembly</label>
                    <select
                      value={formData.regionalAssembly}
                      onChange={e => setFormData(prev => ({ ...prev, regionalAssembly: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.regionalAssembly ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      disabled={!formData.state || !STATE_TO_ASSEMBLIES[formData.state]}
                    >
                      <option value="">
                        {!formData.state 
                          ? "Select State First"
                          : !STATE_TO_ASSEMBLIES[formData.state]
                          ? "No Regional Assembly for Selected State"
                          : "Select Regional Assembly"
                        }
                      </option>
                      {formData.state && STATE_TO_ASSEMBLIES[formData.state]?.map((assembly, index) => (
                        <option key={index} value={assembly}>{assembly}</option>
                      ))}
                    </select>
                    {formErrors.regionalAssembly && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.regionalAssembly}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local Panchayat Trust</label>
                    <input
                      type="text"
                      value={formData.localPanchayatTrust}
                      onChange={e => setFormData(prev => ({ ...prev, localPanchayatTrust: e.target.value }))}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Local Panchayat</label>
                    <select
                      value={formData.localPanchayat}
                      onChange={e => setFormData(prev => ({ ...prev, localPanchayat: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.localPanchayat ? 'border-red-500' : 'border-gray-300'}`}
                      required
                      disabled={!formData.regionalAssembly}
                    >
                      <option value="">
                        {!formData.regionalAssembly
                          ? "Select Regional Assembly First"
                          : "Select Local Panchayat"
                        }
                      </option>
                      {formData.regionalAssembly && getLocalPanchayats(formData.regionalAssembly).map((panchayat, index) => (
                        <option key={index} value={panchayat}>{panchayat}</option>
                      ))}
                    </select>
                    {formErrors.localPanchayat && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.localPanchayat}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Local Panchayat</label>
                    <select
                      value={formData.subLocalPanchayat}
                      onChange={e => setFormData(prev => ({ ...prev, subLocalPanchayat: e.target.value }))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${formErrors.subLocalPanchayat ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={!formData.localPanchayat}
                    >
                      <option value="">
                        {!formData.localPanchayat
                          ? "Select Local Panchayat First"
                          : "Select Sub Local Panchayat"
                        }
                      </option>
                      {formData.localPanchayat && getSubLocalPanchayats(formData.localPanchayat).map((panchayat, index) => (
                        <option key={index} value={panchayat}>{panchayat}</option>
                      ))}
                    </select>
                    {formErrors.subLocalPanchayat && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.subLocalPanchayat}</p>
                    )}
                  </div>
                </div>
              </form>
            </div>

            {/* Fixed Footer with Buttons */}
            <div className="border-t border-gray-200 p-6 bg-white sticky bottom-0">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowQuickRegister(false)}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="quick-registration-form"
                  className="px-6 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Register & View Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Grid Section - Shows loading/error states */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading gallery events...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No gallery events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-500"
              >
                <div className="relative h-64 overflow-hidden">
                  {!isAuthenticated && (
                    <div className="absolute inset-0 z-20 bg-black/25 backdrop-blur-[2px] flex flex-col items-center justify-center p-6">
                      <Lock className="w-12 h-12 text-white/90 mb-4" strokeWidth={1.5} />
                      <p className="text-white/90 text-center text-lg mb-4 font-medium">
                        {t('gallery.loginRequired') || 'Please login to view gallery images'}
                      </p>
                      <button
                        onClick={() => setShowQuickRegister(true)}
                        className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-6 rounded-full font-semibold transition-colors duration-200"
                      >
                        {t('gallery.loginToView') || 'Login to View'}
                      </button>
                    </div>
                  )}
                  <img
                    src={event.images[0]?.url || '/placeholder-image.jpg'}
                    alt={event.name}
                    className={`w-full h-full object-cover transition-transform duration-700 ${!isAuthenticated ? 'filter blur-[1px]' : ''}`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button
                      onClick={() => openLightbox(event)}
                      className="w-full bg-white/20 backdrop-blur-sm text-white py-2 px-4 rounded-full font-semibold hover:bg-white/30 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isAuthenticated ? (
                        <>
                          <Maximize2 className="w-4 h-4" />
                          {t('gallery.viewGallery')}
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          {t('gallery.loginToView')}
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                    <Calendar className="w-4 h-4" />
                    {formatDate(event.date)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors duration-300">
                    {event.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="flex items-center">
                    <span className="text-red-600 font-semibold text-sm flex items-center gap-1">
                      <Image className="w-4 h-4" />
                      {event.images.length} {t('gallery.photos')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedEvent && isAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          ></div>
          
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={t('gallery.lightbox.close')}
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-bold mb-2">{selectedEvent.name}</h2>
              <p className="text-white/90 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(selectedEvent.date)}
              </p>
            </div>

            {/* Image Display */}
            <div className="relative bg-gray-900">
              <img
                src={selectedEvent.images[selectedImageIdx].url}
                alt={selectedEvent.images[selectedImageIdx].alt}
                className="w-full h-96 md:h-[500px] object-contain"
              />
              
              {/* Navigation Arrows */}
              {selectedEvent.images.length > 1 && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={t('gallery.lightbox.previous')}
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                    aria-label={t('gallery.lightbox.next')}
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-600">
                  {selectedEvent.images[selectedImageIdx].alt}
                </p>
                <span className="text-sm text-gray-500">
                  {t('gallery.lightbox.imageOf', {
                    current: selectedImageIdx + 1,
                    total: selectedEvent.images.length
                  })}
                </span>
              </div>
              
              {/* Thumbnail Navigation */}
              {selectedEvent.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {selectedEvent.images.map((image, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        idx === selectedImageIdx
                          ? 'border-red-500 ring-2 ring-red-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;