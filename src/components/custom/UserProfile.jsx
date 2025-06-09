import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337';

const API_TOKEN = import.meta.env.VITE_API_TOKEN || '';

const UserProfile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const mobileNumber = localStorage.getItem('verifiedMobile');
        console.log('Mobile Number:', mobileNumber || 'Missing');

        if (!mobileNumber) {
          console.log('No mobile number found - redirecting to login');
          navigate('/login');
          return;
        }

        const url = `${API_BASE}/api/registration-pages?filters[personal_information][mobile_number]=${mobileNumber}&populate[0]=personal_information&populate[1]=family_details&populate[2]=biographical_details&populate[3]=work_information&populate[4]=additional_details&populate[5]=child_name&populate[6]=your_suggestions&populate[7]=additional_details.regional_information`;
        console.log('API URL:', url);
        console.log('API Token available:', !!API_TOKEN);

        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${API_TOKEN}`,
              'Content-Type': 'application/json',
            }
          });

          console.log('Response status:', response.status);
          console.log('Response ok:', response.ok);

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
          }

          const result = await response.json();
          console.log('API Response data:', result);

          if (result.data && result.data.length > 0) {
            const userRecord = result.data[0];
            console.log('Raw user record:', userRecord);
            
            // Transform the data based on the exact component schemas
            const transformedData = {
              personal_information: {
                full_name: userRecord?.attributes?.personal_information?.full_name || '',
                mobile_number: userRecord?.attributes?.personal_information?.mobile_number || '',
                email_address: userRecord?.attributes?.personal_information?.email_address || '',
                village: userRecord?.attributes?.personal_information?.village || '',
                Gender: userRecord?.attributes?.personal_information?.Gender || '',  // Enum: Male/Female
                nationality: userRecord?.attributes?.personal_information?.nationality || '', // Enum: Indian/Non-Indian
                is_gahoi: userRecord?.attributes?.personal_information?.is_gahoi || '', // Enum: Yes/No
                display_picture: userRecord?.attributes?.personal_information?.display_picture || null
              },
              family_details: {
                father_name: userRecord?.attributes?.family_details?.father_name || '',
                father_mobile: userRecord?.attributes?.family_details?.father_mobile || '',
                mother_name: userRecord?.attributes?.family_details?.mother_name || '',
                mother_mobile: userRecord?.attributes?.family_details?.mother_mobile || '',
                spouse_name: userRecord?.attributes?.family_details?.spouse_name || '',
                spouse_mobile: userRecord?.attributes?.family_details?.spouse_mobile || '',
                phone_number: userRecord?.attributes?.family_details?.phone_number || '',
                gotra: userRecord?.attributes?.family_details?.gotra || '',
                aakna: userRecord?.attributes?.family_details?.aakna || '',
                siblingDetails: userRecord?.attributes?.family_details?.siblingDetails || []
              },
              biographical_details: {
                manglik_status: userRecord?.attributes?.biographical_details?.manglik_status || '',
                Grah: userRecord?.attributes?.biographical_details?.Grah || '',
                Handicap: userRecord?.attributes?.biographical_details?.Handicap || '',
                is_married: userRecord?.attributes?.biographical_details?.is_married || '',
                marriage_to_another_caste: userRecord?.attributes?.biographical_details?.marriage_to_another_caste || '',
                Gotra: userRecord?.attributes?.biographical_details?.Gotra || '',
                Aakna: userRecord?.attributes?.biographical_details?.Aakna || '',
                Mama_Aakna: userRecord?.attributes?.biographical_details?.Mama_Aakna || ''
              },
              work_information: {
                occupation: userRecord?.attributes?.work_information?.occupation || '',
                company_name: userRecord?.attributes?.work_information?.company_name || '',
                work_area: userRecord?.attributes?.work_information?.work_area || '',
                industrySector: userRecord?.attributes?.work_information?.industrySector || '',
                businessSize: userRecord?.attributes?.work_information?.businessSize || '',
                workType: userRecord?.attributes?.work_information?.workType || '',
                employmentType: userRecord?.attributes?.work_information?.employmentType || '',
                businessType: userRecord?.attributes?.work_information?.businessType || '',
                businessYears: userRecord?.attributes?.work_information?.businessYears || ''
              },
              additional_details: {
                blood_group: userRecord?.attributes?.additional_details?.blood_group || '',
                date_of_birth: userRecord?.attributes?.additional_details?.date_of_birth || '',
                date_of_marriage: userRecord?.attributes?.additional_details?.date_of_marriage || '',
                higher_education: userRecord?.attributes?.additional_details?.higher_education || '',
                current_address: userRecord?.attributes?.additional_details?.current_address || '',
                regional_information: userRecord?.attributes?.additional_details?.regional_information || {
                  State: '',
                  district: '',
                  city: '',
                  RegionalAssembly: '',
                  LocalPanchayatName: '',
                  LocalPanchayat: '',
                  SubLocalPanchayat: ''
                }
              },
              child_name: (userRecord?.attributes?.child_name || []).map(child => ({
                child_name: child.child_name || '',
                gender: child.gender || '',  // Enum: Male/Female
                phone_number: child.phone_number || ''
              })),
              your_suggestions: {
                suggestions: userRecord?.attributes?.your_suggestions?.suggestions || ''
              },
              registration_code: userRecord?.attributes?.registration_code || '',
              documentId: userRecord?.id
            };

            console.log('Transformed data:', transformedData);
            setUserData(transformedData);
          } else {
            console.log('No registration found for mobile:', mobileNumber);
            navigate('/registration', { 
              state: { 
                mobileNumber,
                fromLogin: true 
              } 
            });
          }
        } catch (fetchError) {
          console.error('Fetch Error:', fetchError);
          setError(fetchError.message);
          setTimeout(() => {
            navigate('/login');
          }, 3000);
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

  // Debug log to check userData
  console.log('Current userData state:', userData);

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
                <div>
                  <label className="block text-sm font-medium text-gray-600">Gender</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.Gender || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Nationality</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.nationality || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Gahoi Community Member</label>
                  <p className="mt-1 text-gray-800">{userData.personal_information?.is_gahoi || 'N/A'}</p>
                </div>
                {userData.personal_information?.display_picture && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-600">Profile Picture</label>
                    <div className="mt-2">
                      <img 
                        src={`${API_BASE}${userData.personal_information.display_picture.url}`}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Family Details */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Family Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Father's Name</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.father_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Father's Mobile</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.father_mobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mother's Name</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.mother_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Mother's Mobile</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.mother_mobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Spouse's Name</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.spouse_name || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Spouse's Mobile</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.spouse_mobile || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Gotra</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.gotra || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Aakna</label>
                  <p className="mt-1 text-gray-800">{userData.family_details?.aakna || 'N/A'}</p>
                </div>
              </div>

              {/* Siblings Information */}
              {userData.family_details?.siblingDetails?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Siblings</h3>
                  <div className="space-y-4">
                    {userData.family_details.siblingDetails.map((sibling, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <p className="mt-1 text-gray-800">{sibling.sibling_name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Gender</label>
                            <p className="mt-1 text-gray-800">{sibling.gender || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <p className="mt-1 text-gray-800">{sibling.phone_number || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Age</label>
                            <p className="mt-1 text-gray-800">{sibling.age || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Education</label>
                            <p className="mt-1 text-gray-800">{sibling.education || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Occupation</label>
                            <p className="mt-1 text-gray-800">{sibling.occupation || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Marital Status</label>
                            <p className="mt-1 text-gray-800">{sibling.marital_status || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Relation</label>
                            <p className="mt-1 text-gray-800">{sibling.sibling_relation || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Children Information */}
              {userData.child_name?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">Children</h3>
                  <div className="space-y-4">
                    {userData.child_name.map((child, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Name</label>
                            <p className="mt-1 text-gray-800">{child.child_name || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Gender</label>
                            <p className="mt-1 text-gray-800">{child.gender || 'N/A'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600">Phone</label>
                            <p className="mt-1 text-gray-800">{child.phone_number || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Biographical Details */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Biographical Details</h2>
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
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Regional Information</h2>
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
              onClick={() => {
                // Store the current user data in localStorage for the registration form
                localStorage.setItem('editUserData', JSON.stringify(userData));
                navigate('/registration', { 
                  state: { 
                    mobileNumber: userData.personal_information?.mobile_number,
                    isEdit: true,
                    userData: {
                      id: userData.documentId,
                      attributes: {
                        name: userData.personal_information?.full_name,
                        mobileNumber: userData.personal_information?.mobile_number,
                        email: userData.personal_information?.email_address,
                        village: userData.personal_information?.village,
                        gender: userData.personal_information?.Gender,
                        nationality: userData.personal_information?.nationality,
                        isGahoi: userData.personal_information?.is_gahoi,
                        display_picture: userData.personal_information?.display_picture,
                        familyDetails: [
                          {
                            relation: 'Father',
                            name: userData.family_details?.father_name,
                            mobileNumber: userData.family_details?.father_mobile
                          },
                          {
                            relation: 'Mother',
                            name: userData.family_details?.mother_name,
                            mobileNumber: userData.family_details?.mother_mobile
                          },
                          {
                            relation: 'Spouse',
                            name: userData.family_details?.spouse_name,
                            mobileNumber: userData.family_details?.spouse_mobile
                          },
                          ...(userData.family_details?.siblingDetails?.map(s => ({
                            relation: 'Sibling',
                            name: s.sibling_name,
                            mobileNumber: s.phone_number,
                            gender: s.gender,
                            age: s.age,
                            education: s.education,
                            occupation: s.occupation,
                            maritalStatus: s.marital_status
                          })) || [])
                        ],
                        gotra: userData.family_details?.gotra,
                        aakna: userData.family_details?.aakna,
                        manglik: userData.biographical_details?.manglik_status,
                        grah: userData.biographical_details?.Grah,
                        handicap: userData.biographical_details?.Handicap,
                        isMarried: userData.biographical_details?.is_married === 'Married',
                        marriageToAnotherCaste: userData.biographical_details?.marriage_to_another_caste,
                        occupation: userData.work_information?.occupation,
                        companyName: userData.work_information?.company_name,
                        workArea: userData.work_information?.work_area,
                        industrySector: userData.work_information?.industrySector,
                        businessSize: userData.work_information?.businessSize,
                        workType: userData.work_information?.workType,
                        employmentType: userData.work_information?.employmentType,
                        bloodGroup: userData.additional_details?.blood_group,
                        birthDate: userData.additional_details?.date_of_birth,
                        education: userData.additional_details?.higher_education,
                        currentAddress: userData.additional_details?.current_address,
                        state: userData.additional_details?.regional_information?.State,
                        district: userData.additional_details?.regional_information?.district,
                        city: userData.additional_details?.regional_information?.city,
                        regionalAssembly: userData.additional_details?.regional_information?.RegionalAssembly,
                        localPanchayatName: userData.additional_details?.regional_information?.LocalPanchayatName,
                        localPanchayat: userData.additional_details?.regional_information?.LocalPanchayat,
                        subLocalPanchayat: userData.additional_details?.regional_information?.SubLocalPanchayat,
                        registration_code: userData.registration_code
                      }
                    }
                  } 
                });
              }}
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