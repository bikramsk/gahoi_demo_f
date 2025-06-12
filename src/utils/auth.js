// Helper function to store authentication data
export const storeAuthData = (token, mobileNumber) => {
  try {
    // Clean the token before storing (remove quotes if present)
    const cleanToken = token.replace(/^["'](.+)["']$/, '$1').trim();
    
    // Store in localStorage
    localStorage.setItem('jwt', cleanToken);
    localStorage.setItem('verifiedMobile', mobileNumber);
    
    // Log storage success (for debugging)
    console.log('Auth data stored:', {
      tokenLength: cleanToken.length,
      tokenPreview: `${cleanToken.substring(0, 20)}...`,
      mobile: mobileNumber
    });

    return true;
  } catch (error) {
    console.error('Failed to store auth data:', error);
    return false;
  }
};

// Helper function to check authentication state
export const checkAuthState = () => {
  const jwt = localStorage.getItem('jwt');
  const mobile = localStorage.getItem('verifiedMobile');
  
  return { jwt, mobile };
};

// Helper function to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem('jwt');
  localStorage.removeItem('verifiedMobile');
};

// Helper function to validate token format
export const isValidToken = (token) => {
  if (!token) return false;
  
  try {
    const cleanToken = token.replace(/^["'](.+)["']$/, '$1').trim();
    const parts = cleanToken.split('.');
    
    if (parts.length !== 3) return false;
    
    // Verify each part is base64url encoded
    if (!parts.every(part => /^[A-Za-z0-9-_]*$/.test(part))) return false;
    
    return true;
  } catch (error) {
    return false;
  }
};