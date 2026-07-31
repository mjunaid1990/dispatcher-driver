import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [driverInfo, setDriverInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token, user, driver) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      if (driver) {
        await AsyncStorage.setItem('driverInfo', JSON.stringify(driver));
      }
      setUserToken(token);
      setUserInfo(user);
      setDriverInfo(driver || null);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
