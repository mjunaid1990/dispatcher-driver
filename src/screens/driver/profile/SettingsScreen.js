import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import api from '../../../api/client';
import { useDriver } from '../../../hooks/useDriver';
import ScreenHeader from '../../../components/ScreenHeader';
import { colors, spacing, borderRadius, typography, elevation } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';

const SettingsScreen = () => {
  const { driver, loading, setDriver } = useDriver();
  const settings = driver?.settings || {};
  const [isOnline, setIsOnline] = useState(driver?.status === 'online');
  const [newOrderAlerts, setNewOrderAlerts] = useState(settings.newOrderAlerts !== false);
  const [statusUpdates, setStatusUpdates] = useState(settings.statusUpdates !== false);
  const [soundEnabled, setSoundEnabled] = useState(settings.soundEnabled !== false);
  const [saving, setSaving] = useState(false);

  const handleToggleOnline = async () => {
    if (!driver) {
      showAlert('Error', 'Driver profile not found');
      return;
    }
    const next = !isOnline;
    setIsOnline(next);
    try {
      const res = await api.put(`/drivers/${driver._id}`, { status: next ? 'online' : 'offline' });
      setDriver(res.data);
    } catch (error) {
      setIsOnline(!next);
      showAlert('Error', error.response?.data?.message || 'Failed to update availability');
    }
  };

  const handleSaveSettings = async () => {
    if (!driver) {
      showAlert('Error', 'Driver profile not found');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/drivers/${driver._id}`, {
        settings: { newOrderAlerts, statusUpdates, soundEnabled },
      });
      setDriver(res.data);
      showAlert('Success', 'Settings saved');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const renderToggleRow = (label, description, value, onChange) => (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {!!description && <Text style={styles.rowDescription}>{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.surfaceElevated, true: colors.mint }}
        thumbColor={colors.textInverse}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Settings" />
      <ScrollView contentContainerStyle={styles.content}>
        {loading && <Text style={styles.hint}>Loading settings...</Text>}

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Availability</Text>
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={styles.rowLabel}>Online Status</Text>
              <Text style={styles.rowDescription}>
                {isOnline ? 'You are available for deliveries' : 'You are offline'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.statusPill, isOnline && styles.statusPillActive]}
              onPress={handleToggleOnline}
            >
              <Text style={[styles.statusPillText, isOnline && styles.statusPillTextActive]}>
                {isOnline ? 'Online' : 'Offline'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Notifications</Text>
          {renderToggleRow(
            'New Order Alerts',
            'Get notified when a new delivery is available',
            newOrderAlerts,
            setNewOrderAlerts
          )}
          {renderToggleRow(
            'Status Updates',
            'Get notified on delivery status changes',
            statusUpdates,
            setStatusUpdates
          )}
          {renderToggleRow(
            'Sound',
            'Play a sound for new notifications',
            soundEnabled,
            setSoundEnabled
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.saveHint}>
            {newOrderAlerts !== (settings.newOrderAlerts !== false) ||
            statusUpdates !== (settings.statusUpdates !== false) ||
            soundEnabled !== (settings.soundEnabled !== false)
              ? 'You have unsaved changes'
              : 'Settings are up to date'}
          </Text>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveSettings} disabled={saving}>
            <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
          </TouchableOpacity>
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
    padding: spacing.lg,
  },
  hint: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.md,
  },
  sectionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowText: {
    flex: 1,
    marginRight: spacing.md,
  },
  rowLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  rowDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  statusPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius['3xl'],
    backgroundColor: colors.surfaceElevated,
  },
  statusPillActive: {
    backgroundColor: colors.mint,
  },
  statusPillText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  statusPillTextActive: {
    color: colors.textInverse,
  },
  footer: {
    marginTop: spacing.sm,
  },
  saveHint: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  saveButton: {
    backgroundColor: colors.mint,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textInverse,
  },
});

export default SettingsScreen;
