import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Platform, 
  StatusBar,
  Modal // Add Modal import
} from 'react-native';
import LanguageSelector from '../components/LanguageSelector';
import InputArea from '../components/InputArea';
import HistoryModal from '../components/HistoryModal';
import EditModal from '../components/EditModal';
import { History } from 'lucide-react-native';

type Props = {
  language: string;
  articleTitle: string;
  englishText: string;
  targetText: string;
  showSaveButton: boolean;
  isSaved: boolean;
  showSaveNotification: boolean;
  fadeAnim: Animated.Value;
  onLanguageChange: (lang: string) => void;
  onTitleChange: (text: string) => void;
  onEnglishTextChange: (text: string) => void;
  onTargetTextChange: (text: string) => void;
  onLoadArticle: (article: any) => void;
  onNavigateToReader: () => void;
  onSave: () => void;
  onClear: () => void;
  hasContent: boolean;
};

export default function InputScreen({
  language,
  articleTitle,
  englishText,
  targetText,
  showSaveButton,
  isSaved,
  showSaveNotification,
  fadeAnim,
  onLanguageChange,
  onTitleChange,
  onEnglishTextChange,
  onTargetTextChange,
  onLoadArticle,
  onNavigateToReader,
  onSave,
  onClear,
  hasContent,
}: Props) {
  const [showHistory, setShowHistory] = useState(false);
  const [editMode, setEditMode] = useState<'english' | 'target' | 'title' | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    title: true,
    english: true,
    target: true
  });

  const handleLoadArticle = (article: any) => {
    onLoadArticle(article);
    setShowHistory(false);
  };

  const toggleSection = (section: 'title' | 'english' | 'target') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const languages = [
    { id: 'chinese', label: 'Chinese', flag: '🇨🇳' },
    { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { id: 'french', label: 'French', flag: '🇫🇷' },
    { id: 'german', label: 'German', flag: '🇩🇪' },
  ];

  const selectedLanguageData = languages.find(lang => lang.id === language) || languages[0];

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
      {/* Save Notification */}
      {showSaveNotification && (
        <View className="absolute top-4 left-0 right-0 z-50 items-center" pointerEvents="none">
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="bg-green-500 px-6 py-3 rounded-lg shadow-lg"
          >
            <Text className="text-white font-medium text-center">
              ✅ Article saved successfully!
            </Text>
          </Animated.View>
        </View>
      )}

      {/* Header with Language Selector and History Button */}
      <View className="bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          {/* Language Selector - Interactive */}
          <TouchableOpacity
            className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 active:bg-blue-100"
            onPress={() => setShowLanguageModal(true)}
          >
            <Text className="text-xl mr-2">{selectedLanguageData.flag}</Text>
            <Text className="font-medium text-gray-800 mr-1">
              {selectedLanguageData.label}
            </Text>
            <Text className="text-gray-500">▼</Text>
          </TouchableOpacity>

          {/* History Button */}
          <TouchableOpacity
            onPress={() => setShowHistory(true)}
            className="p-2 rounded-lg bg-gray-50 active:bg-gray-200"
          >
            <History size={24} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 20 }}>
        <InputArea
          articleTitle={articleTitle}
          englishText={englishText}
          targetText={targetText}
          language={language}
          expandedSection={expandedSections}
          onToggleSection={toggleSection}
          onEditTitle={() => setEditMode('title')}
          onEditEnglish={() => setEditMode('english')}
          onEditTarget={() => setEditMode('target')}
          onPasteEnglish={onEnglishTextChange}
          onPasteTarget={onTargetTextChange}
        />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="p-4 bg-white border-t border-gray-200" style={{ paddingBottom: Platform.OS === 'ios' ? 20 : 4 }}>
        <View className="flex-row gap-3">
          {/* Save Button - shows if there's content and unsaved changes */}
          {showSaveButton && !isSaved && (
            <TouchableOpacity
              className="flex-1 bg-green-500 rounded-lg py-4 shadow-lg active:bg-green-600"
              onPress={onSave}
            >
              <Text className="text-white font-bold text-center">💾 Save</Text>
            </TouchableOpacity>
          )}

          {/* Clear Button - shows if there's any content */}
          {hasContent && (
            <TouchableOpacity
              className="flex-1 bg-red-500 rounded-lg py-4 shadow-lg active:bg-red-600"
              onPress={onClear}
            >
              <Text className="text-white font-bold text-center">🗑️ Clear</Text>
            </TouchableOpacity>
          )}

          {/* Read Article Button - always takes full width when visible */}
          {hasContent && (
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-lg py-4 shadow-lg active:bg-blue-600"
              onPress={onNavigateToReader}
            >
              <Text className="text-white font-bold text-center">📖 Read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
          style={{ paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
        >
          <View className="flex-1 justify-center items-center px-4">
            <View className="bg-white rounded-lg w-full max-w-md shadow-xl">
              <View className="px-4 py-3 border-b border-gray-200">
                <Text className="text-lg font-bold text-gray-800">Select Language</Text>
              </View>
              
              <ScrollView className="max-h-80">
                {languages.map((lang) => (
                  <TouchableOpacity
                    key={lang.id}
                    className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                      language === lang.id ? 'bg-blue-50' : 'bg-white'
                    } active:bg-gray-50`}
                    onPress={() => {
                      onLanguageChange(lang.id);
                      setShowLanguageModal(false);
                    }}
                  >
                    <Text className="text-xl mr-3">{lang.flag}</Text>
                    <Text className={`font-medium ${language === lang.id ? 'text-blue-600' : 'text-gray-800'}`}>
                      {lang.label}
                    </Text>
                    {language === lang.id && (
                      <View className="ml-auto">
                        <Text className="text-blue-500 font-medium">✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                className="px-4 py-3 border-t border-gray-200 active:bg-gray-50"
                onPress={() => setShowLanguageModal(false)}
              >
                <Text className="text-center text-blue-600 font-medium">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <EditModal
        visible={editMode !== null}
        title={
          editMode === 'title'
            ? 'Article Title'
            : editMode === 'english'
            ? 'English'
            : selectedLanguageData.label
        }
        text={
          editMode === 'title'
            ? articleTitle
            : editMode === 'english'
            ? englishText
            : targetText
        }
        onTextChange={
          editMode === 'title'
            ? onTitleChange
            : editMode === 'english'
            ? onEnglishTextChange
            : onTargetTextChange
        }
        onClose={() => setEditMode(null)}
        multiline={editMode !== 'title'}
      />

      <HistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadArticle={handleLoadArticle}
      />
    </View>
  );
}