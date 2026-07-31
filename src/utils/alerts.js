import { Alert, Platform } from 'react-native';

export const showAlert = (title, message = '') => {
  if (Platform.OS === 'web') {
    window.alert(message ? `${title}\n\n${message}` : title);
    return;
  }
  Alert.alert(title, message);
};

export const confirmAction = (title, message, onConfirm, options = {}) => {
  const { cancelText = 'Cancel', confirmText = 'OK', destructive = false } = options;
  if (Platform.OS === 'web') {
    const ok = window.confirm(`${title}\n\n${message}`);
    if (ok) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: 'cancel' },
    { text: confirmText, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
};
