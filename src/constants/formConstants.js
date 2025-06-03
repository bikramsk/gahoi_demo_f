export const STATE_TO_ASSEMBLIES = {
  "Madhya Pradesh": [
    "Chambal Regional Assembly",
    "Central Malwa Regional Assembly",
    "Mahakaushal Regional Assembly",
    "Vindhya Regional Assembly",
    "Bundelkhand Regional Assembly",
    "Chaurasi Regional Assembly"
  ],
  "Gujarat": [
    "Chaurasi Regional Assembly"
  ],
  "Uttar Pradesh": [
    "Ganga Jamuna Regional Assembly",
    "Northern Regional Assembly"
  ],
  "Maharashtra": ["Southern Regional Assembly"],
  "Chhattisgarh": ["Chhattisgarh Regional Assembly"],
  "Delhi": ["Northern Regional Assembly"],
  "Rajasthan": ["Chambal Regional Assembly"],
  "Bihar": ["Vindhya Regional Assembly"]
};

export const INDUSTRY_SECTORS = [
  "Agriculture & Allied Activities",
  "Manufacturing",
  "Construction & Real Estate",
  "Trade & Commerce",
  "Transportation & Logistics",
  "Information Technology & Services",
  "Financial Services",
  "Healthcare & Pharmaceuticals",
  "Education & Training",
  "Professional Services",
  "Hospitality & Tourism",
  "Media & Entertainment",
  "Textile & Apparel",
  "Mining & Minerals",
  "Power & Energy",
  "Other Services"
];

export const BUSINESS_SIZES = [
  "Micro Enterprise",
  "Small Enterprise",
  "Medium Enterprise",
  "Large Enterprise",
  "Self Employed/Freelancer",
  "Not Applicable"
];

export const WORK_TYPES = [
  "Business Owner",
  "Professional",
  "Skilled Worker",
  "Government Service",
  "Private Sector Employee",
  "Freelancer/Consultant",
  "Retired",
  "Other"
];


// Business Owner
// Professional
// Skilled Worker
// Government Service
// Private Sector Employee
// Freelancer/Consultant
// Retired
// Other

export const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract/Temporary",
  "Self-employed",
  "Not Currently Employed"
];


// Full-time
// Part-time
// Contract/Temporary
// Self-employed
// Not Currently Employed

export const HANDICAP_OPTIONS = ["None", "Physically", "Mentally", "Other"];
export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export const INITIAL_FAMILY_MEMBERS = [
  { relation: "Father", name: "", mobileNumber: "" },
  { relation: "Mother", name: "", mobileNumber: "" },
  { relation: "Spouse", name: "", mobileNumber: "" },
  { relation: "Sibling", name: "", mobileNumber: "", gender: "", age: "", maritalStatus: "", isDependent: false },
  { relation: "Child", name: "", mobileNumber: "", gender: "" }
];

export const MAX_CHILDREN = 4;
export const MAX_SIBLINGS = 5;
export const MARITAL_STATUS_OPTIONS = ["Married", "Unmarried"];
export const EDUCATION_OPTIONS = ["Primary", "Secondary", "Higher Secondary", "Graduate", "Post Graduate", "Other"];
export const OCCUPATION_OPTIONS = ["Student", "Employed", "Self-Employed", "Business", "Homemaker", "Other"];
export const SIBLING_RELATION_OPTIONS = [
"Sister बहन",
"Brother भाई"
];

export const FORM_STEPS = [
  {
    name: "Personal Information",
    fields: ["name", "mobileNumber", "village", "id", "email", "gender", "isGahoi"],
  },
  {
    name: "Additional Details",
    fields: [
      "bloodGroup",
      "birthDate",
      "marriageDate",
      "education",
      "currentAddress",
      "city",
      "district",
      "state",
      "regionalAssembly",
      "localPanchayatName",
      "localPanchayat",
      "subLocalPanchayat",
    ],
  },
  { name: "Family Information", fields: ["familyDetails"] },
  // {
  //   name: "Biographical Details",
  //   fields: ["manglik", "grah", "handicap", "gotra", "aakna"],
  // },
  {
    name: "Work Information",
    fields: [
      "occupation",
      "companyName",
      "workArea",
      "industrySector",
      "businessSize",
      "workType",
      "employmentType",
      "helpOthers",
      "provideDiscount",
    ],
  },
  {
    name: "Final Submission",
    fields: ["suggestions", "date", "referenceBy", "confirmAccuracy"],
  },
];

export const PROCESS_STEPS = [
  { name: "Login", completed: true },
  { name: "OTP Verification", completed: true },
  { name: "Registration", completed: false },
  { name: "Completion", completed: false },
];

export const INITIAL_FORM_DATA = {
  name: "",
  mobileNumber: "",
  display_picture: null,
  village: "",
  email: "",
  bloodGroup: "",
  birthDate: "",
  marriageDate: "",
  education: "",
  currentAddress: "",
  city: "",
  district: "",
  state: "",
  familyDetails: INITIAL_FAMILY_MEMBERS,
  manglik: "",
  grah: "",
  handicap: "",
  gotra: "",
  aakna: "",
  occupation: "",
  companyName: "",
  workArea: "",
  industrySector: "",
  businessSize: "",
  workType: "",
  employmentType: "",
  helpOthers: null,
  provideDiscount: null,
  suggestions: "",
  referenceBy: "",
  gender: "",
  isMarried: "Unmarried",
  marriageToAnotherCaste: "Same Caste Marriage",
  regionalAssembly: "",
  localPanchayat: "",
  localPanchayatName: "",
  subLocalPanchayat: "",
  isGahoi: "Yes",
  confirmAccuracy: false,
}; 