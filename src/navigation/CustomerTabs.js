import React from 'react';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NewOrderScreen from '../screens/customer/NewOrderScreen';
import OrdersScreen from '../screens/customer/OrdersScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import { colors, typography } from '../theme/theme';

const Tab = createBottomTabNavigator();

const icons = {
  Home: { active: 'add-circle', inactive: 'add-circle-outline' },
  Orders: { active: 'receipt', inactive: 'receipt-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

const CustomerTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.mint,
      tabBarInactiveTintColor: colors.textTertiary,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarIcon: ({ color, size, focused }) => {
        const icon = icons[route.name];
        return (
          <Ionicons
            name={focused ? icon.active : icon.inactive}
            size={size}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={NewOrderScreen} />
    <Tab.Screen name="Orders" component={OrdersScreen} />
    <Tab.Screen name="Profile" component={CustomerProfileScreen} />
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surfaceCard,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  tabBarLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default CustomerTabs;
