import React from 'react';

const EDUCATION_OPTIONS = [
  'Primary Education',
  'Secondary Education (Class 10)',
  'Higher Secondary (Class 12)',
  'Diploma',
  'Bachelors Degree',
  'Master Degree',
  'M.Phil',
  'Doctorate (Ph.D.)',
  'Professional Degree (e.g., MBBS, LLB, CA)',
  'Technical Certification (e.g., ITI, Polytechnic)',
  'Currently Studying',
  'Other',
];

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1340';

const PreviousMarriageSection = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      previousMarriage: {
        ...prev.previousMarriage,
        [field]: value
      }
    }));
    setErrors(prev => ({ ...prev, [`previous_marriage.${field}`]: undefined }));
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;
    const formDataUpload = new FormData();
    formDataUpload.append('files', file);
    try {
      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await response.json();
      if (data && data[0] && data[0].id) {
        handleInputChange(field, data[0].id);
      } else {
        alert('File upload failed!');
      }
    } catch (error) {
      alert('File upload failed!');
      console.error(error);
    }
  };

  // Children dynamic fields
  const children = formData.previousMarriage?.children || [];
  const handleChildChange = (index, key, value) => {
    const updated = [...children];
    updated[index] = { 
      ...updated[index], 
      [key]: key === 'age' ? parseInt(value, 10) || '' : value 
    };
    handleInputChange('children', updated);
  };
  const addChild = () => {
    handleInputChange('children', [...children, { child_name: '', age: '', gender: '' }]);
  };
  const removeChild = (index) => {
    const updated = children.filter((_, i) => i !== index);
    handleInputChange('children', updated);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          Previous Marriage Information
        </h3>
      </div>
      <div className="p-6 space-y-6">
        {/* Current Status */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Current Status</label>
          <div className="flex space-x-6">
            {['Widow', 'Widower', 'Divorced'].map(status => (
              <label key={status} className="inline-flex items-center">
                <input
                  type="radio"
                  name="current_status"
                  value={status}
                  checked={formData.previousMarriage?.current_status === status}
                  onChange={(e) => handleInputChange('current_status', e.target.value)}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name of Previous Spouse</label>
            <input
              type="text"
              value={formData.previousMarriage?.spouse_name || ''}
              onChange={(e) => handleInputChange('spouse_name', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter previous spouse's name"
            />
            {errors && errors['previous_marriage.spouse_name'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.spouse_name']}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Marriage</label>
            <input
              type="date"
              value={formData.previousMarriage?.marriage_date || ''}
              onChange={(e) => handleInputChange('marriage_date', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors && errors['previous_marriage.marriage_date'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.marriage_date']}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Marriage Termination</label>
            <input
              type="date"
              value={formData.previousMarriage?.termination_date || ''}
              onChange={(e) => handleInputChange('termination_date', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors && errors['previous_marriage.termination_date'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.termination_date']}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reason for Termination</label>
            <textarea
              value={formData.previousMarriage?.termination_reason || ''}
              onChange={(e) => handleInputChange('termination_reason', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="2"
              placeholder="Enter reason"
            />
            {errors && errors['previous_marriage.termination_reason'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.termination_reason']}</span>
            )}
          </div>
        </div>

        {/* Children Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Children's Information</label>
            {children.map((child, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={child.child_name || ''}
                  onChange={e => handleChildChange(idx, 'child_name', e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder={`Child ${idx + 1} Name`}
                />
                <select
                  value={child.gender || ''}
                  onChange={e => handleChildChange(idx, 'gender', e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <input
                  type="number"
                  value={child.age || ''}
                  onChange={e => handleChildChange(idx, 'age', e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-24"
                  placeholder="Age"
                  min="0"
                />
                <button type="button" onClick={() => removeChild(idx)} className="text-red-600 hover:text-red-800 px-2">×</button>
              </div>
            ))}
            <button type="button" onClick={addChild} className="mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 text-sm">+ Add Child</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Who are the children currently living with?</label>
            <input
              type="text"
              value={formData.previousMarriage?.current_living_with || ''}
              onChange={(e) => handleInputChange('current_living_with', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors && errors['previous_marriage.current_living_with'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.current_living_with']}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Who will they live with after marriage?</label>
            <input
              type="text"
              value={formData.previousMarriage?.future_living_with || ''}
              onChange={(e) => handleInputChange('future_living_with', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {errors && errors['previous_marriage.future_living_with'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.future_living_with']}</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">If children will live with you/your partner after marriage, please provide details</label>
            <textarea
              value={formData.previousMarriage?.children_living_details || ''}
              onChange={(e) => handleInputChange('children_living_details', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="2"
              placeholder="Provide details if applicable"
            />
            {errors && errors['previous_marriage.children_living_details'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.children_living_details']}</span>
            )}
          </div>
        </div>

        {/* Partner Preferences */}
        <div className="space-y-4">
          
          <div className="bg-gradient-to-r from-amber-50 to-white px-6 py-4 border-b border-gray-100 flex items-center mb-4 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M12 4a4 4 0 00-4 4v1a4 4 0 004 4h1a4 4 0 004-4V8a4 4 0 00-4-4h-1z" />
              </svg>
              Expectations from Life Partner
            </h3>
          </div>
          <div>
            <textarea
              value={formData.previousMarriage?.expectations || ''}
              onChange={(e) => handleInputChange('expectations', e.target.value)}
              className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              rows="3"
              placeholder="Enter your expectations"
            />
            {errors && errors['previous_marriage.expectations'] && (
              <span className="text-red-500 text-xs">{errors['previous_marriage.expectations']}</span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Is Kundli (Horoscope) Available?</label>
                <div className="mt-1 flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="is_kundli_available"
                      value="true"
                      checked={formData.previousMarriage?.is_kundli_available === true}
                      onChange={(e) => handleInputChange('is_kundli_available', e.target.value === 'true')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="is_kundli_available"
                      value="false"
                      checked={formData.previousMarriage?.is_kundli_available === false}
                      onChange={(e) => handleInputChange('is_kundli_available', e.target.value === 'true')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Do you want to match Kundli?</label>
                <div className="mt-1 flex space-x-6">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="want_kundli_match"
                      value="true"
                      checked={formData.previousMarriage?.want_kundli_match === true}
                      onChange={(e) => handleInputChange('want_kundli_match', e.target.value === 'true')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="want_kundli_match"
                      value="false"
                      checked={formData.previousMarriage?.want_kundli_match === false}
                      onChange={(e) => handleInputChange('want_kundli_match', e.target.value === 'true')}
                      className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Age Preference for Partner</label>
                <input
                  type="text"
                  value={formData.previousMarriage?.partner_age_preference || ''}
                  onChange={(e) => handleInputChange('partner_age_preference', e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter age preference"
                />
                {errors && errors['previous_marriage.partner_age_preference'] && (
                  <span className="text-red-500 text-xs">{errors['previous_marriage.partner_age_preference']}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Educational Preference</label>
                <select
                  value={formData.previousMarriage?.partner_education_preference || ''}
                  onChange={(e) => handleInputChange('partner_education_preference', e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">Select Education</option>
                  {EDUCATION_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors && errors['previous_marriage.partner_education_preference'] && (
                  <span className="text-red-500 text-xs">{errors['previous_marriage.partner_education_preference']}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Type of Life Partner Desired</label>
                <input
                  type="text"
                  value={formData.previousMarriage?.partner_type_preference || ''}
                  onChange={(e) => handleInputChange('partner_type_preference', e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="e.g., Businessperson, Service, Housewife"
                />
                {errors && errors['previous_marriage.partner_type_preference'] && (
                  <span className="text-red-500 text-xs">{errors['previous_marriage.partner_type_preference']}</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City/Location Preference</label>
                <input
                  type="text"
                  value={formData.previousMarriage?.location_preference || ''}
                  onChange={(e) => handleInputChange('location_preference', e.target.value)}
                  className="mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Enter location preference"
                />
                {errors && errors['previous_marriage.location_preference'] && (
                  <span className="text-red-500 text-xs">{errors['previous_marriage.location_preference']}</span>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Willing to accept a partner with children?</label>
            <div className="mt-1 flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accept_partner_with_children"
                  value="true"
                  checked={formData.previousMarriage?.accept_partner_with_children === true}
                  onChange={(e) => handleInputChange('accept_partner_with_children', e.target.value === 'true')}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accept_partner_with_children"
                  value="false"
                  checked={formData.previousMarriage?.accept_partner_with_children === false}
                  onChange={(e) => handleInputChange('accept_partner_with_children', e.target.value === 'true')}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Required Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Front Side</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('aadhaar_front', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.aadhaar_front && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">{typeof formData.previousMarriage.aadhaar_front === 'string' ? 'Uploaded' : formData.previousMarriage.aadhaar_front.name}</span>
                  <button type="button" onClick={() => handleInputChange('aadhaar_front', null)} className="text-red-500 text-xs ml-2">Remove</button>
                </div>
              )}
              {errors && errors['previous_marriage.aadhaar_front'] && (
                <span className="text-red-500 text-xs">{errors['previous_marriage.aadhaar_front']}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Aadhaar Back Side</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('aadhaar_back', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.aadhaar_back && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">{typeof formData.previousMarriage.aadhaar_back === 'string' ? 'Uploaded' : formData.previousMarriage.aadhaar_back.name}</span>
                  <button type="button" onClick={() => handleInputChange('aadhaar_back', null)} className="text-red-500 text-xs ml-2">Remove</button>
                </div>
              )}
              {errors && errors['previous_marriage.aadhaar_back'] && (
                <span className="text-red-500 text-xs">{errors['previous_marriage.aadhaar_back']}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Divorce Certificate</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('divorce_certificate', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.divorce_certificate && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">{typeof formData.previousMarriage.divorce_certificate === 'string' ? 'Uploaded' : formData.previousMarriage.divorce_certificate.name}</span>
                  <button type="button" onClick={() => handleInputChange('divorce_certificate', null)} className="text-red-500 text-xs ml-2">Remove</button>
                </div>
              )}
              {errors && errors['previous_marriage.divorce_certificate'] && (
                <span className="text-red-500 text-xs">{errors['previous_marriage.divorce_certificate']}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Death Certificate</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('death_certificate', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.death_certificate && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">{typeof formData.previousMarriage.death_certificate === 'string' ? 'Uploaded' : formData.previousMarriage.death_certificate.name}</span>
                  <button type="button" onClick={() => handleInputChange('death_certificate', null)} className="text-red-500 text-xs ml-2">Remove</button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Horoscope (Kundli)</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('kundli', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.kundli && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">{typeof formData.previousMarriage.kundli === 'string' ? 'Uploaded' : formData.previousMarriage.kundli.name}</span>
                  <button type="button" onClick={() => handleInputChange('kundli', null)} className="text-red-500 text-xs ml-2">Remove</button>
                </div>
              )}
              {errors && errors['previous_marriage.kundli'] && (
                <span className="text-red-500 text-xs">{errors['previous_marriage.kundli']}</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Proof of Payment</label>
              <input
                type="file"
                onChange={(e) => handleFileChange('payment_proof', e.target.files[0])}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                accept=".pdf,image/*"
              />
              {formData.previousMarriage?.payment_proof && (
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-500 mr-2">{typeof formData.previousMarriage.payment_proof === 'string' ? 'Uploaded' : formData.previousMarriage.payment_proof.name}</span>
                  <button type="button" onClick={() => handleInputChange('payment_proof', null)} className="text-red-500 text-xs ml-2">Remove</button>
                </div>
              )}
              {errors && errors['previous_marriage.payment_proof'] && (
                <span className="text-red-500 text-xs">{errors['previous_marriage.payment_proof']}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousMarriageSection; 