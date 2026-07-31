import { Platform } from 'react-native';

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
const envTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT;
const envCurrencyCode = process.env.EXPO_PUBLIC_CURRENCY_CODE;
const envCurrencySymbol = process.env.EXPO_PUBLIC_CURRENCY_SYMBOL;

const DEFAULT_API_URL = 'http://localhost:3000/api';
const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_CURRENCY_SYMBOL = '$';

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
export const CURRENCY_CODE = (envCurrencyCode || DEFAULT_CURRENCY_CODE).toUpperCase().slice(0, 3);
export const CURRENCY_SYMBOL = envCurrencySymbol || DEFAULT_CURRENCY_SYMBOL;

export default { API_URL, API_TIMEOUT, SOCKET_URL, CURRENCY_CODE, CURRENCY_SYMBOL };
