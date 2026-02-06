// components/Loader.tsx
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { STRINGS } from '../utils/strings';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from '../utils/themes';

type LoaderProps = {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  showText?: boolean;
  overlay?: boolean;
  fullScreen?: boolean;
};

export default function Loader({
  size = 'large',
  color = COLORS.PRIMARY.main,
  text = STRINGS.COMMON.LOADING,
  showText = true,
  overlay = false,
  fullScreen = false,
}: LoaderProps) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <View style={styles.fullScreenContent}>
          <ActivityIndicator size={size} color={color} />
          {showText && <Text style={styles.fullScreenText}>{text}</Text>}
        </View>
      </View>
    );
  }

  if (overlay) {
    return (
      <View style={styles.overlayContainer}>
        <View style={styles.overlayContent}>
          <ActivityIndicator size={size} color={color} />
          {showText && <Text style={styles.overlayText}>{text}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.inlineContainer}>
      <ActivityIndicator size={size} color={color} />
      {showText && <Text style={styles.inlineText}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKGROUND.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  fullScreenContent: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.BACKGROUND.secondary,
    borderRadius: BORDER_RADIUS.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  fullScreenText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.md,
    color: COLORS.TEXT.secondary,
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.BACKGROUND.modal,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  overlayContent: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.BACKGROUND.secondary,
    borderRadius: BORDER_RADIUS.lg,
    minWidth: 150,
  },
  overlayText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.TEXT.secondary,
  },
  inlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  inlineText: {
    marginLeft: SPACING.sm,
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.TEXT.secondary,
  },
});