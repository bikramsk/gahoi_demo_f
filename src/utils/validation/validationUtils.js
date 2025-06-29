import { REQUIRED_FIELDS, FORM_STEPS } from '../../config/formConfig';
import { STATE_TO_ASSEMBLIES } from '../../constants/formConstants';

// Validate a single field
export const validateField = (name, value) => {
  if (REQUIRED_FIELDS.includes(name) && !value) {
    
    const displayName = name
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/^./, str => str.toUpperCase()) 
      .trim(); 
    return `${displayName} is required`;
  }
  return '';
};

// Validate mobile number
export const validateMobileNumber = (number) => {
  if (!number) return 'Mobile number is required';
  if (number.length !== 10) return 'Mobile number must be 10 digits';
  return '';
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return '';  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return 'Invalid email format';
  return '';
};

// Validate date
export const validateDate = (date, fieldName) => {
  if (!date) return `${fieldName} is required`;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return `Invalid ${fieldName.toLowerCase()}`;
  return '';
};

// Validate marriage date based on marital status
export const validateMarriageDate = (date, isMarried) => {
  if (isMarried === 'Married' && !date) {
    return 'Marriage date is required for married individuals';
  }
  return '';
};

// Validate gotra based on marriage type
export const validateGotra = () => {
  
  return '';
};

// Validate children
export const validateChildren = (children, maxChildren) => {
  if (!Array.isArray(children)) return 'Invalid children data';
  if (children.length > maxChildren) return `Maximum ${maxChildren} children allowed`;
  return '';
};

// Validate siblings
export const validateSiblings = (siblings, maxSiblings) => {
  if (!Array.isArray(siblings)) return 'Invalid siblings data';
  if (siblings.length > maxSiblings) return `Maximum ${maxSiblings} siblings allowed`;
  return '';
};

// Validate nationality
export const validateNationality = (nationality) => {
  if (!nationality) {
    return 'Please select your nationality';
  }
  return '';
};

// Validate family member
export const validateFamilyMember = (member, index) => {
  const errors = {};
  
  // Parent validation (Father and Mother)
  if ((member.relation === 'Father' || member.relation === 'Mother') && !member.name) {
    errors[`familyDetails.${index}.name`] = 'Name is required';
  }
  
  // Child validation - gender required only if name is entered
  if (member.relation === 'Child' && member.name && !member.gender) {
    errors[`familyDetails.${index}.gender`] = 'Gender is required when name is provided';
  }
  
  // Sibling validation - all fields required only if relation is selected
  if (member.relation === 'Sibling' && member.siblingRelation) {
    if (!member.name) errors[`familyDetails.${index}.name`] = 'Name is required';
    if (!member.gender) errors[`familyDetails.${index}.gender`] = 'Gender is required';
    if (!member.age) errors[`familyDetails.${index}.age`] = 'Age is required';
    if (!member.maritalStatus) errors[`familyDetails.${index}.maritalStatus`] = 'Marital status is required';
  }
  
  return errors;
};

// Validate work information fields
export const validateWorkInformation = (workType, employmentType, industrySector, businessSize) => {
  const errors = {};

  if (!workType) {
    errors.workType = 'Work type is required';
    return errors;
  }

  // Validate based on work type
  if (workType === 'Business Owner') {
    if (!industrySector) errors.industrySector = 'Industry sector is required for business owners';
    if (!businessSize) errors.businessSize = 'Business size is required for business owners';
  } else if (workType === 'Professional') {
    if (!industrySector) errors.industrySector = 'Industry sector is required for professionals';
    if (!employmentType) errors.employmentType = 'Employment type is required for professionals';
  }

  return errors;
};

// Update validateStep to include work information validation
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
  if (currentStepFields.includes('workType')) {
    const workErrors = validateWorkInformation(
      formData.workType,
      formData.employmentType,
      formData.industrySector,
      formData.businessSize
    );
    Object.assign(errors, workErrors);
  }

  

  return errors;
}; 