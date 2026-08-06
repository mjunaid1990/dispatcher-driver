import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../config';

const api = axios.create({
  timeout: config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (requestConfig) => {
  requestConfig.baseURL = config.API_URL;
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {}
  return requestConfig;
});

let onUnauthorized = null;

export const setOnUnauthorized = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear auth data
      try {
        await AsyncStorage.multiRemove(['userToken', 'userInfo', 'driverInfo']);
      } catch (e) {
        console.error('Failed to clear auth data:', e);
      }
      if (typeof onUnauthorized === 'function') {
        onUnauthorized();
      }
    }
    return Promise.reject(error);
  }
);

export default api;
