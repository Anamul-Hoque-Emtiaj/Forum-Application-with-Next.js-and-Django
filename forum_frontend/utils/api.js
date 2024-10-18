// frontend/utils/api.js

import axios from 'axios';

// Server-Side API Instance (Within Docker)
export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://backend:8000/api',
});

// Client-Side API Instance (Browser)
export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL_CLIENT || 'http://localhost:8000/api',
});

export { serverApi, clientApi };
