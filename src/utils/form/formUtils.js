import { FORM_STEPS, REQUIRED_FIELDS } from '../../config/formConfig';
import { STATE_TO_ASSEMBLIES } from '../../constants/formConstants';
import {
  validateField,
  validateMobileNumber,
  validateEmail,
  validateDate,
  validateMarriageDate,
  validateGotra,
  validateChildren,
  validateSiblings,
  validateFamilyMember,
  validateNationality
} from '../validation/validationUtils';


const generateGenderCode = (gender) => gender === 'Male' ? 'M' : gender === 'Female' ? 'F' : 'X';
const generateNationalityCode = (nationality) => nationality === 'Indian' ? '1' : nationality === 'Non-Indian' ? '0' : 'X';
const generateGahoiCode = (isGahoi) => isGahoi === 'Yes' || isGahoi === true ? '3' : '0';

// Fixed code mappings for all values
const FIXED_CODES = {
  // Regional Assembly codes 
  regionalAssembly: {
    "Chambal Regional Assembly": "01",
    "Central Malwa Regional Assembly": "02",
    "Mahakaushal Regional Assembly": "03",
    "Vindhya Regional Assembly": "04",
    "Bundelkhand Regional Assembly": "05",
    "Chaurasi Regional Assembly": "06",
    "Ganga Jamuna Regional Assembly": "07",
    "Northern Regional Assembly": "08",
    "Southern Regional Assembly": "09",
    "Chhattisgarh Regional Assembly": "10"
  },
  // Local Panchayat codes 
  localPanchayat: {
    // Chambal Regional Assembly panchayats
    "Gwalior": "01",
    "Bhind": "02",
    "Morena": "03",
    "Datia": "04",
    "Jaipur": "05",
    // Central Malwa Regional Assembly panchayats
    "Indore": "06",
    "Ujjain": "07",
    "Bhopal": "08",
    "Vidisha": "09",
    "Raisen": "10",
    // Mahakaushal Regional Assembly panchayats
    "Narsinghpur": "11",
    "Jabalpur": "12",
    "Sagar": "13",
    "Seoni": "14",
    "Chhindwara": "15",
    "Panna": "16",
    "Hoshangabad": "17",
    "Mandla": "18",
    "Dindori": "19",
    "Sultanpur": "20",
    "Umariya": "21",
    "Hata": "22",
    "Shahdol": "23",
    "Katni": "24",
    // Vindhya Regional Assembly panchayats
    "Chhatarpur": "25",
    "Satna": "26",
    "Rewa": "27",
    "Mahoba": "28",
    "Patna City": "29",
    // Southern Regional Assembly panchayats
    "Nagpur": "30",
    "Pune": "31",
    "Amravati": "32",
    "Mumbai": "33",
    "Chalisgaon": "34",
    "Dhuliya": "35",
    // Chhattisgarh Regional Assembly panchayats
    "Durg": "36",
    "Rajnandgaon": "37",
    "Dhamtari": "38",
    "Raipur": "39",
    "Bilaspur": "40",
    "Jagdalpur": "41",
    "Baikunthpur": "42",
    // Northern Regional Assembly panchayats
    "Mathura": "43",
    "Delhi": "44",
    // Ganga Jamuna Regional Assembly panchayats
    "Jalaun": "45",
    "Kanpur": "46",
    "Auraiya": "47",
    "Lucknow": "48",
    "Karvi": "49",
    "Banda": "50",
    // Bundelkhand Regional Assembly panchayats
    "Jhansi": "51",
    "Lalitpur": "52",
    "Tikamgarh": "53",
    "Ghasan": "54",
    // Chaurasi Regional Assembly panchayats
    "Shivpuri": "55",
    "Ashok Nagar": "56",
    "Guna": "57",
    "Ahmedabad": "58"
  },
  // Sub Local Panchayat codes 
  subLocalPanchayat: {
    // Gwalior sub-panchayats
    "Madhavganj": "01",
    "Khasgi Bazaar": "02",
    "Daulatganj": "03",
    "Kampoo": "04",
    "Lohia Bazaar": "05",
    "Phalka Bazaar": "06",
    "Lohamandi": "07",
    "Bahodapur": "08",
    "Naka Chandravadni": "09",
    "Harishankarpuram": "10",
    "Thatipur": "11",
    "Morar": "12",
    "Dabra": "13",
    "Pichhore Dabra": "14",
    "Behat": "15",
    // Bhind sub-panchayats
    "Alampur": "16",
    "Daboh": "17",
    "Tharet": "18",
    "Mihona": "19",
    "Aswar": "20",
    "Lahar": "21",
    "Gohad": "22",
    "Machhand": "23",
    "Raun": "24",
    // Chhatarpur sub-panchayats
    "Bameetha": "25",
    "Maharajpur": "26",
    "Naugaon": "27",
    "Bijawar": "28",
    "Chandra Nagar": "29",
    "Gulgaj": "30",
    "Bakswaha": "31",
    "Gadhi Malhara": "32",
    "Lavkush Nagar": "33",
    "Alipur": "34",
    "Tatam": "35",
    "Harpalpur": "36",
    "Ishanagar": "37",
    "Bada Malhara": "38",
    // Panna sub-panchayats
    "Amanaganj": "39",
    "Ajaigarh": "40",
    "Gunnor": "41",
    "Mohendra": "42",
    "Simariya": "43",
    "Sunwani Kala": "44",
    "Kishangarh": "45",
    // Shivpuri sub-panchayats
    "Malhawani": "46",
    "Pipara": "47",
    "Semri": "48",
    "Bamore Damaroun": "49",
    "Manpura": "50",
    "Pichhore": "51",
    "Karera": "52",
    "Bhonti": "53",
    // Other cities
    "Nagpur": "54",
    "Pune": "55",
    "Amravati": "56",
    "Mumbai": "57",
    "Chalisgaon": "58",
    "Dhuliya": "59",
    "Durg": "60",
    "Rajnandgaon": "61",
    "Dhamtari": "62",
    "Raipur": "63",
    "Bilaspur": "64",
    "Jagdalpur": "65",
    "Baikunthpur": "66",
    "Mathura": "67",
    "Delhi": "68",
    "Other": "99",
    // Chaurasi Regional Assembly sub-panchayats
    "Shivpuri": "69",
    "Malhawani": "70",
    "Pipara": "71",
    "Semri": "72",
    "Bamore Damaroun": "73",
    "Manpura": "74",
    "Pichhore": "75",
    "Ashok Nagar": "76",
    "Bamore Kala": "77",
    "Guna": "78",
    "Gandhi Nagar": "79",
    "Karera": "80",
    "Bhonti": "81",
    "Dinara": "82",
  },
  // Gotra codes 
  gotra: {
    "Vasar/Vastil/Vasal": "01",  
    "Gahoi": "02",  
    "Agarwal": "03",  
    "Maheshwari": "04",  
    "Khandelwal": "05",  
    "Gol": "06",  
    "Gangal/Gagil": "07",  
    "Badal/Waghil/Bandal": "08",  
    "Kocchal/Kochil": "09",  
    "Jaital": "10",  
    "Vachhil": "11",  
    "Kachhil": "12",  
    "Bhaal": "13",  
    "Kohil": "14",  
    "Kasiv": "15",  
    "Kasav": "16",  
    "Single": "17",  
    "Other": "99"     
  },
  // Aakna codes
  aakna: {    
    "Vasar/Vastil/Vasal": "01",
    "Gahoi": "02",
    "Agarwal": "03",
    "Maheshwari": "04",
    "Khandelwal": "05",
    "Aakna": "06",
    "Amroha": "07",
    "Andhi": "08",
    "Asoo": "09",
    "Asoopi": "10",
    "Asooti": "11",
    "Asudipa": "12",
    "Amar": "13",
    "Arusiya": "14",
    "Badal/Waghil/Bandal": "15",
    "Badil": "16",
    "Badhiya": "17",
    "Badonya": "18",
    "Bagar": "19",
    "Bahre": "20",
    "Bajrang Gadiya": "21",
    "Bamoriya": "22",
    "Bardiya": "23",
    "Barele/Barol": "24",
    "Barha/Barehe": "25",
    "Baronya": "26",
    "Barsainya": "27",
    "Baidal": "28",
    "Beder": "29",
    "Behre": "30",
    "Beder/Badil/Baidal": "31",
    "Bed": "32",
    "Bhagoriya": "33",
    "Bhondu": "34",
    "Bilaiya": "35",
    "Binaurya": "36",
    "Bijpuriya": "37",
    "Brijpuriya": "38",
    "Changele": "39",
    "Chandaiya": "40",
    "Chapra/Chupara": "41",
    "Chauda/Chodha/Chouda": "42",
    "Chiroliya": "43",
    "Dagarhiha": "44",
    "Dadam": "45",
    "Dadarya": "46",
    "Damele": "47",
    "Damorha": "48",
    "Dangre": "49",
    "Dangan ke": "50",
    "Deepa/Teepa": "51",
    "Devadhiya": "52",
    "Dhanoriya": "53",
    "Dhoosar": "54",
    "Digoriya": "55",
    "Dingauriya": "56",
    "Dohariya Devaraha": "57",
    "Gandhi": "58",
    "Geda": "59",
    "Ghura": "60",
    "Gol": "61",
    "Gugoriya/Ugoriya": "62",
    "Gangal/Gagil": "63",
    "Hadyal": "64",
    "Hathnoria/Hathnotiya": "65",
    "Hunka": "66",
    "Indurkhiya": "67",
    "Itodiya": "68",
    "Itoriya": "69",
    "Iksade": "70",
    "Jaar": "71",
    "Jakonya": "72",
    "Jalaounya": "73",
    "Jauriya": "74",
    "Jhudele/Kshurele": "75",
    "Jhuke/Jhunk": "76",
    "Joliya": "77",
    "Jugoriya": "78",
    "Jaital": "79",
    "Kachhil": "80",
    "Kajar": "81",
    "Kanjoulya": "82",
    "Kanthariya": "83",
    "Kasav": "84",
    "Kasiv": "85",
    "Kastwar": "86",
    "Kathal/Kathil": "87",
    "Kathori/Karoli ke": "88",
    "Khangat": "89",
    "Khard": "90",
    "Khadsariya/Kharsadiya": "91",
    "Khaira": "92",
    "Khantal": "93",
    "Kharaya": "94",
    "Kocchal/Kochil": "95",
    "Kudraya": "96",
    "Kurele": "97",
    "Kuretiya/Kuraithiya": "98",
    "Kurothiya": "99",
    "Kshankshar": "100",
    "Lahariya": "101",
    "Lakhatkiya": "102",
    "Lohiya/Loiya": "103",
    "Mahtele": "104",
    "Mangole": "105",
    "Mar": "106",
    "Matele": "107",
    "Maunya": "108",
    "Misurha/Masaurya": "109",
    "Mor": "110",
    "Mungele": "111",
    "Nachhola": "112",
    "Nagariya": "113",
    "Nahar": "114",
    "Naar": "115",
    "Naina/Nehna": "116",
    "Neekhra": "117",
    "Nigoti/Nigotiya": "118",
    "Nignotiya": "119",
    "Nisunge/Nisuri": "120",
    "Nogaraiya": "121",
    "Nolha/Nilha": "122",
    "Pachnole/Pachraulya": "123",
    "Pahariya": "124",
    "Paharu": "125",
    "Patodiya": "126",
    "Patodi": "127",
    "Patraiya/Paterha": "128",
    "Patwari": "129",
    "Piparsaniya": "130",
    "Piparsania": "131",
    "Purpuriya/Puranpuriya": "132",
    "Raghare": "133",
    "Rawat": "134",
    "Reja": "135",
    "Rikholya/Lakhourya": "136",
    "Rusiya": "137",
    "Saab/Sahu": "138",
    "Sadele": "139",
    "Sah/Saav": "140",
    "Sahdele": "141",
    "Sakeray/Sakahere": "142",
    "Sarawagi": "143",
    "Sarawgi (Mau ke)": "144",
    "Sawla/Saula/Chawla": "145",
    "Seth": "146",
    "Seth (Bareth ke)": "147",
    "Seth (Chandaiya ke)": "148",
    "Seth (Kathori/Karoli ke)": "149",
    "Seth (Mau ke/Paliya ke/Khakshis ke/Mahuta ke/Bhaghoi ke)": "150",
    "Seth (Nawgaon/Negua ke)": "151",
    "Seth (Nolha ke)": "152",
    "Seth (Padri ke)": "153",
    "Seth (Rora ke)": "154",
    "Shaav/Shah (Unnao ke)": "155",
    "Shikoly/Sokorya/Shipoulya": "156",
    "Sijariya": "157",
    "Sirsoniya/Risoniya": "158",
    "Soni": "159",
    "Sudipa": "160",
    "Suhane/Sohane": "161",
    "Sulganiya/Sulghaniya": "162",
    "Tapa": "163",
    "Tarsolliya": "164",
    "Tikraya/Tapakle": "165",
    "Trisolliya": "166",
    "Tudha": "167",
    "Tusele": "168",
    "Vachhil": "169",
    "Vilaiya": "170",
    "Viswari": "171",
    "Wageriya": "172",
    "KareKhemau": "173",
    "Sethiya": "174",
    "Dhusar": "175",
    "Jhanjhar": "176",
    "Baraya": "177",
    "Kunayar": "178",
    "Chungele": "179",
    "Bhagorya": "180",
    "Dhingauriya": "181",
    "Dengre/Dangre": "182",
    "Mihi ke Kunwar": "183",
    "Kharya/Khairya": "184",
    "Baderia": "185",
    "Sirojiya": "186",
    "Kuchiya/Kuchha": "187",
    "Kanakne": "188",
    "Matele/Mahtele": "189",
    "Itoriya/Itodiya": "190",
    "Vinaurya": "191",
    "Shikolya/Sakoraya/Shipolya": "192",
    "Katare": "193",
    "Amaulya/Amauriya": "194",
    "Jhudele/Jhad": "195",
    "Bhondiya/Bhondu": "196",
    "Teetbilasi/Teetbirasi": "197",
    "Chandaiya/Chandraseniya": "198",
    "Jhudele/Jurele/Jhood": "199",
    "Kandele": "200",
    "Others": "999"
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch {
    return null;
  }
};

export const validateStep = (step, formData) => {
  const errors = {};
  
  // Get fields for current step
  const currentStepFields = FORM_STEPS[step].fields;
  
  // Check if state has regional assemblies
  const hasRegionalAssemblies = formData.state && STATE_TO_ASSEMBLIES[formData.state];
  
  // Validate required fields for current step
  currentStepFields.forEach(field => {
    // Skip regional assembly related fields if state doesn't have assemblies
    if (
      !hasRegionalAssemblies && 
      (field === 'regionalAssembly' || 
       field === 'localPanchayatName' || 
       field === 'localPanchayat' || 
       field === 'subLocalPanchayat')
    ) {
      return;
    }

    if (REQUIRED_FIELDS.includes(field)) {
      const error = validateField(field, formData[field]);
      if (error) {
        errors[field] = error;
      }
    }
  });

  // Special validations for current step
  if (currentStepFields.includes('mobileNumber')) {
    const mobileError = validateMobileNumber(formData.mobileNumber);
    if (mobileError) errors.mobileNumber = mobileError;
  }

  if (currentStepFields.includes('email')) {
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
  }

  if (currentStepFields.includes('nationality')) {
    const nationalityError = validateNationality(formData.nationality);
    if (nationalityError) errors.nationality = nationalityError;
  }

  if (currentStepFields.includes('birthDate')) {
    const birthDateError = validateDate(formData.birthDate, 'Birth date');
    if (birthDateError) errors.birthDate = birthDateError;
  }

  if (currentStepFields.includes('marriageDate') && formData.isMarried === 'Married') {
    const marriageDateError = validateMarriageDate(formData.marriageDate, formData.isMarried);
    if (marriageDateError) errors.marriageDate = marriageDateError;
  }

  if (currentStepFields.includes('gotra') && formData.marriageToAnotherCaste !== 'Other Caste Marriage') {
    const gotraError = validateGotra(formData.gotra, formData.marriageToAnotherCaste);
    if (gotraError) errors.gotra = gotraError;
  }

  // Validate family members
  if (currentStepFields.includes('familyDetails')) {
    const children = formData.familyDetails.filter(member => member.relation === 'Child');
    const siblings = formData.familyDetails.filter(member => member.relation === 'Sibling');

    const childrenError = validateChildren(children, 4);
    if (childrenError) errors.children = childrenError;

    const siblingsError = validateSiblings(siblings, 5);
    if (siblingsError) errors.siblings = siblingsError;

    formData.familyDetails.forEach((member, index) => {
      const memberErrors = validateFamilyMember(member, index);
      Object.assign(errors, memberErrors);
    });
  }

  return errors;
};

export const formatFormData = (data, displayPictureId = null) => {
  // Generate registration code
  const genderCode = generateGenderCode(data.gender);
  const nationalityCode = generateNationalityCode(data.nationality);
  const gahoiCode = generateGahoiCode(data.isGahoi);
  const gotraCode = FIXED_CODES.gotra[data.gotra] 
    ? FIXED_CODES.gotra[data.gotra].padStart(2, '0')  // Ensure two digits
    : "01"; // Default to Vasar/Vastil/Vasal instead of "00"
  const aaknaCode = FIXED_CODES.aakna[data.aakna] || "00";
  const regionalAssemblyCode = data.state && STATE_TO_ASSEMBLIES[data.state] && data.regionalAssembly 
    ? FIXED_CODES.regionalAssembly[data.regionalAssembly].padStart(2, '0')
    : "06";
  const localPanchayatCode = FIXED_CODES.localPanchayat[data.localPanchayat] || "55";
  const subLocalPanchayatCode = FIXED_CODES.subLocalPanchayat[data.subLocalPanchayat] || "80";
  const fullName = data.name || "";

  const registrationCode = `${fullName ? fullName + '-' : ''}${genderCode}${nationalityCode}${gahoiCode}${gotraCode}${aaknaCode}${regionalAssemblyCode}${localPanchayatCode}${subLocalPanchayatCode}`;

  // Check if state has regional assemblies
  const hasRegionalAssemblies = STATE_TO_ASSEMBLIES[data.state];

  // For states without regional assemblies, send empty strings
  const regionalInfo = hasRegionalAssemblies ? {
    RegionalAssembly: data.regionalAssembly ?? "",
    LocalPanchayatName: data.localPanchayatName ?? "",
    LocalPanchayat: data.localPanchayat ?? "",
    SubLocalPanchayat: data.subLocalPanchayat ?? "",
    State: data.state ?? "",
  } : {
    RegionalAssembly: "",
    LocalPanchayatName: "",
    LocalPanchayat: "",
    SubLocalPanchayat: "",
    State: "", // Send empty string for non-listed states
  };

  return {
    family_details: {
      father_name: data.familyDetails?.[0]?.name ?? "",
      father_mobile: data.familyDetails?.[0]?.mobileNumber ?? "",
      mother_name: data.familyDetails?.[1]?.name ?? "",
      mother_mobile: data.familyDetails?.[1]?.mobileNumber ?? "",
      spouse_name: data.familyDetails?.[2]?.name ?? "",
      spouse_mobile: data.familyDetails?.[2]?.mobileNumber ?? "",
      gotra: data.marriageToAnotherCaste ? "Others" : (data.gotra ?? ""),
      aakna: data.marriageToAnotherCaste ? "Others" : (data.aakna ?? ""),
      siblingDetails: (data.familyDetails || [])
        .filter(member => member?.relation === "Sibling")
        .map((sibling) => ({
          sibling_name: sibling?.name ?? "",
          gender: sibling?.gender || null,
          phone_number: sibling?.mobileNumber ?? "",
          age: sibling?.age ? parseInt(sibling.age, 10) : null,
          education: sibling?.education || null,
          occupation: sibling?.occupation || null,
          marital_status: sibling?.maritalStatus || null,
          is_dependent: sibling?.isDependent ?? false,
          sibling_relation: sibling?.siblingRelation || null
        })) || []
    },
    child_name: (data.familyDetails || [])
      .filter(member => member?.relation === "Child")
      .map((child) => ({ 
        child_name: child?.name ?? "",
        gender: child?.gender || null,
        phone_number: child?.mobileNumber ?? ""
      })) || [],
    biographical_details: {
      manglik_status: data.manglik ?? "",
      Grah: data.grah ?? "",
      Handicap: data.handicap ?? "",
      is_married: data.isMarried ? "Married" : "Unmarried",
      marriage_to_another_caste: data.marriageToAnotherCaste
        ? "Married to Another Caste"
        : "Same Caste Marriage",
    },
    personal_information: {
      full_name: data.name ?? "",
      village: data.village ?? "",
      mobile_number: data.mobileNumber ?? "",
      email_address: data.email ?? "",
      display_picture: displayPictureId,
      Gender: data.gender ?? "",
      nationality: data.nationality ?? "",
      is_gahoi: data.isGahoi ?? "Yes",
    },
    work_information: {
      occupation: data.occupation ?? "",
      company_name: data.companyName ?? "",
      work_area: data.workArea ?? "",
      industrySector: data.industrySector ?? "",
      businessSize: data.businessSize ?? "",
      workType: data.workType ?? "",
      employmentType: data.employmentType ?? "",
    },
    additional_details: {
      blood_group: data.bloodGroup ?? "",
      date_of_birth: formatDate(data.birthDate),
      date_of_marriage: formatDate(data.marriageDate),
      higher_education: data.education ?? "",
      current_address: data.currentAddress ?? "",
      regional_information: regionalInfo,
    },
    your_suggestions: {
      suggestions: data.suggestions ?? "",
    },
    registration_code: registrationCode
  };
};

export const hasErrors = (errors) => {
  if (!errors) return false;
  return Object.keys(errors).length > 0;
};

// Helper function to check if a field should show error state
export const shouldShowError = (fieldName, errors, touched) => {
  return touched[fieldName] && errors[fieldName];
};

// Helper function to get error message for a field
export const getErrorMessage = (fieldName, errors, touched) => {
  if (shouldShowError(fieldName, errors, touched)) {
    return errors[fieldName];
  }
  return '';
}; 