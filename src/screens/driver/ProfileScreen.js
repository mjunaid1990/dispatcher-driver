import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import Button from '../../components/Button';

const ProfileScreen = () => {
  const { userInfo, logout } = useAuth();
  const navigation = useNavigation();

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', screen: null },
    { icon: '🚗', label: 'Vehicle Information', screen: null },
    { icon: '📄', label: 'Documents', screen: null },
    { icon: '📍', label: 'Saved Addresses', screen: null },
    { icon: '🔔', label: 'Notifications', screen: null },
    { icon: '💳', label: 'Payment Methods', screen: null },
    { icon: '📊', label: 'Performance', screen: null },
    { icon: '❓', label: 'Help & Support', screen: null },
    { icon: '⚙️', label: 'Settings', screen: null },
  ];

  const handleMenuPress = (item) => {
    Alert.alert('Coming Soon', `${item.label} feature coming soon`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
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
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>4.9</Text>
              <Text style={styles.statusLabel}>Rating</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>156</Text>
              <Text style={styles.statusLabel}>Deliveries</Text>
            </View>
            <View style={styles.statusDivider} />
            <View style={styles.statusItem}>
              <Text style={styles.statusValue}>98%</Text>
              <Text style={styles.statusLabel}>On-Time</Text>
            </View>
          </View>
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
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            variant="destructive"
            size="md"
            title="Logout"
            onPress={handleLogout}
          />
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
    fontSize: typography.fontSize.xl,
    marginRight: spacing.md,
  },
  menuLabel: {
    fontSize: typography.fontSize.base,
    color: colors.text,
  },
  menuArrow: {
    fontSize: typography.fontSize.lg,
    color: colors.textTertiary,
  },
  logoutSection: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
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
