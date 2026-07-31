import { useState } from 'react';
import { View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../api/client';
import ScreenHeader from '../../../components/ScreenHeader';
import FormField from '../../../components/FormField';
import Button from '../../../components/Button';
import { colors, spacing, borderRadius } from '../../../theme/theme';
import { showAlert } from '../../../utils/alerts';

const EditProfileScreen = () => {
  const { userInfo, updateUser } = useAuth();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [phone, setPhone] = useState(userInfo?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      showAlert('Error', 'Name and email are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.put(`/users/${userInfo._id}`, { name, email, phone });
      await updateUser(res.data);
      showAlert('Success', 'Profile updated successfully');
    } catch (error) {
      showAlert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScreenHeader title="Edit Profile" />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
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
            title={loading ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            loading={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  card: {
    backgroundColor: colors.surfaceCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
});

export default EditProfileScreen;
