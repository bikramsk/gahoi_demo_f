import React, { useState, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337';

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

const SECTIONS = [
  { id: 'personal', title: 'Personal Information', icon: 'user' },
  { id: 'family', title: 'Family Details', icon: 'users' },
  { id: 'biographical', title: 'Biographical Details', icon: 'book' },
  { id: 'work', title: 'Work Information', icon: 'briefcase' },
  { id: 'additional', title: 'Additional Details', icon: 'plus' },
  { id: 'regional', title: 'Regional Information', icon: 'map' }
];


const LoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-8 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-8">
          <h2 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h2>
          <button 
            onClick={() => window.location.reload()}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('personal');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('=== Starting Profile Load ===');
        const mobileNumber = localStorage.getItem('verifiedMobile');
        const token = localStorage.getItem('token');
        
        console.log('Credentials Check:', {
          hasMobile: !!mobileNumber,
          hasToken: !!token,
          mobileNumber,
          tokenFirstChars: token?.substring(0, 20) + '...',
          apiBase: API_BASE
        });

        if (!mobileNumber) {
          console.log('Missing mobile number - redirecting to login');
          setError('Please login again to continue');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        // Try with both JWT and API token
        let headers = {
          'Authorization': token ? `Bearer ${token}` : `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        };

        if (!headers.Authorization) {
          console.log('No authentication tokens available');
          setError('Authentication failed. Please login again.');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        // First verify user status
        console.log('Checking user status...');
        const verifyResponse = await fetch(`${API_BASE}/api/check-user-mpin/${mobileNumber}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const verifyData = await verifyResponse.json();
        console.log('User status check:', verifyData);

        if (!verifyResponse.ok || !verifyData.exists) {
          console.log('User verification failed');
          localStorage.removeItem('token');
          localStorage.removeItem('verifiedMobile');
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

        // Get user by mobile number using Strapi v5 format
        const userResponse = await fetch(`${API_BASE}/api/users?filters[mobile_number]=${mobileNumber}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        console.log('User API Response:', {
          status: userResponse.status,
          ok: userResponse.ok,
          url: userResponse.url
        });

        if (!userResponse.ok) {
          throw new Error(`Failed to fetch user: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log('User Data:', userData);

        if (!userData.data || userData.data.length === 0) {
          throw new Error('User not found');
        }

        // In Strapi v5, we use documentId instead of id
        const documentId = userData.data[0].documentId;
        console.log('Found User Document ID:', documentId);

        // Now get full profile with all relations using documentId
        const profileUrl = `${API_BASE}/api/users/${documentId}?populate[0]=personal_information&populate[1]=family_details&populate[2]=biographical_details&populate[3]=work_information&populate[4]=additional_details&populate[5]=child_name&populate[6]=your_suggestions&populate[7]=additional_details.regional_information&populate[8]=display_picture`;
        console.log('Making profile API call to:', profileUrl);

        const profileResponse = await fetch(profileUrl, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${API_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch complete profile');
        }

        const profileData = await profileResponse.json();
        console.log('Profile Data:', profileData);

        const transformedData = {
          personal_information: {
            full_name: profileData.data.attributes?.name || '',
            mobile_number: profileData.data.attributes?.mobile_number || '',
            email_address: profileData.data.attributes?.email || '',
            village: profileData.data.attributes?.village || '',
            Gender: profileData.data.attributes?.gender || '',
            nationality: profileData.data.attributes?.nationality || '',
            is_gahoi: profileData.data.attributes?.is_gahoi || false,
            display_picture: profileData.data.attributes?.display_picture?.data?.attributes?.url || null
          },
          family_details: profileData.data.attributes?.family_details || {},
          biographical_details: profileData.data.attributes?.biographical_details || {},
          work_information: profileData.data.attributes?.work_information || {},
          additional_details: profileData.data.attributes?.additional_details || {},
          child_name: profileData.data.attributes?.child_name || [],
          your_suggestions: profileData.data.attributes?.your_suggestions || {},
          gahoi_code: profileData.data.attributes?.gahoi_code || '',
          documentId: profileData.data.id
        };

        setUserData(transformedData);
        setLoading(false);
        setError(null);

      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('verifiedMobile');
        setError('Failed to load profile. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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

  if (!userData || !userData.personal_information) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Found</h2>
          <p className="text-gray-600">Please complete your registration first.</p>
          <button
            onClick={() => navigate('/registration')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-red-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src={userData.personal_information?.display_picture ? 
                  `${API_BASE}${userData.personal_information.display_picture}` : 
                  '/default-avatar.png'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full border-2 border-white object-cover"
              />
              <div>
                <h1 className="text-xl font-bold">{userData.personal_information?.full_name}</h1>
                <p className="text-sm opacity-90">Gahoi Code: {userData.gahoi_code}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                className="px-4 py-2 text-sm bg-red-700 rounded-lg hover:bg-red-600 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Profile
              </button>
              <button 
                onClick={() => navigate('/')}
                className="px-4 py-2 text-sm bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
              >
                Home
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-700 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <nav className="py-4">
                {SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'bg-red-50 text-red-700 border-l-4 border-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {renderIcon(section.icon)}
                    <span className="ml-3">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="max-w-3xl mx-auto">
                {activeSection === 'personal' && (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSkeleton />}>
                      <section>
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                          <button
                            onClick={() => {
                              localStorage.setItem('editUserData', JSON.stringify(userData));
                              navigate('/registration', { 
                                state: { 
                                  mobileNumber: userData.personal_information?.mobile_number,
                                  isEdit: true,
                                  activeSection: 'personal',
                                  userData: {
                                    id: userData.documentId,
                                    attributes: userData
                                  }
                                } 
                              });
                            }}
                            className="px-3 py-1 text-sm bg-red-700 text-white rounded hover:bg-red-800 transition-colors flex items-center"
                          >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Section
                          </button>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                          <dl className="divide-y divide-gray-200">
                            {Object.entries(userData.personal_information || {}).map(([key, value]) => (
                              key !== 'display_picture' && (
                                <div key={key} className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 hover:bg-gray-50">
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
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeSection === 'family' && (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSkeleton />}>
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
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeSection === 'biographical' && (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSkeleton />}>
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
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeSection === 'work' && (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSkeleton />}>
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
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeSection === 'additional' && (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSkeleton />}>
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
                    </Suspense>
                  </ErrorBoundary>
                )}

                {activeSection === 'regional' && (
                  <ErrorBoundary>
                    <Suspense fallback={<LoadingSkeleton />}>
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
                    </Suspense>
                  </ErrorBoundary>
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