const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiUrl = (endpoint: string): string => {
  // For local development, use the full API URL
  // For Vercel deployment, it will use the re-routed endpoints
  if (import.meta.env.DEV || !import.meta.env.VITE_API_URL) {
    return `${API_BASE_URL}${endpoint}`;
  }
  // vercel re-routes /api/... to the backend set in vercel.json
  return `${endpoint}`;
};

export default API_BASE_URL;
