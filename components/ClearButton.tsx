import React from 'react';
import { TouchableOpacity, Text, Animated, Alert } from 'react-native';

type Props = {
  visible: boolean;
  onPress: () => void;
};

export default function ClearButton({ visible, onPress }: Props) {
  const opacity = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const handlePress = () => {
    Alert.alert('Clear All', 'Are you sure you want to clear all content?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress,
      },
    ]);
  };

  if (!visible) return null;

  return (
    <Animated.View style={{ opacity }} className={styles.container}>
      <TouchableOpacity className={styles.button} onPress={handlePress}>
        <Text className={styles.icon}>🗑️</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = {
  container: 'absolute bottom-6 right-6',
  button: 'bg-red-500 w-14 h-14 rounded-full items-center justify-center shadow-lg',
  icon: 'text-2xl',
};