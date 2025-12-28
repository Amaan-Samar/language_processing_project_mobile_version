// import React from 'react';
// import { Text, View } from 'react-native';

// import { EditScreenInfo } from './EditScreenInfo';

// type ScreenContentProps = {
//   title: string;
//   path: string;
//   children?: React.ReactNode;
// };

// export const ScreenContent = ({ title, path, children }: ScreenContentProps) => {
//   return (
//     <View className={styles.container}>
//       <Text className={styles.title}>{title}</Text>
//       <View className={styles.separator} />
//       <EditScreenInfo path={path} />
//       {children}
//     </View>
//   );
// };
// const styles = {
//   container: `items-center flex-1 justify-center bg-white`,
//   separator: `h-[1px] my-7 w-4/5 bg-gray-200`,
//   title: `text-xl font-bold`,
// };



import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

type Props = {
  englishText: string;
  targetText: string;
  language: string;
  onEditEnglish: () => void;
  onEditTarget: () => void;
};

export default function InputArea({
  englishText,
  targetText,
  language,
  onEditEnglish,
  onEditTarget,
}: Props) {
  return (
    <View className={styles.container}>
      {/* English Input */}
      <View className={styles.inputWrapper}>
        <View className={styles.header}>
          <Text className={styles.headerText}>English</Text>
          <TouchableOpacity onPress={onEditEnglish} className={styles.editButton}>
            <Text className={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          className={styles.input}
          multiline
          placeholder="Enter English text..."
          placeholderTextColor="#9CA3AF"
          value={englishText}
          editable={false}
        />
      </View>

      {/* Target Language Input */}
      <View className={styles.inputWrapper}>
        <View className={styles.header}>
          <Text className={styles.headerText}>
            {language.charAt(0).toUpperCase() + language.slice(1)}
          </Text>
          <TouchableOpacity onPress={onEditTarget} className={styles.editButton}>
            <Text className={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          className={styles.input}
          multiline
          placeholder={`Enter ${language} text...`}
          placeholderTextColor="#9CA3AF"
          value={targetText}
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = {
  container: 'bg-white px-4 py-3 border-b border-gray-200',
  inputWrapper: 'mb-3',
  header: 'flex-row justify-between items-center mb-2',
  headerText: 'text-sm font-semibold text-gray-700',
  editButton: 'px-2 py-1',
  editIcon: 'text-lg',
  input: 'border border-gray-300 rounded-lg p-3 min-h-[80px] bg-gray-50 text-gray-800',
};