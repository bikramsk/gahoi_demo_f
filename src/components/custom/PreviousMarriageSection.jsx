import React from 'react';
import { FIXED_CODES } from '../../utils/form/formUtils';

const API_BASE = import.meta.env.MODE === 'production' 
  ? 'https://api.gahoishakti.in'
  : 'http://localhost:1337';


const GAHOI_GOTRAS = [
  "Vasar/Vastil/Vasal",
  "Gol",
  "Gangal/Gagil",
  "Badal/Waghil/Bandal",
  "Kocchal/Kochil",
  "Jaital",
  "Vachhil",
  "Kachhil",
  "Bhaal",
  "Kohil",
  "Kasiv",
  "Kasav",
  "Single"
];

// Map Gotra to Aakna 
const gotraAaknaMap = {
  "Vasar/Vastil/Vasal": [
    "Rusiya",
    "Arusiya",
    "Behre",
    "Bahre",
    "Pahariya",
    "Reja",
    "Mar",
    "Amar",
    "Mor",
    "Sethiya",
    "Damele",
    "Kathal",
    "Kathil",
    "Marele",
    "Nahar",
    "Naar",
    "KareKhemau",
    "Raghare",
    "Bagar",
    "Tudha",
    "Sah",
    "Saav",
    "Dangan ke",
    "Seth (Mau ke/Paliya ke/Khakshis ke/Mahuta ke/Bhaghoi ke)",
    "Kasav",
    "Khaira",
    "Sarawgi (Mau ke)",
    "Sahdele",
    "Sadele",
    "Changele",
    "Chungele",
    "Mungele",
    "Dhoosar",
    "Dadraya",
    "Patodiya",
    "Patodi",
    "Paterha",
    "Jhanjhar",
    "Kharaya",
    "Baraya",
    "Kunayar",
    "Purpuriya",
    "Puranpuriya",
    "Kajar",
    "Kshankshar",
  ],

  Gol: [
    "Andhi",
    "Baderiya",
    "Bamoriya",
    "Bardiya",
    "Bed",
    "Bhagoriya",
    "Bijpuriya",
    "Bilaiya",
    "Chiroliya",
    "Tarsolliya",
    "Trisolliya",
    "Kharaya",
    "Jakonya",
    "Jauriya",
    "Joliya",
    "Jalaounya",
    "Kanthariya",
    "Itoriya",
    "Itodiya",
    "Katare",
    "Kurele",
    "Vilaiya",
    "Nigoti",
    "Nignotiya",
    "Soni",
    "Rawat",
    "Sarawagi",
    "Brijpuriya",
    "Sijariya",
    "Gandhi",
    "Bamoriya",
    "Amoriya",
    "Dohariya Devaraha",
    "Devadhiya",
    "Chungele",
    "Seth (Rora ke)",
    "Mungele",
    "Mangole",
    "Kurothiya",
    "Khaira",
    "Bhagorya",
    "Maunya",
    "Hadyal",
    "Digoriya",
    "Dhingauriya",
    "Jaar",
    "Patwari",
    "Gandhi",
  ],

  "Gangal / Gagil": [
    "Geda",
    "Chapra",
    "Chupara",
    "Rawat",
    "Nogaraiya",
    "Jhudele/Kshurele",
    "Nisunge/Nisuri",
    "Seth (Nolha ke)",
    "Dangre",
    "Barele",
    "Barol",
    "Nolha/Nilha",
    "Mihi ke Kunwar",
    "Saab/Sahu",
  ],

  "Badal / Waghil / Bandal": [
    "Chauda",
    "Chodha",
    "Chouda",
    "Soni",
    "Kharya/Khairya",
    "Seth (Kathori, Karoli ke)",
    "Patraiya/Paterha",
    "Barha/Barehe",
    "Hathnoria/Hathnotiya",
    "Damorha",
    "Lakhatkiya",
    "Paharu",
    "Dagarhiha",
    "Kuretiya/Kuraithiya",
    "Gugoriya/Ugoriya",
    "Jugoriya",
    "Sulganiya/Sulghaniya",
    "Amroha",
    "Dadam",
    "Sawla",
    "Wageriya",
  ],

  "Kocchal / Kochil": [
    "Neekhra",
    "Indurkhiya",
    "Kastwar",
    "Kurele",
    "Misurha/Masaurya",
    "Sawla/Saula/Chawla",
    "Viswari",
    "Pahariya",
    "Piparsania",
    "Dadarya",
    "Nachhola",
    "Baronya",
    "Binaurya",
    "Kharya/Khara",
    "Iksade",
    "Sulganiya/Sulghaniya",
    "Kanjoulya",
    "Nigoti (Nigotiya)",
    "Rawat",
    "Seth",
    "Soni",
  ],

  Jaital: [
    "Baderia",
    "Kathal/Kathil",
    "Nagariya",
    "Rikholya/Lakhourya",
    "Seth (Bareth ke)",
    "Shikoly/Sokorya/Shipoulya",
    "Lahariya",
    "Sirojiya",
  ],

  Vachhil: [
    "Kuchiya/Kuchha",
    "Tikraya/Tapakle",
    "Damele",
    "Barsainya",
    "Tapa",
    "Kanakne",
    "Matele/Mahtele",
    "Hunka",
    "Seth (Nawgaon/Negua ke)",
    "Badonya",
    "Gandhi",
    "Rikholya",
    "Dhanoriya",
    "Itoriya/Itodiya",
    "Sakeray/Sakahere",
    "Soni",
    "Khadsariya/Kharsadiya",
    "Badhiya",
    "Vinaurya",
    "Sirsoniya/Risoniya",
    "Shikoly/Sokorya/Shipoulya",
    "Khangat",
    "Katare",
    "Sarawgi (Mau ke)",
    "Chungele",
  ],

  Kachhil: [
    "Chapra/Chupara",
    "Tusele",
    "Piparsaniya",
    "Seth (Padri ke)",
    "Dhusar",
    "Bhondiya (Bhondu)",
    "Amaulya/Amauriya",
    "Jhudele/Jhad",
    "Rawat",
    "Katare",
  ],

  Bhaal: [
    "Kudraya",
    "Khard",
    "Suhane/Sohane",
    "Dengre/Dagre",
    "Teetbilasi/Teetbirasi",
    "Ghura",
    "Khangat",
    "Bajrang Gadiya",
    "Naina/Nehna",
    "Pachnole/Pachraulya",
    "Sah/Saav",
    "Seth (Chandaiya ke)",
    "Chandaiya/Chandraseniya",
    "Jhudele/Jurele/Jhood",
  ],

  Kohil: ["Kandele", "Lohiya/Loiya", "Shaav/Shah (Unnao ke)", "Jhuke/Jhunk"],

  Kasiv: [
    "Asoo",
    "Asoopi",
    "Asooti",
    "Khantal",
    "Beder",
    "Badil",
    "Baidal",
    "Sudipa",
    "Asudipa",
    "Deepa/Teepa",
  ],

  Kasav: [
    "Asoo",
    "Asoopi",
    "Asooti",
    "Khantal",
    "Beder",
    "Badil",
    "Baidal",
    "Sudipa",
    "Asudipa",
    "Deepa/Teepa",
  ],
  Single: [],
};

const PreviousMarriageSection = ({ formData, setFormData, errors, setErrors }) => {
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      previousMarriage: {
        ...prev.previousMarriage,
        [field]: value,
        ...(field === 'spouse_gotra' ? { spouse_akna: '' } : {})
      }
    }));

    // Clear the specific error when user starts typing/selecting
    if (errors?.[`previous_marriage.${field}`]) {
      setErrors(prev => ({ 
        ...prev, 
        [`previous_marriage.${field}`]: undefined 
      }));
    }
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

  // Sort gotra options alphabetically
  const sortedGotraOptions = GAHOI_GOTRAS.sort((a, b) => a.localeCompare(b));

  // aakna options based on selected gotra
  const getAaknaOptions = () => {
    const selectedGotra = formData.previousMarriage?.spouse_gotra;
    if (!selectedGotra) return [];
    return gotraAaknaMap[selectedGotra] || [];
  };

  // Validate all required fields
  const validateFields = () => {
    const newErrors = {};
    const fields = [
      { key: 'spouse_name', label: 'Name of Previous Spouse' },
      { key: 'spouse_gotra', label: 'Spouse Gotra' },
      { key: 'spouse_akna', label: 'Spouse Aakna' },
      { key: 'spouse_dob', label: 'Spouse Date of Birth' },
      { key: 'children_living_with', label: 'Will children live with you' },
      { key: 'want_kundli_match', label: 'Do you want to match Kundli' },
      { key: 'accept_partner_with_children', label: 'Willing to accept partner with children' }
    ];

    fields.forEach(({ key, label }) => {
      if (!formData.previousMarriage?.[key]) {
        newErrors[`previous_marriage.${key}`] = `${label} is required`;
      }
    });

    // Validate children information if children_living_with is 'yes'
    if (formData.previousMarriage?.children_living_with === 'yes') {
      const children = formData.previousMarriage?.children || [];
      children.forEach((child, index) => {
        if (!child.child_name) {
          newErrors[`previous_marriage.children.${index}.name`] = 'Child name is required';
        }
        if (!child.gender) {
          newErrors[`previous_marriage.children.${index}.gender`] = 'Child gender is required';
        }
        if (!child.age) {
          newErrors[`previous_marriage.children.${index}.age`] = 'Child age is required';
        }
      });
    }

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
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
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name of Previous Spouse</label>
            <input
              type="text"
              value={formData.previousMarriage?.spouse_name || ''}
              onChange={(e) => handleInputChange('spouse_name', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_name'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Enter previous spouse's name"
            />
            {errors?.['previous_marriage.spouse_name'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.spouse_name']}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spouse Gotra</label>
            <select
              value={formData.previousMarriage?.spouse_gotra || ''}
              onChange={(e) => handleInputChange('spouse_gotra', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_gotra'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Select Gotra</option>
              {sortedGotraOptions.map(gotra => (
                <option key={gotra} value={gotra}>{gotra}</option>
              ))}
            </select>
            {errors?.['previous_marriage.spouse_gotra'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.spouse_gotra']}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spouse Aakna</label>
            <select
              value={formData.previousMarriage?.spouse_akna || ''}
              onChange={(e) => handleInputChange('spouse_akna', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_akna'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              disabled={!formData.previousMarriage?.spouse_gotra}
            >
              <option value="">Select Aakna</option>
              {getAaknaOptions().map(akna => (
                <option key={akna} value={akna}>{akna}</option>
              ))}
            </select>
            {errors?.['previous_marriage.spouse_akna'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.spouse_akna']}</p>
            )}
            {!formData.previousMarriage?.spouse_gotra && (
              <p className="text-gray-500 text-xs mt-2 ml-1 italic">
                Select a Gotra first to see available Aakna options
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Spouse Date of Birth</label>
            <input
              type="date"
              value={formData.previousMarriage?.spouse_dob || ''}
              onChange={(e) => handleInputChange('spouse_dob', e.target.value)}
              className={`mt-1 block w-full px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 ${
                errors?.['previous_marriage.spouse_dob'] ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {errors?.['previous_marriage.spouse_dob'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.spouse_dob']}</p>
            )}
          </div>
        </div>

        {/* Children Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Will children live with you/your partner after marriage?</label>
            <div className="mt-2 space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="children_living_with"
                  value="yes"
                  checked={formData.previousMarriage?.children_living_with === 'yes'}
                  onChange={(e) => handleInputChange('children_living_with', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.children_living_with'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="children_living_with"
                  value="no"
                  checked={formData.previousMarriage?.children_living_with === 'no'}
                  onChange={(e) => handleInputChange('children_living_with', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.children_living_with'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {errors?.['previous_marriage.children_living_with'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.children_living_with']}</p>
            )}
          </div>

          {formData.previousMarriage?.children_living_with === 'yes' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Children's Information</label>
              {children.map((child, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={child.child_name || ''}
                      onChange={e => handleChildChange(idx, 'child_name', e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full ${
                        errors?.[`previous_marriage.children.${idx}.name`] ? 'border-red-500 bg-red-50' : ''
                      }`}
                      placeholder={`Child ${idx + 1} Name`}
                    />
                    {errors?.[`previous_marriage.children.${idx}.name`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`previous_marriage.children.${idx}.name`]}</p>
                    )}
                  </div>
                  <div className="flex-1">
                    <select
                      value={child.gender || ''}
                      onChange={e => handleChildChange(idx, 'gender', e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full ${
                        errors?.[`previous_marriage.children.${idx}.gender`] ? 'border-red-500 bg-red-50' : ''
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors?.[`previous_marriage.children.${idx}.gender`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`previous_marriage.children.${idx}.gender`]}</p>
                    )}
                  </div>
                  <div className="w-24">
                    <input
                      type="number"
                      value={child.age || ''}
                      onChange={e => handleChildChange(idx, 'age', e.target.value)}
                      className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-full ${
                        errors?.[`previous_marriage.children.${idx}.age`] ? 'border-red-500 bg-red-50' : ''
                      }`}
                      placeholder="Age"
                      min="0"
                    />
                    {errors?.[`previous_marriage.children.${idx}.age`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`previous_marriage.children.${idx}.age`]}</p>
                    )}
                  </div>
                  <button type="button" onClick={() => removeChild(idx)} className="text-red-600 hover:text-red-800 px-2">×</button>
                </div>
              ))}
              <button type="button" onClick={addChild} className="mt-2 px-3 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 text-sm">+ Add Child</button>
            </div>
          )}
        </div>

        {/* Partner Preferences */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Do you want to match Kundli?</label>
            <div className="mt-1 flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="want_kundli_match"
                  value="yes"
                  checked={formData.previousMarriage?.want_kundli_match === 'yes'}
                  onChange={(e) => handleInputChange('want_kundli_match', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.want_kundli_match'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="want_kundli_match"
                  value="no"
                  checked={formData.previousMarriage?.want_kundli_match === 'no'}
                  onChange={(e) => handleInputChange('want_kundli_match', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.want_kundli_match'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {errors?.['previous_marriage.want_kundli_match'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.want_kundli_match']}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Willing to accept a partner with children?</label>
            <div className="mt-1 flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accept_partner_with_children"
                  value="yes"
                  checked={formData.previousMarriage?.accept_partner_with_children === 'yes'}
                  onChange={(e) => handleInputChange('accept_partner_with_children', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.accept_partner_with_children'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="accept_partner_with_children"
                  value="no"
                  checked={formData.previousMarriage?.accept_partner_with_children === 'no'}
                  onChange={(e) => handleInputChange('accept_partner_with_children', e.target.value)}
                  className={`h-4 w-4 text-amber-600 focus:ring-amber-500 ${
                    errors?.['previous_marriage.accept_partner_with_children'] ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-700">No</span>
              </label>
            </div>
            {errors?.['previous_marriage.accept_partner_with_children'] && (
              <p className="text-red-500 text-xs mt-1">{errors['previous_marriage.accept_partner_with_children']}</p>
            )}
          </div>
        </div>

        {/* Document Uploads */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Required Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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