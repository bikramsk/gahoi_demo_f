import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthState } from '../../utils/auth';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337';

const SECTIONS = [
  { id: 'personal', title: 'Personal Information', icon: 'user' },
  { id: 'family', title: 'Family Details', icon: 'users' },
  { id: 'biographical', title: 'Biographical Details', icon: 'book' },
  { id: 'work', title: 'Work Information', icon: 'briefcase' },
  { id: 'additional', title: 'Additional Details', icon: 'plus' },
  { id: 'regional', title: 'Regional Information', icon: 'map' }
];

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');
  const [authError, setAuthError] = useState(null);

 
  // Update the isValidToken function with better validation
  const isValidToken = (token) => {
    if (!token) return false;
    
    try {
      // Remove quotes and whitespace
      const cleanToken = token.replace(/^["'](.+)["']$/, '$1').trim();
      
      // Check basic JWT structure
      const parts = cleanToken.split('.');
      if (parts.length !== 3) return false;
      
      // Verify each part is base64url encoded
      if (!parts.every(part => /^[A-Za-z0-9-_]*$/.test(part))) return false;
      
      // Try to decode the payload
      const payload = JSON.parse(atob(parts[1]));
      
      // Check if token is expired
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        console.error('Token expired');
        return false;
      }
      
      return true;
    } catch (err) {
      console.error('Token validation error:', err);
      return false;
    }
  };

  // Update the fetchUserData function within useEffect
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { jwt, mobile } = checkAuthState();
        
        if (!jwt || !mobile) {
          console.error('No auth data found');
          navigate('/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${jwt}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        };

        console.log('Request Headers:', {
          authHeader: headers.Authorization.substring(0, 30) + '...',
          allHeaders: headers
        });

        const url = `${API_BASE}/api/registration-pages`;
        const params = new URLSearchParams({
          'filters[personal_information][mobile_number][$eq]': mobile,
          'populate': 'personal_information'
        });

        // Log full request details
        console.log('Making API Request:', {
          url: `${url}?${params.toString()}`,
          method: 'GET',
          headers: headers,
          credentials: 'include'
        });

        const response = await fetch(`${url}?${params.toString()}`, {
          method: 'GET',
          headers: headers,
          credentials: 'include'
        });

        // Log response details
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Response Error:', {
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            error: errorData
          });

          if (response.status === 401) {
            console.error('Authentication failed - clearing credentials');
            localStorage.clear();
            setAuthError('Session expired. Please login again.');
            navigate('/login');
            return;
          }
          
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response Success:', {
          hasData: !!data?.data,
          dataLength: data?.data?.length,
          firstRecord: data?.data?.[0]?.id
        });

        if (!data.data || data.data.length === 0) {
          console.log('No profile data found, redirecting to registration');
          navigate('/registration', { 
            state: { 
              mobileNumber: mobile,
              fromLogin: true 
            } 
          });
          return;
        }

        setUserData(data.data[0].attributes);
        setLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError(`Failed to load profile data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('verifiedMobile');
    navigate('/login');
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'users':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'book':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'briefcase':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'plus':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        );
      case 'map':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600">{authError}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  if (!userData || !userData.personal_information) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Incomplete</h2>
          <p className="text-gray-600 mb-2">Your profile information is incomplete.</p>
          <p className="text-gray-600 mb-4">Please complete your registration to continue.</p>
          <button
            onClick={() => navigate('/registration', {
              state: {
                mobileNumber: localStorage.getItem('verifiedMobile'),
                fromLogin: true
              }
            })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Complete Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Header */}
      <header className="bg-red-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img 
                src="/gahoi-logo.png" 
                alt="Gahoi Logo" 
                className="h-12 w-auto"
              />
            </div>
            <nav className="flex space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="px-3 py-2 text-sm font-medium text-white hover:text-red-200"
              >
                होम
              </button>
              <button 
                onClick={() => navigate('/gau-seva')}
                className="px-3 py-2 text-sm font-medium text-white hover:text-red-200"
              >
                गौ सेवा
              </button>
              <button 
                onClick={() => navigate('/gotra-aankna')}
                className="px-3 py-2 text-sm font-medium text-white hover:text-red-200"
              >
                गोत्र और आंकना
              </button>
              <button 
                onClick={() => navigate('/contact-us')}
                className="px-3 py-2 text-sm font-medium text-white hover:text-red-200"
              >
                संपर्क करें
              </button>
              <button 
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-white hover:text-red-200"
              >
                लॉग आउट
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white border-b border-gray-200 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-end h-14 gap-8">
            <div className="flex items-center gap-2">
              <h1 className="text-gray-700 text-sm font-medium">{userData.personal_information?.full_name}</h1>
              <span className="text-gray-400">|</span>
              <p className="text-gray-600 text-sm">गहोई कोड: {userData.gahoi_code}</p>
                </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                  localStorage.setItem('editUserData', JSON.stringify(userData));
                  navigate('/registration', { 
                    state: { 
                      mobileNumber: userData.personal_information?.mobile_number,
                      isEdit: true,
                      userData: {
                        id: userData.documentId,
                        attributes: userData
                      }
                    } 
                  });
                }}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                एडिट
              </button>
              <button 
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                लॉग आउट
              </button>
                </div>
                </div>
                </div>
                </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
              <nav className="py-4 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-shrink-0 md:flex-shrink flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-red-50 text-red-700 border-b-4 md:border-b-0 md:border-l-4 border-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {renderIcon(section.icon)}
                    <span className="ml-3 whitespace-nowrap">{section.title}</span>
                  </button>
                ))}
              </nav>
                </div>

            {/* Content Area */}
            <div className="flex-1 p-4 md:p-8">
              <div className="max-w-3xl mx-auto">
                {activeSection === 'personal' && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(userData.personal_information || {}).map(([key, value]) => (
                          key !== 'display_picture' && (
                            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                              <dt className="text-sm font-medium text-gray-500">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </dt>
                              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value || 'N/A'}
                              </dd>
                </div>
                          )
                        ))}
                      </dl>
                    </div>
                  </section>
                )}

                {activeSection === 'family' && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Family Details</h2>
                    <div className="space-y-6">
                      {/* Basic Family Info */}
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <dl className="divide-y divide-gray-200">
                          {Object.entries(userData.family_details || {}).map(([key, value]) => (
                            !Array.isArray(value) && (
                              <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500">
                                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  {value || 'N/A'}
                                </dd>
                </div>
                            )
                          ))}
                        </dl>
              </div>

                      {/* Siblings */}
              {userData.family_details?.siblingDetails?.length > 0 && (
                        <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Siblings</h3>
                  <div className="space-y-4">
                    {userData.family_details.siblingDetails.map((sibling, index) => (
                              <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  {Object.entries(sibling).map(([key, value]) => (
                                    <div key={key} className="sm:col-span-1">
                                      <dt className="text-sm font-medium text-gray-500">
                                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                      </dt>
                                      <dd className="mt-1 text-sm text-gray-900">
                                        {value || 'N/A'}
                                      </dd>
                          </div>
                                  ))}
                                </dl>
                      </div>
                    ))}
                  </div>
                </div>
              )}
                      </div>
                  </section>
                )}

                {activeSection === 'biographical' && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Biographical Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Manglik Status</label>
                  <p className="mt-1 text-gray-800">{userData.biographical_details?.manglik_status || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Grah</label>
                  <p className="mt-1 text-gray-800">{userData.biographical_details?.Grah || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Handicap</label>
                  <p className="mt-1 text-gray-800">{userData.biographical_details?.Handicap || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Marital Status</label>
                  <p className="mt-1 text-gray-800">{userData.biographical_details?.is_married || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Marriage Status</label>
                  <p className="mt-1 text-gray-800">{userData.biographical_details?.marriage_to_another_caste || 'N/A'}</p>
                </div>
              </div>
            </section>
                )}

                {activeSection === 'work' && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Work Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Occupation</label>
                  <p className="mt-1 text-gray-800">{userData.work_information?.occupation || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Company Name</label>
                  <p className="mt-1 text-gray-800">{userData.work_information?.company_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Work Area</label>
                  <p className="mt-1 text-gray-800">{userData.work_information?.work_area || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Industry Sector</label>
                  <p className="mt-1 text-gray-800">{userData.work_information?.industrySector || 'N/A'}</p>
                </div>
              </div>
            </section>
                )}

                {activeSection === 'additional' && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Blood Group</label>
                  <p className="mt-1 text-gray-800">{userData.additional_details?.blood_group || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                  <p className="mt-1 text-gray-800">{userData.additional_details?.date_of_birth || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Higher Education</label>
                  <p className="mt-1 text-gray-800">{userData.additional_details?.higher_education || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Current Address</label>
                  <p className="mt-1 text-gray-800">{userData.additional_details?.current_address || 'N/A'}</p>
                </div>
              </div>
            </section>
                )}

                {activeSection === 'regional' && (
                  <section>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Regional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">State</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.State || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">District</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.district || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">City</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.city || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Regional Assembly</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.RegionalAssembly || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Local Panchayat Name</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.LocalPanchayatName || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Local Panchayat</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.LocalPanchayat || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Sub Local Panchayat</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.SubLocalPanchayat || 'N/A'}
                  </p>
                </div>
              </div>
            </section>
                )}
              </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;