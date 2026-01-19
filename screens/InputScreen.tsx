// screens/InputScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput,
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Platform,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  History, 
  Save, 
  Trash2, 
  BookOpen,
  Globe,
  Check,
  X,
  Search
} from 'lucide-react-native';
// import LanguageSelector from '../components/LanguageSelector';
import InputArea from '../components/InputArea';
import HistoryModal from '../components/HistoryModal';
import EditModal from '../components/EditModal';
import { supportedLanguages } from '../utils/pinyinProcessor';

type Props = {
  language: string;
  articleTitle: string;
  englishText: string;
  targetText: string;
  showSaveButton: boolean;
  isSaved: boolean;
  showSaveNotification: boolean;
  fadeAnim: Animated.Value;
  isProcessing?: boolean;
  processingStats?: {
    hasEnglish: boolean;
    hasTarget: boolean;
    englishParagraphs: number;
    targetParagraphs: number;
    isComplete: boolean;
  };
  onLanguageChange: (language: string) => void;
  onTitleChange: (text: string) => void;
  onEnglishTextChange: (text: string) => void;
  onTargetTextChange: (text: string) => void;
  onLoadArticle: (article: any) => void;
  onHistoryClose: () => void;
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
  const [searchQuery, setSearchQuery] = useState('');
  
  const [expandedSections, setExpandedSections] = useState({
    title: true,
    english: true,
    target: true
  });
  
  const insets = useSafeAreaInsets();

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

  // Filter languages based on search query
  const filteredLanguages = searchQuery.trim() === '' 
    ? supportedLanguages 
    : supportedLanguages.filter(lang =>
        lang.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.id.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const selectedLanguageData = supportedLanguages.find(lang => lang.id === language) || supportedLanguages[0];

  // Check if there's content in either English or target text for the reader
  const hasReaderContent = englishText.trim().length > 0 || targetText.trim().length > 0;

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        paddingTop: Platform.OS === 'ios' ? insets.top : 0,
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Save Notification */}
          {showSaveNotification && (
            <View 
              className="absolute left-0 right-0 z-50 items-center" 
              pointerEvents="none"
              style={{ top: insets.top + 16 }}
            >
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

          {/* Header */}
          <View 
            className="bg-white px-4 border-b border-gray-200"
            style={{ 
              paddingTop: Platform.OS === 'ios' ? 12 : Math.max(insets.top, 12),
              paddingBottom: 12
            }}
          >
            <View className="flex-row items-center justify-between">
              {/* Language Selector */}
              
              <TouchableOpacity
                className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 active:bg-blue-100"
                onPress={() => setShowLanguageModal(true)}
              >
                <Text className="text-xl mr-2">{selectedLanguageData.flag}</Text>
                <Text className="font-medium text-gray-800 mr-1">
                  {selectedLanguageData.label}
                </Text>
                <Globe size={16} color="#6B7280" />
              </TouchableOpacity>

              {/* History Button */}
              <TouchableOpacity
                onPress={() => setShowHistory(true)}
                className="p-2 rounded-lg bg-gray-50 active:bg-gray-200"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <History size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content Area with Action Buttons */}
          <ScrollView 
            className="flex-1"
            contentContainerStyle={{ 
              paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            {/* Input Area */}
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

            {/* Action Buttons */}
            {(hasContent || hasReaderContent) && (
              <View>
                <View className="flex-row gap-3">
                  {/* Save Button - Always gray outline when not saved */}
                  {showSaveButton && !isSaved && (
                    <TouchableOpacity
                      className="flex-1 rounded-lg py-3 flex-row items-center justify-center gap-2 bg-white shadow-sm active:bg-gray-50"
                      onPress={onSave}
                    >
                      <Save size={20} color="#6B7280" />
                      <Text className="text-gray-700 font-bold">Save</Text>
                    </TouchableOpacity>
                  )}

                  {/* Clear Button - Always gray outline */}
                  <TouchableOpacity
                    className="flex-1 rounded-lg py-3 flex-row items-center justify-center gap-2 bg-white shadow-sm active:bg-gray-50"
                    onPress={onClear}
                  >
                    <Trash2 size={20} color="#6B7280" />
                    <Text className="text-gray-700 font-bold">Clear</Text>
                  </TouchableOpacity>

                  {/* Read Article Button - Blue background when enabled */}
                  <TouchableOpacity
                    className={`flex-1 rounded-lg py-3 flex-row items-center justify-center gap-2 shadow-sm ${
                      hasReaderContent 
                        ? 'bg-blue-500 border-2 border-blue-500 active:bg-blue-600' 
                        : 'bg-gray-300 border-2 border-gray-300'
                    }`}
                    onPress={hasReaderContent ? onNavigateToReader : undefined}
                    disabled={!hasReaderContent}
                  >
                    <BookOpen size={20} color={hasReaderContent ? "white" : "#9CA3AF"} />
                    <Text className={`font-bold ${hasReaderContent ? 'text-white' : 'text-gray-500'}`}>
                      Read
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Helper text */}
                {!hasReaderContent && (
                  <Text className="text-gray-500 text-xs text-center mt-2">
                    Add text in English or {selectedLanguageData.label} to enable reading
                  </Text>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>

      {/* Language Selection Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
        statusBarTranslucent={true}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
          style={{ 
            paddingTop: insets.top,
            paddingBottom: insets.bottom 
          }}
        >
          <View className="flex-1 justify-center items-center px-4">
            <TouchableWithoutFeedback onPress={() => {}}>
              <View className="bg-white rounded-lg w-full max-w-md shadow-xl">
                <View className="px-4 py-3 border-b border-gray-200">
                  <Text className="text-lg font-bold text-gray-800">Select Language</Text>
                  <Text className="text-sm text-gray-500 mt-1">
                    {filteredLanguages.length} of {supportedLanguages.length} languages
                  </Text>
                  
                  {/* Search Bar */}
                  <View className="mt-3 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <Search size={18} color="#6B7280" />
                    <TextInput
                      className="flex-1 ml-2 text-gray-800"
                      placeholder="Search languages..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <X size={18} color="#6B7280" />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <ScrollView 
                  className="max-h-96"
                  showsVerticalScrollIndicator={true}
                >
                  {filteredLanguages.map((lang) => (
                    <TouchableOpacity
                      key={lang.id}
                      className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
                        language === lang.id ? 'bg-blue-50' : 'bg-white'
                      } active:bg-gray-50`}
                      onPress={() => {
                        onLanguageChange(lang.id);
                        setShowLanguageModal(false);
                        setSearchQuery('');
                      }}
                    >
                      <Text className="text-xl mr-3">{lang.flag}</Text>
                      <View className="flex-1">
                        <Text className={`font-medium ${language === lang.id ? 'text-blue-600' : 'text-gray-800'}`}>
                          {lang.label}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          {lang.id} • {lang.needsRomanization ? 'Romanization' : 'Latin alphabet'}
                        </Text>
                      </View>
                      {language === lang.id && (
                        <View className="ml-auto">
                          <Check size={20} color="#3B82F6" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  {filteredLanguages.length === 0 && (
                    <View className="px-4 py-8 items-center">
                      <Text className="text-gray-500">No languages found matching `{searchQuery}`</Text>
                    </View>
                  )}
                </ScrollView>
                
                <TouchableOpacity
                  className="px-4 py-3 border-t border-gray-200 active:bg-gray-50 flex-row items-center justify-center gap-2"
                  onPress={() => {
                    setShowLanguageModal(false);
                    setSearchQuery('');
                  }}
                >
                  <X size={20} color="#3B82F6" />
                  <Text className="text-blue-600 font-medium">Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Edit Modal */}
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

      {/* History Modal */}
      <HistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onLoadArticle={handleLoadArticle}
      />
    </KeyboardAvoidingView>
  );
}