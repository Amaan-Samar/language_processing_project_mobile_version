
import React, { useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  text: string;
  onTextChange: (text: string) => void;
  onClose: () => void;
  multiline?: boolean;
};

export default function EditModal({
  visible,
  title,
  text,
  onTextChange,
  onClose,
  multiline = true,
}: Props) {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      // Set cursor to beginning when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.setNativeProps({
          selection: { start: 0, end: 0 },
        });
      }, 100);
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View className={styles.container}>
        {/* Header */}
        <View className={styles.header}>
          <TouchableOpacity onPress={onClose} className={styles.doneButton}>
            <Text className={styles.doneText}>Done</Text>
          </TouchableOpacity>
          <Text className={styles.title}>Edit {title}</Text>
          <View className={styles.spacer} />
        </View>

        {/* Text Input */}
        <TextInput
          ref={inputRef}
          className={styles.input}
          multiline={multiline}
          value={text}
          onChangeText={onTextChange}
          placeholder={`Enter ${title}...`}
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />
      </View>
    </Modal>
  );
}

const styles = {
  container: 'flex-1 bg-white',
  header: 'flex-row justify-between items-center px-4 py-3 border-b border-gray-200',
  doneButton: 'py-1 px-2',
  doneText: 'text-blue-500 text-base font-medium',
  title: 'text-base font-semibold text-gray-800',
  spacer: 'w-12',
  input: 'flex-1 p-4 text-base text-gray-800',
};