import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/client';
import ScreenHeader from '../../../components/ScreenHeader';
import Button from '../../../components/Button';
import { colors, spacing, borderRadius, typography, elevation } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';

const typeLabel = {
  new_order: 'New Order',
  assignment: 'Delivery Assignment',
  status: 'Status Update',
  earning: 'Earnings',
  payout: 'Payout',
  system: 'System',
};

const NotificationsScreen = () => {
  const { userInfo } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const res = await api.get('/notifications', { params: { userId: userInfo._id } });
      setNotifications(res.data || []);
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const markRead = async (item) => {
    if (item.readAt) return;
    try {
      await api.put(`/notifications/${item._id}`, { readAt: new Date().toISOString() });
      setNotifications((prev) =>
        prev.map((n) => (n._id === item._id ? { ...n, readAt: new Date().toISOString() } : n))
      );
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to update notification');
    }
  };

  const markAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.readAt);
      await Promise.all(
        unread.map((n) => api.put(`/notifications/${n._id}`, { readAt: new Date().toISOString() }))
      );
      setNotifications((prev) =>
        prev.map((n) => (n.readAt ? n : { ...n, readAt: new Date().toISOString() }))
      );
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to mark all as read');
    }
  };

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, !item.readAt && styles.cardUnread]}
      onPress={() => markRead(item)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.title}>
          {typeLabel[item.type] || item.type || 'Notification'}
        </Text>
        <Text style={styles.time}>
          {new Date(item.sentAt || item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.headline}>{item.title}</Text>
      {!!item.body && <Text style={styles.body}>{item.body}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title="Notifications" />
      {unreadCount > 0 && (
        <View style={styles.actions}>
          <Button variant="ghost" size="sm" title="Mark all as read" onPress={markAllRead} />
        </View>
      )}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No notifications</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.base,
  },
  actions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    padding: spacing.lg,
  },
  empty: {
    textAlign: 'center',
    color: colors.textTertiary,
    fontSize: typography.fontSize.base,
    marginTop: spacing['4xl'],
  },
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...elevation.md,
  },
  cardUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.mint,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.mint,
    textTransform: 'uppercase',
  },
  time: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  headline: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default NotificationsScreen;
