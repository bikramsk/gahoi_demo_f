import React from 'react';
import { FIXED_CODES } from '../../utils/form/formUtils';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      previousMarriage: {
        ...prev.previousMarriage,
        [field]: value
      }
    }));

    // Clear errors for the field
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleFileChange = async (field, file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const fileUrl = data[0]?.url;

      if (fileUrl) {
        handleInputChange(field, fileUrl);
      }
    } catch (error) {
      console.error('File upload error:', error);
      setErrors(prev => ({
        ...prev,
        [field]: 'File upload failed'
      }));
    }
  };

  const handleChildChange = (index, key, value) => {
    setFormData(prev => {
      const newChildren = [...(prev.previousMarriage.children || [])];
      newChildren[index] = {
        ...newChildren[index],
        [key]: value
      };
      return {
        ...prev,
        previousMarriage: {
          ...prev.previousMarriage,
          children: newChildren
        }
      };
    });
  };

  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      previousMarriage: {
        ...prev.previousMarriage,
        children: [...(prev.previousMarriage.children || []), { name: '', gender: '', age: '', livingWith: '' }]
      }
    }));
  };

  const removeChild = (index) => {
    setFormData(prev => ({
      ...prev,
      previousMarriage: {
        ...prev.previousMarriage,
        children: prev.previousMarriage.children.filter((_, i) => i !== index)
      }
    }));
  };

  const getAaknaOptions = () => {
    const selectedGotra = formData.previousMarriage?.gotra;
    return selectedGotra ? gotraAaknaMap[selectedGotra] || [] : [];
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">{t('previousMarriage.title')}</h2>

      {/* Previous Spouse Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('previousMarriage.spouseName.label')}
          </label>
          <input
            type="text"
            value={formData.previousMarriage?.spouseName || ''}
            onChange={(e) => handleInputChange('spouseName', e.target.value)}
            placeholder={t('previousMarriage.spouseName.placeholder')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors?.spouseName && (
            <p className="mt-1 text-sm text-red-600">{t('previousMarriage.validation.spouseNameRequired')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('previousMarriage.gotra.label')}
          </label>
          <select
            value={formData.previousMarriage?.gotra || ''}
            onChange={(e) => handleInputChange('gotra', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">{t('previousMarriage.gotra.placeholder')}</option>
            {GAHOI_GOTRAS.map((gotra) => (
              <option key={gotra} value={gotra}>
                {gotra}
              </option>
            ))}
          </select>
          {errors?.gotra && (
            <p className="mt-1 text-sm text-red-600">{t('previousMarriage.validation.gotraRequired')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('previousMarriage.aakna.label')}
          </label>
          <select
            value={formData.previousMarriage?.aakna || ''}
            onChange={(e) => handleInputChange('aakna', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">{t('previousMarriage.aakna.placeholder')}</option>
            {getAaknaOptions().map((aakna) => (
              <option key={aakna} value={aakna}>
                {aakna}
              </option>
            ))}
          </select>
          {errors?.aakna && (
            <p className="mt-1 text-sm text-red-600">{t('previousMarriage.validation.aaknaRequired')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            {t('previousMarriage.dob.label')}
          </label>
          <input
            type="date"
            value={formData.previousMarriage?.dob || ''}
            onChange={(e) => handleInputChange('dob', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors?.dob && (
            <p className="mt-1 text-sm text-red-600">{t('previousMarriage.validation.dobRequired')}</p>
          )}
        </div>
      </div>

      {/* Children Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('previousMarriage.children.title')}</h3>
        
        {formData.previousMarriage?.children?.map((child, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('previousMarriage.children.name.label')}
              </label>
              <input
                type="text"
                value={child.name}
                onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                placeholder={t('previousMarriage.children.name.placeholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('previousMarriage.children.gender.label')}
              </label>
              <select
                value={child.gender}
                onChange={(e) => handleChildChange(index, 'gender', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">{t('previousMarriage.children.gender.placeholder')}</option>
                <option value="male">{t('previousMarriage.children.gender.options.male')}</option>
                <option value="female">{t('previousMarriage.children.gender.options.female')}</option>
                <option value="other">{t('previousMarriage.children.gender.options.other')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('previousMarriage.children.age.label')}
              </label>
              <input
                type="number"
                value={child.age}
                onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                placeholder={t('previousMarriage.children.age.placeholder')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                {t('previousMarriage.children.livingWith.label')}
              </label>
              <select
                value={child.livingWith}
                onChange={(e) => handleChildChange(index, 'livingWith', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">{t('previousMarriage.children.livingWith.placeholder')}</option>
                <option value="self">{t('previousMarriage.children.livingWith.options.self')}</option>
                <option value="spouse">{t('previousMarriage.children.livingWith.options.spouse')}</option>
                <option value="other">{t('previousMarriage.children.livingWith.options.other')}</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => removeChild(index)}
              className="col-span-full md:col-span-1 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200"
            >
              {t('previousMarriage.children.removeButton')}
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addChild}
          className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-md hover:bg-indigo-200"
        >
          {t('previousMarriage.children.addButton')}
        </button>
      </div>

      {/* Preferences */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.previousMarriage?.kundliMatch || false}
              onChange={(e) => handleInputChange('kundliMatch', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {t('previousMarriage.preferences.kundliMatch.label')}
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            {t('previousMarriage.preferences.kundliMatch.description')}
          </p>
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.previousMarriage?.acceptChildren || false}
              onChange={(e) => handleInputChange('acceptChildren', e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm font-medium text-gray-700">
              {t('previousMarriage.preferences.acceptChildren.label')}
            </span>
          </label>
          <p className="mt-1 text-sm text-gray-500">
            {t('previousMarriage.preferences.acceptChildren.description')}
          </p>
        </div>
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('previousMarriage.documents.title')}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.documents.deathCertificate.label')}
            </label>
            <p className="mt-1 text-sm text-gray-500">
              {t('previousMarriage.documents.deathCertificate.description')}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange('deathCertificate', e.target.files[0])}
              className="mt-1 block w-full"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t('previousMarriage.documents.divorcePapers.label')}
            </label>
            <p className="mt-1 text-sm text-gray-500">
              {t('previousMarriage.documents.divorcePapers.description')}
            </p>
            <input
              type="file"
              onChange={(e) => handleFileChange('divorcePapers', e.target.files[0])}
              className="mt-1 block w-full"
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousMarriageSection; 