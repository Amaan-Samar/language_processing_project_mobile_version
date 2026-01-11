import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy,  ClipboardPaste, ChevronRight, ChevronDown, Pencil } from 'lucide-react-native';

type Props = {
  articleTitle: string;
  englishText: string;
  targetText: string;
  language: string;
  expandedSection: {
    title: boolean;
    english: boolean;
    target: boolean;
  };
  onToggleSection: (section: 'title' | 'english' | 'target') => void;
  onEditTitle: () => void;
  onEditEnglish: () => void;
  onEditTarget: () => void;
  onPasteEnglish: (text: string) => void;
  onPasteTarget: (text: string) => void;
};

export default function InputArea({
  articleTitle,
  englishText,
  targetText,
  language,
  expandedSection,
  onToggleSection,
  onEditTitle,
  onEditEnglish,
  onEditTarget,
  onPasteEnglish,
  onPasteTarget,
}: Props) {
  const handlePaste = async (setter: (text: string) => void) => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        setter(text);
      } else {
        Alert.alert('Clipboard Empty', 'No text found in clipboard');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to paste from clipboard');
    }
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert('Copied', `${label} copied to clipboard`);
    } catch (error) {
      Alert.alert('Error', 'Failed to copy to clipboard');
    }
  };

  const renderCollapsibleSection = (
    section: 'title' | 'english' | 'target',
    title: string,
    value: string,
    placeholder: string,
    onEdit: () => void,
    onPaste?: (text: string) => void,
    multiline: boolean = false
  ) => {
    const isExpanded = expandedSection[section]; 
    const hasValue = value.trim().length > 0;

    return (
      <View className="mb-3">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-sm font-semibold text-gray-700">{title}</Text>
          <View className="flex-row items-center gap-2">
            {isExpanded && onPaste && (
              <TouchableOpacity
                onPress={() => handlePaste(onPaste)}
              >
                <Text><ClipboardPaste size={20} color="gray" /></Text>
              </TouchableOpacity>
            )}
            {isExpanded && hasValue && (
              <TouchableOpacity
              onPress={() => handleCopy(value, title)}
              className="px-2 py-1 bg-blue-50 rounded"
              >
              <Text><Copy size={20} color="gray" /></Text>
              </TouchableOpacity>
            )}
            {isExpanded && (
              <TouchableOpacity onPress={onEdit} className="px-2 py-1">
                <Text className="text-lg"><Pencil color="gray" size={20} /> </Text>
                
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onToggleSection(section)}
              className="px-2 py-1"
            >
              {isExpanded ? (
              <ChevronDown size={20} color="#374151" />
              ) : (
                <ChevronRight size={20} color="#374151" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {isExpanded && (
          <TextInput
            className={multiline ? styles.input : styles.titleInput}
            multiline={multiline}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={value}
            editable={false}
            numberOfLines={multiline ? 6 : 1}
          />
        )}

        {!isExpanded && hasValue && (
          <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
            <Text className="text-gray-600 text-sm" numberOfLines={2}>
              {value}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      {renderCollapsibleSection(
        'title',
        'Article Title',
        articleTitle,
        'Enter article title...',
        onEditTitle,
        undefined,
        false
      )}

      {renderCollapsibleSection(
        'english',
        'English',
        englishText,
        'Enter English text...',
        onEditEnglish,
        onPasteEnglish,
        true
      )}

      {renderCollapsibleSection(
        'target',
        language.charAt(0).toUpperCase() + language.slice(1),
        targetText,
        `Enter ${language} text...`,
        onEditTarget,
        onPasteTarget,
        true
      )}
    </View>
  );
}

const styles = {
  titleInput: 'border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800 font-medium',
  input: 'border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-800',
};