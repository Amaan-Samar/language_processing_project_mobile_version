import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import { ChevronDown, Globe } from 'lucide-react-native';

type Props = {
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
};

export default function LanguageSelector({ selectedLanguage, onLanguageChange }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { id: 'chinese', label: 'Chinese', flag: '🇨🇳' },
    { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { id: 'french', label: 'French', flag: '🇫🇷' },
    { id: 'german', label: 'German', flag: '🇩🇪' },
  ];

  const selectedLanguageData = languages.find(lang => lang.id === selectedLanguage);

  const handleLanguageSelect = (langId: string) => {
    onLanguageChange(langId);
    setIsDropdownOpen(false);
  };

  const renderLanguageItem = ({ item }: { item: typeof languages[0] }) => (
    <TouchableOpacity
      className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
        selectedLanguage === item.id ? 'bg-blue-50' : 'bg-white'
      }`}
      onPress={() => handleLanguageSelect(item.id)}
    >
      <Text className="text-xl mr-3">{item.flag}</Text>
      <Text className={`font-medium ${selectedLanguage === item.id ? 'text-blue-600' : 'text-gray-800'}`}>
        {item.label}
      </Text>
      {selectedLanguage === item.id && (
        <View className="ml-auto">
          <Text className="text-blue-500 font-medium">✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="bg-white px-4 py-3 border-b border-gray-200">
      <Text className="text-sm text-gray-600 mb-2 font-medium">Select Language</Text>
      
      <TouchableOpacity
        className="flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-3 bg-white"
        onPress={() => setIsDropdownOpen(true)}
      >
        <View className="flex-row items-center">
          <Globe size={20} color="#4B5563" className="mr-3" />
          {selectedLanguageData && (
            <View className="flex-row items-center">
              <Text className="text-xl mr-2">{selectedLanguageData.flag}</Text>
              <Text className="text-gray-800 font-medium text-lg">
                {selectedLanguageData.label}
              </Text>
            </View>
          )}
        </View>
        <ChevronDown size={20} color="#4B5563" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={isDropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-lg w-full max-w-md shadow-xl">
              <View className="px-4 py-3 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-800">Select a Language</Text>
              </View>
              
              <FlatList
                data={languages}
                renderItem={renderLanguageItem}
                keyExtractor={item => item.id}
                showsVerticalScrollIndicator={false}
                className="max-h-80"
              />
              
              <TouchableOpacity
                className="px-4 py-3 border-t border-gray-200"
                onPress={() => setIsDropdownOpen(false)}
              >
                <Text className="text-center text-blue-600 font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}