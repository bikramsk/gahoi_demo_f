import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1340';

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
        const token = localStorage.getItem('token');
        const documentId = localStorage.getItem('documentId');

        console.log('Auth check:', { 
          hasMobile: !!mobileNumber, 
          hasToken: !!token,
          hasDocumentId: !!documentId,
          apiBase: API_BASE 
        });

        if (!token) {
          console.log('Missing auth token');
          setError('Please login again to continue');
          localStorage.clear();
          setTimeout(() => navigate('/login', { replace: true }), 2000);
          return;
        }

        let profileData = null;
        let lastError = null;

        // Try different approaches 
        const attempts = [
          // Attempt 1: Try with mobile number filter
          async () => {
            if (mobileNumber) {
              // console.log('Attempting to fetch by mobile number:', mobileNumber);
              const response = await fetch(
                `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number][$eq]=${mobileNumber}&populate=*`,
                {
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }
              );
              if (response.ok) {
                const data = await response.json();
                // console.log('Mobile number fetch response:', data);
                return data.data?.[0];
              }
              lastError = `Mobile number fetch failed with status: ${response.status}`;
            }
            return null;
          },

          // Attempt 2: Try with document ID if available
          async () => {
            if (documentId) {
              // console.log('Attempting to fetch by document ID:', documentId);
              const response = await fetch(
                `${API_BASE}/api/registration-pages/${documentId}?populate=*`,
                {
                  headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  }
                }
              );
              if (response.ok) {
                const data = await response.json();
                // console.log('Document ID fetch response:', data);
                return data.data;
              }
              lastError = `Document ID fetch failed with status: ${response.status}`;
            }
            return null;
          },

          // Attempt 3: Get all registration pages and filter client-side
          async () => {
            // console.log('Attempting to fetch all registration pages');
            const response = await fetch(
              `${API_BASE}/api/registration-pages?populate=*`,
              {
                headers: { 
                  'Authorization': `Bearer ${token}`,
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                }
              }
            );
            if (response.ok) {
              const data = await response.json();
              // console.log('All registration pages response:', data);
              return data.data?.find(entry => 
                entry.attributes?.personal_information?.mobile_number === mobileNumber
              );
            }
            lastError = `All pages fetch failed with status: ${response.status}`;
            return null;
          }
        ];

        // Try each method 
        for (const attempt of attempts) {
          try {
            const result = await attempt();
            if (result) {
              profileData = result;
              break;
            }
          } catch (error) {
            console.warn('Attempt failed:', error);
            lastError = error.message;
            continue;
          }
        }

        if (!profileData) {
          throw new Error(`Could not fetch user data. Last error: ${lastError}`);
        }

       
        const attrs = profileData.attributes || profileData;
        setUserData({
          personal_information: attrs.personal_information || {},
          family_details: attrs.family_details || {},
          biographical_details: attrs.biographical_details || {},
          work_information: attrs.work_information || {},
          additional_details: attrs.additional_details || {},
          child_name: attrs.child_name || [],
          your_suggestions: attrs.your_suggestions || {},
          gahoi_code: attrs.gahoi_code || '',
          documentId: profileData.id,
          createdAt: attrs.createdAt,
          updatedAt: attrs.updatedAt,
          publishedAt: attrs.publishedAt
        });
        
        
        if (profileData.id && !localStorage.getItem('documentId')) {
          localStorage.setItem('documentId', profileData.id);
        }

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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <span>Failed to load profile</span>
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

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Personal Information</h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <dl className="divide-y divide-gray-200">
                {Object.entries(displayData.personal_information || {})
                  .filter(([key]) => key !== 'id' && key !== 'display_picture')
                  .map(([key, value]) => (
                    <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </dt>
                      <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {value?.toString() || 'N/A'}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </section>
        );
      case 'family':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Family Details</h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <dl className="divide-y divide-gray-200">
                {Object.entries(displayData.family_details || {}).length > 0 ? (
                  Object.entries(displayData.family_details || {})
                    .filter(([key]) => key !== 'id')
                    .map(([key, value]) => (
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
        );
      case 'biographical':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Biographical Details</h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <dl className="divide-y divide-gray-200">
                {Object.entries(displayData.biographical_details || {})
                  .filter(([key]) => key !== 'id')
                  .map(([key, value]) => (
                    <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
                      <dt className="text-sm font-medium text-gray-500 mb-1 sm:mb-0">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </dt>
                      <dd className="text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {value?.toString() || 'N/A'}
                      </dd>
                    </div>
                  ))}
              </dl>
            </div>
          </section>
        );
      case 'work':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Work Information</h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <dl className="divide-y divide-gray-200">
                {Object.entries(displayData.work_information || {}).length > 0 ? (
                  Object.entries(displayData.work_information || {})
                    .filter(([key]) => key !== 'id')
                    .map(([key, value]) => (
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
        );
      case 'additional':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Additional Details</h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <dl className="divide-y divide-gray-200">
                {Object.entries(displayData.additional_details || {}).filter(([key]) => key !== 'regional_information' && key !== 'id').length > 0 ? (
                  Object.entries(displayData.additional_details || {})
                    .filter(([key]) => key !== 'regional_information' && key !== 'id')
                    .map(([key, value]) => (
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
                    No additional details available
                  </div>
                )}
              </dl>
            </div>
          </section>
        );
      case 'regional':
        return (
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Regional Information</h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <dl className="divide-y divide-gray-200">
                {Object.entries(displayData.additional_details?.regional_information || {}).length > 0 ? (
                  Object.entries(displayData.additional_details?.regional_information || {})
                    .filter(([key]) => key !== 'id')
                    .map(([key, value]) => (
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
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

            {/* Content */}
            <div className="flex-1 p-4 lg:p-6">
              {renderSectionContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 