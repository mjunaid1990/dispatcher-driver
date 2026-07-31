import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, borderRadius, typography, elevation } from '../../theme/theme';
import ScreenHeader from '../../components/ScreenHeader';
import FormField from '../../components/FormField';
import Button from '../../components/Button';
import api from '../../api/client';
import { showAlert } from '../../utils/alerts';

const RateOrderScreen = ({ route }) => {
  const { userInfo } = useAuth();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState(null);
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch (error) {
        showAlert('Error', 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };
    loadOrder();
  }, [orderId]);

  const getDriver = () => {
    const driver = order?.assignedDriverId;
    if (driver && typeof driver === 'object' && driver.userId && typeof driver.userId === 'object') {
      return { name: driver.userId.name || 'Driver', userId: driver.userId._id };
    }
    return null;
  };

  const handleSubmit = async () => {
    if (stars === 0) {
      showAlert('Error', 'Select a star rating');
      return;
    }
    const driver = getDriver();
    if (!driver) {
      showAlert('Error', 'No driver to rate');
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/ratings', {
        orderId,
        raterId: userInfo._id,
        rateeId: driver.userId,
        role: 'driver',
        stars,
        comment: comment.trim() || undefined,
      });
      showAlert('Success', 'Thanks for your feedback!');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.mint} />
      </View>
    );
  }

  const driver = getDriver();

  return (
    <View style={styles.container}>
      <ScreenHeader title="Rate Driver" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.driverName}>{driver?.name || 'Your Driver'}</Text>
          <Text style={styles.hint}>How was your delivery experience?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setStars(n)} activeOpacity={0.8}>
                <Ionicons
                  name={n <= stars ? 'star' : 'star-outline'}
                  size={36}
                  color={n <= stars ? colors.warning : colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>

          <FormField
            label="Leave a comment (optional)"
            value={comment}
            onChangeText={setComment}
            placeholder="Share your feedback about the delivery..."
            multiline
            numberOfLines={4}
          />

          <Button
            variant="primary"
            size="lg"
            title={submitting ? 'Submitting...' : 'Submit Rating'}
            onPress={handleSubmit}
            loading={submitting}
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.base,
  },
  content: {
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    ...elevation.md,
  },
  driverName: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    textAlign: 'center',
  },
  hint: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing['3xl'],
  },
});

export default RateOrderScreen;
