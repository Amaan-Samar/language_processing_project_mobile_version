// // screens/InputScreen.tsx
// import React, { useState } from 'react';
// import { 
//   View, 
//   Text, 
//   TextInput,
//   TouchableOpacity, 
//   ScrollView, 
//   Animated, 
//   Platform,
//   Modal,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { 
//   History, 
//   Save, 
//   Trash2, 
//   BookOpen,
//   Globe,
//   Check,
//   X,
//   Search
// } from 'lucide-react-native';
// // import LanguageSelector from '../components/LanguageSelector';
// import InputArea from '../components/InputArea';
// import HistoryModal from '../components/HistoryModal';
// import EditModal from '../components/EditModal';
// import { supportedLanguages } from '../utils/pinyinProcessor';

// type Props = {
//   language: string;
//   articleTitle: string;
//   englishText: string;
//   targetText: string;
//   showSaveButton: boolean;
//   isSaved: boolean;
//   showSaveNotification: boolean;
//   fadeAnim: Animated.Value;
//   isProcessing?: boolean;
//   processingStats?: {
//     hasEnglish: boolean;
//     hasTarget: boolean;
//     englishParagraphs: number;
//     targetParagraphs: number;
//     isComplete: boolean;
//   };
//   onLanguageChange: (language: string) => void;
//   onTitleChange: (text: string) => void;
//   onEnglishTextChange: (text: string) => void;
//   onTargetTextChange: (text: string) => void;
//   onLoadArticle: (article: any) => void;
//   onHistoryClose: () => void;
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
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const [expandedSections, setExpandedSections] = useState({
//     title: true,
//     english: true,
//     target: true
//   });
  
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

//   // Filter languages based on search query
//   const filteredLanguages = searchQuery.trim() === '' 
//     ? supportedLanguages 
//     : supportedLanguages.filter(lang =>
//         lang.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         lang.id.toLowerCase().includes(searchQuery.toLowerCase())
//       );

//   const selectedLanguageData = supportedLanguages.find(lang => lang.id === language) || supportedLanguages[0];

//   // Check if there's content in either English or target text for the reader
//   const hasReaderContent = englishText.trim().length > 0 || targetText.trim().length > 0;

//   return (
//     <KeyboardAvoidingView 
//       className="flex-1 bg-gray-50"
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={{
//         paddingTop: Platform.OS === 'ios' ? insets.top : 0,
//       }}
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View className="flex-1">
//           {/* Save Notification */}
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

//           {/* Header */}
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
//                 <Globe size={16} color="#6B7280" />
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

//           {/* Scrollable Content Area with Action Buttons */}
//           <ScrollView 
//             className="flex-1"
//             contentContainerStyle={{ 
//               paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 32,
//               paddingHorizontal: 16,
//             }}
//             showsVerticalScrollIndicator={true}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Input Area */}
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

//             {/* Action Buttons */}
//             {(hasContent || hasReaderContent) && (
//               <View>
//                 <View className="flex-row gap-3">
//                   {/* Save Button - Always gray outline when not saved */}
//                   {showSaveButton && !isSaved && (
//                     <TouchableOpacity
//                       className="flex-1 rounded-lg py-3 flex-row items-center justify-center gap-2 bg-white shadow-sm active:bg-gray-50"
//                       onPress={onSave}
//                     >
//                       <Save size={20} color="#6B7280" />
//                       <Text className="text-gray-700 font-bold">Save</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/* Clear Button - Always gray outline */}
//                   <TouchableOpacity
//                     className="flex-1 rounded-lg py-3 flex-row items-center justify-center gap-2 bg-white shadow-sm active:bg-gray-50"
//                     onPress={onClear}
//                   >
//                     <Trash2 size={20} color="#6B7280" />
//                     <Text className="text-gray-700 font-bold">Clear</Text>
//                   </TouchableOpacity>

//                   {/* Read Article Button - Blue background when enabled */}
//                   <TouchableOpacity
//                     className={`flex-1 rounded-lg py-3 flex-row items-center justify-center gap-2 shadow-sm ${
//                       hasReaderContent 
//                         ? 'bg-blue-500 border-2 border-blue-500 active:bg-blue-600' 
//                         : 'bg-gray-300 border-2 border-gray-300'
//                     }`}
//                     onPress={hasReaderContent ? onNavigateToReader : undefined}
//                     disabled={!hasReaderContent}
//                   >
//                     <BookOpen size={20} color={hasReaderContent ? "white" : "#9CA3AF"} />
//                     <Text className={`font-bold ${hasReaderContent ? 'text-white' : 'text-gray-500'}`}>
//                       Read
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 {/* Helper text */}
//                 {!hasReaderContent && (
//                   <Text className="text-gray-500 text-xs text-center mt-2">
//                     Add text in English or {selectedLanguageData.label} to enable reading
//                   </Text>
//                 )}
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </TouchableWithoutFeedback>

//       {/* Language Selection Modal */}
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
//             <TouchableWithoutFeedback onPress={() => {}}>
//               <View className="bg-white rounded-lg w-full max-w-md shadow-xl">
//                 <View className="px-4 py-3 border-b border-gray-200">
//                   <Text className="text-lg font-bold text-gray-800">Select Language</Text>
//                   <Text className="text-sm text-gray-500 mt-1">
//                     {filteredLanguages.length} of {supportedLanguages.length} languages
//                   </Text>
                  
//                   {/* Search Bar */}
//                   <View className="mt-3 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
//                     <Search size={18} color="#6B7280" />
//                     <TextInput
//                       className="flex-1 ml-2 text-gray-800"
//                       placeholder="Search languages..."
//                       value={searchQuery}
//                       onChangeText={setSearchQuery}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                     />
//                     {searchQuery.length > 0 && (
//                       <TouchableOpacity onPress={() => setSearchQuery('')}>
//                         <X size={18} color="#6B7280" />
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 </View>
                
//                 <ScrollView 
//                   className="max-h-96"
//                   showsVerticalScrollIndicator={true}
//                 >
//                   {filteredLanguages.map((lang) => (
//                     <TouchableOpacity
//                       key={lang.id}
//                       className={`flex-row items-center px-4 py-3 border-b border-gray-100 ${
//                         language === lang.id ? 'bg-blue-50' : 'bg-white'
//                       } active:bg-gray-50`}
//                       onPress={() => {
//                         onLanguageChange(lang.id);
//                         setShowLanguageModal(false);
//                         setSearchQuery('');
//                       }}
//                     >
//                       <Text className="text-xl mr-3">{lang.flag}</Text>
//                       <View className="flex-1">
//                         <Text className={`font-medium ${language === lang.id ? 'text-blue-600' : 'text-gray-800'}`}>
//                           {lang.label}
//                         </Text>
//                         <Text className="text-xs text-gray-500">
//                           {lang.id} • {lang.needsRomanization ? 'Romanization' : 'Latin alphabet'}
//                         </Text>
//                       </View>
//                       {language === lang.id && (
//                         <View className="ml-auto">
//                           <Check size={20} color="#3B82F6" />
//                         </View>
//                       )}
//                     </TouchableOpacity>
//                   ))}
                  
//                   {filteredLanguages.length === 0 && (
//                     <View className="px-4 py-8 items-center">
//                       <Text className="text-gray-500">No languages found matching `{searchQuery}`</Text>
//                     </View>
//                   )}
//                 </ScrollView>
                
//                 <TouchableOpacity
//                   className="px-4 py-3 border-t border-gray-200 active:bg-gray-50 flex-row items-center justify-center gap-2"
//                   onPress={() => {
//                     setShowLanguageModal(false);
//                     setSearchQuery('');
//                   }}
//                 >
//                   <X size={20} color="#3B82F6" />
//                   <Text className="text-blue-600 font-medium">Cancel</Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
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






// // screens/InputScreen.tsx
// import React, { useState, useMemo } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   KeyboardAvoidingView,
//   TouchableWithoutFeedback,
//   Keyboard,
//   FlatList,
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import {
//   History,
//   Save,
//   Trash2,
//   BookOpen,
//   Globe,
//   Check,
//   X,
//   Search
// } from 'lucide-react-native';
// import InputArea from '../components/InputArea';
// import HistoryModal from '../components/HistoryModal';
// import EditModal from '../components/EditModal';
// import { Notification } from '../components/Notification';
// import { supportedLanguages } from '../utils/pinyinProcessor';
// import { STRINGS } from '../utils/strings';
// import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, getThemeForLanguage } from '../utils/themes';

// type Props = {
//   language: string;
//   articleTitle: string;
//   englishText: string;
//   targetText: string;
//   showSaveButton: boolean;
//   isSaved: boolean;
//   showSaveNotification: boolean;
//   isProcessing?: boolean;
//   processingStats?: {
//     hasEnglish: boolean;
//     hasTarget: boolean;
//     englishParagraphs: number;
//     targetParagraphs: number;
//     isComplete: boolean;
//   };
//   onLanguageChange: (language: string) => void;
//   onTitleChange: (text: string) => void;
//   onEnglishTextChange: (text: string) => void;
//   onTargetTextChange: (text: string) => void;
//   onLoadArticle: (article: any) => void;
//   onHistoryClose: () => void;
//   onNavigateToReader: () => void;
//   onSave: () => void;
//   onClear: () => void;
//   onHideSaveNotification?: () => void;
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
//   onLanguageChange,
//   onTitleChange,
//   onEnglishTextChange,
//   onTargetTextChange,
//   onLoadArticle,
//   onNavigateToReader,
//   onSave,
//   onClear,
//   onHideSaveNotification,
//   hasContent,
// }: Props) {
//   const [showHistory, setShowHistory] = useState(false);
//   const [editMode, setEditMode] = useState<'english' | 'target' | 'title' | null>(null);
//   const [showLanguageModal, setShowLanguageModal] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
  
//   const [expandedSections, setExpandedSections] = useState({
//     title: true,
//     english: true,
//     target: true
//   });
  
//   const insets = useSafeAreaInsets();
  
//   // Get current language theme
//   const languageTheme = useMemo(() => getThemeForLanguage(language), [language]);

//   // Memoized computations
//   const filteredLanguages = useMemo(() => {
//     if (searchQuery.trim() === '') return supportedLanguages;
//     const query = searchQuery.toLowerCase();
//     return supportedLanguages.filter(lang =>
//       lang.label.toLowerCase().includes(query) ||
//       lang.id.toLowerCase().includes(query)
//     );
//   }, [searchQuery]);

//   const selectedLanguageData = useMemo(() => 
//     supportedLanguages.find(lang => lang.id === language) || supportedLanguages[0],
//     [language]
//   );

//   const hasReaderContent = useMemo(() => 
//     englishText.trim().length > 0 || targetText.trim().length > 0,
//     [englishText, targetText]
//   );

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

//   // Language list item renderer
//   const renderLanguageItem = ({ item: lang }: { item: any }) => (
//     <TouchableOpacity
//       style={[
//         localStyles.languageItem,
//         language === lang.id && { backgroundColor: COLORS.STATE.selected }
//       ]}
//       onPress={() => {
//         onLanguageChange(lang.id);
//         setShowLanguageModal(false);
//         setSearchQuery('');
//       }}
//     >
//       <Text style={localStyles.flag}>{lang.flag}</Text>
//       <View style={localStyles.languageInfo}>
//         <Text style={[
//           localStyles.languageName,
//           language === lang.id && { color: languageTheme.primary }
//         ]}>
//           {lang.label}
//         </Text>
//         <Text style={localStyles.languageId}>
//           {lang.id} • {lang.needsRomanization ? 'Romanization' : 'Latin alphabet'}
//         </Text>
//       </View>
//       {language === lang.id && (
//         <View style={localStyles.checkIcon}>
//           <Check size={20} color={languageTheme.primary} />
//         </View>
//       )}
//     </TouchableOpacity>
//   );

//   return (
//     <KeyboardAvoidingView 
//       style={localStyles.container}
//       behavior="padding"
//     >
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <View style={localStyles.innerContainer}>
//           {/* Save Notification */}
//           {showSaveNotification && (
//             <View style={[localStyles.notificationWrapper, { top: insets.top + SPACING.md }]}>
//               <Notification
//                 type="success"
//                 message={STRINGS.NOTIFICATIONS.ARTICLE_SAVED}
//                 onClose={onHideSaveNotification}
//                 duration={3000}
//               />
//             </View>
//           )}

//           {/* Header */}
//           <View style={[localStyles.header, { paddingTop: Math.max(insets.top, SPACING.md) }]}>
//             <View style={localStyles.headerContent}>
//               {/* Language Selector */}
//               <TouchableOpacity
//                 style={localStyles.languageSelector}
//                 onPress={() => setShowLanguageModal(true)}
//               >
//                 <Text style={localStyles.languageFlag}>{selectedLanguageData.flag}</Text>
//                 <Text style={localStyles.languageLabel}>{selectedLanguageData.label}</Text>
//                 <Globe size={16} color={COLORS.TEXT.secondary} />
//               </TouchableOpacity>

//               {/* History Button */}
//               <TouchableOpacity
//                 onPress={() => setShowHistory(true)}
//                 style={localStyles.historyButton}
//               >
//                 <History size={24} color={COLORS.TEXT.primary} />
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* Scrollable Content Area */}
//           <ScrollView 
//             style={localStyles.scrollView}
//             contentContainerStyle={localStyles.scrollContent}
//             showsVerticalScrollIndicator={true}
//             keyboardShouldPersistTaps="handled"
//           >
//             {/* Input Area */}
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

//             {/* Action Buttons */}
//             {(hasContent || hasReaderContent) && (
//               <View style={localStyles.actionSection}>
//                 <View style={localStyles.actionButtons}>
//                   {/* Save Button */}
//                   {showSaveButton && !isSaved && (
//                     <TouchableOpacity
//                       style={localStyles.saveButton}
//                       onPress={onSave}
//                     >
//                       <Save size={20} color={COLORS.TEXT.secondary} />
//                       <Text style={localStyles.buttonText}>{STRINGS.COMMON.SAVE}</Text>
//                     </TouchableOpacity>
//                   )}

//                   {/* Clear Button */}
//                   <TouchableOpacity
//                     style={localStyles.clearButton}
//                     onPress={onClear}
//                   >
//                     <Trash2 size={20} color={COLORS.TEXT.secondary} />
//                     <Text style={localStyles.buttonText}>{STRINGS.COMMON.CLEAR}</Text>
//                   </TouchableOpacity>

//                   {/* Read Article Button */}
//                   <TouchableOpacity
//                     style={[
//                       localStyles.readButton,
//                       hasReaderContent 
//                         ? { backgroundColor: languageTheme.primary, borderColor: languageTheme.primary }
//                         : localStyles.readButtonDisabled
//                     ]}
//                     onPress={hasReaderContent ? onNavigateToReader : undefined}
//                     disabled={!hasReaderContent}
//                   >
//                     <BookOpen size={20} color={hasReaderContent ? COLORS.TEXT.contrast : COLORS.TEXT.disabled} />
//                     <Text style={[
//                       localStyles.readButtonText,
//                       hasReaderContent ? localStyles.readButtonTextEnabled : localStyles.readButtonTextDisabled
//                     ]}>
//                       {STRINGS.COMMON.READ}
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
                
//                 {/* Helper text */}
//                 {!hasReaderContent && (
//                   <Text style={localStyles.helperText}>
//                     {STRINGS.INPUT_SCREEN.ADD_TEXT_TO_ENABLE(selectedLanguageData.label)}
//                   </Text>
//                 )}
//               </View>
//             )}
//           </ScrollView>
//         </View>
//       </TouchableWithoutFeedback>

//       {/* Language Selection Modal */}
//       <Modal
//         visible={showLanguageModal}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setShowLanguageModal(false)}
//         statusBarTranslucent={true}
//       >
//         <TouchableOpacity
//           style={[localStyles.modalOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
//           activeOpacity={1}
//           onPress={() => setShowLanguageModal(false)}
//         >
//           <View style={localStyles.modalContent}>
//             <TouchableWithoutFeedback onPress={() => {}}>
//               <View style={localStyles.modalCard}>
//                 <View style={localStyles.modalHeader}>
//                   <Text style={localStyles.modalTitle}>{STRINGS.COMMON.SELECT_LANGUAGE}</Text>
//                   <Text style={localStyles.modalSubtitle}>
//                     {STRINGS.INPUT_SCREEN.LANGUAGES_COUNT(filteredLanguages.length, supportedLanguages.length)}
//                   </Text>
                  
//                   {/* Search Bar */}
//                   <View style={localStyles.searchContainer}>
//                     <Search size={18} color={COLORS.TEXT.secondary} />
//                     <TextInput
//                       style={localStyles.searchInput}
//                       placeholder={STRINGS.INPUT_SCREEN.SEARCH_LANGUAGES}
//                       placeholderTextColor={COLORS.TEXT.tertiary}
//                       value={searchQuery}
//                       onChangeText={setSearchQuery}
//                       autoCapitalize="none"
//                       autoCorrect={false}
//                     />
//                     {searchQuery.length > 0 && (
//                       <TouchableOpacity onPress={() => setSearchQuery('')}>
//                         <X size={18} color={COLORS.TEXT.secondary} />
//                       </TouchableOpacity>
//                     )}
//                   </View>
//                 </View>
                
//                 <FlatList
//                   data={filteredLanguages}
//                   renderItem={renderLanguageItem}
//                   keyExtractor={(item) => item.id}
//                   ListEmptyComponent={
//                     <View style={localStyles.emptyState}>
//                       <Text style={localStyles.emptyStateText}>
//                         {STRINGS.INPUT_SCREEN.NO_LANGUAGES_FOUND(searchQuery)}
//                       </Text>
//                     </View>
//                   }
//                   style={localStyles.languageList}
//                   initialNumToRender={20}
//                   maxToRenderPerBatch={20}
//                   windowSize={5}
//                 />
                
//                 <TouchableOpacity
//                   style={localStyles.modalCloseButton}
//                   onPress={() => {
//                     setShowLanguageModal(false);
//                     setSearchQuery('');
//                   }}
//                 >
//                   <X size={20} color={languageTheme.primary} />
//                   <Text style={[localStyles.modalCloseText, { color: languageTheme.primary }]}>
//                     {STRINGS.COMMON.CANCEL}
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* Edit Modal */}
//       <EditModal
//         visible={editMode !== null}
//         title={
//           editMode === 'title'
//             ? STRINGS.MODALS.EDIT_TITLE
//             : editMode === 'english'
//             ? STRINGS.MODALS.EDIT_ENGLISH
//             : STRINGS.MODALS.EDIT_TARGET(selectedLanguageData.label)
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

// const localStyles = {
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.BACKGROUND.primary,
//   },
//   innerContainer: {
//     flex: 1,
//   },
//   notificationWrapper: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     zIndex: 1000,
//     alignItems: 'center',
//   },
//   header: {
//     backgroundColor: COLORS.BACKGROUND.secondary,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.BORDER.light,
//     paddingHorizontal: SPACING.md,
//     paddingBottom: SPACING.md,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   languageSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.BACKGROUND.tertiary,
//     paddingHorizontal: SPACING.sm,
//     paddingVertical: SPACING.xs,
//     borderRadius: BORDER_RADIUS.lg,
//     borderWidth: 1,
//     borderColor: COLORS.BORDER.light,
//   },
//   languageFlag: {
//     fontSize: TYPOGRAPHY.sizes.xl,
//     marginRight: SPACING.xs,
//   },
//   languageLabel: {
//     fontWeight: TYPOGRAPHY.weights.medium,
//     color: COLORS.TEXT.primary,
//     marginRight: SPACING.xs,
//   },
//   historyButton: {
//     padding: SPACING.sm,
//     borderRadius: BORDER_RADIUS.md,
//     backgroundColor: COLORS.BACKGROUND.tertiary,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: SPACING.xxl,
//     paddingHorizontal: SPACING.md,
//   },
//   actionSection: {
//     marginTop: SPACING.lg,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: SPACING.sm,
//   },
//   saveButton: {
//     flex: 1,
//     borderRadius: BORDER_RADIUS.lg,
//     paddingVertical: SPACING.md,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: SPACING.xs,
//     backgroundColor: COLORS.BACKGROUND.secondary,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   clearButton: {
//     flex: 1,
//     borderRadius: BORDER_RADIUS.lg,
//     paddingVertical: SPACING.md,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: SPACING.xs,
//     backgroundColor: COLORS.BACKGROUND.secondary,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   readButton: {
//     flex: 1,
//     borderRadius: BORDER_RADIUS.lg,
//     paddingVertical: SPACING.md,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: SPACING.xs,
//     borderWidth: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   readButtonDisabled: {
//     backgroundColor: COLORS.STATE.disabled,
//     borderColor: COLORS.BORDER.medium,
//   },
//   buttonText: {
//     fontWeight: TYPOGRAPHY.weights.bold,
//     color: COLORS.TEXT.secondary,
//   },
//   readButtonText: {
//     fontWeight: TYPOGRAPHY.weights.bold,
//   },
//   readButtonTextEnabled: {
//     color: COLORS.TEXT.contrast,
//   },
//   readButtonTextDisabled: {
//     color: COLORS.TEXT.disabled,
//   },
//   helperText: {
//     color: COLORS.TEXT.tertiary,
//     fontSize: TYPOGRAPHY.sizes.xs,
//     textAlign: 'center',
//     marginTop: SPACING.xs,
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: COLORS.BACKGROUND.modal,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: SPACING.md,
//   },
//   modalContent: {
//     width: '100%',
//     maxWidth: 500,
//   },
//   modalCard: {
//     backgroundColor: COLORS.BACKGROUND.secondary,
//     borderRadius: BORDER_RADIUS.xl,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 10 },
//     shadowOpacity: 0.1,
//     shadowRadius: 20,
//     elevation: 10,
//   },
//   modalHeader: {
//     padding: SPACING.lg,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.BORDER.light,
//   },
//   modalTitle: {
//     fontSize: TYPOGRAPHY.sizes.lg,
//     fontWeight: TYPOGRAPHY.weights.bold,
//     color: COLORS.TEXT.primary,
//   },
//   modalSubtitle: {
//     fontSize: TYPOGRAPHY.sizes.sm,
//     color: COLORS.TEXT.secondary,
//     marginTop: SPACING.xs,
//   },
//   searchContainer: {
//     marginTop: SPACING.md,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: COLORS.BACKGROUND.tertiary,
//     borderRadius: BORDER_RADIUS.md,
//     paddingHorizontal: SPACING.sm,
//     paddingVertical: SPACING.xs,
//   },
//   searchInput: {
//     flex: 1,
//     marginLeft: SPACING.xs,
//     color: COLORS.TEXT.primary,
//     fontSize: TYPOGRAPHY.sizes.md,
//   },
//   languageList: {
//     maxHeight: 400,
//   },
//   languageItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: SPACING.md,
//     borderBottomWidth: 1,
//     borderBottomColor: COLORS.BORDER.light,
//   },
//   flag: {
//     fontSize: TYPOGRAPHY.sizes.xl,
//     marginRight: SPACING.md,
//   },
//   languageInfo: {
//     flex: 1,
//   },
//   languageName: {
//     fontWeight: TYPOGRAPHY.weights.medium,
//     color: COLORS.TEXT.primary,
//     fontSize: TYPOGRAPHY.sizes.md,
//   },
//   languageId: {
//     fontSize: TYPOGRAPHY.sizes.xs,
//     color: COLORS.TEXT.tertiary,
//     marginTop: 2,
//   },
//   checkIcon: {
//     marginLeft: 'auto',
//   },
//   emptyState: {
//     padding: SPACING.xl,
//     alignItems: 'center',
//   },
//   emptyStateText: {
//     color: COLORS.TEXT.secondary,
//     textAlign: 'center',
//   },
//   modalCloseButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: SPACING.xs,
//     padding: SPACING.lg,
//     borderTopWidth: 1,
//     borderTopColor: COLORS.BORDER.light,
//   },
//   modalCloseText: {
//     fontWeight: TYPOGRAPHY.weights.medium,
//   },
// };















// screens/InputScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ActivityIndicator,
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
import InputArea from '../components/InputArea';
import HistoryModal from '../components/HistoryModal';
import EditModal from '../components/EditModal';
import { Notification } from '../components/Notification';
import { supportedLanguages } from '../utils/pinyinProcessor';
import { STRINGS } from '../utils/strings';
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY, getThemeForLanguage } from '../utils/themes';

type Props = {
  language: string;
  articleTitle: string;
  englishText: string;
  targetText: string;
  showSaveButton: boolean;
  isSaved: boolean;
  showSaveNotification: boolean;
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
  onHideSaveNotification?: () => void;
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
  isProcessing = false,
  processingStats,
  onLanguageChange,
  onTitleChange,
  onEnglishTextChange,
  onTargetTextChange,
  onLoadArticle,
  onNavigateToReader,
  onSave,
  onClear,
  onHideSaveNotification,
  hasContent,
}: Props) {
  const [showHistory, setShowHistory] = useState(false);
  const [editMode, setEditMode] = useState<'english' | 'target' | 'title' | null>(null);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNavigating, setIsNavigating] = useState(false); // NEW: Track navigation loading
  
  const [expandedSections, setExpandedSections] = useState({
    title: true,
    english: true,
    target: true
  });
  
  const insets = useSafeAreaInsets();
  
  // Get current language theme
  const languageTheme = useMemo(() => getThemeForLanguage(language), [language]);

  // Memoized computations
  const filteredLanguages = useMemo(() => {
    if (searchQuery.trim() === '') return supportedLanguages;
    const query = searchQuery.toLowerCase();
    return supportedLanguages.filter(lang =>
      lang.label.toLowerCase().includes(query) ||
      lang.id.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const selectedLanguageData = useMemo(() => 
    supportedLanguages.find(lang => lang.id === language) || supportedLanguages[0],
    [language]
  );

  const hasReaderContent = useMemo(() => 
    englishText.trim().length > 0 || targetText.trim().length > 0,
    [englishText, targetText]
  );

  // Determine button state - disabled if processing OR navigating OR no content
  const canNavigateToReader = useMemo(() => 
    hasReaderContent && !isProcessing && !isNavigating,
    [hasReaderContent, isProcessing, isNavigating]
  );

  // Show loader if either processing content OR navigating
  const showLoader = isProcessing || isNavigating;

  const handleLoadArticle = (article: any) => {
    onLoadArticle(article);
    setShowHistory(false);
  };

  // NEW: Handle navigation with loading state
  const handleNavigateToReader = () => {
    if (!canNavigateToReader) return;
    
    setIsNavigating(true);
    
    // Small delay to show the loader, then navigate
    setTimeout(() => {
      onNavigateToReader();
      // Reset after navigation
      setTimeout(() => {
        setIsNavigating(false);
      }, 100);
    }, 150); // 150ms delay to ensure loader is visible
  };

  const toggleSection = (section: 'title' | 'english' | 'target') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Language list item renderer
  const renderLanguageItem = ({ item: lang }: { item: any }) => (
    <TouchableOpacity
      style={[
        localStyles.languageItem,
        language === lang.id && { backgroundColor: COLORS.STATE.selected }
      ]}
      onPress={() => {
        onLanguageChange(lang.id);
        setShowLanguageModal(false);
        setSearchQuery('');
      }}
    >
      <Text style={localStyles.flag}>{lang.flag}</Text>
      <View style={localStyles.languageInfo}>
        <Text style={[
          localStyles.languageName,
          language === lang.id && { color: languageTheme.primary }
        ]}>
          {lang.label}
        </Text>
        <Text style={localStyles.languageId}>
          {lang.id} • {lang.needsRomanization ? 'Romanization' : 'Latin alphabet'}
        </Text>
      </View>
      {language === lang.id && (
        <View style={localStyles.checkIcon}>
          <Check size={20} color={languageTheme.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView 
      style={localStyles.container}
      behavior="padding"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={localStyles.innerContainer}>
          {/* Save Notification */}
          {showSaveNotification && (
            <View style={[localStyles.notificationWrapper, { top: insets.top + SPACING.md }]}>
              <Notification
                type="success"
                message={STRINGS.NOTIFICATIONS.ARTICLE_SAVED}
                onClose={onHideSaveNotification}
                duration={3000}
              />
            </View>
          )}

          {/* Header */}
          <View style={[localStyles.header, { paddingTop: Math.max(insets.top, SPACING.md) }]}>
            <View style={localStyles.headerContent}>
              {/* Language Selector */}
              <TouchableOpacity
                style={localStyles.languageSelector}
                onPress={() => setShowLanguageModal(true)}
              >
                <Text style={localStyles.languageFlag}>{selectedLanguageData.flag}</Text>
                <Text style={localStyles.languageLabel}>{selectedLanguageData.label}</Text>
                <Globe size={16} color={COLORS.TEXT.secondary} />
              </TouchableOpacity>

              {/* History Button */}
              <TouchableOpacity
                onPress={() => setShowHistory(true)}
                style={localStyles.historyButton}
              >
                <History size={24} color={COLORS.TEXT.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content Area */}
          <ScrollView 
            style={localStyles.scrollView}
            contentContainerStyle={localStyles.scrollContent}
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
              <View style={localStyles.actionSection}>
                <View style={localStyles.actionButtons}>
                  {/* Save Button */}
                  {showSaveButton && !isSaved && (
                    <TouchableOpacity
                      style={localStyles.saveButton}
                      onPress={onSave}
                    >
                      <Save size={20} color={COLORS.TEXT.secondary} />
                      <Text style={localStyles.buttonText}>{STRINGS.COMMON.SAVE}</Text>
                    </TouchableOpacity>
                  )}

                  {/* Clear Button */}
                  <TouchableOpacity
                    style={localStyles.clearButton}
                    onPress={onClear}
                  >
                    <Trash2 size={20} color={COLORS.TEXT.secondary} />
                    <Text style={localStyles.buttonText}>{STRINGS.COMMON.CLEAR}</Text>
                  </TouchableOpacity>

                  {/* Read Article Button */}
                  <TouchableOpacity
                    style={[
                      localStyles.readButton,
                      canNavigateToReader 
                        ? { backgroundColor: languageTheme.primary, borderColor: languageTheme.primary }
                        : localStyles.readButtonDisabled
                    ]}
                    onPress={handleNavigateToReader}
                    disabled={!canNavigateToReader}
                  >
                    {showLoader ? (
                      <ActivityIndicator 
                        size="small" 
                        color={hasReaderContent ? COLORS.TEXT.contrast : COLORS.TEXT.disabled} 
                      />
                    ) : (
                      <BookOpen 
                        size={20} 
                        color={canNavigateToReader ? COLORS.TEXT.contrast : COLORS.TEXT.disabled} 
                      />
                    )}
                    <Text style={[
                      localStyles.readButtonText,
                      canNavigateToReader ? localStyles.readButtonTextEnabled : localStyles.readButtonTextDisabled
                    ]}>
                      {isProcessing 
                        ? STRINGS.COMMON.PROCESSING 
                        : isNavigating 
                        ? STRINGS.COMMON.LOADING 
                        : STRINGS.COMMON.READ}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {/* Helper text */}
                {!hasReaderContent && !showLoader && (
                  <Text style={localStyles.helperText}>
                    {STRINGS.INPUT_SCREEN.ADD_TEXT_TO_ENABLE(selectedLanguageData.label)}
                  </Text>
                )}
                {isProcessing && (
                  <Text style={localStyles.helperText}>
                    {STRINGS.COMMON.PROCESSING_TEXT}
                  </Text>
                )}
                {isNavigating && (
                  <Text style={localStyles.helperText}>
                    {STRINGS.COMMON.LOADING_TEXT}
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
          style={[localStyles.modalOverlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={localStyles.modalContent}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={localStyles.modalCard}>
                <View style={localStyles.modalHeader}>
                  <Text style={localStyles.modalTitle}>{STRINGS.COMMON.SELECT_LANGUAGE}</Text>
                  <Text style={localStyles.modalSubtitle}>
                    {STRINGS.INPUT_SCREEN.LANGUAGES_COUNT(filteredLanguages.length, supportedLanguages.length)}
                  </Text>
                  
                  {/* Search Bar */}
                  <View style={localStyles.searchContainer}>
                    <Search size={18} color={COLORS.TEXT.secondary} />
                    <TextInput
                      style={localStyles.searchInput}
                      placeholder={STRINGS.INPUT_SCREEN.SEARCH_LANGUAGES}
                      placeholderTextColor={COLORS.TEXT.tertiary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {searchQuery.length > 0 && (
                      <TouchableOpacity onPress={() => setSearchQuery('')}>
                        <X size={18} color={COLORS.TEXT.secondary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                
                <FlatList
                  data={filteredLanguages}
                  renderItem={renderLanguageItem}
                  keyExtractor={(item) => item.id}
                  ListEmptyComponent={
                    <View style={localStyles.emptyState}>
                      <Text style={localStyles.emptyStateText}>
                        {STRINGS.INPUT_SCREEN.NO_LANGUAGES_FOUND(searchQuery)}
                      </Text>
                    </View>
                  }
                  style={localStyles.languageList}
                  initialNumToRender={20}
                  maxToRenderPerBatch={20}
                  windowSize={5}
                />
                
                <TouchableOpacity
                  style={localStyles.modalCloseButton}
                  onPress={() => {
                    setShowLanguageModal(false);
                    setSearchQuery('');
                  }}
                >
                  <X size={20} color={languageTheme.primary} />
                  <Text style={[localStyles.modalCloseText, { color: languageTheme.primary }]}>
                    {STRINGS.COMMON.CANCEL}
                  </Text>
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
            ? STRINGS.MODALS.EDIT_TITLE
            : editMode === 'english'
            ? STRINGS.MODALS.EDIT_ENGLISH
            : STRINGS.MODALS.EDIT_TARGET(selectedLanguageData.label)
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

const localStyles = {
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND.primary,
  },
  innerContainer: {
    flex: 1,
  },
  notificationWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1000,
    alignItems: 'center',
  },
  header: {
    backgroundColor: COLORS.BACKGROUND.secondary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.light,
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.tertiary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.BORDER.light,
  },
  languageFlag: {
    fontSize: TYPOGRAPHY.sizes.xl,
    marginRight: SPACING.xs,
  },
  languageLabel: {
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.TEXT.primary,
    marginRight: SPACING.xs,
  },
  historyButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.BACKGROUND.tertiary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  actionSection: {
    marginTop: SPACING.lg,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  saveButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.BACKGROUND.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  clearButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.BACKGROUND.secondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  readButton: {
    flex: 1,
    borderRadius: BORDER_RADIUS.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readButtonDisabled: {
    backgroundColor: COLORS.STATE.disabled,
    borderColor: COLORS.BORDER.medium,
  },
  buttonText: {
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.TEXT.secondary,
  },
  readButtonText: {
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  readButtonTextEnabled: {
    color: COLORS.TEXT.contrast,
  },
  readButtonTextDisabled: {
    color: COLORS.TEXT.disabled,
  },
  helperText: {
    color: COLORS.TEXT.tertiary,
    fontSize: TYPOGRAPHY.sizes.xs,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND.modal,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
  },
  modalCard: {
    backgroundColor: COLORS.BACKGROUND.secondary,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.light,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontWeight: TYPOGRAPHY.weights.bold,
    color: COLORS.TEXT.primary,
  },
  modalSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    color: COLORS.TEXT.secondary,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    marginTop: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND.tertiary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.xs,
    color: COLORS.TEXT.primary,
    fontSize: TYPOGRAPHY.sizes.md,
  },
  languageList: {
    maxHeight: 400,
  },
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER.light,
  },
  flag: {
    fontSize: TYPOGRAPHY.sizes.xl,
    marginRight: SPACING.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontWeight: TYPOGRAPHY.weights.medium,
    color: COLORS.TEXT.primary,
    fontSize: TYPOGRAPHY.sizes.md,
  },
  languageId: {
    fontSize: TYPOGRAPHY.sizes.xs,
    color: COLORS.TEXT.tertiary,
    marginTop: 2,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  emptyState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    color: COLORS.TEXT.secondary,
    textAlign: 'center',
  },
  modalCloseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER.light,
  },
  modalCloseText: {
    fontWeight: TYPOGRAPHY.weights.medium,
  },
};