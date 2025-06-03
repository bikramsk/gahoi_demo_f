import React, { useState, useEffect, useCallback, useMemo } from "react";import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PhotoUpload from "./PhotoUpload";
import {
  STATE_TO_ASSEMBLIES,
  INDUSTRY_SECTORS,
  BUSINESS_SIZES,
  WORK_TYPES,
  EMPLOYMENT_TYPES,
  HANDICAP_OPTIONS,
  BLOOD_GROUPS,
  INITIAL_FAMILY_MEMBERS,
  MAX_CHILDREN,
  MAX_SIBLINGS,
  MARITAL_STATUS_OPTIONS,
  EDUCATION_OPTIONS,
  OCCUPATION_OPTIONS,
  SIBLING_RELATION_OPTIONS,
  FORM_STEPS,
  PROCESS_STEPS,
  INITIAL_FORM_DATA,
} from "../../constants/formConstants";
import {
  validateStep,
  formatFormData,
  hasErrors,
} from "../../utils/form/formUtils";
import {
  STATES,
  STATE_TO_DISTRICTS,
  DISTRICT_TO_CITIES,
} from "../../constants/locationData";


export const CHAURASI_PANCHAYAT_NAMES = [
  "Gahoi Vaishya Panchayat",
  "Shri Gahoi Vaishya Sabha",
  "Gahoi Vaishya Samaj",
];

const LOCAL_PANCHAYATS = {
  "Chambal Regional Assembly": ["Morena", "Bhind", "Gwalior"],
  "Central Malwa Regional Assembly": ["Indore", "Dewas", "Ujjain", "Bhopal", "Vidisha", "Raisen"],
  "Mahakaushal Regional Assembly": ["Jabalpur", "Katni", "Rewa", ""],
  "Vindhya Regional Assembly": ["Satna", "Shahdol", "Sidhi", "Chhatarpur", "Panna", "Rewa"],
  "Bundelkhand Regional Assembly": ["Sagar", "Damoh", "Chhatarpur"],
  "Chaurasi Regional Assembly": ["Bhopal", "Vidisha", "Raisen"],
  "Southern Regional Assembly": ["Pune", "Mumbai", "Nagpur", "Amravati", "Chalisgaon", "Dhuliya"]
};

const SUB_LOCAL_PANCHAYATS = {
  Pune: ["Pune", "Pimpri-Chinchwad", "Khadki", "Hadapsar"],
  Mumbai: ["South Mumbai", "Andheri", "Borivali", "Thane", "Navi Mumbai"],
  Nagpur: ["Nagpur", "Kamptee", "Hingna"],
  Amravati: ["Amravati", "Badnera", "Achalpur"],
  Chalisgaon: ["Chalisgaon"],
  Dhuliya: ["Dhuliya"],
  Morena: ["Morena", "Ambah", "Porsa"],
  Bhind: ["Bhind", "Ater", "Lahar"],
  Gwalior: ["Gwalior", "Dabra", "Bhitarwar"],
  Patna: ["Patna"],
  Durg: ["Durg"],
  Rajnandgaon: ["Rajnandgaon"],
  Dhamtari: ["Dhamtari"],
  Raipur: ["Raipur"],
  Bilaspur: ["Bilaspur"],
  Bastar: ["Bastar"],
  Koriya: ["Koriya"],
  Jhansi: [
    "Garautha", "Barua Sagar", "Simriddha", "Tahrauli", "Gursarai", "Bamor",
    "Poonchh", "Erich", "Bhel Simrawali", "Babina Cantt", "Bangra Uldan Ranipur",
    "Mauranipur", "Baragaon", "Ranipur", "Jhansi", "Samthar", "Archara", "Moth"
  ],
  Tikamgarh: [
    "Tikamgarh", "Baldeogarh", "Jatara", "Palera", "Niwari", "Prithvipur",
    "Orchha", "Badagaon", "Mohangarh", "Digoda", "Lidhora", "Khargapur"
  ],
  Datia: [
    "Sewdha", "Chhoti Badoni", "Datia", "Indergarh", "Badhara Sopan",
    "Unnao Balaji", "Bhander", "Salon B"
  ],
  Jaipur: ["Jaipur"],
  Indore: ["Indore"],
  Ujjain: ["Ujjain"],
  Bhopal: ["Bhopal", "Berasia"],
  Vidisha: ["Vidisha"],
  Raisen: ["Begamganj"]
};

const CHAURASI_LOCAL_PANCHAYAT_MAPPING = {
  "Gahoi Vaishya Panchayat": ["Shivpuri", "Ashok Nagar", "Guna", "Ahmedabad"],
  "Shri Gahoi Vaishya Sabha": ["Shivpuri"],
  "Gahoi Vaishya Samaj": ["Ashok Nagar"],
};

const CHAURASI_SUB_LOCAL_PANCHAYAT_MAPPING = {
  "Gahoi Vaishya Panchayat": {
    Shivpuri: [
      "Shivpuri",
      "Malhawani",
      "Pipara",
      "Semri",
      "Bamore Damaroun",
      "Manpura",
      "Pichhore",
    ],
    "Ashok Nagar": ["Ashok Nagar", "Bamore Kala"],
    Guna: ["Guna"],
    Ahmedabad: ["Gandhi Nagar"],
  },
  "Shri Gahoi Vaishya Sabha": {
    Shivpuri: ["Karera", "Bhonti"],
  },
  "Gahoi Vaishya Samaj": {
    "Ashok Nagar": ["Dinara", "Guna"],
  },
};

const GUJARAT_CHAURASI_MAPPING = {
  "Gandhinagar": {
    assembly: "Chaurasi Regional Assembly",
    localPanchayatName: "Gahoi Vaishya Panchayat",
    localPanchayat: "Ahmedabad",
    subLocalPanchayat: "Gandhi Nagar"
  }
};

const RegistrationForm = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    mobileNumber: location.state?.mobileNumber || "",
    workCategory: "professional",
  });
  const [processSteps, setProcessSteps] = useState(PROCESS_STEPS);
  const [progress, setProgress] = useState(50);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const indianCities = [
    "Ahmedabad",
    "Amravati",
    "Ashok Nagar",
    "Auraiya",
    "Baikunthpur",
    "Banda",
    "Bhind",
    "Bilaspur",
    "Bhopal",
    "Chalisgaon",
    "Chhatarpur",
    "Chhindwara",
    "Datia",
    "Delhi",
    "Dhamtari",
    "Dhuliya",
    "Dindori",
    "Durg",
    "Ghasan",
    "Guna",
    "Gwalior",
    "Hata",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jagdalpur",
    "Jaipur",
    "Jalaun",
    "Jhansi",
    "Kanpur",
    "Karvi",
    "Katni",
    "Lalitpur",
    "Lucknow",
    "Mahoba",
    "Mandla",
    "Mathura",
    "Morena",
    "Mumbai",
    "Nagpur",
    "Narsinghpur",
    "Other",
    "Panna",
    "Patna City",
    "Pune",
    "Raisen",
    "Raipur",
    "Rajnandgaon",
    "Rewa",
    "Sagar",
    "Satna",
    "Seoni",
    "Shahdol",
    "Shivpuri",
    "Sultanpur",
    "Tikamgarh",
    "Ujjain",
    "Umariya",
    "Vidisha",
  ];

  const handleImageSelect = (file) => {
    setFormData((prev) => ({
      ...prev,
      display_picture: file,
    }));
  };


  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const nav = document.querySelector("nav");

    if (header) header.style.display = "none";
    if (footer) footer.style.display = "none";
    if (nav) nav.style.display = "none";

    document.body.classList.add("fullscreen-form");

    return () => {
      if (header) header.style.display = "";
      if (footer) footer.style.display = "";
      if (nav) nav.style.display = "";
      document.body.classList.remove("fullscreen-form");
    };
  }, []);

  // Optimize form steps by using constants
  const formSteps = useMemo(() => FORM_STEPS, []);

  useEffect(() => {
    if (location.state?.fromLogin) {
      if (location.state?.processSteps) {
        setProcessSteps(location.state.processSteps);
      }

      // If mobile number is verified, we can start from the form
      if (location.state?.mobileNumber) {
        setFormData((prev) => ({
          ...prev,
          mobileNumber: location.state.mobileNumber,
        }));
      }
    }
  }, [location.state]);

  
  useEffect(() => {
    const completedSteps = processSteps.filter((step) => step.completed).length;
    const totalSteps = processSteps.length;
    setProgress(Math.round((completedSteps / totalSteps) * 100));
  }, [processSteps]);


  useEffect(() => {
    const registrationProgress = currentStep / (formSteps.length - 1);

   
    const updatedSteps = [...processSteps];
    updatedSteps[2].completed = registrationProgress > 0;
    setProcessSteps(updatedSteps);
  }, [currentStep, formSteps.length, processSteps]);

  // map Gotra to Aakna
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

  //  Aakna options based on selected Gotra
  const getAaknaOptions = () => {
    return formData.gotra ? gotraAaknaMap[formData.gotra] || [] : [];
  };

  const pincodeData = {
    // Delhi
    110: {
      state: "Delhi",
      city: "Delhi",
      districts: {
        "110001-110012": "Central Delhi",
        "110013-110019": "East Delhi",
        "110020-110029": "New Delhi",
        "110030-110039": "North Delhi",
        "110040-110049": "South Delhi",
        "110050-110059": "West Delhi",
        "110060-110069": "North East Delhi",
        "110070-110079": "South West Delhi",
        "110080-110089": "North West Delhi",
        "110090-110099": "Shahdara",
      },
    },
    // Madhya Pradesh - Gwalior
    474: {
      state: "Madhya Pradesh",
      city: "Gwalior",
      districts: {
        474015: "Thatipur",
        474020: "Sithouli",
      },
    },
    475: {
      state: "Madhya Pradesh",
      city: "Gwalior",
      districts: {
        475001: "Dabra",
        475110: "Morar",
        475661: "Datia",
        475686: "Seondha",
        475675: "Indergarh",
      },
    },
    477: {
      state: "Madhya Pradesh",
      city: "Bhind",
      districts: {
        477001: "Bhind",
        477116: "Ater",
        477441: "Mehgaon",
        477333: "Gohad",
      },
    },
    476: {
      state: "Madhya Pradesh",
      city: "Morena",
      districts: {
        476001: "Morena",
        476221: "Ambah",
        476554: "Porsa",
        476115: "Joura",
      },
    },
    // Rajasthan - Jaipur
    302: {
      state: "Rajasthan",
      city: "Jaipur",
      districts: {
        "302001-302039": "Jaipur",
      },
    },
    303: {
      state: "Rajasthan",
      city: "Jaipur",
      districts: {
        303001: "Chomu",
        303103: "Jobner",
        303702: "Dudu",
      },
    },
    // Uttar Pradesh
    285: {
      state: "Uttar Pradesh",
      city: "Jalaun",
      districts: {
        285123: "Jalaun",
        285001: "Orai",
        285130: "Kalpi",
      },
    },
    226: {
      state: "Uttar Pradesh",
      city: "Lucknow",
      districts: {
        "226001-226031": "Lucknow",
        226010: "Gomti Nagar",
        226012: "Alambagh",
      },
    },
    227: {
      state: "Uttar Pradesh",
      city: "Lucknow",
      districts: {
        227105: "Malihabad",
      },
    },
    208: {
      state: "Uttar Pradesh",
      city: "Kanpur",
      districts: {
        "208001-208027": "Kanpur",
      },
    },
    209: {
      state: "Uttar Pradesh",
      city: "Kanpur",
      districts: {
        209214: "Rural Kanpur Areas",
      },
    },
    210: {
      state: "Uttar Pradesh",
      districts: {
        210205: "Karvi",
        210001: "Banda",
        210120: "Naraini",
      },
    },
    206: {
      state: "Uttar Pradesh",
      city: "Auraiya",
      districts: {
        206122: "Auraiya",
        206128: "Phaphund",
      },
    },
    284: {
      state: "Uttar Pradesh",
      city: "Jhansi",
      districts: {
        "284001-284003": "Jhansi",
      },
    },
    // Madhya Pradesh
    472: {
      state: "Madhya Pradesh",
      city: "Tikamgarh",
      districts: {
        472001: "Tikamgarh",
        472339: "Jatara",
      },
    },
    473: {
      state: "Madhya Pradesh",
      districts: {
        473551: "Shivpuri",
        473331: "Ashok Nagar",
        473001: "Guna",
      },
    },
    // Gujarat - Ahmedabad
    380: {
      state: "Gujarat",
      city: "Ahmedabad",
      districts: {
        "380001-382470": "Ahmedabad",
      },
    },
    // Madhya Pradesh - More Cities
    452: {
      state: "Madhya Pradesh",
      city: "Indore",
      districts: {
        "452001-452020": "Indore",
      },
    },
    456: {
      state: "Madhya Pradesh",
      city: "Ujjain",
      districts: {
        "456001-456668": "Ujjain",
      },
    },
    462: {
      state: "Madhya Pradesh",
      city: "Bhopal",
      districts: {
        "462001-462047": "Bhopal",
      },
    },
    464: {
      state: "Madhya Pradesh",
      districts: {
        464001: "Vidisha",
        464551: "Raisen",
      },
    },
    487: {
      state: "Madhya Pradesh",
      city: "Narsinghpur",
      districts: {
        487001: "Narsinghpur",
      },
    },
    482: {
      state: "Madhya Pradesh",
      city: "Jabalpur",
      districts: {
        "482001-482008": "Jabalpur",
      },
    },
    484: {
      state: "Madhya Pradesh",
      districts: {
        484661: "Umariya",
        484001: "Shahdol",
      },
    },
    470: {
      state: "Madhya Pradesh",
      districts: {
        470001: "Sagar",
        470775: "Hata",
      },
    },
    480: {
      state: "Madhya Pradesh",
      districts: {
        480661: "Seoni",
        480001: "Chhindwara",
      },
    },
    483: {
      state: "Madhya Pradesh",
      city: "Katni",
      districts: {
        483501: "Katni",
      },
    },
    488: {
      state: "Madhya Pradesh",
      city: "Panna",
      districts: {
        488001: "Panna",
      },
    },
    461: {
      state: "Madhya Pradesh",
      city: "Hoshangabad",
      districts: {
        461001: "Hoshangabad",
      },
    },
    481: {
      state: "Madhya Pradesh",
      districts: {
        481661: "Mandla",
        481880: "Dindori",
      },
    },
    // Uttar Pradesh
    228: {
      state: "Uttar Pradesh",
      city: "Sultanpur",
      districts: {
        228001: "Sultanpur",
      },
    },
    471: {
      state: "Madhya Pradesh",
      city: "Chhatarpur",
      districts: {
        471001: "Chhatarpur",
      },
    },
    485: {
      state: "Madhya Pradesh",
      city: "Satna",
      districts: {
        485001: "Satna",
      },
    },
    800: {
      state: "Bihar",
      city: "Patna City",
      districts: {
        800008: "Patna",
      },
    },
    486: {
      state: "Madhya Pradesh",
      city: "Rewa",
      districts: {
        486001: "Rewa",
      },
    },
    // Chhattisgarh Cities
    491: {
      state: "Chhattisgarh",
      districts: {
        491001: "Durg",
        491441: "Rajnandgaon",
      },
    },
    493: {
      state: "Chhattisgarh",
      city: "Dhamtari",
      districts: {
        493773: "Dhamtari",
      },
    },
    492: {
      state: "Chhattisgarh",
      city: "Raipur",
      districts: {
        "492001-492099": "Raipur",
      },
    },
    495: {
      state: "Chhattisgarh",
      city: "Bilaspur",
      districts: {
        495001: "Bilaspur",
      },
    },
    494: {
      state: "Chhattisgarh",
      city: "Jagdalpur",
      districts: {
        494001: "Jagdalpur",
      },
    },
    497: {
      state: "Chhattisgarh",
      city: "Baikunthpur",
      districts: {
        497335: "Baikunthpur",
      },
    },
    // Maharashtra Cities
    440: {
      state: "Maharashtra",
      city: "Nagpur",
      districts: {
        "440001-440037": "Nagpur",
      },
    },
    424: {
      state: "Maharashtra",
      city: "Chalisgaon",
      districts: {
        424101: "Chalisgaon",
      },
    },
    411: {
      state: "Maharashtra",
      city: "Pune",
      districts: {
        "411001-411062": "Pune",
      },
    },
    444: {
      state: "Maharashtra",
      city: "Amravati",
      districts: {
        444601: "Amravati",
        444602: "Amravati",
        444603: "Amravati",
      },
    },
    400: {
      state: "Maharashtra",
      city: "Mumbai",
      districts: {
        "400001-400104": "Mumbai",
      },
    },
    281: {
      state: "Uttar Pradesh",
      city: "Mathura",
      districts: {
        281001: "Mathura",
      },
    },
  };
  // Memoized helper functions
  const memoizedGetLocationFromPincode = (pincode) => {
    if (!pincode || pincode.length !== 6) return null;

    const areaCode = pincode.substring(0, 3);
    const location = pincodeData[areaCode];

    if (!location) return null;

    const numericPincode = parseInt(pincode);
    let district = null;
    let city = location.city;

    // Find matching district based on pincode range
    for (const [range, districtName] of Object.entries(location.districts)) {
      const [start, end] = range.split("-").map((p) => parseInt(p));
      if (!end) {
        // Single pincode match
        if (parseInt(range) === numericPincode) {
          district = districtName;
          // If city isn't set at the area code level, try to determine from district name
          if (!city) {
            city = districtName.replace(" City", "").replace(" Town", "");
          }
          break;
        }
      } else {
        // Pincode range match
        if (numericPincode >= start && numericPincode <= end) {
          district = districtName;
          break;
        }
      }
    }

    return {
      state: location.state,
      city: city,
      district: district,
    };
  };

  const extractPincodeFromAddress = (address) => {
    const pincodeMatch = address.match(/\b\d{6}\b/);
    return pincodeMatch ? pincodeMatch[0] : null;
  };

  // Optimize handlers with useCallback
  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === "mobileNumber" && !/^\d*$/.test(value)) {
        return;
      }

      setFormData((prev) => {
        const newData = { ...prev, [name]: value };

        // Auto-update dependent fields
        if (name === "localPanchayat") {
          newData.subLocalPanchayat = "";
        } else if (name === "regionalAssembly") {
          newData.localPanchayatName = "";
          newData.localPanchayat = "";
          newData.subLocalPanchayat = "";
        } else if (name === "localPanchayatName") {
          newData.localPanchayat = "";
          newData.subLocalPanchayat = "";
        } else if (name === "gotra") {
          newData.aakna = "";
        } else if (name === "isMarried") {
          newData.isMarried = value === "yes";
          if (value === "no") {
            newData.marriageDate = "";
          }
        } else if (name === "state") {
          // Reset all regional assembly related fields when state changes
          newData.regionalAssembly = "";
          newData.localPanchayatName = "";
          newData.localPanchayat = "";
          newData.subLocalPanchayat = "";
        }

        return newData;
      });

      // Clear field error
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors]
  );

  // Optimize family detail handler
  const handleFamilyDetailChange = useCallback(
    (index, field, value) => {
      if (field === "mobileNumber" && !/^\d*$/.test(value)) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        familyDetails: prev.familyDetails.map((member, i) =>
          i === index ? { ...member, [field]: value } : member
        ),
      }));

      if (errors[`familyDetails.${index}.${field}`]) {
        setErrors((prev) => ({
          ...prev,
          [`familyDetails.${index}.${field}`]: "",
        }));
      }
    },
    [errors]
  );

  // Optimize add child function
  const addChild = useCallback(() => {
    if (
      formData.familyDetails.filter((member) => member.relation === "Child")
        .length < MAX_CHILDREN
    ) {
      setFormData((prev) => ({
        ...prev,
        familyDetails: [
          ...prev.familyDetails,
          { relation: "Child", name: "", mobileNumber: "", gender: "" },
        ],
      }));
    }
  }, [formData.familyDetails]);

  // Add a function to add sibling
  const addSibling = useCallback(() => {
    if (
      formData.familyDetails.filter((member) => member.relation === "Sibling")
        .length < MAX_SIBLINGS
    ) {
      setFormData((prev) => ({
        ...prev,
        familyDetails: [
          ...prev.familyDetails,
          {
            relation: "Sibling",
            name: "",
            mobileNumber: "",
            gender: "",
            age: "",
            occupation: "",
            education: "",
            maritalStatus: "",
            isDependent: false,
          },
        ],
      }));
    }
  }, [formData.familyDetails]);

  // Add remove functions
  const removeChild = useCallback((indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      familyDetails: prev.familyDetails.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  }, []);

  const removeSibling = useCallback((indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      familyDetails: prev.familyDetails.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  }, []);

  // Update validateCurrentStep function
  const validateCurrentStep = useCallback(() => {
    const newErrors = validateStep(currentStep, formData);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  }, [currentStep, formData]);

  // Function to check if email exists in Strapi backend
  const checkEmailExists = async (email) => {
    try {
      const baseUrl = import.meta.env.VITE_PUBLIC_STRAPI_API_URL;
      const url = `${baseUrl}/api/registration-pages?filters[personal_information][email_address]=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check email existence');
      }

      const data = await response.json();
      return data.data && data.data.length > 0;

    } catch (error) {
      console.error('Error checking email existence:', error);
      throw error;
    }
  };

  const handleNext = async () => {
    setSubmitted(true);
    setLoading(true);
    
    try {
      // Only validate email existence on the first step
      if (currentStep === 0 && formData.email) {
        const emailExists = await checkEmailExists(formData.email);
        if (emailExists) {
          setErrors(prev => ({
            ...prev,
            email: "This email address is already registered. Please use a different email."
          }));
          setLoading(false);
          return;
        }
      }
      
      // If this is the final step, skip validation and submit directly
      if (currentStep === formSteps.length - 1) {
        if (!formData.confirmAccuracy) {
          setSubmitted(true);
          setLoading(false);
          return;
        }
        handleSubmit();
        return;
      }
      
      // For other steps, validate as normal
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
        setSubmitted(false);
        window.scrollTo(0, 0);
      } else {
        // Scroll to first error
        const firstErrorField = document.querySelector(".error-field");
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    } catch (error) {
      console.error("Error in handleNext:", error);
      setErrors(prev => ({
        ...prev,
        email: "Unable to verify email. Please try again."
      }));
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setSubmitted(false);
      window.scrollTo(0, 0);
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("files", file);

    try {
      console.log("Uploading image...");
      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_STRAPI_API_URL}/api/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Upload failed:", response.status);
        return null;
      }

      const result = await response.json();
      console.log("Image upload response:", result);

      // Return the first uploaded image's ID
      if (result && result.length > 0) {
        const uploadedImage = result[0];
        return uploadedImage.id;
      }

      return null;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const displayPictureId = formData.display_picture
        ? await uploadImage(formData.display_picture)
        : null;

      const strapiData = formatFormData(
        {
          ...formData,
          gotraList: Object.keys(gotraAaknaMap),
          aaknaList: getAaknaOptions(),
          localPanchayatList: formData.regionalAssembly
            ? LOCAL_PANCHAYATS[formData.regionalAssembly] || []
            : [],
          subLocalPanchayatList: formData.localPanchayat
            ? SUB_LOCAL_PANCHAYATS[formData.localPanchayat] || []
            : [],
        },
        displayPictureId
      );

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_STRAPI_API_URL}/api/registration-pages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          },
          body: JSON.stringify({ data: strapiData }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(
          errorData.error?.message ||
            errorData.error?.details?.errors?.[0]?.message ||
            "Failed to submit form"
        );
      }

      const result = await response.json();
      console.log("Form submitted successfully:", result);

      showSuccessMessage();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert(`Failed to submit form: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Separate function for showing success message
  const showSuccessMessage = () => {
    const successPopup = document.createElement("div");
    successPopup.className =
      "fixed inset-0 flex items-center justify-center z-50";
    successPopup.innerHTML = `
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>
      <div class="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4 relative z-10 border-2 border-[#FD7D01]">
        <div class="text-center">
          <div class="flex justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-[#FD7D01]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p class="text-gray-600 mb-6">Form submitted successfully! Redirecting to homepage...</p>
          <div class="w-full bg-gray-200 h-2 rounded-full mt-4">
            <div class="bg-[#FD7D01] h-2 rounded-full" style="width: 0%; transition: width 2s ease-in-out;" id="progress-bar"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(successPopup);
    const progressBar = document.getElementById("progress-bar");

    setTimeout(() => {
      progressBar.style.width = "100%";
    }, 100);

    setTimeout(() => {
      document.body.removeChild(successPopup);
      window.location.href = "/";
    }, 2500);
  };

  const hasError = (fieldName) => {
    return submitted && errors[fieldName];
  };

  const hasFamilyError = (index, field) => {
    return submitted && errors[`familyDetails.${index}.${field}`];
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Existing fields */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("name")
                      ? "border-red-500 bg-red-50 error-field"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your full name"
                />
                {renderError("name")}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("mobileNumber")
                      ? "border-red-500 bg-red-50 error-field"
                      : "border-gray-300"
                  }`}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  disabled={location.state?.fromLogin}
                />
                {hasError("mobileNumber") && (
                  <p className="text-red-500 text-xs">{errors.mobileNumber}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className=" text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Village
                </label>
                <input
                  type="text"
                  name="village"
                  value={formData.village}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("village")
                      ? "border-red-500 bg-red-50 error-field"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your village name"
                />
                {hasError("village") && (
                  <p className="text-red-500 text-xs">{errors.village}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className=" text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M14.243 5.757a6 6 0 10-9.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("email")
                      ? "border-red-500 bg-red-50 error-field"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email address"
                />
                {hasError("email") && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className=" text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Gender
                </label>
                <div className="flex items-center space-x-8 px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Male"
                      checked={formData.gender === "Male"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Male</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value="Female"
                      checked={formData.gender === "Female"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Female</span>
                  </label>
                </div>

                {hasError("gender") && (
                  <p className="text-red-500 text-xs">{errors.gender}</p>
                )}
              </div>

              {/* Nationality field */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Nationality
                  {hasError("nationality") && (
                    <span className="ml-2 text-xs text-red-500">*Required</span>
                  )}
                </label>
                <div
                  className={`flex items-center space-x-8 px-4 py-2.5 border rounded-lg ${
                    hasError("nationality")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="nationality"
                      value="Indian"
                      checked={formData.nationality === "Indian"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nationality: e.target.value,
                        })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Indian</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="nationality"
                      value="Non-Indian"
                      checked={formData.nationality === "Non-Indian"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nationality: e.target.value,
                        })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Non-Indian
                    </span>
                  </label>
                </div>
                {hasError("nationality") && (
                  <p className="text-red-500 text-xs">{errors.nationality}</p>
                )}
              </div>

              {/* Gahoi Community field */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Are you from Gahoi Community?
                </label>
                <div
                  className={`flex items-center space-x-8 px-4 py-2.5 border rounded-lg ${
                    hasError("isGahoi")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isGahoi"
                      value="Yes"
                      checked={formData.isGahoi === "Yes"}
                      onChange={(e) =>
                        setFormData({ ...formData, isGahoi: e.target.value })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="isGahoi"
                      value="No"
                      checked={formData.isGahoi === "No"}
                      onChange={(e) =>
                        setFormData({ ...formData, isGahoi: e.target.value })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
                {hasError("isGahoi") && (
                  <p className="text-red-500 text-xs">{errors.isGahoi}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block text-sm font-medium flex text-gray-700">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 00-1 1v1h1a1 1 0 000 2H6v1a1 1 0 00-2 0V6H3a1 1 0 000-2h1V3a1 1 0 00-1-1zm0 10a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Blood Group
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("bloodGroup")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUPS.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                {hasError("bloodGroup") && (
                  <p className="text-red-500 text-xs">
                    Please select your blood group
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <label className=" text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("birthDate")
                      ? "border-red-500 bg-red-50 error-field"
                      : "border-gray-300"
                  }`}
                />
                {hasError("birthDate") && (
                  <p className="text-red-500 text-xs">{errors.birthDate}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className=" text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Date of Marriage
                </label>
                <input
                  type="date"
                  name="marriageDate"
                  value={formData.marriageDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 border-gray-300"
                />
              </div>

              <div className="space-y-3">
                <label className=" text-sm font-medium text-gray-700 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-700"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Highest Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("education")
                      ? "border-red-500 bg-red-50 error-field"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your highest education"
                />
                {hasError("education") && (
                  <p className="text-red-500 text-xs">{errors.education}</p>
                )}
              </div>

              {/* Regional Information Section */}
              {renderRegionalInformation()}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {/* Parents Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-white px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Parents Information
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formData.familyDetails.slice(0, 2).map((member, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {member.relation}
                        </span>
                        {hasFamilyError(index, "name") && (
                          <span className="ml-2 text-xs text-red-500">
                            *Required
                          </span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) =>
                            handleFamilyDetailChange(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          className={`block w-full px-4 py-2.5 text-gray-700 border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                            hasFamilyError(index, "name")
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent`}
                          placeholder={`Enter ${member.relation}'s name`}
                        />
                        <div className="flex gap-2">
                          <input
                            type="tel"
                            value={member.mobileNumber}
                            onChange={(e) =>
                              handleFamilyDetailChange(
                                index,
                                "mobileNumber",
                                e.target.value
                              )
                            }
                            className="block flex-1 px-4 py-2.5 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                            maxLength={10}
                            placeholder={`${member.relation}'s mobile number`}
                          />
                          {member.mobileNumber?.length === 10 && (
                            <button
                              type="button"
                              onClick={() => openWhatsAppShare(member.mobileNumber)}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                              title="Invite to join"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Marital Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  Marital Status
                </h3>
              </div>
              <div className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center sm:space-x-8 space-y-2 sm:space-y-0">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isMarried"
                      value="yes"
                      checked={formData.isMarried === true}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isMarried: e.target.value === "yes",
                        }))
                      }
                      className="h-4 w-4 text-purple-700 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Married</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isMarried"
                      value="no"
                      checked={formData.isMarried === false}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isMarried: e.target.value === "yes",
                        }))
                      }
                      className="h-4 w-4 text-purple-700 focus:ring-purple-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Unmarried</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Spouse Card - Only show if married */}
            {formData.isMarried && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-50 to-white px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-pink-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  Spouse Information
                </h3>
              </div>
              <div className="p-6">
                {formData.familyDetails.slice(2, 3).map((member, index) => (
                  <div
                    key={index + 2}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleFamilyDetailChange(
                          index + 2,
                          "name",
                          e.target.value
                        )
                      }
                      className="block w-full px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                      placeholder="Enter spouse's name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={member.mobileNumber}
                        onChange={(e) =>
                          handleFamilyDetailChange(
                            index + 2,
                            "mobileNumber",
                            e.target.value
                          )
                        }
                        className="block flex-1 px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                        maxLength={10}
                        placeholder="Spouse's mobile number"
                      />
                      {member.mobileNumber?.length === 10 && (
                        <button
                          type="button"
                          onClick={() => openWhatsAppShare(member.mobileNumber)}
                          className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                          title="Invite to join"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {/* Children Section - Only show if married */}
            {formData.isMarried && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-blue-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Children Information
                </h3>
                {formData.familyDetails.filter(
                  (member) => member.relation === "Child"
                ).length < MAX_CHILDREN && (
                  <button
                    type="button"
                    onClick={addChild}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Child
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {formData.familyDetails
                    .filter((member) => member.relation === "Child")
                    .map((member, childIndex) => {
                      const index = formData.familyDetails.indexOf(member);
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 space-y-4 relative"
                        >
                          {/* Add Remove Button for Children */}
                          {index > 2 && (
                            <button
                              type="button"
                              onClick={() => removeChild(index)}
                              className="absolute -top-2 -right-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) =>
                                  handleFamilyDetailChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className={`block w-full px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                  hasFamilyError(index, "name")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                                placeholder={`Child ${childIndex + 1}'s name`}
                              />
                              {hasFamilyError(index, "name") && (
                                <p className="text-red-500 text-xs">
                                  {errors[`familyDetails.${index}.name`]}
                                </p>
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex gap-2">
                                <input
                                  type="tel"
                                  value={member.mobileNumber}
                                  onChange={(e) =>
                                    handleFamilyDetailChange(
                                      index,
                                      "mobileNumber",
                                      e.target.value
                                    )
                                  }
                                  className={`block flex-1 px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                    hasFamilyError(index, "mobileNumber")
                                      ? "border-red-500 bg-red-50"
                                      : "border-gray-300"
                                  }`}
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                  maxLength={10}
                                  placeholder="Mobile number (optional)"
                                />
                                {member.mobileNumber?.length === 10 && (
                                  <button
                                    type="button"
                                    onClick={() => openWhatsAppShare(member.mobileNumber)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                    title="Invite to join"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              {hasFamilyError(index, "mobileNumber") && (
                                <p className="text-red-500 text-xs">
                                  {errors[`familyDetails.${index}.mobileNumber`]}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div
                              className={`flex items-center space-x-6 px-4 py-2.5 border rounded-lg ${
                                hasFamilyError(index, "gender")
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            >
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`child-gender-${index}`}
                                  value="Male"
                                  checked={member.gender === "Male"}
                                  onChange={(e) =>
                                    handleFamilyDetailChange(
                                      index,
                                      "gender",
                                      e.target.value
                                    )
                                  }
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Male
                                </span>
                              </label>
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  name={`child-gender-${index}`}
                                  value="Female"
                                  checked={member.gender === "Female"}
                                  onChange={(e) =>
                                    handleFamilyDetailChange(
                                      index,
                                      "gender",
                                      e.target.value
                                    )
                                  }
                                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Female
                                </span>
                              </label>
                            </div>
                            {hasFamilyError(index, "gender") && (
                              <p className="text-red-500 text-xs">
                                {errors[`familyDetails.${index}.gender`]}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            )}


<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Show Gotra fields only if marriageToAnotherCaste is false */}
           
                <>
                  {/* Gotra */}
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md md:col-span-1 lg:col-span-1">
                    <label className=" text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Gotra
                    </label>
                    <select
                      name="gotra"
                      value={formData.gotra}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("gotra")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Gotra</option>
                      {[
                        "Vasar/Vastil/Vasal",
                        "Gol",
                        "Gangal / Gagil",
                        "Badal / Waghil / Bandal",
                        "Kocchal / Kochil",
                        "Jaital",
                        "Vachhil",
                        "Kachhil",
                        "Bhaal",
                        "Kohil",
                        "Kasiv",
                        "Kasav",
                        "Single",
                      ].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {hasError("gotra") && (
                      <p className="text-red-500 text-xs mt-2 ml-1">
                        {errors.gotra}
                      </p>
                    )}
                  </div>

                  {/* Aakna */}
                  <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200 transition-all hover:shadow-md md:col-span-1 lg:col-span-2">
                    <label className=" text-sm font-medium text-gray-700 mb-2 sm:mb-3 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Aakna
                    </label>
                    <select
                      name="aakna"
                      value={formData.aakna}
                      onChange={handleInputChange}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("aakna")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      disabled={!formData.gotra}
                    >
                      <option value="">Select Aakna</option>
                      {getAaknaOptions().map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    {hasError("aakna") && (
                      <p className="text-red-500 text-xs mt-2 ml-1">
                        {errors.aakna}
                      </p>
                    )}
                    {!formData.gotra && (
                      <p className="text-gray-500 text-xs mt-2 ml-1 italic">
                        Select a Gotra first to see available Aakna options
                      </p>
                    )}
                  </div>
                </>
            
            </div>
            {/* Siblings Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-white px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Siblings Information
                </h3>
                {formData.familyDetails.filter(
                  (member) => member.relation === "Sibling"
                ).length < MAX_SIBLINGS && (
                  <button
                    type="button"
                    onClick={addSibling}
                    className="inline-flex items-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors duration-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Add Sibling
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {formData.familyDetails
                    .filter((member) => member.relation === "Sibling")
                    .map((member, siblingIndex) => {
                      const index = formData.familyDetails.indexOf(member);
                      return (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 space-y-4 relative"
                        >
                          {/* Add Remove Button for Siblings */}
                          {index > 2 && (
                            <button
                              type="button"
                              onClick={() => removeSibling(index)}
                              className="absolute top-2 right-2 p-1 text-red-600 hover:text-red-800 transition-colors duration-200"
                              title="Remove Sibling"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-4">
                              <select
                                value={member.siblingRelation || ""}
                                onChange={(e) =>
                                  handleFamilyDetailChange(
                                    index,
                                    "siblingRelation",
                                    e.target.value
                                  )
                                }
                                className="block w-full px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                              >
                                <option value="">Select Relation</option>
                                {SIBLING_RELATION_OPTIONS.map((rel) => (
                                  <option key={rel} value={rel}>
                                    {rel}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) =>
                                  handleFamilyDetailChange(
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                className="block w-full px-4 py-2.5 text-gray-700 bg-white rounded-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                                placeholder={`Sibling ${
                                  siblingIndex + 1
                                }'s name`}
                              />
                            </div>
                            <div className="space-y-4">
                              <div className="flex gap-2">
                                <input
                                  type="tel"
                                  value={member.mobileNumber}
                                  onChange={(e) =>
                                    handleFamilyDetailChange(
                                      index,
                                      "mobileNumber",
                                      e.target.value
                                    )
                                  }
                                  className="block flex-1 px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
                                  pattern="[0-9]*"
                                  inputMode="numeric"
                                  maxLength={10}
                                  placeholder="Mobile number"
                                />
                                {member.mobileNumber?.length === 10 && (
                                  <button
                                    type="button"
                                    onClick={() => openWhatsAppShare(member.mobileNumber)}
                                    className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                                    title="Invite to join"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                    </svg>
                                  </button>
                                )}
                              </div>
                              <input
                                type="number"
                                value={member.age}
                                onChange={(e) =>
                                  handleFamilyDetailChange(
                                    index,
                                    "age",
                                    e.target.value
                                  )
                                }
                                className={`block w-full px-4 py-2.5 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                                  hasFamilyError(index, "age")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                                placeholder="Age"
                                min="0"
                                max="120"
                              />
                              {hasFamilyError(index, "age") && (
                                <p className="text-red-500 text-xs">
                                  Age is required
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6">
                            <div className="space-y-1">
                              <div
                                className={`flex items-center space-x-6 px-4 py-2.5 border rounded-lg ${
                                  hasFamilyError(index, "gender")
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                              >
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`gender-${index}`}
                                    value="Male"
                                    checked={member.gender === "Male"}
                                    onChange={(e) =>
                                      handleFamilyDetailChange(
                                        index,
                                        "gender",
                                        e.target.value
                                      )
                                    }
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Male
                                  </span>
                                </label>
                                <label className="inline-flex items-center">
                                  <input
                                    type="radio"
                                    name={`gender-${index}`}
                                    value="Female"
                                    checked={member.gender === "Female"}
                                    onChange={(e) =>
                                      handleFamilyDetailChange(
                                        index,
                                        "gender",
                                        e.target.value
                                      )
                                    }
                                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">
                                    Female
                                  </span>
                                </label>
                              </div>
                            </div>

                            <select
                              value={member.maritalStatus}
                              onChange={(e) =>
                                handleFamilyDetailChange(
                                  index,
                                  "maritalStatus",
                                  e.target.value
                                )
                              }
                              className={`px-4 py-2 text-sm text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200${
                                hasFamilyError(index, "maritalStatus")
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-300"
                              }`}
                            >
                              <option value="">Marital Status</option>
                              {MARITAL_STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>

                           
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

           
          </div>
        );

      case 3:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-red-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">
                Work Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Work Type Selection Radio Buttons */}
              <div className="md:col-span-2 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Professional Category
                </label>
                <div className="flex items-center space-x-8 px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                  <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                      name="workCategory"
                      value="business_owner"
                      checked={formData.workCategory === "business_owner"}
                    onChange={(e) =>
                        setFormData({ ...formData, workCategory: e.target.value })
                    }
                    className="h-4 w-4 text-red-700 focus:ring-red-500"
                  />
                    <span className="ml-2 text-sm text-gray-700">Business Owner</span>
                </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="workCategory"
                      value="professional"
                      checked={formData.workCategory === "professional"}
                      onChange={(e) =>
                        setFormData({ ...formData, workCategory: e.target.value })
                      }
                      className="h-4 w-4 text-red-700 focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Professional/Employee</span>
                  </label>
                </div>
              </div>

              {/* Business Owner Specific Fields */}
              {formData.workCategory === "business_owner" && (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Size/Classification
                    </label>
                    <select
                      name="businessSize"
                      value={formData.businessSize}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("businessSize")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Business Size</option>
                      {BUSINESS_SIZES.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                    {hasError("businessSize") && (
                      <p className="text-red-500 text-xs">
                        Please select a business size
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("businessType")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Business Type</option>
                      <option value="sole_proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="private_limited">Private Limited Company</option>
                      <option value="public_limited">Public Limited Company</option>
                      <option value="llp">Limited Liability Partnership (LLP)</option>
                      <option value="other">Other</option>
                    </select>
                    {hasError("businessType") && (
                      <p className="text-red-500 text-xs">
                        Please select a business type
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Years in Business
                    </label>
                    <select
                      name="businessYears"
                      value={formData.businessYears}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("businessYears")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Select Years in Business</option>
                      <option value="0-2">0-2 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="6-10">6-10 years</option>
                      <option value="11-20">11-20 years</option>
                      <option value="20+">More than 20 years</option>
                    </select>
                    {hasError("businessYears") && (
                      <p className="text-red-500 text-xs">
                        Please select years in business
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Industry Sector
                </label>
                <select
                  name="industrySector"
                  value={formData.industrySector}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("industrySector")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Industry Sector</option>
                  {INDUSTRY_SECTORS.map((sector) => (
                    <option key={sector} value={sector}>
                      {sector}
                    </option>
                  ))}
                </select>
                {hasError("industrySector") && (
                  <p className="text-red-500 text-xs">
                    Please select an industry sector
                  </p>
                )}
              </div>

              {/* Business Size/Classification - Only show if businessman is selected */}
              {formData.workCategory === "businessman" && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Business Size/Classification
                </label>
                <select
                  name="businessSize"
                  value={formData.businessSize}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("businessSize")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Business Size</option>
                  {BUSINESS_SIZES.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                {hasError("businessSize") && (
                  <p className="text-red-500 text-xs">
                    Please select a business size
                  </p>
                )}
              </div>
              )}

              {/* <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Work Type
                </label>
                <select
                  name="workType"
                  value={formData.workType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                    hasError("workType")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                  <option value="">Select Work Type</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Professional">Professional</option>
                  <option value="Skilled Worker">Skilled Worker</option>
                  <option value="Government Service">Government Service</option>
                  <option value="Private Sector Employee">Private Sector Employee</option>
                  <option value="Freelancer/Consultant">Freelancer/Consultant</option>
                  <option value="Retired">Retired</option>
                  <option value="Other">Other</option>
                </select>
                {hasError("workType") && (
                  <p className="text-red-500 text-xs">Please select work type</p>
                )}
              </div> */}

              {/* Business Owner Specific Fields */}
              {/* {formData.workType === "Business Owner" && (
                <>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                      Business Type
                </label>
                <select
                      name="businessType"
                      value={formData.businessType}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("businessType")
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                >
                      <option value="">Select Business Type</option>
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership">Partnership</option>
                      <option value="Private Limited Company">Private Limited Company</option>
                      <option value="Public Limited Company">Public Limited Company</option>
                      <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                      <option value="Other">Other</option>
                </select>
                    {hasError("businessType") && (
                      <p className="text-red-500 text-xs">Please select business type</p>
                )}
              </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Business Size
                    </label>
                    <select
                      name="businessSize"
                      value={formData.businessSize}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("businessSize")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                        }`}
                    >
                      <option value="">Select Business Size</option>
                      <option value="Micro Enterprise">Micro Enterprise</option>
                      <option value="Small Enterprise">Small Enterprise</option>
                      <option value="Medium Enterprise">Medium Enterprise</option>
                      <option value="Large Enterprise">Large Enterprise</option>
                      <option value="Self Employed/Freelancer">Self Employed/Freelancer</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                    {hasError("businessSize") && (
                      <p className="text-red-500 text-xs">Please select business size</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Years in Business
                    </label>
                    <select
                      name="businessYears"
                      value={formData.businessYears}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("businessYears")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                        }`}
                    >
                      <option value="">Select Years in Business</option>
                      <option value="0-2 years">0-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="11-20 years">11-20 years</option>
                      <option value="More than 20 years">More than 20 years</option>
                    </select>
                    {hasError("businessYears") && (
                      <p className="text-red-500 text-xs">Please select years in business</p>
                    )}
                  </div>
                </>
              )} */}

              {/* Show these fields only if Professional/Employee is selected */}
              {formData.workCategory === "professional" && (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Occupation/Job Title
                    </label>
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("occupation")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your specific role or job title"
                    />
                    {hasError("occupation") && (
                      <p className="text-red-500 text-xs">
                        Please enter your occupation
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Company/Organization Name
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("companyName")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your company or organization name"
                    />
                    {hasError("companyName") && (
                      <p className="text-red-500 text-xs">
                        Please enter your company name
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Work Location/Area
                    </label>
                    <input
                      type="text"
                      name="workArea"
                      value={formData.workArea}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                        hasError("workArea")
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter your work location or area"
                    />
                    {hasError("workArea") && (
                      <p className="text-red-500 text-xs">
                        Please enter your work location
                      </p>
                    )}
                  </div>
                </>
              )}

             
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start sm:items-center text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs sm:text-sm text-gray-600">
                  These details are important for community records and can be
                  useful for various purposes.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2 text-red-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.243 5.757a6 6 0 10-9.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-lg font-semibold text-gray-800">
                Final Submission
              </h2>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Suggestions:
                  </label>
                  <textarea
                    name="suggestions"
                    value={formData.suggestions}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 min-h-[120px]"
                    placeholder="Please share any suggestions or feedback you may have"
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="confirmAccuracy"
                    checked={formData.confirmAccuracy}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        confirmAccuracy: e.target.checked
                      }));
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <div className="ml-3 text-sm font-medium text-gray-700">
                    By submitting this form, I confirm that the information provided is accurate to the best of my knowledge.
                  </div>
                </div>
                {submitted && !formData.confirmAccuracy && (
                  <p className="mt-2 text-sm text-red-600">Please confirm that the information is accurate</p>
                )}
              </div>

              <div className="text-center text-gray-500 text-sm">
                Thank you for completing the registration form. Your information
                will be processed shortly.
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Replace indianStates array with imported STATES
  const indianStates = STATES;

  // Add Mahakaushal Regional Assembly panchayat names
  const mahakaushalPanchayatNames = [
    "Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Samaj Panchayat",
    "Shri Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Samaj",
    "Gahoi Vaishya Panchayat Parishad",
    "Shri Gahoi Vaishya Samaj",
  ];

  // Add Central Malwa Regional Assembly panchayat names
  const centralMalwaPanchayatNames = [
    "Gahoi Vaishya Samaj",
    "Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Samaj Kalyan Samiti",
    "Gahoi Vaishya Samaj Panchayat",
    "Shri Gahoi Vaishya Samaj Panchayat",
  ];

  // Local panchayat names for Chambal Regional Assembly
  const chambalPanchayatNames = [
    "Gahoi Vaishya Samaj Register Brahttar Gwalior",
    "Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Sabha",
    "Gahoi Vaishya Samaj",
  ];

  // Updated mapping for Ganga Jamuna Regional Assembly
  const gangaJamunaPanchayatNames = [
    "Gahoi Seva Mandal",
    "Gahoi Vaishya Seva Samiti",
    "Gahoi Vaishya Samaj Panchayat",
    "Gahoi Vaishya Panchayat Samiti",
    "Gahoi Vaishya Kalyan Samiti",
    "Gahoi Vaishya Yuva Samiti",
    "Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Samaj",
  ];

  // Add Bundelkhand Regional Assembly panchayat names
  const bundelkhandPanchayatNames = [
    "Gahoi Vaishya Panchayat",
    "Shri Gahoi Vaishya Panchayat",
    "Shri Gahoi Vaishya Seva Samiti",
    "Shri Daudayal Gahoi Vaishya Seva Samiti",
    "Gahoi Vaishya Seva Samiti",
  ];

  // Add Chaurasi Regional Assembly panchayat names
  const chaurasi_PanchayatNames = [
    "Gahoi Vaishya Panchayat",
    "Shri Gahoi Vaishya Sabha",
    "Gahoi Vaishya Samaj",
  ];

  // Add Vindhya Regional Assembly panchayat names
  const vindhyaPanchayatNames = [
    "Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Samaj",
    "Shri Gahoi Vaishya Sabha",
  ];

  // Add Chhattisgarh Regional Assembly panchayat names
  const chhattisgarhPanchayatNames = [
    "Gahoi Vaishya Panchayat",
    "Gahoi Vaishya Samaj",
  ];

  // Add Northern Regional Assembly panchayat names
  const northernPanchayatNames = ["Shri Gahoi Vaishya Association"];

  // Add Southern Regional Assembly panchayat names
  const southernPanchayatNames = ["Gahoi Vaishya Panchayat"];

  const getFilteredRegionalAssemblies = useCallback(() => {
    if (!formData.state) return [];

    // For Uttar Pradesh
    if (formData.state === "Uttar Pradesh") {
      if (formData.district === "Mathura") {
        return ["Northern Regional Assembly"];
      }
      if (formData.district === "Mahoba") {
        return ["Vindhya Regional Assembly"];
      }
      if (formData.district === "Sultanpur") {
        return ["Mahakaushal Regional Assembly"];
      }
      if (formData.district === "Lalitpur") {
        return ["Bundelkhand Regional Assembly"];
      }
      if (formData.district === "Jhansi") {
        return ["Bundelkhand Regional Assembly"];
      }
      if (["Jalaun", "Lucknow", "Kanpur Nagar", "Chitrakoot", "Banda", "Auraiya"].includes(formData.district)) {
        return ["Ganga Jamuna Regional Assembly"];
      }
    }

    // For Madhya Pradesh, filter assemblies based on district
    if (formData.state === "Madhya Pradesh") {
      // Mahakaushal Regional Assembly districts
      if (["Jabalpur", "Katni", "Rewa", "Narsinghpur", "Umaria", "Sagar", "Seoni", "Katni", "Chhindwara", "Panna", "Hoshangabad", "Mandla", "Damoh", "Shahdol", "Dindori",
        "Guna"
      ].includes(formData.district)) {
        if (formData.district === "Panna") {
          return ["Mahakaushal Regional Assembly", "Vindhya Regional Assembly"];
        }
        return ["Mahakaushal Regional Assembly"];
      }

      // Vindhya Regional Assembly districts
      if (["Satna", "Shahdol", "Sidhi", "Chhatarpur", "Panna", "Rewa"].includes(formData.district)) {
        if (formData.district === "Panna") {
          return ["Mahakaushal Regional Assembly", "Vindhya Regional Assembly"];
        }
        return ["Vindhya Regional Assembly"];
      }

      // Chaurasi Regional Assembly districts
      if (["Shivpuri", "Rewa", "Satna", "Ashoknagar", "Guna"].includes(formData.district)) {
        return ["Chaurasi Regional Assembly"];
      }

      // Chambal Regional Assembly districts
      if (["Gwalior", "Bhind", "Datia", "Morena"].includes(formData.district)) {
        return ["Chambal Regional Assembly"];
      }

      // Central Malwa Regional Assembly districts
      if (["Indore", "Dewas", "Ujjain", "Bhopal", "Vidisha", "Raisen"].includes(formData.district)) {
        return ["Central Malwa Regional Assembly"];
      }

      // Bundelkhand Regional Assembly districts
      if (["Tikamgarh"].includes(formData.district)) {
        return ["Bundelkhand Regional Assembly"];
      }
    }

    // For Delhi
    if (formData.state === "Delhi" && formData.district === "Delhi") {
      return ["Northern Regional Assembly"];
    }

    // For Bihar
    if (formData.state === "Bihar" && formData.district === "Patna") {
      return ["Vindhya Regional Assembly"];
    }

    // For Rajasthan
    if (formData.state === "Rajasthan" && formData.district === "Jaipur") {
      return ["Chambal Regional Assembly"];
    }

    // For Chhattisgarh
    if (formData.state === "Chhattisgarh") {
      if (["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur", "Bastar", "Koriya"].includes(formData.district)) {
        return ["Chhattisgarh Regional Assembly"];
      }
    }

    // For Maharashtra
    if (formData.state === "Maharashtra") {
      if (["Nagpur", "Pune", "Amravati", "Mumbai", "Jalgaon"].includes(formData.district)) {
        return ["Southern Regional Assembly"];
      }
    }

      return [];
  }, [formData.state, formData.district]);

  const getFilteredLocalPanchayatNames = () => {
    if (!formData.regionalAssembly) return [];

    // Bundelkhand Regional Assembly cases
    if (formData.regionalAssembly === "Bundelkhand Regional Assembly") {
      if (formData.state === "Uttar Pradesh") {
        if (formData.district === "Lalitpur") {
          return [
            "Shri Daudayal Gahoi Vaishya Seva Samiti",
            "Gahoi Vaishya Seva Samiti",
            "Gahoi Vaishya Panchayat",
            "Shri Gahoi Vaishya Panchayat"
          ];
        }
      }
    }

    // Chaurasi Regional Assembly cases
    if (formData.regionalAssembly === "Chaurasi Regional Assembly") {
      if (formData.state === "Madhya Pradesh") {
        if (formData.district === "Shivpuri") {
          return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Sabha"];
        }
        if (["Rewa", "Satna", "Guna"].includes(formData.district)) {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Ashoknagar") {
          return ["Gahoi Vaishya Panchayat", "Gahoi Vaishya Samaj"];
        }
      }
    }

    // Chambal Regional Assembly cases
    if (formData.regionalAssembly === "Chambal Regional Assembly") {
      // For Gwalior
      if (formData.state === "Madhya Pradesh" && formData.district === "Gwalior" && formData.city === "Gwalior") {
        return ["Gahoi Vaishya Samaj Register Brahttar Gwalior", "Gahoi Vaishya Panchayat"];
      }
      // For Bhind
      if (formData.state === "Madhya Pradesh" && formData.district === "Bhind") {
        return ["Gahoi Vaishya Sabha", "Gahoi Vaishya Panchayat"];
      }
      // For Datia
      if (formData.state === "Madhya Pradesh" && formData.district === "Datia") {
        return ["Gahoi Vaishya Panchayat"];
      }
      // For Morena
      if (formData.state === "Madhya Pradesh" && formData.district === "Morena") {
        return ["Gahoi Vaishya Samaj"];
      }
      // For Jaipur
      if (formData.state === "Rajasthan" && formData.district === "Jaipur") {
        return ["Gahoi Vaishya Panchayat"];
      }
    }

    // Northern Regional Assembly case
    if (formData.regionalAssembly === "Northern Regional Assembly") {
      if (formData.state === "Delhi" && formData.district === "Delhi") {
        return ["Shri Gahoi Vaishya Association"];
      }
      if (formData.state === "Uttar Pradesh" && formData.district === "Mathura") {
        return ["Gahoi Vaishya Vikas Sansthan"];
      }
    }

    // Vindhya Regional Assembly cases
    if (formData.regionalAssembly === "Vindhya Regional Assembly") {
      if (formData.state === "Bihar" && formData.district === "Patna") {
        return ["Shri Gahoi Vaishya Sabha"];
      }
      if (formData.state === "Uttar Pradesh" && formData.district === "Mahoba") {
        return ["Gahoi Vaishya Samaj"];
      }
      // Add new Madhya Pradesh cases for Central Malwa
      if (formData.state === "Madhya Pradesh") {
        if (formData.district === "Indore") {
          return ["Gahoi Vaishya Samaj"];
        }
        if (formData.district === "Ujjain") {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Bhopal") {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Vidisha") {
          return ["Gahoi Vaishya Samaj Kalyan Samiti"];
        }
        if (formData.district === "Raisen" && formData.city === "Begamganj") {
          return ["Shri Gahoi Vaishya Samaj Panchayat"];
        }
      }

    //Chattrapur, Panna, Reva, Satna case
      if (formData.regionalAssembly === "Vindhya Regional Assembly" && 
          formData.state === "Madhya Pradesh" && 
          ["Laundi", "Nowgong", "Chhatarpur", "Harpalpur", "Bada Malhera"].includes(formData.city)) {
          return ["Gahoi Vaishya Panchayat"];
      }
          if (formData.district === "Panna" && formData.city === "Amanganj") {
                return ["Gahoi Vaishya Panchayat"];
              
      }
      if (formData.district === "Panna" && formData.city === "Ajaigarh") {
                return ["Gahoi Vaishya Panchayat"];
              
      }
      if (formData.district === "Panna" && formData.city === "Panna") {
                return ["Gahoi Vaishya Panchayat"];
              
      }

     
      if (formData.state === "Madhya Pradesh" && formData.district === "Satna") {
        return ["Gahoi Vaishya Panchayat"];
      }
      

    }

    
    

    

    // Mahakaushal Regional Assembly case
    if (formData.regionalAssembly === "Mahakaushal Regional Assembly") {
      if (formData.state === "Uttar Pradesh" && formData.district === "Sultanpur") {
        return ["Gahoi Vaishya Panchayat"];
      }
      if (formData.state === "Madhya Pradesh" && formData.city === "Gotegaon" ) {
        return ["Gahoi Vaishya Panchayat"];
      }
      if (formData.state === "Madhya Pradesh" && formData.city === "Gadarwara") {
        return ["Gahoi Vaishya Panchayat"];
      }
      if (formData.state === "Madhya Pradesh" && formData.city === "Barheta") {
        return ["Gahoi Vaishya Panchayat"];
      }
      if (formData.state === "Madhya Pradesh" && formData.city === "Narsinghpur") {
        return ["Gahoi Vaishya Panchayat"];
      }
      if (formData.state === "Madhya Pradesh" && formData.city === "Chichli") {
        return ["Gahoi Vaishya Panchayat"];
      }
        if (formData.state === "Madhya Pradesh" && formData.city === "Saikeda") {
        return ["Gahoi Vaishya Panchayat"];
      }

      if (formData.city === "Kareli" ) {
        return ["Gahoi Vaishya Samaj Panchayat"];
      }
        if (formData.city === "Paloha" ) {
       return ["Gahoi Vaishya Samaj Panchayat"];
      }
       if (formData.city === "Tendukheda(NP)" ) {
      return ["Gahoi Vaishya Samaj Panchayat"];
      }
        if (formData.city === "Narsinghpur" ) {
      return ["Gahoi Vaishya Samaj Panchayat"];
      }

      if (formData.city === "Jabalpur") {
        return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Samaj"];
      }
         if (formData.city === "Sihora") {
        return ["Gahoi Vaishya Panchayat"];
      }

       if (formData.state === "Madhya Pradesh" && formData.city === "Umaria" ) {
        return ["Shri Gahoi Vaishya Panchayat"];
      }

      if (formData.state === "Madhya Pradesh" && formData.city === "Katni Nagar") {
        return ["Gahoi Vaishya Samaj", "Gahoi Vaishya Panchayat Parishad"];
      }

// Chindwara 
      if (formData.state === "Madhya Pradesh" && formData.city === "Chhindwara") {
        return ["Gahoi Vaishya Panchayat", "Shri Gahoi Vaishya Panchayat"];
      }

 // Panna
      if (formData.state === "Madhya Pradesh" && formData.city === "Panna") {
        return ["Gahoi Vaishya Panchayat"];
      }


//Hoshangabad
      if (formData.state === "Madhya Pradesh" && formData.city === "Pipariya") {
        return ["Gahoi Vaishya Panchayat"];
      } 
// Mandla
      if (formData.state === "Madhya Pradesh" && formData.city === "Mandla") {
        return ["Gahoi Vaishya Panchayat"];
      }
// Damoh
      if (formData.state === "Madhya Pradesh" && formData.city === "Hatta") {
        return ["Shri Gahoi Vaishya Panchayat"];
      }
// Shahdol
      if (formData.state === "Madhya Pradesh" && formData.city === "Shahdol") {
        return ["Shri Gahoi Vaishya Panchayat"];
      }
// Dindori
      if (formData.state === "Madhya Pradesh" && formData.city === "Dindori") {
        return ["Gahoi Vaishya Panchayat"];
      }
// Guna
      if (formData.state === "Madhya Pradesh" && formData.city === "Raghogarh") {
        return ["Gahoi Vaishya Panchayat"];
      }



//Sagar District cases
if (formData.state === "Madhya Pradesh") {
  switch(formData.city) {
    case "Rehli":
    case "Sagar":
      return ["Gahoi Vaishya Panchayat"];
    case "Garhakota":
    case "Deori":
      return ["Shri Gahoi Vaishya Panchayat"];
    case "Shahgarh":
      return ["Gahoi Vaishya Samaj"];
  }
}


if (formData.state === "Madhya Pradesh" && (formData.city === "Lakhnadon" || formData.city === "Seoni")) {
    return ["Gahoi Vaishya Panchayat"];
}

}

    




    // Bundelkhand Regional Assembly cases
    if (formData.regionalAssembly === "Bundelkhand Regional Assembly") {
      if (formData.state === "Uttar Pradesh" && formData.district === "Jhansi") {
        if (["Garautha", "Barua Sagar", "Simriddha", "Tahrauli", "Gursarai", "Bamor", 
            "Poonchh", "Erich", "Bhel Simrawali", "Babina Cantt", "Bangra Uldan Ranipur", 
            "Mauranipur"].includes(formData.city)) {
            return ["Gahoi Vaishya Panchayat"];
          }
        if (["Baragaon", "Ranipur", "Jhansi", "Samthar", "Archara"].includes(formData.city)) {
          return ["Shri Gahoi Vaishya Panchayat"];
        }
        if (formData.city === "Moth") {
          return ["Shri Gahoi Vaishya Seva Samiti"];
        }
      }
      if (formData.state === "Madhya Pradesh" && formData.district === "Tikamgarh") {
        return ["Shri Gahoi Vaishya Panchayat"];
      }
    }

    // Ganga Jamuna Regional Assembly cases
    if (formData.regionalAssembly === "Ganga Jamuna Regional Assembly") {
      if (formData.state === "Uttar Pradesh") {
        if (formData.district === "Jalaun") {
          return ["Gahoi Vaishya Samaj Panchayat", "Gahoi Vaishya Panchayat Samiti"];
        }
        if (formData.district === "Lucknow") {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Kanpur Nagar") {
          return ["Gahoi Vaishya Kalyan Samiti"];
        }
        if (formData.district === "Chitrakoot") {
          return ["Gahoi Vaishya Samaj"];
        }
        if (formData.district === "Banda") {
            return ["Gahoi Vaishya Samaj Panchayat"];
          }
        if (formData.district === "Auraiya") {
          return ["Gahoi Vaishya Yuva Samiti"];
        }
      }
    }

    // Chhattisgarh Regional Assembly cases
    if (formData.regionalAssembly === "Chhattisgarh Regional Assembly") {
      if (formData.state === "Chhattisgarh") {
        if (["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur"].includes(formData.district)) {
            return ["Gahoi Vaishya Panchayat"];
          }
        if (["Bastar", "Koriya"].includes(formData.district)) {
          return ["Gahoi Vaishya Samaj"];
        }
      }
    }

    // Southern Regional Assembly cases
    if (formData.regionalAssembly === "Southern Regional Assembly") {
      if (formData.state === "Maharashtra") {
        return ["Gahoi Vaishya Panchayat"];
      }
    }

    // Add new Central Malwa Regional Assembly cases
    if (formData.regionalAssembly === "Central Malwa Regional Assembly") {
      if (formData.state === "Madhya Pradesh") {
        if (formData.district === "Indore") {
          return ["Gahoi Vaishya Samaj"];
        }
        if (formData.district === "Ujjain") {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Bhopal") {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Vidisha") {
          return ["Gahoi Vaishya Samaj Kalyan Samiti"];
        }
        if (formData.district === "Raisen") {
          return ["Shri Gahoi Vaishya Samaj Panchayat"];
        }
      }
    }

    return [];
  };

  const getFilteredLocalPanchayats = () => {
    if (!formData.regionalAssembly || !formData.localPanchayatName) return [];

    // Central Malwa Regional Assembly cases
    if (formData.regionalAssembly === "Central Malwa Regional Assembly" && formData.state === "Madhya Pradesh") {
      if (formData.localPanchayatName === "Gahoi Vaishya Samaj" && formData.district === "Indore") {
        return ["Indore"];
      }
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        if (formData.district === "Ujjain") return ["Ujjain"];
        if (formData.district === "Bhopal") return ["Bhopal"];
      }
      if (formData.localPanchayatName === "Gahoi Vaishya Samaj Kalyan Samiti" && formData.district === "Vidisha") {
        return ["Vidisha"];
      }
      if (formData.localPanchayatName === "Shri Gahoi Vaishya Samaj Panchayat" && formData.district === "Raisen") {
        return ["Raisen"];
      }
      return [];
    }

    // Bundelkhand Regional Assembly cases
    if (formData.regionalAssembly === "Bundelkhand Regional Assembly") {
      if (formData.state === "Uttar Pradesh" && formData.district === "Lalitpur") {
        return ["Lalitpur"];
      }
    }

    // Chaurasi Regional Assembly cases
    if (formData.regionalAssembly === "Chaurasi Regional Assembly" && formData.state === "Madhya Pradesh") {
      return [formData.district];
    }

    // Chambal Regional Assembly cases
    if (formData.regionalAssembly === "Chambal Regional Assembly") {
      // For Gwalior
      if (formData.state === "Madhya Pradesh" && formData.district === "Gwalior") {
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj Register Brahttar Gwalior" ||
            formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          return ["Gwalior"];
        }
      }
      // For Bhind
      if (formData.state === "Madhya Pradesh" && formData.district === "Bhind") {
        return ["Bhind"];
      }
      // For Datia
      if (formData.state === "Madhya Pradesh" && formData.district === "Datia") {
        return ["Datia"];
      }
      // For Morena
      if (formData.state === "Madhya Pradesh" && formData.district === "Morena") {
        return ["Morena"];
      }
      // For Jaipur
      if (formData.state === "Rajasthan" && formData.district === "Jaipur") {
        return ["Jaipur"];
      }
    }

    // Northern Regional Assembly cases
    if (formData.regionalAssembly === "Northern Regional Assembly") {
      if (formData.state === "Delhi" && formData.district === "Delhi") {
        return ["Delhi"];
      }
      if (formData.state === "Uttar Pradesh" && formData.district === "Mathura") {
        return ["Mathura"];
      }
    }

    // Vindhya Regional Assembly cases
    if (formData.regionalAssembly === "Vindhya Regional Assembly") {
      if (formData.state === "Bihar" && formData.district === "Patna") {
        return ["Patna"];
      }
      if (formData.state === "Uttar Pradesh" && formData.district === "Mahoba") {
          return ["Mahoba"];
        }
    }

   //Vrindha - Chattapur, Panna, Reva, Satna case
    if (formData.regionalAssembly === "Vindhya Regional Assembly" &&
        formData.state === "Madhya Pradesh" &&
        ["Laundi", "Nowgong", "Chhatarpur", "Harpalpur", "Bada Malhera"].includes(formData.city)) {
      return ["Chhatarpur"];
    }


    if (formData.regionalAssembly === "Vindhya Regional Assembly" &&
        formData.state === "Madhya Pradesh" &&
        formData.district === "Panna" &&
        ["Amanganj", "Panna", "Ajaigarh"].includes(formData.city)) {
      return ["Panna"];
    }

if (formData.regionalAssembly === "Vindhya Regional Assembly") {
      if (formData.district === "Satna" && formData.city === "Satna") {
        return ["Satna"];
      }
    }

    if (formData.regionalAssembly === "Vindhya Regional Assembly") {
      if (formData.district === "Satna" && formData.city === "Chitrakoot") {
        return ["Satna"];
      }
    }



    // Mahakaushal Regional Assembly case
    if (formData.regionalAssembly === "Mahakaushal Regional Assembly") {
      if (formData.state === "Uttar Pradesh" && formData.district === "Sultanpur") {
        return ["Gahoi Vaishya Panchayat"];
      }
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        if (formData.district === "Narsinghpur" && formData.localPanchayatName === "Gahoi Vaishya Panchayat") return ["Narsinghpur"];       
      }
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj Panchayat") {
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj Panchayat") return ["Narsinghpur"];       
      }

       if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        if (formData.city === "Sihora" && formData.localPanchayatName === "Gahoi Vaishya Panchayat") return ["Jabalpur"];       
      }

         if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        if (formData.city === "Jabalpur" && formData.localPanchayatName === "Gahoi Vaishya Panchayat") return ["Jabalpur"];       
      }
      
       if (formData.localPanchayatName === "Shri Gahoi Vaishya Samaj") {
        if (formData.city === "Jabalpur" && formData.localPanchayatName === "Shri Gahoi Vaishya Samaj") return ["Jabalpur"];       
      }

      if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
        if (formData.city === "Umaria" && formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") return ["Umaria"];       
      }

      //Sagar

      if (
              (formData.localPanchayatName === "Gahoi Vaishya Panchayat" && 
              (formData.city === "Rehli" || formData.city === "Sagar")) ||
              (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat" && 
              (formData.city === "Garhakota" || formData.city === "Deori")) ||
              (formData.localPanchayatName === "Gahoi Vaishya Samaj" && 
              formData.city === "Shahgarh")
            ) {
              return ["Sagar"];
            }

        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat" && 
          (formData.city === "Seoni" || formData.city === "Lakhnadon")) {
        return ["Seoni"];
      }


      //Katni
      if (formData.state === "Madhya Pradesh" && formData.city === "Katni Nagar") {
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
          return ["Katni"];
        }
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat Parishad") {
          return ["Katni"];
        }
      }
      
    }

    //Chindwara

     if (formData.state === "Madhya Pradesh" && formData.city === "Chhindwara") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          return ["Chhindwara"];
        }
        if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
          return ["Chhindwara"];
        }
      }
      
  //Panna
    if (formData.state === "Madhya Pradesh" && formData.city === "Panna") {
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        return ["Panna"];
      }
    }

// Hoshangabad
    if (formData.state === "Madhya Pradesh" && formData.city === "Pipariya") {
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        return ["Hoshangabad"];
      }
    }
// Mandla
    if (formData.state === "Madhya Pradesh" && formData.city === "Mandla") {    
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        return ["Mandla"];
      }
    }
// Damoh
    if (formData.state === "Madhya Pradesh" && formData.city === "Hatta") {
      if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
        return ["Hatta"];
      }
    }
// Shahdol
    if (formData.state === "Madhya Pradesh" && formData.city === "Shahdol") {
      if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
        return ["Shahdol"];
      }
    }
// Dindori
    if (formData.state === "Madhya Pradesh" && formData.city === "Dindori") {
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        return ["Dindori"];
      }
    }
// Guna
    if (formData.state === "Madhya Pradesh" && formData.city === "Raghogarh") {
      if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
        return ["Guna"];
      }
    }



    // Bundelkhand Regional Assembly cases
    if (formData.regionalAssembly === "Bundelkhand Regional Assembly") {
      if (formData.state === "Uttar Pradesh" && formData.district === "Jhansi") {
        return ["Jhansi"];
      }
      if (formData.state === "Madhya Pradesh" && formData.district === "Tikamgarh") {
        return ["Tikamgarh"];
      }
    }

    // Ganga Jamuna Regional Assembly cases
    if (formData.regionalAssembly === "Ganga Jamuna Regional Assembly") {
      if (formData.state === "Uttar Pradesh") {
        if (formData.district === "Jalaun") {
          return ["Gahoi Vaishya Samaj Panchayat", "Gahoi Vaishya Panchayat Samiti"];
        }
        if (formData.district === "Lucknow") {
          return ["Gahoi Vaishya Panchayat"];
        }
        if (formData.district === "Kanpur Nagar") {
          return ["Gahoi Vaishya Kalyan Samiti"];
        }
        if (formData.district === "Chitrakoot") {
          return ["Gahoi Vaishya Samaj"];
        }
        if (formData.district === "Banda") {
            return ["Gahoi Vaishya Samaj Panchayat"];
          }
        if (formData.district === "Auraiya") {
          return ["Gahoi Vaishya Yuva Samiti"];
        }
      }
    }

    // Chhattisgarh Regional Assembly cases
    if (formData.regionalAssembly === "Chhattisgarh Regional Assembly") {
      if (formData.state === "Chhattisgarh") {
        if (["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur"].includes(formData.district)) {
            return ["Gahoi Vaishya Panchayat"];
          }
        if (["Bastar", "Koriya"].includes(formData.district)) {
          return ["Gahoi Vaishya Samaj"];
        }
      }
    }

    // Southern Regional Assembly cases
    if (formData.regionalAssembly === "Southern Regional Assembly") {
      if (formData.state === "Maharashtra") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          return [formData.city];
        }
      }


    }

      return [];
  };

  

  const getFilteredSubLocalPanchayats = () => {
    if (!formData.regionalAssembly || !formData.localPanchayatName || !formData.localPanchayat) return [];

    // Mahakaushal Regional Assembly cases
    if (formData.regionalAssembly === "Mahakaushal Regional Assembly" && formData.state === "Madhya Pradesh") {
      // Narsinghpur district cases
      if (formData.district === "Narsinghpur") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Narsinghpur") return ["Gotegaon", "Gadarwara", "Barheta", "Narsinghpur", "Chichli", "Saikeda"];
        }
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj Panchayat") {
          if (formData.localPanchayat === "Narsinghpur") return ["Kareli", "Tendukheda(NP)", "Paloha", "Bedu"];
        }

         if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Seoni") return ["Seoni", "Ganesh Ganj"];
        }
      
      }

        //katni 
      if (formData.district === "Katni") {
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
          if (formData.localPanchayat === "Katni") return ["Kanhwara"];
        }
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat Parishad") {
          if (formData.localPanchayat === "Katni") return ["Katni "];
        }
      } 
      
      // Chindwara
      if (formData.district === "Chhindwara") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhindwara") return ["Junnardeo"];
        }
        if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhindwara") return ["Chhindwara"];
        }
      } 

      //Panna
      if (formData.district === "Panna") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Panna") return ["Shah Nagar", "Pawai", "Kishangarh"];
        }
       
      }

// Hoshangabad district cases
      if (formData.district === "Hoshangabad") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Hoshangabad") return ["Pipariya"];
        }
      
      }

      //Mandla
 if (formData.district === "Mandla") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Mandla") return ["Mandla"];
        }
      }

    //Damoh
    if (formData.district === "Damoh") {

        if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Hatta") return ["Madhiya Do"];
        }
        
      }

      // Shahdol district cases 
      if (formData.district === "Shahdol") {

        if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Shahdol") return ["Shahdol"];
        }
        
      }

      // Dindori district cases 
      if (formData.district === "Dindori") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Dindori") return ["Dindori"];
        }
      }

      // Guna district cases
      if (formData.district === "Guna") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Guna") return ["Raghogarh"];
        }
      }

      
      // Jabalpur district cases
      if (formData.district === "Jabalpur") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Jabalpur") {
         
            if (formData.city === "Sihora") {
              return ["Khitola", "Sihora"];
            }
           
            return ["Jabalpur"];
          }
        }
        if (formData.localPanchayatName === "Shri Gahoi Vaishya Samaj") {
          if (formData.localPanchayat === "Jabalpur") return ["Jabalpur"];
        }
      }

      //sagr district cases
      if (formData.district === "Sagar") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Sagar")

            if (formData.city === "Rehli" && formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
              return ["Rehli"];
            }
                    
            return ["Sagar"];
          }     
      }
      if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Sagar") return ["Garhakota" , "Deori"];
        }
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
          if (formData.localPanchayat === "Sagar") return ["Shahgarh"];
        }

      // Umaria district cases
      if (formData.district === "Umaria") {
        if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Umaria") return ["Silaudi", "Masur Pani", "Dhuldhuli", "Devri"];
        }
      }

      // Seoni district cases
      if (formData.district === "Seoni") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Seoni") return ["Seoni", "Ganesh Ganji"];
        }
      }


      return [];
    }

    // Central Malwa Regional Assembly cases
    

    // Use SUB_LOCAL_PANCHAYATS mapping for all other assemblies
    if (SUB_LOCAL_PANCHAYATS[formData.localPanchayat]) {
      return SUB_LOCAL_PANCHAYATS[formData.localPanchayat];
    }

    // Bundelkhand Regional Assembly cases
    if (formData.regionalAssembly === "Bundelkhand Regional Assembly") {
      if (formData.state === "Uttar Pradesh") {
        if (formData.district === "Lalitpur") {
          if (formData.localPanchayatName === "Shri Daudayal Gahoi Vaishya Seva Samiti") {
            return ["Bansi"];
          }
          if (formData.localPanchayatName === "Gahoi Vaishya Seva Samiti") {
            return ["Lalitpur"];
          }
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Talbehat", "Poora Kalan"];
          }
          if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
            return ["Narahat", "War"];
          }
        }
        if (formData.district === "Jhansi") {
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return [
              "Garautha",
              "Barua Sagar",
              "Simriddha",
              "Tahrauli",
              "Gursarai",
              "Bamor",
              "Poonchh",
              "Erich",
              "Bhel Simrawali",
              "Babina Cantt",
              "Bangra Uldan Ranipur",
              "Mauranipur"
            ];
          }
          if (formData.localPanchayatName === "Shri Gahoi Vaishya Panchayat") {
            return [
              "Baragaon",
              "Ranipur",
              "Jhansi",
              "Samthar",
              "Archara"
            ];
          }
          if (formData.localPanchayatName === "Shri Gahoi Vaishya Seva Samiti") {
            return ["Moth"];
          }
        }
      }
      if (formData.state === "Madhya Pradesh" && formData.district === "Tikamgarh") {
        return [
          "Tikamgarh",
          "Baldeogarh",
          "Jatara",
          "Palera",
          "Niwari",
          "Prithvipur",
          "Orchha",
          "Badagaon",
          "Mohangarh",
          "Digoda",
          "Lidhora",
          "Khargapur"
        ];
      }
    }

    // Chaurasi Regional Assembly cases
    if (formData.regionalAssembly === "Chaurasi Regional Assembly") {
      switch (formData.district) {
        case "Shivpuri":
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Shivpuri", "Mahalwani", "Pipara", "Bamour Damaron", "Manpura", "Pichhore"];
          }
          if (formData.localPanchayatName === "Shri Gahoi Vaishya Sabha") {
            return ["Karera", "Bhauti"];
          }
          break;
        case "Rewa":
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Rewa", "Semaria", "Pipara"];
          }
          break;
        case "Satna":
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Satna", "Kotar", "Semari"];
          }
          break;
        case "Ashoknagar":
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Ashoknagar", "Bamore Kalan"];
          }
          if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
            return ["Dinara", "Guna"];
          }
          break;
        case "Guna":
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Guna"];
          }
          break;
        default:
          return [];
      }
    }

    // Ganga Jamuna Regional Assembly cases
    if (formData.regionalAssembly === "Ganga Jamuna Regional Assembly") {
      if (formData.state === "Uttar Pradesh") {
        if (formData.district === "Jalaun") {
          if (formData.localPanchayatName === "Gahoi Seva Mandal") {
            return ["Orai"];
          }
          if (formData.localPanchayatName === "Gahoi Vaishya Seva Samiti") {
            return ["Konch"];
          }
          if (formData.localPanchayatName === "Gahoi Vaishya Samaj Panchayat") {
            return ["Madhogarh", "Jalaun"];
          }
        }
        if (formData.district === "Lucknow") {
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return ["Lucknow", "Bakshi Ka Talab", "Malihabad"];
          }
        }
        if (formData.district === "Kanpur Nagar") {
          if (formData.localPanchayatName === "Gahoi Vaishya Kalyan Samiti") {
            return ["Kanpur", "Bilhaur", "Ghatampur"];
          }
        }
        if (formData.district === "Chitrakoot") {
          if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
            return ["Karwi", "Mau", "Bharatkoop"];
          }
        }
        if (formData.district === "Banda") {
          if (formData.localPanchayatName === "Gahoi Vaishya Samaj Panchayat") {
            return ["Banda", "Naraini", "Baberu"];
          }
        }
        if (formData.district === "Auraiya") {
          if (formData.localPanchayatName === "Gahoi Vaishya Yuva Samiti") {
            return ["Auraiya", "Dibiyapur", "Phaphund"];
          }
        }
      }
    }

    // Northern Regional Assembly cases
    if (formData.regionalAssembly === "Northern Regional Assembly") {
      if (formData.state === "Uttar Pradesh") {
        if (formData.district === "Mathura") {
          if (formData.localPanchayatName === "Gahoi Vaishya Vikas Sansthan") {
            return ["Mathura", "Vrindavan", "Govardhan"];
          }
        }
      }
      if (formData.state === "Delhi" && formData.district === "Delhi") {
        if (formData.localPanchayatName === "Shri Gahoi Vaishya Association") {
          return ["Delhi"];
        }
      }
    }

    // Vindhya Regional Assembly cases
    if (formData.regionalAssembly === "Vindhya Regional Assembly") {
      if (formData.state === "Bihar" && formData.district === "Patna") {
        if (formData.localPanchayatName === "Shri Gahoi Vaishya Sabha") {
          return ["Patna City"];
        }
      }
      if (formData.state === "Uttar Pradesh" && formData.district === "Mahoba") {
        if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
          return ["Mahoba"];
        }
      }
    }

    // Vrindha - Chattapur, Panna, Reva, Satna case
     if (formData.city === "Laundi") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhatarpur") return ["Lavkush Nagar"];
        }
       } 

       if (formData.city === "Nowgong") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhatarpur") return ["Alipur"];
        }
       } 

        if (formData.city === "Chattarpur") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhatarpur") return ["Tatam"];
        }
       }

        if (formData.city === "Harpalpur") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhatarpur") return ["Harpalpur"];
        }
       }

         if (formData.city === "Chattarpur") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhatarpur") return ["Ishanagar"];
        }
       }

           if (formData.city === "Bada Malhera") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Chhatarpur") return ["Bada Malhera"];
        }
       }

        if (formData.city === "Amanganj") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Panna") return ["Amanganj"];
        }
        
       } 

        if (formData.city === "Panna") {
       if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Panna") return ["Panna" , "Gunnor", "Mohendra", "Simariya", "Sunwani Kala", "Kishangarh" ];
        } 
      }

       if (formData.city === "Ajaigarh") {
       if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Panna") return ["Ajaigarh"];
        } 
      }

      if (formData.city === "Chitrakoot") {
       if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Satna") return ["Nayagaon Chitrakoot"];
        } 
      }

         if (formData.city === "Satna") {
       if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          if (formData.localPanchayat === "Satna") return ["Satna"];
        } 
      }



    // Chhattisgarh Regional Assembly cases
    if (formData.regionalAssembly === "Chhattisgarh Regional Assembly") {
      if (formData.state === "Chhattisgarh") {
        if (["Durg", "Rajnandgaon", "Dhamtari", "Raipur", "Bilaspur"].includes(formData.district)) {
          if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
            return [formData.district];
          }
        }
        if (["Bastar", "Koriya"].includes(formData.district)) {
          if (formData.localPanchayatName === "Gahoi Vaishya Samaj") {
            return [formData.district];
          }
        }
      }
    }

    // Southern Regional Assembly cases
    if (formData.regionalAssembly === "Southern Regional Assembly") {
      if (formData.state === "Maharashtra") {
        if (formData.localPanchayatName === "Gahoi Vaishya Panchayat") {
          return [formData.district];
        }
      }
    }

    return [];
  };

  // Mapping for Local Panchayat based on Local Panchayat Name
  const localPanchayatMapping = {
    "Gahoi Vaishya Samaj Register Brahttar Gwalior": ["Gwalior"],
    "Gahoi Vaishya Panchayat": ["Gwalior", "Bhind", "Datia", "Jaipur", "Shivpuri", "Rewa", "Satna", "Guna", "Ashoknagar"],
    "Gahoi Vaishya Sabha": ["Bhind"],
    "Shri Gahoi Vaishya Sabha": ["Shivpuri"],
    "Gahoi Vaishya Samaj": ["Morena", "Ashoknagar"],
    "Gahoi Seva Mandal": ["Jalaun"],
    "Gahoi Vaishya Seva Samiti": ["Jalaun"],
    "Gahoi Vaishya Samaj Panchayat": ["Jalaun", "Banda"],
  };

  // Mapping for Sub Local Panchayat based on Local Panchayat
  const subLocalPanchayatMapping = {
    Gwalior: {
      "Gahoi Vaishya Samaj Register Brahttar Gwalior": [
        "Gahoi Vaishya Samaj Register Brahtaar Gwalior",
      ],
      "Gahoi Vaishya Panchayat": [
        "Madhavganj",
        "Khasgi Bazaar",
        "Daulatganj",
        "Kampoo",
        "Lohia Bazaar",
        "Phalka Bazaar",
        "Lohamandi",
        "Bahodapur",
        "Naka Chandravadni",
        "Harishankarpuram",
        "Thatipur",
        "Morar",
        "Dabra",
        "Pichhore Dabra",
        "Behat",
      ],
    },
    Bhind: {
      "Gahoi Vaishya Panchayat": [
        "Alampur",
        "Daboh",
        "Tharet",
        "Mihona",
        "Aswar",
        "Lahar",
        "Gohad",
        "Machhand",
        "Raun",
      ],
      "Gahoi Vaishya Sabha": ["Bhind"],
    },
    Morena: {
      "Gahoi Vaishya Samaj": ["Morena"],
    },
    Datia: {
      "Gahoi Vaishya Panchayat": [
        "Sewdha",
        "Chhoti Badoni",
        "Datia",
        "Indergarh",
        "Badhara Sopan",
        "Unnao Balaji",
        "Bhander",
        "Salon B",
      ],
    },
    Jaipur: {
      "Gahoi Vaishya Panchayat": ["Jaipur"],
    },
    Jalaun: {
      "Gahoi Seva Mandal": ["Orai"],
      "Gahoi Vaishya Seva Samiti": ["Konch"],
      "Gahoi Vaishya Samaj Panchayat": ["Madhogarh", "Jalaun"],
    },
    Banda: {
      "Gahoi Vaishya Samaj Panchayat": ["Banda"],
    },
  };

  // Update the regional information section to use filtered dropdowns
  const renderRegionalInformation = () => (
    <div className="md:col-span-2 mt-6 mb-4">
      <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
            clipRule="evenodd"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">
          Regional Information
        </h3>
      </div>

      <div className="space-y-4">
        {/* First Row: State, District, City */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* State Dropdown */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                  clipRule="evenodd"
                />
              </svg>
              State
            </label>
            <select
              name="state"
              value={formData.state || ""}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                hasError("state")
                  ? "border-red-500 bg-red-50 error-field"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select State</option>
              {indianStates.map((state, index) => (
                <option key={index} value={state}>
                  {state}
                </option>
              ))}
            </select>
            {hasError("state") && (
              <p className="text-red-500 text-xs">{errors.state}</p>
            )}
          </div>

          {/* District Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                  clipRule="evenodd"
                />
              </svg>
              District
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                hasError("district")
                  ? "border-red-500 bg-red-50 error-field"
                  : "border-gray-300"
              }`}
            >
              <option value="">Select District</option>
              {formData.state &&
                STATE_TO_DISTRICTS[formData.state]?.map((district, index) => (
                  <option key={index} value={district}>
                    {district}
                  </option>
                ))}
            </select>
            {hasError("district") && (
              <p className="text-red-500 text-xs">{errors.district}</p>
            )}
          </div>

          {/* City Dropdown */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-red-700"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
                  clipRule="evenodd"
                />
              </svg>
              City
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
                hasError("city")
                  ? "border-red-500 bg-red-50 error-field"
                  : "border-gray-300"
              }`}
              disabled={!formData.district}
            >
              <option value="">Select City</option>
              {formData.state && formData.district && DISTRICT_TO_CITIES[formData.state]?.[formData.district]?.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {hasError("city") && (
              <p className="text-red-500 text-xs">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Current Address - Full Width */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-red-700"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Current Address
          </label>
          <textarea
            name="currentAddress"
            value={formData.currentAddress}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 ${
              hasError("currentAddress")
                ? "border-red-500 bg-red-50 error-field"
                : "border-gray-300"
            }`}
            rows="3"
            placeholder="Enter your current address"
          />
          {hasError("currentAddress") && (
            <p className="text-red-500 text-xs">{errors.currentAddress}</p>
          )}
        </div>

        {/* First Row: Regional Assembly and Local Panchayat Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Regional Assembly Dropdown */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <label
              htmlFor="regionalAssembly"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Regional Assembly <span className="text-red-500">*</span>
            </label>
            <select
              id="regionalAssembly"
              name="regionalAssembly"
              value={formData.regionalAssembly || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200 text-sm"
              disabled={!formData.state || !STATE_TO_ASSEMBLIES[formData.state]}
            >
              <option value="">
                {!formData.state 
                  ? "Select State First"
                  : !STATE_TO_ASSEMBLIES[formData.state]
                  ? "No Regional Assembly for Selected State"
                  : "Select Regional Assembly"
                }
              </option>
              {getFilteredRegionalAssemblies().map((assembly, index) => (
                <option key={index} value={assembly}>
                  {assembly}
                </option>
              ))}
            </select>
            {errors.regionalAssembly && (
              <p className="mt-1 text-xs text-red-500">
                {errors.regionalAssembly}
              </p>
            )}
          </div>

          {/* Local Panchayat Name Dropdown */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <label
              htmlFor="localPanchayatName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Local Panchayat Trust <span className="text-red-500">*</span>
            </label>
            <select
              id="localPanchayatName"
              name="localPanchayatName"
              value={formData.localPanchayatName || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200 text-sm"
              disabled={!formData.regionalAssembly || !STATE_TO_ASSEMBLIES[formData.state]}
            >
              <option value="">
                {!formData.state 
                  ? "Select State First"
                  : !STATE_TO_ASSEMBLIES[formData.state]
                  ? "No Local Panchayat for Selected State"
                  : !formData.regionalAssembly
                  ? "Select Regional Assembly First"
                  : "Select Local Panchayat Name"
                }
              </option>
              {getFilteredLocalPanchayatNames().map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.localPanchayatName && (
              <p className="mt-1 text-xs text-red-500">
                {errors.localPanchayatName}
              </p>
            )}
          </div>
        </div>

        {/* Second Row: Local Panchayat and Sub Local Panchayat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Local Panchayat Dropdown */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <label
              htmlFor="localPanchayat"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Local Panchayat <span className="text-red-500">*</span>
            </label>
            <select
              id="localPanchayat"
              name="localPanchayat"
              value={formData.localPanchayat || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200 text-sm"
              disabled={!formData.localPanchayatName || !STATE_TO_ASSEMBLIES[formData.state]}
            >
              <option value="">
                {!formData.state 
                  ? "Select State First"
                  : !STATE_TO_ASSEMBLIES[formData.state]
                  ? "No Local Panchayat for Selected State"
                  : !formData.localPanchayatName
                  ? "Select Local Panchayat Name First"
                  : "Select Local Panchayat"
                }
              </option>
              {getFilteredLocalPanchayats().map((panchayat, index) => (
                <option key={index} value={panchayat}>
                  {panchayat}
                </option>
              ))}
            </select>
            {errors.localPanchayat && (
              <p className="mt-1 text-xs text-red-500">
                {errors.localPanchayat}
              </p>
            )}
          </div>

          {/* Sub Local Panchayat Dropdown */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <label
              htmlFor="subLocalPanchayat"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Sub Local Panchayat <span className="text-red-500">*</span>
            </label>
            <select
              id="subLocalPanchayat"
              name="subLocalPanchayat"
              value={formData.subLocalPanchayat || ""}
              onChange={handleInputChange}
              className="w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white transition-all duration-200 text-sm"
              disabled={!formData.localPanchayat || !STATE_TO_ASSEMBLIES[formData.state]}
            >
              <option value="">
                {!formData.state 
                  ? "Select State First"
                  : !STATE_TO_ASSEMBLIES[formData.state]
                  ? "No Sub Local Panchayat for Selected State"
                  : !formData.localPanchayat
                  ? "Select Local Panchayat First"
                  : "Select Sub Local Panchayat"
                }
              </option>
              {getFilteredSubLocalPanchayats().map((panchayat, index) => (
                <option key={index} value={panchayat}>
                  {panchayat}
                </option>
              ))}
            </select>
            {errors.subLocalPanchayat && (
              <p className="mt-1 text-xs text-red-500">
                {errors.subLocalPanchayat}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Create a reusable function to render form field errors
  const renderError = (fieldName) => {
    if (hasError(fieldName)) {
      return <p className="text-red-500 text-xs">{errors[fieldName]}</p>;
    }
    return null;
  };

  const handleSkip = () => {
    // Set empty values based on current step
    const emptyValues = {
      biographical_details: {
        manglik_status: "",
        Grah: "",
        Handicap: "",
        gotra: "",
        aakna: "",
      },
      work_information: {
        industrySector: "",
        businessSize: "",
        workType: "",
        employmentType: "",
        occupation: "",
        companyName: "",
        workArea: "",
      },
      additional_details: {
        regional_information: {
          State: "",
          RegionalAssembly: "",
          LocalPanchayat: "",
          LocalPanchayatName: "",
          SubLocalPanchayat: "",
        },
      },
    };

    // Update form data with empty values for current section only
    setFormData((prev) => ({
      ...prev,
      ...(emptyValues[Object.keys(emptyValues)[currentStep - 1]] || {}),
    }));

    setCurrentStep(currentStep + 1);
    setSubmitted(false);
    window.scrollTo(0, 0);
  };

  // In the renderStepContent function, add isGahoi field to personal information section
  const renderPersonalInformation = () => {
    return (
      <div className="space-y-4">
        {/* Add isGahoi field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Are you from Gahoi Community?
          </label>
          <div className="mt-1 space-y-2">
            <div className="border border-gray-300 rounded-md p-3">
              <div className="flex items-center space-x-6">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isGahoi"
                    value="Yes"
                    checked={formData.isGahoi === "Yes"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        isGahoi: value,
                      }));
                    }}
                    className="form-radio h-4 w-4 text-primary border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes</span>
                </label>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="isGahoi"
                    value="No"
                    checked={formData.isGahoi === "No"}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        isGahoi: value,
                      }));
                    }}
                    className="form-radio h-4 w-4 text-primary border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">No</span>
                </label>
              </div>
            </div>
            {errors.isGahoi && (
              <p className="text-red-500 text-sm">{errors.isGahoi}</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // In the navigation buttons section
  const renderNavigationButtons = () => {
    return (
      <div className="mt-8 flex justify-between items-center">
        <div>
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
          )}
        </div>

        <div className="flex gap-3">
          {currentStep > 0 && currentStep < formSteps.length - 1 && (
            <button
              type="button"
              onClick={handleSkip}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Skip this section
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : currentStep === formSteps.length - 1 ? (
              "Submit"
            ) : (
              "Next"
            )}
          </button>
        </div>
      </div>
    );
  };

  // Inside the RegistrationForm component, add this function after the imports
  const openWhatsAppShare = (mobileNumber) => {
    if (mobileNumber?.length === 10) {
      const message = 'Join our Gahoi community! Register here:';
      const url = window.location.origin + '/register';
      window.open(`https://wa.me/91${mobileNumber}?text=${encodeURIComponent(message + ' ' + url)}`, '_blank');
    }
  };

  // Helper function to get existing panchayats
  const getExistingPanchayats = (district) => {
    try {
      const existingCase = getFilteredLocalPanchayatNames().find(name => 
        name === district
      );
      return existingCase ? [existingCase] : [];
    } catch {
      return [];
    }
  };

  return (
    <div
      className="min-h-screen py-8 px-4 flex items-center justify-center relative"
      style={{
        backgroundImage: 'url("/decorative-bg.jpg")',
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundColor: "#1e293b", 
      }}
    >
      {/* Back to Home Button */}
      <button
        onClick={() => (window.location.href = "/")}
        className="absolute top-4 left-4 bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition-colors duration-200 z-20 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Home
      </button>

      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-800/70"></div>
      <div className="w-full max-w-4xl mx-auto rounded-xl shadow-lg overflow-hidden relative z-10 mt-8 bg-white border border-[#FD7D01]">
        {/* Header */}
        <div className="bg-red-800 text-white p-3">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold mb-2 text-center">
              Registration Form
            </h1>

            {/* Progress Tracker */}
            <div className="w-full bg-gray-200 h-1.5 mt-3 mb-2 rounded-full overflow-hidden">
              <div
                className="bg-white h-1.5 transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="flex justify-between px-2 text-xs">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center ${
                    step.completed ? "text-white" : "text-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mb-1 ${
                      step.completed
                        ? "bg-white text-red-800"
                        : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {step.completed ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-center text-[10px]">{step.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Steps Tabs */}
        <div className="bg-gray-100 border-b">
          <div className="container mx-auto flex flex-wrap">
            {formSteps.map((step, index) => (
              <button
                key={index}
                type="button"
                className={`py-2 px-3 text-xs font-medium border-b-2 ${
                  currentStep === index
                    ? "border-red-700 text-red-700"
                    : index < currentStep
                    ? "border-green-500 text-green-700"
                    : "border-transparent text-gray-500"
                } whitespace-nowrap`}
                onClick={() => index <= currentStep && setCurrentStep(index)}
                disabled={index > currentStep}
              >
                {index + 1}. {step.name}
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="p-4">
          <div className="container mx-auto">
            {currentStep === 0 && (
              <div className="mb-4">
                <PhotoUpload onImageSelect={handleImageSelect} />
              </div>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            {renderNavigationButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;







