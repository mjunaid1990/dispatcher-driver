import { Platform } from 'react-native';

const envApiUrl = process.env.EXPO_PUBLIC_API_URL;
const envTimeout = process.env.EXPO_PUBLIC_API_TIMEOUT;
const envCurrencyCode = process.env.EXPO_PUBLIC_CURRENCY_CODE;
const envCurrencySymbol = process.env.EXPO_PUBLIC_CURRENCY_SYMBOL;
const envBaseFeeSmall = process.env.EXPO_PUBLIC_BASE_FEE_SMALL;
const envBaseFeeMedium = process.env.EXPO_PUBLIC_BASE_FEE_MEDIUM;
const envBaseFeeLarge = process.env.EXPO_PUBLIC_BASE_FEE_LARGE;

const DEFAULT_API_URL = 'http://localhost:3000/api';
const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_CURRENCY_SYMBOL = '$';
const DEFAULT_BASE_FEES = { small: 5, medium: 8, large: 12 };

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
export const BASE_FEES = {
  small: parseFloat(envBaseFeeSmall) || DEFAULT_BASE_FEES.small,
  medium: parseFloat(envBaseFeeMedium) || DEFAULT_BASE_FEES.medium,
  large: parseFloat(envBaseFeeLarge) || DEFAULT_BASE_FEES.large,
};

export default {
  API_URL,
  API_TIMEOUT,
  SOCKET_URL,
  CURRENCY_CODE,
  CURRENCY_SYMBOL,
  BASE_FEES,
};
