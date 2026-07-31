import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import Button from '../../components/Button';
import { useDriver } from '../../hooks/useDriver';
import { formatCurrency } from '../../utils/currency';

const ProfileScreen = () => {
  const { userInfo } = useAuth();
  const { driver, loading } = useDriver();
  const navigation = useNavigation();

  const menuItems = [
    { icon: 'person-circle-outline', label: 'Edit Profile', screen: 'ProfileEdit' },
    { icon: 'car-outline', label: 'Vehicle Information', screen: 'ProfileVehicle' },
    { icon: 'document-text-outline', label: 'Documents', screen: 'ProfileDocuments' },
    { icon: 'notifications-outline', label: 'Notifications', screen: 'ProfileNotifications' },
    { icon: 'card-outline', label: 'Payment Methods', screen: 'ProfilePayments' },
    { icon: 'stats-chart-outline', label: 'Performance', screen: 'ProfilePerformance' },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: 'ProfileSupport' },
    { icon: 'settings-outline', label: 'Settings', screen: 'ProfileSettings' },
  ];

  const handleMenuPress = (item) => {
    if (item.screen) {
      navigation.navigate(item.screen);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo?.name?.charAt(0).toUpperCase() || 'D'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo?.name || 'Driver Name'}</Text>
            <Text style={styles.profileEmail}>{userInfo?.email || 'driver@example.com'}</Text>
            <Text style={styles.profilePhone}>{userInfo?.phone || '+1234567890'}</Text>
          </View>
          <Button
            variant="secondary"
            size="sm"
            title="Edit"
            onPress={() => handleMenuPress(menuItems[0])}
          />
        </View>

        {/* Driver Status */}
        <View style={styles.statusCard}>
          {loading ? (
            <Text style={styles.statusLoading}>Loading...</Text>
          ) : (
            <View style={styles.statusRow}>
              <View style={styles.statusItem}>
                <Text style={styles.statusValue}>
                  {driver?.rating ? Number(driver.rating).toFixed(1) : '0.0'}
                </Text>
                <Text style={styles.statusLabel}>Rating</Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusItem}>
                <Text style={styles.statusValue}>{driver?.totalDeliveries ?? 0}</Text>
                <Text style={styles.statusLabel}>Deliveries</Text>
              </View>
              <View style={styles.statusDivider} />
              <View style={styles.statusItem}>
                <Text style={styles.statusValue}>
                  {formatCurrency(driver?.earningsBalance ?? 0)}
                </Text>
                <Text style={styles.statusLabel}>Balance</Text>
              </View>
            </View>
          )}
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon} size={20} color={colors.textSecondary} style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Dispatcher Driver App v1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: spacing['2xl'],
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  profileCard: {
    margin: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    flexDirection: 'row',
    alignItems: 'center',
    ...elevation.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mint,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  profileEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  profilePhone: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  statusCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    ...elevation.md,
  },
  statusLoading: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.fontSize.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
  },
  statusValue: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  statusLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
  },
  statusDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  menuSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    ...elevation.md,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  versionSection: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  versionText: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
});

export default ProfileScreen;
