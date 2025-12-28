// import { SafeAreaView } from 'react-native';

// export const Container = ({ children }: { children: React.ReactNode }) => {
//   return <SafeAreaView className={styles.container}>{children}</SafeAreaView>;
// };

// const styles = {
//   container: 'flex flex-1 m-6',
// };


import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
};

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: Props) {
  const languages = [
    { id: 'chinese', label: 'Chinese' },
    { id: 'spanish', label: 'Spanish' },
    { id: 'french', label: 'French' },
    { id: 'german', label: 'German' },
  ];

  return (
    <View className={styles.container}>
      <Text className={styles.label}>Select Language</Text>
      <View className={styles.buttonsContainer}>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            className={`${styles.button} ${
              selectedLanguage === lang.id ? styles.buttonActive : styles.buttonInactive
            }`}
            onPress={() => onLanguageChange(lang.id)}
          >
            <Text
              className={
                selectedLanguage === lang.id ? styles.buttonTextActive : styles.buttonTextInactive
              }
            >
              {lang.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = {
  container: 'bg-white px-4 py-3 border-b border-gray-200',
  label: 'text-sm text-gray-600 mb-2 font-medium',
  buttonsContainer: 'flex-row flex-wrap',
  button: 'px-4 py-2 rounded-lg mr-2 mb-2',
  buttonActive: 'bg-blue-500',
  buttonInactive: 'bg-gray-200',
  buttonTextActive: 'text-white font-medium',
  buttonTextInactive: 'text-gray-700',
};
// serfsd