export const cleanAndValidateToken = (token) => {
  if (!token) return null;
  
  try {
    // Remove quotes and whitespace
    const cleanToken = token.replace(/^["'](.+)["']$/, '$1').trim();
    
    // Check basic JWT structure (three parts separated by dots)
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('Invalid token structure');
      return null;
    }
    
    // Try to decode the payload
    const payload = JSON.parse(atob(parts[1]));
    
    // Log token details for debugging
    console.log('Token payload:', {
      id: payload.id,
      mobileNumber: payload.mobileNumber,
      iat: new Date(payload.iat * 1000).toLocaleString(),
      exp: new Date(payload.exp * 1000).toLocaleString()
    });
    
    // Check expiration
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.error('Token expired');
      return null;
    }
    
    return cleanToken;
  } catch (err) {
    console.error('Token validation error:', err);
    return null;
  }
};

export const getAuthHeaders = (token) => {
  const cleanToken = cleanAndValidateToken(token);
  if (!cleanToken) return null;

  return {
    'Authorization': `Bearer ${cleanToken}`,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  };
};

export const storeAuthData = (token, mobileNumber) => {
  try {
    // Clean and validate the token before storing
    const cleanToken = cleanAndValidateToken(token);
    if (!cleanToken) {
      throw new Error('Invalid token');
    }

    // Store both token and mobile number
    localStorage.setItem('jwt', cleanToken);
    localStorage.setItem('verifiedMobile', mobileNumber);

    // Debug log
    console.log('Auth data stored:', {
      tokenPreview: `${cleanToken.substring(0, 20)}...`,
      mobile: mobileNumber
    });

    return true;
  } catch (error) {
    console.error('Error storing auth data:', error);
    return false;
  }
}; 