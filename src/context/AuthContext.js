import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (token, user) => {
    try {
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(user));
      setUserToken(token);
      setUserInfo(user);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
      setUserToken(null);
      setUserInfo(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userInfo');
      if (token && user) {
        setUserToken(token);
        setUserInfo(JSON.parse(user));
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
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
