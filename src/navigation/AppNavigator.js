import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Driver Screens
import DriverTabs from './DriverTabs';
import DeliveryDetailScreen from '../screens/driver/DeliveryDetailScreen';
import DeliveryStatusScreen from '../screens/driver/DeliveryStatusScreen';

// Customer Screens
import CustomerTabs from './CustomerTabs';
import CustomerOrderDetailScreen from '../screens/customer/OrderDetailScreen';
import RateOrderScreen from '../screens/customer/RateOrderScreen';

// Profile Screens
import EditProfileScreen from '../screens/driver/profile/EditProfileScreen';
import VehicleScreen from '../screens/driver/profile/VehicleScreen';
import DocumentsScreen from '../screens/driver/profile/DocumentsScreen';
import NotificationsScreen from '../screens/driver/profile/NotificationsScreen';
import PaymentMethodsScreen from '../screens/driver/profile/PaymentMethodsScreen';
import PerformanceScreen from '../screens/driver/profile/PerformanceScreen';
import SupportScreen from '../screens/driver/profile/SupportScreen';
import SettingsScreen from '../screens/driver/profile/SettingsScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { userToken, userInfo, isLoading, checkAuth } = useAuth();

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
      ) : userInfo?.role === 'customer' ? (
        <>
          <Stack.Screen name="CustomerTabs" component={CustomerTabs} />
          <Stack.Screen name="OrderDetail" component={CustomerOrderDetailScreen} />
          <Stack.Screen name="RateOrder" component={RateOrderScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={DriverTabs} />
          <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
          <Stack.Screen name="DeliveryStatus" component={DeliveryStatusScreen} />
          <Stack.Screen name="ProfileEdit" component={EditProfileScreen} />
          <Stack.Screen name="ProfileVehicle" component={VehicleScreen} />
          <Stack.Screen name="ProfileDocuments" component={DocumentsScreen} />
          <Stack.Screen name="ProfileNotifications" component={NotificationsScreen} />
          <Stack.Screen name="ProfilePayments" component={PaymentMethodsScreen} />
          <Stack.Screen name="ProfilePerformance" component={PerformanceScreen} />
          <Stack.Screen name="ProfileSupport" component={SupportScreen} />
          <Stack.Screen name="ProfileSettings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
