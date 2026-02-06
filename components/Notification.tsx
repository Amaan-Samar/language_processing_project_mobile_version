// components/Notification.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { CheckCircle, XCircle, AlertCircle, X, Info } from 'lucide-react-native';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../utils/themes';
import { STRINGS } from '../utils/strings';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface NotificationProps {
  type: NotificationType;
  message: string;
  duration?: number;
  onClose?: () => void;
  showClose?: boolean;
}

export const Notification: React.FC<NotificationProps> = ({
  type,
  message,
  duration = 3000,
  onClose,
  showClose = true,
}) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width: screenWidth } = Dimensions.get('window');

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto-dismiss
    const timer = setTimeout(() => {
      dismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose?.();
    });
  };

  const getNotificationStyles = () => {
    const styles = {
      success: {
        bg: COLORS.STATE.selected,
        border: COLORS.STATE.success,
        icon: <CheckCircle size={TYPOGRAPHY.sizes.lg} color={COLORS.STATE.success} />,
      },
      error: {
        bg: '#FEF2F2',
        border: COLORS.TEXT.error,
        icon: <XCircle size={TYPOGRAPHY.sizes.lg} color={COLORS.TEXT.error} />,
      },
      warning: {
        bg: '#FFFBEB',
        border: COLORS.TEXT.warning,
        icon: <AlertCircle size={TYPOGRAPHY.sizes.lg} color={COLORS.TEXT.warning} />,
      },
      info: {
        bg: '#EFF6FF',
        border: COLORS.PRIMARY.main,
        icon: <Info size={TYPOGRAPHY.sizes.lg} color={COLORS.PRIMARY.main} />,
      },
    };
    return styles[type];
  };

  const styles = getNotificationStyles();

  return (
    <Animated.View
      style={[
        {
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
          width: screenWidth - SPACING.md * 2,
        },
        localStyles.container,
      ]}
    >
      <View
        style={[
          localStyles.content,
          { backgroundColor: styles.bg, borderLeftColor: styles.border },
        ]}
      >
        <View style={localStyles.messageContainer}>
          <View style={localStyles.iconContainer}>{styles.icon}</View>
          <Text style={localStyles.messageText}>{message}</Text>
        </View>
        {showClose && (
          <TouchableOpacity
            onPress={dismiss}
            style={localStyles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={TYPOGRAPHY.sizes.md} color={COLORS.TEXT.secondary} />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: SPACING.lg,
    alignSelf: 'center',
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    minHeight: 56,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  messageText: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.TEXT.primary,
    flex: 1,
    lineHeight: 20,
  },
  closeButton: {
    marginLeft: SPACING.sm,
    padding: SPACING.xs,
  },
});

export default Notification;