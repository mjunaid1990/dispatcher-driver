import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Driver Screens
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DeliveryDetailScreen from '../screens/driver/DeliveryDetailScreen';
import DeliveryStatusScreen from '../screens/driver/DeliveryStatusScreen';
import EarningsScreen from '../screens/driver/EarningsScreen';
import ProfileScreen from '../screens/driver/ProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken, isLoading, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!userToken ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
          <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
          <Stack.Screen name="DeliveryStatus" component={DeliveryStatusScreen} />
          <Stack.Screen name="Earnings" component={EarningsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
