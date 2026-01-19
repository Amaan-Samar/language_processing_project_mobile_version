// import React from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import * as Clipboard from 'expo-clipboard';
// import { Copy, Clipboard as ClipboardIcon, ChevronRight, ChevronDown, Edit2 } from 'lucide-react-native';

// type Props = {
//   articleTitle: string;
//   englishText: string;
//   targetText: string;
//   language: string;
//   expandedSection: {
//     title: boolean;
//     english: boolean;
//     target: boolean;
//   };
//   onToggleSection: (section: 'title' | 'english' | 'target') => void;
//   onEditTitle: () => void;
//   onEditEnglish: () => void;
//   onEditTarget: () => void;
//   onPasteEnglish: (text: string) => void;
//   onPasteTarget: (text: string) => void;
// };

// export default function InputArea({
//   articleTitle,
//   englishText,
//   targetText,
//   language,
//   expandedSection,
//   onToggleSection,
//   onEditTitle,
//   onEditEnglish,
//   onEditTarget,
//   onPasteEnglish,
//   onPasteTarget,
// }: Props) {
//   const handlePaste = async (setter: (text: string) => void) => {
//     try {
//       const text = await Clipboard.getStringAsync();
//       if (text) {
//         setter(text);
//       } else {
//         Alert.alert('Clipboard Empty', 'No text found in clipboard');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to paste from clipboard');
//     }
//   };

//   const handleCopy = async (text: string, label: string) => {
//     try {
//       await Clipboard.setStringAsync(text);
//       Alert.alert('Copied', `${label} copied to clipboard`);
//     } catch (error) {
//       Alert.alert('Error', 'Failed to copy to clipboard');
//     }
//   };

//   const renderCollapsibleSection = (
//     section: 'title' | 'english' | 'target',
//     title: string,
//     value: string,
//     placeholder: string,
//     onEdit: () => void,
//     onPaste?: (text: string) => void,
//     multiline: boolean = false
//   ) => {
//     const isExpanded = expandedSection[section]; 
//     const hasValue = value.trim().length > 0;

//     return (
//       <View className="mb-3">
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-sm font-semibold text-gray-700">{title}</Text>
//           <View className="flex-row items-center gap-2">
//             {isExpanded && onPaste && (
//               <TouchableOpacity
//                 onPress={() => handlePaste(onPaste)}
//                 className="p-1"
//               >
//                 <ClipboardIcon size={20} color="#6B7280" />
//               </TouchableOpacity>
//             )}
//             {isExpanded && hasValue && (
//               <TouchableOpacity
//                 onPress={() => handleCopy(value, title)}
//                 className="p-1"
//               >
//                 <Copy size={20} color="#6B7280" />
//               </TouchableOpacity>
//             )}
//             {isExpanded && (
//               <TouchableOpacity onPress={onEdit} className="p-1">
//                 <Edit2 size={20} color="#6B7280" />
//               </TouchableOpacity>
//             )}
//             <TouchableOpacity
//               onPress={() => onToggleSection(section)}
//               className="p-1"
//             >
//               {isExpanded ? (
//                 <ChevronDown size={20} color="#374151" />
//               ) : (
//                 <ChevronRight size={20} color="#374151" />
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>

//         {isExpanded && (
//           <TextInput
//             className={multiline ? styles.input : styles.titleInput}
//             multiline={multiline}
//             placeholder={placeholder}
//             placeholderTextColor="#9CA3AF"
//             value={value}
//             editable={false}
//             numberOfLines={multiline ? 6 : 1}
//           />
//         )}

//         {!isExpanded && hasValue && (
//           <View className="border border-gray-300 rounded-lg p-3 bg-gray-50">
//             <Text className="text-gray-600 text-sm" numberOfLines={2}>
//               {value}
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   return (
//     <View className="bg-white rounded-lg p-4 mt-4">
//       {renderCollapsibleSection(
//         'title',
//         'Article Title',
//         articleTitle,
//         'Enter article title...',
//         onEditTitle,
//         undefined,
//         false
//       )}

//       {renderCollapsibleSection(
//         'english',
//         'English',
//         englishText,
//         'Enter English text...',
//         onEditEnglish,
//         onPasteEnglish,
//         true
//       )}

//       {renderCollapsibleSection(
//         'target',
//         language.charAt(0).toUpperCase() + language.slice(1),
//         targetText,
//         `Enter ${language} text...`,
//         onEditTarget,
//         onPasteTarget,
//         true
//       )}
//     </View>
//   );
// }

// const styles = {
//   titleInput: 'rounded-lg p-3 bg-gray-50 text-gray-800 font-medium',
//   input: 'rounded-lg p-3 bg-gray-50 text-gray-800',
// };


import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Copy, Clipboard as ClipboardIcon, ChevronRight, ChevronDown, Edit2, CheckCircle2 } from 'lucide-react-native';

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
  // New props for processing feedback
  isProcessing?: boolean;
  processingStats?: {
    hasEnglish: boolean;
    hasTarget: boolean;
    englishParagraphs: number;
    targetParagraphs: number;
    isComplete: boolean;
  };
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
  isProcessing = false,
  processingStats,
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

  const renderProcessingIndicator = () => {
    if (!processingStats) return null;

    const { hasEnglish, hasTarget, englishParagraphs, targetParagraphs, isComplete } = processingStats;

    if (!hasEnglish && !hasTarget) return null;

    return (
      <View className="mt-2 mb-1 px-3 py-2 bg-blue-50 rounded-lg border border-blue-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {isProcessing ? (
              <>
                <ActivityIndicator size="small" color="#3B82F6" />
                <Text className="text-sm text-blue-700 font-medium">
                  Processing article...
                </Text>
              </>
            ) : (
              <>
                <CheckCircle2 size={16} color="#10B981" />
                <Text className="text-sm text-green-700 font-medium">
                  Article ready
                </Text>
              </>
            )}
          </View>
          
          <View className="flex-row items-center gap-3">
            {hasEnglish && (
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-gray-600">EN:</Text>
                <Text className="text-xs font-semibold text-gray-700">{englishParagraphs}</Text>
              </View>
            )}
            {hasTarget && (
              <View className="flex-row items-center gap-1">
                <Text className="text-xs text-gray-600">{language.slice(0, 2).toUpperCase()}:</Text>
                <Text className="text-xs font-semibold text-gray-700">{targetParagraphs}</Text>
              </View>
            )}
          </View>
        </View>
        
        {!isComplete && (
          <Text className="text-xs text-gray-600 mt-1">
            {!hasEnglish ? 'Add English text to complete' : 'Add translation to complete'}
          </Text>
        )}
      </View>
    );
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
                className="p-1"
              >
                <ClipboardIcon size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
            {isExpanded && hasValue && (
              <TouchableOpacity
                onPress={() => handleCopy(value, title)}
                className="p-1"
              >
                <Copy size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
            {isExpanded && (
              <TouchableOpacity onPress={onEdit} className="p-1">
                <Edit2 size={20} color="#6B7280" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => onToggleSection(section)}
              className="p-1"
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
    <View className="bg-white rounded-lg p-4 mt-4">
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

      {/* Processing indicator */}
      {renderProcessingIndicator()}
    </View>
  );
}

const styles = {
  titleInput: 'rounded-lg p-3 bg-gray-50 text-gray-800 font-medium',
  input: 'rounded-lg p-3 bg-gray-50 text-gray-800',
};