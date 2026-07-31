import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/client';
import ScreenHeader from '../../../components/ScreenHeader';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import { colors, spacing, borderRadius, typography, elevation } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';

const CATEGORIES = ['Delivery', 'Payment', 'Account', 'App Issue', 'Other'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

const statusColor = {
  open: colors.warning,
  in_progress: colors.info,
  resolved: colors.success,
};

const SupportScreen = () => {
  const { userInfo } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sending, setSending] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState(PRIORITIES[0]);
  const [message, setMessage] = useState('');

  const loadTickets = useCallback(async () => {
    try {
      const res = await api.get('/tickets', { params: { openedBy: userInfo._id } });
      setTickets(res.data || []);
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTickets();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      showAlert('Error', 'Subject and message are required');
      return;
    }
    setSending(true);
    try {
      await api.post('/tickets', {
        openedBy: userInfo._id,
        subject,
        category,
        priority,
        messages: [{ senderId: userInfo._id, text: message }],
      });
      setSubject('');
      setMessage('');
      setShowForm(false);
      showAlert('Success', 'Ticket submitted. We will get back to you soon.');
      loadTickets();
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setSending(false);
    }
  };

  const renderChipRow = (options, selected, onSelect) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[styles.chip, selected === option && styles.chipActive]}
          onPress={() => onSelect(option)}
        >
          <Text style={[styles.chipText, selected === option && styles.chipTextActive]}>
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderTicket = ({ item }) => {
    const expanded = expandedId === item._id;
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => setExpandedId(expanded ? null : item._id)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.subject}>{item.subject}</Text>
          <Text style={[styles.status, { color: statusColor[item.status] || colors.textSecondary }]}>
            {(item.status || 'open').toUpperCase()}
          </Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{item.category || 'General'}</Text>
          <Text style={styles.meta}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {expanded && (
          <View style={styles.messages}>
            {(item.messages || []).map((msg, index) => (
              <View key={index} style={styles.messageBubble}>
                <Text style={styles.messageText}>{msg.text}</Text>
                <Text style={styles.messageTime}>
                  {new Date(msg.sentAt).toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Help & Support" />
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.mint} />
        </View>
      ) : (
        <FlatList
          data={tickets}
          keyExtractor={(item) => item._id}
          renderItem={renderTicket}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <Text style={styles.empty}>No support tickets yet</Text>
          }
        />
      )}

      {showForm && (
        <ScrollView style={styles.formContainer} keyboardShouldPersistTaps="handled">
          <Text style={styles.formTitle}>New Ticket</Text>
          <FormField label="Subject" value={subject} onChangeText={setSubject} placeholder="How can we help?" />
          <Text style={styles.fieldLabel}>Category</Text>
          {renderChipRow(CATEGORIES, category, setCategory)}
          <Text style={styles.fieldLabel}>Priority</Text>
          {renderChipRow(PRIORITIES, priority, setPriority)}
          <FormField label="Message" value={message} onChangeText={setMessage} placeholder="Describe your issue..." multiline numberOfLines={4} />
          <View style={styles.formActions}>
            <Button variant="outline" size="md" title="Cancel" onPress={() => setShowForm(false)} style={styles.flexBtn} />
            <Button variant="primary" size="md" title={sending ? 'Submitting...' : 'Submit'} onPress={handleSubmit} loading={sending} style={styles.flexBtn} />
          </View>
        </ScrollView>
      )}

      {!showForm && (
        <View style={styles.footer}>
          <Button variant="primary" size="md" title="Open New Ticket" onPress={() => setShowForm(true)} />
        </View>
      )}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  subject: {
    flex: 1,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text,
    marginRight: spacing.sm,
  },
  status: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  meta: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  messages: {
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  messageBubble: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  messageText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  messageTime: {
    fontSize: typography.fontSize.xs,
    color: colors.textTertiary,
  },
  formContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    maxHeight: '60%',
  },
  formTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.lg,
  },
  fieldLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  chipRow: {
    flexGrow: 0,
    marginBottom: spacing.lg,
  },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceElevated,
    marginRight: spacing.sm,
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
  formActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  flexBtn: {
    flex: 1,
  },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surfaceCard,
  },
});

export default SupportScreen;
