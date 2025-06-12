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