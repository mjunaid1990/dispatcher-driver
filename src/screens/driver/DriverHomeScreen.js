import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';

const DriverHomeScreen = () => {
  const navigation = useNavigation();
  const { userInfo } = useAuth();
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Mock data - replace with API calls
  useEffect(() => {
    loadDeliveries();
  }, []);

  const loadDeliveries = () => {
    // Mock active deliveries
    setActiveDeliveries([
      {
        id: '1',
        customerName: 'John Doe',
        pickupAddress: '123 Main St, Downtown',
        dropoffAddress: '456 Oak Ave, Suburb',
        status: 'in_transit',
        estimatedTime: '15 min',
        earnings: 12.50,
      },
    ]);

    // Mock available deliveries
    setAvailableDeliveries([
      {
        id: '2',
        customerName: 'Jane Smith',
        pickupAddress: '789 Pine Rd, City Center',
        dropoffAddress: '321 Elm St, Westside',
        distance: '3.2 km',
        earnings: 15.00,
        estimatedTime: '20 min',
      },
      {
        id: '3',
        customerName: 'Bob Johnson',
        pickupAddress: '555 Maple Dr, Northgate',
        dropoffAddress: '888 Cedar Ln, Southpark',
        distance: '5.1 km',
        earnings: 18.50,
        estimatedTime: '25 min',
      },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadDeliveries();
      setRefreshing(false);
    }, 1000);
  };

  const handleAcceptDelivery = (delivery) => {
    Alert.alert(
      'Accept Delivery',
      `Accept delivery for ${delivery.customerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            // TODO: Call API to accept delivery
            Alert.alert('Success', 'Delivery accepted!');
            setAvailableDeliveries(prev => 
              prev.filter(d => d.id !== delivery.id)
            );
            setActiveDeliveries(prev => [
              { ...delivery, status: 'assigned' },
              ...prev,
            ]);
          },
        },
      ]
    );
  };

  const handleDeclineDelivery = (delivery) => {
    Alert.alert(
      'Decline Delivery',
      'Are you sure you want to decline this delivery?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            // TODO: Call API to decline delivery
            setAvailableDeliveries(prev => 
              prev.filter(d => d.id !== delivery.id)
            );
          },
        },
      ]
    );
  };

  const renderActiveDelivery = ({ item }) => (
    <TouchableOpacity
      style={styles.deliveryCard}
      onPress={() => navigation.navigate('DeliveryDetail', { delivery: item })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <StatusPill status={item.status} size="sm" />
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={styles.dot} />
          <Text style={styles.address}>{item.pickupAddress}</Text>
        </View>
        <View style={styles.addressRow}>
          <View style={[styles.dot, styles.dropoffDot]} />
          <Text style={styles.address}>{item.dropoffAddress}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.earnings}>${item.earnings.toFixed(2)}</Text>
        <Text style={styles.eta}>{item.estimatedTime}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAvailableDelivery = ({ item }) => (
    <View style={styles.deliveryCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.distance}>{item.distance}</Text>
      </View>
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <View style={styles.dot} />
          <Text style={styles.address}>{item.pickupAddress}</Text>
        </View>
        <View style={styles.addressRow}>
          <View style={[styles.dot, styles.dropoffDot]} />
          <Text style={styles.address}>{item.dropoffAddress}</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.earnings}>${item.earnings.toFixed(2)}</Text>
        <Text style={styles.eta}>{item.estimatedTime}</Text>
      </View>
      <View style={styles.actionButtons}>
        <Button
          variant="outline"
          size="sm"
          title="Decline"
          onPress={() => handleDeclineDelivery(item)}
          style={styles.declineButton}
        />
        <Button
          variant="primary"
          size="sm"
          title="Accept"
          onPress={() => handleAcceptDelivery(item)}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {userInfo?.name || 'Driver'}</Text>
          <Text style={styles.subtitle}>Ready for deliveries</Text>
        </View>
        <TouchableOpacity
          style={[styles.onlineToggle, isOnline && styles.onlineToggleActive]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <Text style={[styles.onlineToggleText, isOnline && styles.onlineToggleTextActive]}>
            {isOnline ? 'Online' : 'Offline'}
          </Text>
        </TouchableOpacity>
      </View>

      {activeDeliveries.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Delivery</Text>
          <FlatList
            data={activeDeliveries}
            renderItem={renderActiveDelivery}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Available Deliveries ({availableDeliveries.length})
        </Text>
        <FlatList
          data={availableDeliveries}
          renderItem={renderAvailableDelivery}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No available deliveries</Text>
            </View>
          }
        />
      </View>

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navItemTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Earnings')}
        >
          <Text style={styles.navItemText}>Earnings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.navItemText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  onlineToggle: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surfaceElevated,
  },
  onlineToggleActive: {
    backgroundColor: colors.mint,
  },
  onlineToggleText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  onlineToggleTextActive: {
    color: colors.textInverse,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  deliveryCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  customerName: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  distance: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  addressContainer: {
    marginBottom: spacing.md,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.mint,
    marginRight: spacing.md,
    marginTop: 6,
  },
  dropoffDot: {
    backgroundColor: colors.error,
  },
  address: {
    flex: 1,
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  earnings: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
    color: colors.success,
  },
  eta: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  declineButton: {
    flex: 1,
  },
  emptyContainer: {
    padding: spacing['4xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    color: colors.textTertiary,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceCard,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.md,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
  },
  navItemText: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  navItemTextActive: {
    fontSize: typography.fontSize.sm,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default DriverHomeScreen;
