import { Platform } from 'react-native';
import { applyBrandColors } from '../theme/theme';

const DEFAULT_API_URL = 'http://localhost:3000/api';
const DEFAULT_CURRENCY_CODE = 'USD';
const DEFAULT_CURRENCY_SYMBOL = '$';
const DEFAULT_BASE_FEES = { small: 5, medium: 8, large: 12 };

const env = (key, fallback) => {
  const value = process.env[key];
  return value === undefined || value === null || value === '' ? fallback : value;
};

const stripTrailingSlashes = (value) => String(value || '').replace(/\/+$/, '');

// Derive every URL the app needs from a single client server URL.
const deriveUrls = (serverUrl) => {
  const base = stripTrailingSlashes(serverUrl).replace(/\/api\/?$/, '');
  return {
    API_URL: `${base}/api`,
    LARAVEL_URL: base,
    UPLOAD_URL: `${base}/api/upload`,
    SOCKET_URL: base,
  };
};

const getApiUrl = () => {
  const envApiUrl = env('EXPO_PUBLIC_API_URL', '');
  if (envApiUrl) return envApiUrl;
  if (__DEV__) {
    return Platform.select({
      android: 'http://10.0.2.2:3000/api',
      default: 'http://localhost:3000/api',
    });
  }
  return DEFAULT_API_URL;
};

const initialState = () => {
  const apiUrl = getApiUrl();
  const urls = deriveUrls(apiUrl);

  return {
    ...urls,
    API_TIMEOUT: parseInt(env('EXPO_PUBLIC_API_TIMEOUT', '30000'), 10) || 30000,
    CURRENCY_CODE: (env('EXPO_PUBLIC_CURRENCY_CODE', DEFAULT_CURRENCY_CODE) || DEFAULT_CURRENCY_CODE).toUpperCase().slice(0, 3),
    CURRENCY_SYMBOL: env('EXPO_PUBLIC_CURRENCY_SYMBOL', DEFAULT_CURRENCY_SYMBOL) || DEFAULT_CURRENCY_SYMBOL,
    BASE_FEES: {
      small: parseFloat(env('EXPO_PUBLIC_BASE_FEE_SMALL', DEFAULT_BASE_FEES.small)) || DEFAULT_BASE_FEES.small,
      medium: parseFloat(env('EXPO_PUBLIC_BASE_FEE_MEDIUM', DEFAULT_BASE_FEES.medium)) || DEFAULT_BASE_FEES.medium,
      large: parseFloat(env('EXPO_PUBLIC_BASE_FEE_LARGE', DEFAULT_BASE_FEES.large)) || DEFAULT_BASE_FEES.large,
    },
    APP_NAME: env('EXPO_PUBLIC_APP_NAME', 'Dispatcher Driver App'),
    PRIMARY_COLOR: env('EXPO_PUBLIC_PRIMARY_COLOR', '#2dd4a8'),
    SECONDARY_COLOR: env('EXPO_PUBLIC_SECONDARY_COLOR', '#0d1b2a'),
  };
};

export const config = initialState();

export const loadConfig = async () => {
  // Configuration is now loaded from environment variables only
  // Apply brand colors based on config values
  if (config.PRIMARY_COLOR || config.SECONDARY_COLOR) {
    applyBrandColors(config.PRIMARY_COLOR, config.SECONDARY_COLOR);
  }
  return config;
};

export default config;
