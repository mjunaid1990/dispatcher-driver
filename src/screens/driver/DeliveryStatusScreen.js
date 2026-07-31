import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, elevation, typography } from '../../theme/theme';
import api from '../../api/client';
import { showAlert } from '../../utils/alerts';
import SignaturePad from '../../components/SignaturePad';
import SignaturePreview from '../../components/SignaturePreview';
import StatusPill from '../../components/StatusPill';
import Button from '../../components/Button';
import Toast from '../../components/Toast';

const DeliveryStatusScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { delivery } = route.params || {};
  const { driverInfo, userInfo } = useAuth();
  const [notes, setNotes] = useState('');
  const [signatureCaptured, setSignatureCaptured] = useState(false);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [signatureStrokes, setSignatureStrokes] = useState([]);
  const [signatureModalVisible, setSignatureModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const signaturePadRef = useRef(null);

  const showToast = (type, message) => {
    setToast({ type, message, key: Date.now() });
  };

  const resolveDriverId = async () => {
    if (driverInfo?._id) return driverInfo._id;
    try {
      const res = await api.get('/drivers', { params: { userId: userInfo?._id } });
      return res.data[0]?._id || null;
    } catch (error) {
      return null;
    }
  };

  const statusOptions = [
    { key: 'picked_up', label: 'Picked Up', color: colors.mint },
    { key: 'in_transit', label: 'In Transit', color: colors.info },
    { key: 'delivered', label: 'Delivered', color: colors.success },
    { key: 'failed', label: 'Failed Delivery', color: colors.error },
  ];

  const handleCaptureSignature = () => {
    setSignatureModalVisible(true);
  };

  const handleConfirmSignature = () => {
    const dataUrl = signaturePadRef.current?.capture();
    if (!dataUrl) {
      showAlert('Error', 'Please draw your signature first');
      return;
    }
    setSignatureUrl(dataUrl);
    setSignatureStrokes(signaturePadRef.current?.getStrokes() || []);
    setSignatureCaptured(true);
    setSignatureModalVisible(false);
  };

  const handleClearSignature = () => {
    signaturePadRef.current?.clear();
  };

  const handleSave = async () => {
    if (!selectedStatus && !signatureCaptured && !notes.trim()) {
      showToast('error', 'Please select a status or capture a signature');
      return;
    }
    if (selectedStatus === 'delivered' && !signatureCaptured) {
      showToast('error', 'Please capture the customer signature first');
      return;
    }
    const orderId = delivery?.order?._id || delivery?.id;
    if (!orderId) {
      showToast('error', 'Order not found');
      return;
    }
    setSaving(true);
    try {
      let driverId = null;
      try {
        driverId = await resolveDriverId();
      } catch (error) {}

      const payload = {};
      if (selectedStatus) {
        payload.status = selectedStatus;
        if (selectedStatus === 'delivered') {
          payload.deliveredAt = new Date().toISOString();
        }
        if (selectedStatus === 'failed') {
          payload.failureReason = notes || 'Delivery failed';
        }
      }
      if (signatureUrl || notes) {
        payload.proofOfDelivery = {
          signatureUrl: signatureUrl || undefined,
          notes,
          capturedAt: new Date().toISOString(),
        };
      }
      await api.put(`/orders/${orderId}`, payload);

      if (driverId && selectedStatus) {
        await api
          .post('/tracking/events', { orderId, driverId, status: selectedStatus, note: notes })
          .catch(() => {});
      }

      showToast('success', selectedStatus ? 'Status updated successfully' : 'Proof of delivery saved');
    } catch (error) {
      showToast('error', error.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Status</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Current Status */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Status</Text>
          <View style={styles.statusCard}>
            <StatusPill status={delivery?.status} size="md" />
          </View>
        </View>

        {/* Status Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Update To</Text>
          <View style={styles.statusOptions}>
            {statusOptions.map((option) => {
              const selected = selectedStatus === option.key;
              return (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.statusOption,
                    { borderLeftColor: option.color },
                    selected && styles.statusOptionSelected,
                  ]}
                  onPress={() => setSelectedStatus(option.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radioOuter, { borderColor: option.color }]}>
                    {selected && (
                      <View style={[styles.radioInner, { backgroundColor: option.color }]} />
                    )}
                  </View>
                  <Text
                    style={[
                      styles.statusOptionLabel,
                      selected && styles.statusOptionLabelSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {selected && <Text style={[styles.radioCheck, { color: option.color }]}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Proof of Delivery */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proof of Delivery</Text>

          <TouchableOpacity
            style={[styles.podCard, signatureCaptured && styles.podCardCompleted]}
            onPress={handleCaptureSignature}
          >
            <View style={styles.podIcon}>
              <Text style={styles.podIconText}>{signatureCaptured ? '✓' : '✍️'}</Text>
            </View>
            <View style={styles.podContent}>
              <Text style={styles.podTitle}>Customer Signature</Text>
              <Text style={styles.podSubtitle}>
                {signatureCaptured ? 'Signature captured' : 'Tap to capture signature'}
              </Text>
            </View>
          </TouchableOpacity>

          {signatureCaptured && signatureStrokes.length > 0 && (
            <View style={styles.signaturePreviewWrap}>
              <Text style={styles.signaturePreviewLabel}>Captured Signature</Text>
              <SignaturePreview strokes={signatureStrokes} />
            </View>
          )}
        </View>

        {/* Notes + Save */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Notes</Text>
          <View style={styles.notesCard}>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about this delivery..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <Button
            variant="primary"
            size="lg"
            title={saving ? 'Saving...' : 'Save'}
            onPress={handleSave}
            loading={saving}
            style={styles.saveButton}
          />
        </View>

        {/* Issue Report */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Issue</Text>
          <TouchableOpacity
            style={styles.issueCard}
            onPress={() => showAlert('Report Issue', 'Issue reporting feature coming soon')}
          >
            <Text style={styles.issueTitle}>Report a Problem</Text>
            <Text style={styles.issueSubtitle}>
              Unable to complete delivery? Report an issue.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={signatureModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSignatureModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Capture Signature</Text>
            <Text style={styles.modalSubtitle}>
              Please ask the customer to sign below
            </Text>
            <SignaturePad ref={signaturePadRef} />
            <View style={styles.modalActions}>
              <Button
                variant="outline"
                size="md"
                title="Clear"
                onPress={handleClearSignature}
                style={styles.modalButton}
              />
              <Button
                variant="secondary"
                size="md"
                title="Cancel"
                onPress={() => setSignatureModalVisible(false)}
                style={styles.modalButton}
              />
              <Button
                variant="primary"
                size="md"
                title="Confirm"
                onPress={handleConfirmSignature}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {toast && <Toast key={toast.key} type={toast.type} message={toast.message} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.surfaceCard,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: typography.fontSize.base,
    color: colors.mint,
    fontWeight: typography.fontWeight.semibold,
  },
  headerTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statusCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.mint,
    ...elevation.md,
  },
  statusOptions: {
    gap: spacing.sm,
  },
  statusOption: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...elevation.md,
  },
  statusOptionSelected: {
    borderWidth: 1,
    borderColor: colors.mint,
    backgroundColor: colors.surfaceElevated,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusOptionLabel: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.text,
  },
  statusOptionLabelSelected: {
    fontWeight: typography.fontWeight.semibold,
  },
  radioCheck: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.bold,
  },
  podCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    ...elevation.md,
  },
  podCardCompleted: {
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  podIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceElevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  podIconText: {
    fontSize: typography.fontSize.xl,
  },
  podContent: {
    flex: 1,
  },
  podTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  podSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
  },
  signaturePreviewWrap: {
    marginTop: spacing.sm,
  },
  signaturePreviewLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  notesCard: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...elevation.md,
  },
  notesInput: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    minHeight: 100,
  },
  saveButton: {
    marginTop: spacing.lg,
  },
  issueCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  issueTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  issueSubtitle: {
    fontSize: typography.fontSize.sm,
    color: 'rgba(239, 68, 68, 0.8)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 27, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius['2xl'],
    padding: spacing['2xl'],
    ...elevation.xl,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSubtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
});

export default DeliveryStatusScreen;
