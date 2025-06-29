export const FORM_STEPS = [
  {
    name: "Personal Information",
    fields: ["name", "mobileNumber", "id", "gender", "nationality"],
  },
  {
    name: "Additional Details",
    fields: [
      "bloodGroup",
      "birthDate",
      "marriageDate",
      "education",
      "gotra",
      "aakna",
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
  { 
    name: "Family Information", 
    fields: ["familyDetails"] 
  },
  {
    name: "Work Information",
    fields: [
      "workType",
      "industrySector",
      "businessSize",
      "employmentType"
    ],
  },
  {
    name: "Final Submission",
    fields: ["suggestions"],
  },
];

export const REQUIRED_FIELDS = [
  "name", 
  "mobileNumber", 
  "bloodGroup",
  "birthDate", 
  "education", 
  "gender",
  "nationality",
  "state", 
  "workType"
];

export const INITIAL_FORM_STATE = {
  name: "",
  mobileNumber: "",
  display_picture: null,
  email: "",
  nationality: "",
  bloodGroup: "",
  birthDate: "",
  marriageDate: "",
  education: "",
  currentAddress: "",
  city: "",
  district: "",
  state: "",
  familyDetails: [],
  gotra: "",
  aakna: "",
  industrySector: "",
  businessSize: "",
  workType: "",
  employmentType: "",
  suggestions: "",
  referenceBy: "",
  gender: "",
  isMarried: "Unmarried",
  marriageToAnotherCaste: "Same Caste Marriage",
  regionalAssembly: "",
  localPanchayat: "",
  localPanchayatName: "",
  subLocalPanchayat: "",
}; 