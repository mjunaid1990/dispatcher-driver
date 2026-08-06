import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setOnUnauthorized } from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token, user, driverInfo) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      if (driverInfo) {
        await AsyncStorage.setItem('driverInfo', JSON.stringify(driverInfo));
      }
      setUserToken(token);
      setUserInfo(user);
      setDriverInfo(driverInfo || null);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      await AsyncStorage.removeItem('driverInfo');
      setUserToken(null);
      setUserInfo(null);
      setDriverInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthError = async () => {
    await logout();
    // Navigation to login screen would be handled by the consuming component
  };

  useEffect(() => {
    setOnUnauthorized(handleAuthError);
    return () => setOnUnauthorized(null);
  }, []);

  const updateUser = async (user) => {
    setUserInfo(user);
    await AsyncStorage.setItem('userInfo', JSON.stringify(user));
  };

  const updateDriver = async (driver) => {
    setDriverInfo(driver);
    await AsyncStorage.setItem('driverInfo', JSON.stringify(driver));
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userInfo');
      const driver = await AsyncStorage.getItem('driverInfo');
      if (token && user) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
        setDriverInfo(driver ? JSON.parse(driver) : null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userInfo,
        driverInfo,
        isLoading,
        login,
        logout,
        checkAuth,
        updateUser,
        updateDriver,
        handleAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
