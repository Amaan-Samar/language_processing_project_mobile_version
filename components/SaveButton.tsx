import React from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function SaveButton({ onPress }: Props) {
  return (
    <Animated.View className={styles.container}>
      <TouchableOpacity className={styles.button} onPress={onPress}>
        <Text className={styles.icon}>💾</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = {
  container: 'absolute bottom-24 right-6',
  button: 'bg-green-500 w-14 h-14 rounded-full items-center justify-center shadow-lg',
  icon: 'text-2xl',
};