import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import api from '../../../api/client';
import { useDriver } from '../../../hooks/useDriver';
import ScreenHeader from '../../../components/ScreenHeader';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import { colors, spacing, borderRadius, typography } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';

const VEHICLE_TYPES = ['bike', 'scooter', 'car', 'van'];

const VehicleScreen = () => {
  const { driver, loading, setDriver } = useDriver();
  const vehicle = driver?.vehicle || {};
  const license = driver?.license || {};
  const [vehicleType, setVehicleType] = useState(vehicle.type || 'car');
  const [plate, setPlate] = useState(vehicle.plate || '');
  const [model, setModel] = useState(vehicle.model || '');
  const [color, setColor] = useState(vehicle.color || '');
  const [licenseNumber, setLicenseNumber] = useState(license.number || '');
  const [expiry, setExpiry] = useState(
    license.expiryAt ? String(license.expiryAt).slice(0, 10) : ''
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!driver) {
      showAlert('Error', 'Driver profile not found');
      return;
    }
    setSaving(true);
    try {
      const res = await api.put(`/drivers/${driver._id}`, {
        vehicle: { type: vehicleType, plate, model, color },
        license: {
          number: licenseNumber,
          expiryAt: expiry ? new Date(expiry).toISOString() : undefined,
        },
      });
      setDriver(res.data);
      showAlert('Success', 'Vehicle information updated');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to update vehicle information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Vehicle Information" />
      <ScrollView contentContainerStyle={styles.content}>
        {loading && <Text style={styles.hint}>Loading vehicle information...</Text>}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Vehicle Type</Text>
          <View style={styles.typeRow}>
            {VEHICLE_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={[styles.typeChip, vehicleType === type && styles.typeChipActive]}
                onPress={() => setVehicleType(type)}
              >
                <Text
                  style={[styles.typeChipText, vehicleType === type && styles.typeChipTextActive]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <FormField label="License Plate" value={plate} onChangeText={setPlate} placeholder="e.g. ABC-1234" autoCapitalize="characters" />
          <FormField label="Model" value={model} onChangeText={setModel} placeholder="e.g. Toyota Corolla" />
          <FormField label="Color" value={color} onChangeText={setColor} placeholder="e.g. Black" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Driver License</Text>
          <FormField label="License Number" value={licenseNumber} onChangeText={setLicenseNumber} placeholder="e.g. DL-123456789" />
          <FormField label="Expiry Date (YYYY-MM-DD)" value={expiry} onChangeText={setExpiry} placeholder="e.g. 2027-06-30" />
        </View>

        <View style={styles.footer}>
          <Button
            variant="primary"
            size="md"
            title={saving ? 'Saving...' : 'Save Vehicle Info'}
            onPress={handleSave}
            loading={saving}
          />
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
  },
  sectionLabel: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  typeChip: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  typeChipActive: {
    backgroundColor: colors.mint,
  },
  typeChipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  typeChipTextActive: {
    color: colors.textInverse,
  },
  footer: {
    marginTop: spacing.sm,
  },
});

export default VehicleScreen;
