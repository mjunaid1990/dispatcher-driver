import { Platform } from 'react-native';

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
const envTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT;

const DEFAULT_API_URL = 'http://localhost:3000/api';

const getApiUrl = () => {
  if (envApiUrl) return envApiUrl;
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:3000/api',
      default: 'http://localhost:3000/api',
    });
  }
  return DEFAULT_API_URL;
};

export const API_URL = getApiUrl().replace(/\/+$/, '');
export const API_TIMEOUT = parseInt(envTimeout, 10) || 30000;
export const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

export default { API_URL, API_TIMEOUT, SOCKET_URL };
