import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const mobileNumber = localStorage.getItem('verifiedMobile');

        // Debug logs
        console.log('Token:', token ? 'Present' : 'Missing');
        console.log('Mobile Number:', mobileNumber || 'Missing');

        if (!token || !mobileNumber) {
          console.log('Missing credentials - redirecting to login');
          navigate('/login');
          return;
        }

        const url = `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number]=${mobileNumber}`;
        console.log('Fetching from URL:', url);

      
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include'
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error:', errorText);
          
          if (response.status === 401) {
          
            localStorage.removeItem('token');
            localStorage.removeItem('verifiedMobile');
            navigate('/login');
            return;
          }
          
          throw new Error(`Failed to fetch user data: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response data:', data);

        if (data.data && data.data.length > 0) {
          setUserData(data.data[0].attributes);
        } else {
          console.log('No user data found - redirecting to registration');
          navigate('/registration', { 
            state: { 
              mobileNumber,
              fromLogin: true 
            } 
          });
        }
      } catch (error) {
        console.error('Profile Error:', error);
        setError(error.message);
        
        
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

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

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-red-800 text-white p-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <p className="text-sm mt-2">Registration Details</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {/* Personal Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.mobile_number || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.email_address || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Village</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.village || 'N/A'}</p>
                </div>
              </div>
            </section>

            {/* Work Information */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Work Information</h2>
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

            {/* Additional Details */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Details</h2>
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

            {/* Regional Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Regional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Regional Assembly</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.RegionalAssembly || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Local Panchayat</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.LocalPanchayat || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">State</label>
                  <p className="mt-1 text-gray-800">
                    {userData.additional_details?.regional_information?.State || 'N/A'}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Actions */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-4">
            <button
              onClick={() => window.location.href = '/'}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back to Home
            </button>
            <button
              onClick={() => navigate('/registration', { 
                state: { 
                  mobileNumber: userData.personal_information?.mobile_number,
                  fromLogin: true,
                  isEdit: true
                } 
              })}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 