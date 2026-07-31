import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, typography, elevation } from '../../theme/theme';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import api from '../../api/client';
import { showAlert, confirmAction } from '../../utils/alerts';

const CustomerProfileScreen = () => {
  const { userInfo, updateUser, logout } = useAuth();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      showAlert('Error', 'Name and email are required');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/users/${userInfo._id}`, { name, email, phone });
      await updateUser(res.data);
      showAlert('Success', 'Profile updated successfully');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    confirmAction('Logout', 'Are you sure you want to logout?', () => logout(), {
      confirmText: 'Logout',
      destructive: true,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInfo?.name?.charAt(0).toUpperCase() || 'C'}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userInfo?.name || 'Customer'}</Text>
            <Text style={styles.profileEmail}>{userInfo?.email || ''}</Text>
            <Text style={styles.profilePhone}>{userInfo?.phone || ''}</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <FormField
            label="Full Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />
          <FormField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
          />
          <FormField
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          <Button
            variant="primary"
            size="md"
            title={saving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={saving}
          />
        </View>

        <Button variant="destructive" size="md" title="Logout" onPress={handleLogout} />

        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Dispatcher App v1.0.0</Text>
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
    flexGrow: 1,
    paddingBottom: spacing['4xl'],
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
  formCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
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

export default CustomerProfileScreen;
