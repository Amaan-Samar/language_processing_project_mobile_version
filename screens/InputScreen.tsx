// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TouchableOpacity, 
//   ScrollView, 
//   Animated, 
//   Platform,
//   Modal,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import the hook
// import { History } from 'lucide-react-native';
// import LanguageSelector from '../components/LanguageSelector';
// import InputArea from '../components/InputArea';
// import HistoryModal from '../components/HistoryModal';
// import EditModal from '../components/EditModal';

// type Props = {
//   language: string;
//   articleTitle: string;
//   englishText: string;
//   targetText: string;
//   showSaveButton: boolean;
//   isSaved: boolean;
//   showSaveNotification: boolean;
//   fadeAnim: Animated.Value;
//   onLanguageChange: (lang: string) => void;
//   onTitleChange: (text: string) => void;
//   onEnglishTextChange: (text: string) => void;
//   onTargetTextChange: (text: string) => void;
//   onLoadArticle: (article: any) => void;
//   onNavigateToReader: () => void;
//   onSave: () => void;
//   onClear: () => void;
//   hasContent: boolean;
// };

// export default function InputScreen({
//   language,
//   articleTitle,
//   englishText,
//   targetText,
//   showSaveButton,
//   isSaved,
//   showSaveNotification,
//   fadeAnim,
//   onLanguageChange,
//   onTitleChange,
//   onEnglishTextChange,
//   onTargetTextChange,
//   onLoadArticle,
//   onNavigateToReader,
//   onSave,
//   onClear,
//   hasContent,
// }: Props) {
//   const [showHistory, setShowHistory] = useState(false);
//   const [editMode, setEditMode] = useState<'english' | 'target' | 'title' | null>(null);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     title: true,
//     english: true,
//     target: true
//   });
  
//   // Get safe area insets for all device edges
//   const insets = useSafeAreaInsets();

//   const handleLoadArticle = (article: any) => {
//     onLoadArticle(article);
//     setShowHistory(false);
//   };

//   const toggleSection = (section: 'title' | 'english' | 'target') => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const languages = [
//     { id: 'chinese', label: 'Chinese', flag: '🇨🇳' },
//     { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
//     { id: 'french', label: 'French', flag: '🇫🇷' },
//     { id: 'german', label: 'German', flag: '🇩🇪' },
//   ];

//   const selectedLanguageData = languages.find(lang => lang.id === language) || languages[0];

//   return (
//     <KeyboardAvoidingView 
//       className="flex-1 bg-gray-50"
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{
//         paddingTop: Platform.OS === 'ios' ? insets.top : 0,
//       }}
//     >
//       {/* Dismiss keyboard when tapping outside */}
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View className="flex-1">
//           {/* Save Notification with safe area */}
//           {showSaveNotification && (
//             <View 
//               className="absolute left-0 right-0 z-50 items-center" 
//               pointerEvents="none"
//               style={{ top: insets.top + 16 }}
//             >
//               <Animated.View 
//                 style={{ opacity: fadeAnim }}
//                 className="bg-green-500 px-6 py-3 rounded-lg shadow-lg"
//               >
//                 <Text className="text-white font-medium text-center">
//                   ✅ Article saved successfully!
//                 </Text>
//               </Animated.View>
//             </View>
//           )}

//           {/* Header with Language Selector and History Button */}
//           <View 
//             className="bg-white px-4 border-b border-gray-200"
//             style={{ 
//               paddingTop: Platform.OS === 'ios' ? 12 : Math.max(insets.top, 12),
//               paddingBottom: 12
//             }}
//           >
//             <View className="flex-row items-center justify-between">
//               {/* Language Selector */}
//               <TouchableOpacity
//                 className="flex-row items-center bg-blue-50 px-3 py-2 rounded-lg border border-blue-100 active:bg-blue-100"
//                 onPress={() => setShowLanguageModal(true)}
//               >
//                 <Text className="text-xl mr-2">{selectedLanguageData.flag}</Text>
//                 <Text className="font-medium text-gray-800 mr-1">
//                   {selectedLanguageData.label}
//                 </Text>
//                 <Text className="text-gray-500">▼</Text>
//               </TouchableOpacity>

//               {/* History Button */}
//               <TouchableOpacity
//                 onPress={() => setShowHistory(true)}
//                 className="p-2 rounded-lg bg-gray-50 active:bg-gray-200"
//                 hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//               >
//                 <History size={24} color="#374151" />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Scrollable Content Area */}
//           <ScrollView 
//             className="flex-1"
//             contentContainerStyle={{ 
//               paddingBottom: hasContent ? 100 : 20, // Extra space for buttons when they exist
//               paddingHorizontal: 16,
//               paddingTop: 16
//             }}
//             showsVerticalScrollIndicator={true}
//             keyboardShouldPersistTaps="handled"
//           >
//             <InputArea
//               articleTitle={articleTitle}
//               englishText={englishText}
//               targetText={targetText}
//               language={language}
//               expandedSection={expandedSections}
//               onToggleSection={toggleSection}
//               onEditTitle={() => setEditMode('title')}
//               onEditEnglish={() => setEditMode('english')}
//               onEditTarget={() => setEditMode('target')}
//               onPasteEnglish={onEnglishTextChange}
//               onPasteTarget={onTargetTextChange}
//             />
//           </ScrollView>

//           {/* Bottom Action Buttons with safe area */}
//           {hasContent && (
//             <View 
//               className="bg-white border-t border-gray-200"
//               style={{
//                 paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
//                 paddingTop: 16,
//                 paddingHorizontal: 16
//               }}
//             >
//               <View className="flex-row gap-3">
//                 {/* Save Button - shows if there's content and unsaved changes */}
//                 {showSaveButton && !isSaved && (
//                   <TouchableOpacity
//                     className="flex-1 bg-green-500 rounded-lg py-4 shadow-lg active:bg-green-600"
//                     onPress={onSave}
//                   >
//                     <Text className="text-white font-bold text-center">💾 Save</Text>
//                   </TouchableOpacity>
//                 )}

//                 {/* Clear Button */}
//                 <TouchableOpacity
//                   className="flex-1 bg-red-500 rounded-lg py-4 shadow-lg active:bg-red-600"
//                   onPress={onClear}
//                 >
//                   <Text className="text-white font-bold text-center">🗑️ Clear</Text>
//                 </TouchableOpacity>

//                 {/* Read Article Button */}
//                 <TouchableOpacity
//                   className="flex-1 bg-blue-500 rounded-lg py-4 shadow-lg active:bg-blue-600"
//                   onPress={onNavigateToReader}
//                 >
//                   <Text className="text-white font-bold text-center">📖 Read</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </View>
//       </TouchableWithoutFeedback>

//       {/* Language Selection Modal with safe area */}
//       <Modal
//         visible={showLanguageModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowLanguageModal(false)}
//         statusBarTranslucent={true}
//       >
//         <TouchableOpacity
//           className="flex-1 bg-black/50"
//           activeOpacity={1}
//           onPress={() => setShowLanguageModal(false)}
//           style={{ 
//             paddingTop: insets.top,
//             paddingBottom: insets.bottom 
//           }}
//         >
//           <View className="flex-1 justify-center items-center px-4">
//             <View className="bg-white rounded-lg w-full max-w-md shadow-xl" style={{ maxHeight: '80%' }}>
//               <View className="px-4 py-3 border-b border-gray-200">
//                 <Text className="text-lg font-bold text-gray-800">Select Language</Text>
//               </View>
              
//               <ScrollView className="flex-1">
//                 {languages.map((lang) => (
//                   <TouchableOpacity
//                     key={lang.id}
//                     className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
//                       language === lang.id ? 'bg-blue-50' : 'bg-white'
//                     } active:bg-gray-50`}
//                     onPress={() => {
//                       onLanguageChange(lang.id);
//                       setShowLanguageModal(false);
//                     }}
//                   >
//                     <Text className="text-xl mr-3">{lang.flag}</Text>
//                     <Text className={`font-medium ${language === lang.id ? 'text-blue-600' : 'text-gray-800'}`}>
//                       {lang.label}
//                     </Text>
//                     {language === lang.id && (
//                       <View className="ml-auto">
//                         <Text className="text-blue-500 font-medium">✓</Text>
//                       </View>
//                     )}
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
              
//               <TouchableOpacity
//                 className="px-4 py-3 border-t border-gray-200 active:bg-gray-50"
//                 onPress={() => setShowLanguageModal(false)}
//               >
//                 <Text className="text-center text-blue-600 font-medium">Cancel</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Edit Modal */}
//       <EditModal
//         visible={editMode !== null}
//         title={
//           editMode === 'title'
//             ? 'Article Title'
//             : editMode === 'english'
//             ? 'English'
//             : selectedLanguageData.label
//         }
//         text={
//           editMode === 'title'
//             ? articleTitle
//             : editMode === 'english'
//             ? englishText
//             : targetText
//         }
//         onTextChange={
//           editMode === 'title'
//             ? onTitleChange
//             : editMode === 'english'
//             ? onEnglishTextChange
//             : onTargetTextChange
//         }
//         onClose={() => setEditMode(null)}
//         multiline={editMode !== 'title'}
//       />

//       {/* History Modal */}
//       <HistoryModal
//         visible={showHistory}
//         onClose={() => setShowHistory(false)}
//         onLoadArticle={handleLoadArticle}
//       />
//     </KeyboardAvoidingView>
//   );
// }


import React, { useState } from 'react';
import { 
  View, 
  Text, 
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
  X
} from 'lucide-react-native';
import LanguageSelector from '../components/LanguageSelector';
import InputArea from '../components/InputArea';
import HistoryModal from '../components/HistoryModal';
import EditModal from '../components/EditModal';

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

  const languages = [
    { id: 'chinese', label: 'Chinese', flag: '🇨🇳' },
    { id: 'spanish', label: 'Spanish', flag: '🇪🇸' },
    { id: 'french', label: 'French', flag: '🇫🇷' },
    { id: 'german', label: 'German', flag: '🇩🇪' },
  ];

  const selectedLanguageData = languages.find(lang => lang.id === language) || languages[0];

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
                {/* <Text className="text-sm font-semibold text-gray-700 mb-3">Actions</Text> */}
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
                </View>
                
                <ScrollView 
                  className="max-h-96" // Changed from fixed height to max-height
                  showsVerticalScrollIndicator={true}
                >
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
                          <Check size={20} color="#3B82F6" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                
                <TouchableOpacity
                  className="px-4 py-3 border-t border-gray-200 active:bg-gray-50 flex-row items-center justify-center gap-2"
                  onPress={() => setShowLanguageModal(false)}
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