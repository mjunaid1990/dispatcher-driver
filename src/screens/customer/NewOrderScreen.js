import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography, elevation } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import api from '../../api/client';
import { showAlert } from '../../utils/alerts';

const SIZES = ['small', 'medium', 'large'];
const PRIORITIES = ['normal', 'express'];

const baseFeeBySize = { small: 5, medium: 8, large: 12 };

const NewOrderScreen = () => {
  const { userInfo } = useAuth();
  const navigation = useNavigation();

  const [pickup, setPickup] = useState({ line: '', contactName: '', contactPhone: '', lat: '', lng: '' });
  const [dropoff, setDropoff] = useState({ line: '', contactName: '', contactPhone: '', lat: '', lng: '' });
  const [items, setItems] = useState([{ name: '', qty: '1' }]);
  const [packageSize, setPackageSize] = useState('medium');
  const [priority, setPriority] = useState('normal');
  const [codAmount, setCodAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setPickupField = (key, value) => setPickup((prev) => ({ ...prev, [key]: value }));
  const setDropoffField = (key, value) => setDropoff((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setPickup({ line: '', contactName: '', contactPhone: '', lat: '', lng: '' });
    setDropoff({ line: '', contactName: '', contactPhone: '', lat: '', lng: '' });
    setItems([{ name: '', qty: '1' }]);
    setPackageSize('medium');
    setPriority('normal');
    setCodAmount('');
  };

  const updateItem = (index, key, value) =>
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)));

  const addItem = () => setItems((prev) => [...prev, { name: '', qty: '1' }]);
  const removeItem = (index) => setItems((prev) => prev.filter((_, i) => i !== index));

  const estimateTotal = () => {
    const base = baseFeeBySize[packageSize] || 8;
    const itemFee = items.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 0) * 2, 0);
    const cod = parseFloat(codAmount) || 0;
    return base + itemFee + cod;
  };

  const parseCoords = (lat, lng) => {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    return {
      lat: Number.isNaN(parsedLat) ? 31.5204 : parsedLat,
      lng: Number.isNaN(parsedLng) ? 74.3436 : parsedLng,
    };
  };

  const handleSubmit = async () => {
    const cleanItems = items.filter((item) => item.name.trim());
    if (!pickup.line.trim() || !dropoff.line.trim()) {
      showAlert('Error', 'Pickup and drop-off addresses are required');
      return;
    }
    if (!pickup.contactName.trim() || !dropoff.contactName.trim()) {
      showAlert('Error', 'Contact names are required for pickup and drop-off');
      return;
    }
    if (cleanItems.length === 0) {
      showAlert('Error', 'Add at least one item');
      return;
    }
    if (codAmount && Number.isNaN(parseFloat(codAmount))) {
      showAlert('Error', 'Cash on delivery must be a number');
      return;
    }

    const pickupCoords = parseCoords(pickup.lat, pickup.lng);
    const dropoffCoords = parseCoords(dropoff.lat, dropoff.lng);

    setSubmitting(true);
    try {
      const payload = {
        orderNumber: `ORD-${Date.now()}`,
        customerId: userInfo._id,
        pickup: {
          line: pickup.line.trim(),
          contactName: pickup.contactName.trim(),
          contactPhone: pickup.contactPhone.trim(),
          location: { type: 'Point', coordinates: [pickupCoords.lng, pickupCoords.lat] },
        },
        dropoff: {
          line: dropoff.line.trim(),
          contactName: dropoff.contactName.trim(),
          contactPhone: dropoff.contactPhone.trim(),
          location: { type: 'Point', coordinates: [dropoffCoords.lng, dropoffCoords.lat] },
        },
        items: cleanItems.map((item) => ({ name: item.name.trim(), qty: parseInt(item.qty, 10) || 1 })),
        packageSize,
        codAmount: parseFloat(codAmount) || 0,
        priority,
        pricing: {
          base: baseFeeBySize[packageSize],
          distanceFee: 0,
          surge: priority === 'express' ? 2 : 0,
          tip: 0,
          total: estimateTotal(),
          currency: 'USD',
        },
        status: 'pending',
      };
      const res = await api.post('/orders', payload);
      resetForm();
      showAlert('Success', `Order ${res.data.orderNumber} placed successfully`);
      navigation.navigate('OrderDetail', { orderId: res.data._id });
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  const renderChips = (options, selected, onSelect) => (
    <View style={styles.chipRow}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.chip, selected === option && styles.chipActive]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.chipText, selected === option && styles.chipTextActive]}>
            {option.replace('_', ' ').toUpperCase()}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="New Order" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pickup</Text>
          <FormField label="Address" value={pickup.line} onChangeText={(v) => setPickupField('line', v)} placeholder="e.g. 45 Mall Road, Lahore" />
          <FormField label="Contact Name" value={pickup.contactName} onChangeText={(v) => setPickupField('contactName', v)} placeholder="Who should the driver meet?" />
          <FormField label="Contact Phone" value={pickup.contactPhone} onChangeText={(v) => setPickupField('contactPhone', v)} placeholder="e.g. +1-555-0103" keyboardType="phone-pad" />
          <View style={styles.coordRow}>
            <View style={styles.coordField}>
              <FormField label="Latitude" value={pickup.lat} onChangeText={(v) => setPickupField('lat', v)} placeholder="optional" keyboardType="numeric" />
            </View>
            <View style={styles.coordField}>
              <FormField label="Longitude" value={pickup.lng} onChangeText={(v) => setPickupField('lng', v)} placeholder="optional" keyboardType="numeric" />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Drop-off</Text>
          <FormField label="Address" value={dropoff.line} onChangeText={(v) => setDropoffField('line', v)} placeholder="e.g. 12-A Canal Road, Lahore" />
          <FormField label="Contact Name" value={dropoff.contactName} onChangeText={(v) => setDropoffField('contactName', v)} placeholder="Who is receiving the package?" />
          <FormField label="Contact Phone" value={dropoff.contactPhone} onChangeText={(v) => setDropoffField('contactPhone', v)} placeholder="e.g. +1-555-0104" keyboardType="phone-pad" />
          <View style={styles.coordRow}>
            <View style={styles.coordField}>
              <FormField label="Latitude" value={dropoff.lat} onChangeText={(v) => setDropoffField('lat', v)} placeholder="optional" keyboardType="numeric" />
            </View>
            <View style={styles.coordField}>
              <FormField label="Longitude" value={dropoff.lng} onChangeText={(v) => setDropoffField('lng', v)} placeholder="optional" keyboardType="numeric" />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemName}>
                <FormField
                  label={index === 0 ? 'Item Name' : `Item ${index + 1}`}
                  value={item.name}
                  onChangeText={(v) => updateItem(index, 'name', v)}
                  placeholder="e.g. Document"
                />
              </View>
              <View style={styles.itemQty}>
                <FormField
                  label="Qty"
                  value={item.qty}
                  onChangeText={(v) => updateItem(index, 'qty', v)}
                  keyboardType="numeric"
                />
              </View>
              {items.length > 1 && (
                <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeItem}>
                  <Text style={styles.removeItemText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <Button variant="ghost" size="sm" title="+ Add Item" onPress={addItem} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Package Size</Text>
          {renderChips(SIZES, packageSize, setPackageSize)}

          <Text style={[styles.cardTitle, styles.sectionGap]}>Priority</Text>
          {renderChips(PRIORITIES, priority, setPriority)}

          <FormField
            label="Cash on Delivery Amount (optional)"
            value={codAmount}
            onChangeText={setCodAmount}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>

        <View style={styles.estimateCard}>
          <Text style={styles.estimateLabel}>Estimated Total</Text>
          <Text style={styles.estimateValue}>${estimateTotal().toFixed(2)}</Text>
          <Text style={styles.estimateHint}>
            Base + item fees{priority === 'express' ? ' + express surge' : ''} + COD
          </Text>
        </View>

        <Button
          variant="primary"
          size="lg"
          title={submitting ? 'Placing Order...' : 'Place Order'}
          onPress={handleSubmit}
          loading={submitting}
          style={styles.submit}
        />
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  flex: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing['6xl'],
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    ...elevation.md,
  },
  cardTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  sectionGap: {
    marginTop: spacing.lg,
  },
  coordRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  coordField: {
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.md,
  },
  itemName: {
    flex: 1,
  },
  itemQty: {
    width: 64,
  },
  removeItem: {
    marginBottom: spacing.lg,
  },
  removeItemText: {
    fontSize: typography.fontSize.sm,
    color: colors.error,
    fontWeight: typography.fontWeight.semibold,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.mint,
  },
  chipText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.textInverse,
  },
  estimateCard: {
    backgroundColor: colors.mint,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...elevation.glow,
  },
  estimateLabel: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(13, 27, 42, 0.8)',
    marginBottom: spacing.sm,
  },
  estimateValue: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.textInverse,
    marginBottom: spacing.xs,
  },
  estimateHint: {
    fontSize: typography.fontSize.xs,
    color: 'rgba(13, 27, 42, 0.8)',
    textAlign: 'center',
  },
  submit: {
    marginBottom: spacing['4xl'],
  },
});

export default NewOrderScreen;
