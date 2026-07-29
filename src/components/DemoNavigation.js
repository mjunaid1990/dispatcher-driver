import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from './Button';
import { colors, spacing } from '../theme/theme';

const DemoNavigation = () => {
  const navigation = useNavigation();

  const screens = [
    { name: 'Login', route: 'Login' },
    { name: 'Signup', route: 'Signup' },
    { name: 'Driver Home', route: 'DriverHome' },
    { name: 'Earnings', route: 'Earnings' },
    { name: 'Profile', route: 'Profile' },
    { name: 'Delivery Detail', route: 'DeliveryDetail', params: { delivery: {
      id: '1',
      customerName: 'John Doe',
      pickupAddress: '123 Main St, Downtown',
      dropoffAddress: '456 Oak Ave, Suburb',
      status: 'in_transit',
      estimatedTime: '15 min',
      earnings: 12.50,
    }}},
    { name: 'Delivery Status', route: 'DeliveryStatus', params: { delivery: {
      id: '1',
      customerName: 'John Doe',
      pickupAddress: '123 Main St, Downtown',
      dropoffAddress: '456 Oak Ave, Suburb',
      status: 'in_transit',
      estimatedTime: '15 min',
      earnings: 12.50,
    }}},
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="outline"
          size="sm"
          title="📱 Demo Navigation"
          onPress={() => {}}
        />
      </View>
      <ScrollView style={styles.scroll} horizontal showsHorizontalScrollIndicator={false}>
        {screens.map((screen) => (
          <Button
            key={screen.route}
            variant="secondary"
            size="sm"
            title={screen.name}
            onPress={() => navigation.navigate(screen.route, screen.params)}
            style={styles.navButton}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  scroll: {
    paddingHorizontal: spacing.lg,
  },
  navButton: {
    marginRight: spacing.sm,
  },
});

export default DemoNavigation;
