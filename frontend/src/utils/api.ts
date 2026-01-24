const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiUrl = (endpoint: string): string => {
  // return `${API_BASE_URL}${endpoint}`;
  // vercel re-routes /api/... to the backend set in vercel.json
  return `${endpoint}`;
};

export default API_BASE_URL;
