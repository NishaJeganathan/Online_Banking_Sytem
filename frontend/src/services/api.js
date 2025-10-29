import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service for banking operations
export const bankingAPI = {
  // User Authentication
  registerUser: async (bankId, userData) => {
    const response = await api.post(`/api/b1/register/${bankId}`, userData);
    return response.data;
  },

  loginUser: async (bankId, credentials) => {
    const response = await api.post(`/api/b1/${bankId}/login`, credentials);
    return response.data;
  },

  getUserInfo: async (bankId, userId) => {
    const response = await api.get(`/api/b1/${bankId}/me?userId=${userId}`);
    return response.data;
  },

  // Account Management
  getAccountDetails: async (bankId, accNo) => {
    const response = await api.get(`/api/b1/accounts/details/${bankId}/${accNo}`);
    return response.data;
  },

  getTransactionHistory: async (transactionData) => {
    const response = await api.post('/api/b1/accounts/transactions', transactionData);
    return response.data;
  },

  // Transactions
  transferWithinBank: async (transferData) => {
    const response = await api.post('/api/b1/transfer', transferData);
    return response.data;
  },

  transferToOtherBank: async (transferData) => {
    const response = await api.post('/api/b1/transfer/other', transferData);
    return response.data;
  },
};

export default api;
