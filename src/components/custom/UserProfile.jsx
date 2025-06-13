import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337';

const API_TOKEN = localStorage.getItem('token');

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

  // Global error boundary
  useEffect(() => {
    const handleError = (error) => {
      console.error('Error in UserProfile:', error);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const mobileNumber = localStorage.getItem('verifiedMobile');

        if (!mobileNumber) {
          setError('Please login again to continue');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        if (!API_TOKEN) {
          setError('Configuration error. Please try again later.');
          return;
        }

        const apiUrl = `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number][$eq]=${mobileNumber}&populate=*`;

        const profileResponse = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
            Accept: 'application/json'
          }
        });

        if (!profileResponse.ok) {
          throw new Error(`Failed to fetch profile data: ${profileResponse.status}`);
        }

        const profileData = await profileResponse.json();
        console.log('PROFILE DATA:', profileData);

        if (!profileData.data || profileData.data.length === 0) {
          setError('Please complete your registration first.');
          setTimeout(() => {
            navigate('/registration', { 
              state: { 
                mobileNumber,
                fromLogin: true 
              } 
            });
          }, 2000);
          return;
        }

        const profile = profileData.data[0];
        if (!profile || !profile.attributes) {
          setError('Profile not found or incomplete.');
          setLoading(false);
          return;
        }

        const attrs = profile.attributes;
        const transformedData = {
          personal_information: attrs.personal_information || {},
          family_details: attrs.family_details || {},
          biographical_details: attrs.biographical_details || {},
          work_information: attrs.work_information || {},
          additional_details: attrs.additional_details || {},
          child_name: attrs.child_name || [],
          your_suggestions: attrs.your_suggestions || {},
          gahoi_code: attrs.gahoi_code || '',
          documentId: profile.id,
          createdAt: attrs.createdAt,
          updatedAt: attrs.updatedAt,
          publishedAt: attrs.publishedAt
        };

        setUserData(transformedData);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
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

  // Initialize empty data structure if no data is available
  const emptyData = {
    personal_information: {},
    family_details: {},
    biographical_details: {},
    work_information: {},
    additional_details: {},
    child_name: [],
    your_suggestions: {},
    gahoi_code: '',
    documentId: '',
    createdAt: '',
    updatedAt: '',
    publishedAt: ''
  };

  // Use empty data if userData is not available
  const displayData = userData || emptyData;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse"></div>
                <img 
                  src={displayData.personal_information?.display_picture ? 
                    `${API_BASE}${displayData.personal_information.display_picture}` : 
                    '/default-avatar.png'} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full border-2 border-white object-cover relative z-10"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div>
                <h1 className="text-xl font-bold">{displayData.personal_information?.full_name || 'Username'}</h1>
                <p className="text-sm opacity-90">Gahoi Code: {displayData.gahoi_code || 'Not Available'}</p>
                {error && <p className="text-sm text-red-300 mt-1">{error}</p>}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2">
              <button 
                onClick={() => navigate('/registration', { 
                  state: { 
                    mobileNumber: displayData.personal_information?.mobile_number,
                    isEdit: true,
                    userData: {
                      id: displayData.documentId,
                      attributes: displayData
                    }
                  } 
                })}
                className="px-4 py-2 text-sm bg-red-700 rounded-lg hover:bg-red-600 transition-colors flex items-center whitespace-nowrap"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm bg-red-700 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Home
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-700 rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Sidebar */}
            <div className="w-full lg:w-64 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible py-2 lg:py-4">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex-shrink-0 flex items-center px-4 py-3 text-sm font-medium transition-colors
                      ${activeSection === section.id
                        ? 'bg-red-50 text-red-700 border-b-4 lg:border-b-0 lg:border-l-4 border-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                      } w-auto lg:w-full whitespace-nowrap`}
                  >
                    {renderIcon(section.icon)}
                    <span className="ml-3">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
              <div className="max-w-3xl mx-auto">
                {activeSection === 'personal' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Personal Information</h2>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(displayData.personal_information || {}).map(([key, value]) => (
                          key !== 'display_picture' && (
                            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                              <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </dt>
                              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.toString() || 'N/A'}
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
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Family Details</h2>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(displayData.family_details || {}).length > 0 ? (
                          Object.entries(displayData.family_details || {}).map(([key, value]) => (
                            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                              <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </dt>
                              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.toString() || 'N/A'}
                              </dd>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            No family details available
                          </div>
                        )}
                      </dl>
                    </div>
                  </section>
                )}

                {activeSection === 'biographical' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Biographical Details</h2>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(displayData.biographical_details || {}).length > 0 ? (
                          Object.entries(displayData.biographical_details || {}).map(([key, value]) => (
                            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                              <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </dt>
                              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.toString() || 'N/A'}
                              </dd>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            No biographical details available
                          </div>
                        )}
                      </dl>
                    </div>
                  </section>
                )}

                {activeSection === 'work' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Work Information</h2>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(displayData.work_information || {}).length > 0 ? (
                          Object.entries(displayData.work_information || {}).map(([key, value]) => (
                            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                              <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                              </dt>
                              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.toString() || 'N/A'}
                              </dd>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            No work information available
                          </div>
                        )}
                      </dl>
                    </div>
                  </section>
                )}

                {activeSection === 'additional' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Additional Details</h2>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(displayData.additional_details || {}).filter(([key]) => key !== 'regional_information').length > 0 ? (
                          Object.entries(displayData.additional_details || {}).map(([key, value]) => (
                            key !== 'regional_information' && (
                              <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                                <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                </dt>
                                <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                  {value?.toString() || 'N/A'}
                                </dd>
                              </div>
                            )
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            No additional details available
                          </div>
                        )}
                      </dl>
                    </div>
                  </section>
                )}

                {activeSection === 'regional' && (
                  <section>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Regional Information</h2>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <dl className="divide-y divide-gray-200">
                        {Object.entries(displayData.additional_details?.regional_information || {}).length > 0 ? (
                          Object.entries(displayData.additional_details?.regional_information || {}).map(([key, value]) => (
                            <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                              <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                                {key.split(/(?=[A-Z])/).join(' ')}
                              </dt>
                              <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                {value?.toString() || 'N/A'}
                              </dd>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-6 text-center text-gray-500">
                            No regional information available
                          </div>
                        )}
                      </dl>
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