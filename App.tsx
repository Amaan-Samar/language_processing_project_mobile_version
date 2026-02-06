// import './global.css';
// import React, { useState, useEffect, useCallback, useRef, StrictMode  } from 'react';
// import { View, Animated, Alert, ActivityIndicator } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import InputScreen from './screens/InputScreen';
// import ReaderScreen from './screens/ReaderScreen';
// import { useArticleStorage, initializeDatabase } from './hooks/useArticleStorage';
// import { useArticleProcessor } from './hooks/useArticleProcessor';
// import { SQLiteProvider } from 'expo-sqlite';

// // Logging utility
// const log = {
//   info: (context: string, message: string, data?: any) => {
//     console.log(`[INFO] [${context}] ${message}`, data ? data : '');
//   },
//   warn: (context: string, message: string, data?: any) => {
//     console.warn(`[WARN] [${context}] ${message}`, data ? data : '');
//   },
//   error: (context: string, message: string, error?: any) => {
//     console.error(`[ERROR] [${context}] ${message}`, error ? error : '');
//   },
//   debug: (context: string, message: string, data?: any) => {
//     if (__DEV__) {
//       console.log(`[DEBUG] [${context}] ${message}`, data ? data : '');
//     }
//   },
// };

// function AppContent() {
//   // const insets = useSafeAreaInsets();
  
//   const [currentScreen, setCurrentScreen] = useState<'input' | 'reader'>('input');
//   const [language, setLanguage] = useState('chinese');
//   const [englishText, setEnglishText] = useState('');
//   const [targetText, setTargetText] = useState('');
//   const [articleTitle, setArticleTitle] = useState('');
//   const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);
//   const [showSaveNotification, setShowSaveNotification] = useState(false);
//   const [isSaved, setIsSaved] = useState(false);
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [lastSavedContent, setLastSavedContent] = useState({
//     title: '',
//     english: '',
//     target: '',
//     language: '',
//   });

//   const fadeAnim = useState(new Animated.Value(0))[0];
//   const isLoadingArticle = useRef(false);

//   const { saveOrUpdateArticle, checkAndPromptExport, getArticleById } = useArticleStorage();
//   const { renderedContent, isProcessing, processingStats, hasContent: hasProcessedContent } = useArticleProcessor(englishText, targetText, language);
//   const hasContent = englishText.trim() && targetText.trim();
//   const showSaveButton = hasContent && articleTitle.trim() && (hasUnsavedChanges || !isSaved);

//   // Log initial mount
//   useEffect(() => {
//     log.info('App', 'Component mounted');
//     return () => {
//       log.info('App', 'Component unmounting');
//     };
//   }, []);

//   // Log screen changes
//   useEffect(() => {
//     log.info('Navigation', `Screen changed to: ${currentScreen}`);
//   }, [currentScreen]);

//   // Log article ID changes
//   useEffect(() => {
//     if (currentArticleId !== null) {
//       log.info('Article', `Current article ID set to: ${currentArticleId}`);
//     }
//   }, [currentArticleId]);

//   // Check if currently loaded article still exists
//   const checkArticleExists = useCallback(async () => {
//     if (currentArticleId) {
//       log.debug('Article', 'Checking if current article exists', { articleId: currentArticleId });
//       const article = await getArticleById(currentArticleId);
//       if (!article) {
//         log.warn('Article', 'Current article was deleted, clearing form', { articleId: currentArticleId });
//         clearForm();
//       } else {
//         log.debug('Article', 'Article still exists', { articleId: currentArticleId });
//       }
//     }
//   }, [currentArticleId]);

//   // Check for changes compared to last saved state
//   const checkForChanges = useCallback(() => {
//     // Don't check for changes while loading an article
//     if (isLoadingArticle.current) {
//       log.debug('Changes', 'Skipping change detection - article is loading');
//       return;
//     }

//     const currentContent = {
//       title: articleTitle,
//       english: englishText,
//       target: targetText,
//       language,
//     };

//     const hasChanged = 
//       currentContent.title !== lastSavedContent.title ||
//       currentContent.english !== lastSavedContent.english ||
//       currentContent.target !== lastSavedContent.target ||
//       currentContent.language !== lastSavedContent.language;

//     if (hasChanged !== hasUnsavedChanges) {
//       log.debug('Changes', `Unsaved changes status: ${hasChanged}`);
//       setHasUnsavedChanges(hasChanged);
//     }
    
//     if (hasChanged && isSaved) {
//       log.debug('Changes', 'Content modified after save - marking as unsaved');
//       setIsSaved(false);
//     }
//   }, [articleTitle, englishText, targetText, language, lastSavedContent, hasUnsavedChanges, isSaved]);

//   // Show save notification with animation
//   const showNotification = () => {
//     log.debug('Notification', 'Showing save notification');
//     setShowSaveNotification(true);
//     Animated.sequence([
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//       Animated.delay(2000),
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setShowSaveNotification(false);
//       log.debug('Notification', 'Save notification hidden');
//     });
//   };

//   const clearForm = () => {
//     log.info('Form', 'Clearing form data', { hadArticleId: currentArticleId !== null });
//     setEnglishText('');
//     setTargetText('');
//     setArticleTitle('');
//     setCurrentArticleId(null);
//     setIsSaved(false);
//     setHasUnsavedChanges(false);
//     setLastSavedContent({
//       title: '',
//       english: '',
//       target: '',
//       language: '',
//     });
//     // Navigate back to input screen if on reader screen
//     if (currentScreen === 'reader') {
//       log.info('Navigation', 'Returning to input screen after clear');
//       setCurrentScreen('input');
//     }
//   };

//   const handleSave = async () => {
//     if (hasContent && articleTitle.trim()) {
//       log.info('Save', 'Attempting to save article', {
//         isUpdate: currentArticleId !== null,
//         articleId: currentArticleId,
//         titleLength: articleTitle.length,
//         englishTextLength: englishText.length,
//         targetTextLength: targetText.length,
//       });

//       try {
//         const id = await saveOrUpdateArticle({
//           id: currentArticleId,
//           title: articleTitle,
//           english: englishText,
//           target: targetText,
//           language,
//           timestamp: Date.now(),
//         });
        
//         if (id) {
//           log.info('Save', 'Article saved successfully', { articleId: id, wasUpdate: currentArticleId !== null });
//           setCurrentArticleId(id);
//           setLastSavedContent({
//             title: articleTitle,
//             english: englishText,
//             target: targetText,
//             language,
//           });
          
//           setIsSaved(true);
//           setHasUnsavedChanges(false);
//           showNotification();
//           checkAndPromptExport();
//         } else {
//           log.error('Save', 'Failed to save article - no ID returned');
//           Alert.alert('Error', 'Failed to save article. Please try again.');
//         }
//       } catch (error) {
//         log.error('Save', 'Exception during save operation', error);
//         Alert.alert('Error', 'Failed to save article. Please try again.');
//       }
//     } else {
//       log.warn('Save', 'Save attempted with missing content', {
//         hasContent,
//         hasTitle: articleTitle.trim().length > 0,
//       });
//     }
//   };

//   const handleClear = () => {
//     log.info('Clear', 'Clear confirmation dialog shown');
//     Alert.alert(
//       'Clear Article',
//       'Are you sure you want to clear all content? This cannot be undone.',
//       [
//         { 
//           text: 'Cancel', 
//           style: 'cancel',
//           onPress: () => log.debug('Clear', 'Clear cancelled by user'),
//         },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: () => {
//             log.info('Clear', 'Clear confirmed by user');
//             clearForm();
//           },
//         },
//       ]
//     );
//   };

//   const handleLoadArticle = (article: any) => {
//     log.info('Load', 'Loading article', {
//       articleId: article.id,
//       title: article.title,
//       language: article.language,
//     });
    
//     // Set loading flag to prevent change detection
//     isLoadingArticle.current = true;
    
//     // Update all state at once
//     setArticleTitle(article.title);
//     setEnglishText(article.english_text);
//     setTargetText(article.target_text);
//     setLanguage(article.language);
//     setCurrentArticleId(article.id);
    
//     // Set saved content to match loaded article
//     const savedContent = {
//       title: article.title,
//       english: article.english_text,
//       target: article.target_text,
//       language: article.language,
//     };
    
//     setLastSavedContent(savedContent);
//     setIsSaved(true);
//     setHasUnsavedChanges(false);
    
//     // Clear loading flag after a brief delay to ensure all state updates have processed
//     setTimeout(() => {
//       isLoadingArticle.current = false;
//       log.debug('Load', 'Article loading completed', { articleId: article.id });
//     }, 100);
//   };

//   // Add handler to check if article exists when coming back from history
//   const handleHistoryClose = useCallback(() => {
//     log.debug('History', 'History screen closed - checking article existence');
//     checkArticleExists();
//   }, [checkArticleExists]);

//   // Only check for changes, don't reset saved state
//   useEffect(() => {
//     if (!isLoadingArticle.current) {
//       checkForChanges();
//     }
//   }, [checkForChanges]);

//   const handleEnglishTextChange = useCallback((text: string) => {
//     log.debug('Input', 'English text changed', { length: text.length });
//     setEnglishText(text);
//   }, []);

//   const handleTargetTextChange = useCallback((text: string) => {
//     log.debug('Input', 'Target text changed', { length: text.length });
//     setTargetText(text);
//   }, []);

//   const handleTitleChange = useCallback((text: string) => {
//     log.debug('Input', 'Title changed', { length: text.length });
//     setArticleTitle(text);
//   }, []);

//   const handleLanguageChange = useCallback((lang: string) => {
//     log.info('Language', `Language changed to: ${lang}`);
//     setLanguage(lang);
//   }, []);

//   return (
//     <View className="flex-1 bg-gray-50">
//       <StatusBar style="auto" />

//       {currentScreen === 'input' ? (
//         <InputScreen
//           language={language}
//           articleTitle={articleTitle}
//           englishText={englishText}
//           targetText={targetText}
//           showSaveButton={showSaveButton}
//           isSaved={isSaved}
//           showSaveNotification={showSaveNotification}
//           fadeAnim={fadeAnim}
//           isProcessing={isProcessing}
//           processingStats={processingStats}
//           onLanguageChange={handleLanguageChange}
//           onTitleChange={handleTitleChange}
//           onEnglishTextChange={handleEnglishTextChange}
//           onTargetTextChange={handleTargetTextChange}
//           onLoadArticle={handleLoadArticle}
//           onHistoryClose={handleHistoryClose}
//           onNavigateToReader={() => setCurrentScreen('reader')}
//           onSave={handleSave}
//           onClear={handleClear}
//           hasContent={hasContent}
//         />
//       ) : (
//         <ReaderScreen
//           articleTitle={articleTitle}
//           renderedContent={renderedContent}
//           showSaveButton={showSaveButton}
//           isSaved={isSaved}
//           showSaveNotification={showSaveNotification}
//           fadeAnim={fadeAnim}
//           onSave={handleSave}
//           onClear={handleClear}
//           onBack={() => setCurrentScreen('input')}
//         />
//       )}
//     </View>
//   );
// }

// export default function App() {
//   return (
//   <StrictMode>
//       <SQLiteProvider
//           databaseName="articles.db"
//           onInit={initializeDatabase}
//           options={{
//             enableChangeListener: true,
//           }}
//           >
//         <SafeAreaProvider>
//             <AppContent />
//         </SafeAreaProvider>
//       </SQLiteProvider>
//     </StrictMode >
//   );
// }


// App.tsx
import './global.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InputScreen from './screens/InputScreen';
import ReaderScreen from './screens/ReaderScreen';
import { useArticleStorage, initializeDatabase } from './hooks/useArticleStorage';
import { useArticleProcessor } from './hooks/useArticleProcessor';
import { SQLiteProvider } from 'expo-sqlite';
import { createLogger } from './utils/logger';
import { STRINGS } from './utils/strings';
import { useSettings } from './hooks/useSettings';


// Create logger instances
const appLogger = createLogger('App');
const navigationLogger = createLogger('Navigation');
const articleLogger = createLogger('Article');

function AppContent() {
  const { settings, isLoading } = useSettings()
  const [currentScreen, setCurrentScreen] = useState<'input' | 'reader'>('input');
  const [language, setLanguage] = useState('chinese');
  const [englishText, setEnglishText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [articleTitle, setArticleTitle] = useState('');
  const [currentArticleId, setCurrentArticleId] = useState<number | null>(null);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedContent, setLastSavedContent] = useState({
    title: '',
    english: '',
    target: '',
    language: '',
  });

  const isLoadingArticle = useRef(false);

  const { saveOrUpdateArticle, checkAndPromptExport, getArticleById } = useArticleStorage();
  const { renderedContent, isProcessing, processingStats, hasContent: hasProcessedContent } = useArticleProcessor(englishText, targetText, language);
  const hasContent = englishText.trim() && targetText.trim();
  const showSaveButton = hasContent && articleTitle.trim() && (hasUnsavedChanges || !isSaved);

  useEffect(() => {
    if (!isLoading) {
      setLanguage(settings.language);
    }
  }, [settings.language, isLoading]);

  // Log initial mount
  useEffect(() => {
    appLogger.info('Component mounted');
    return () => {
      appLogger.info('Component unmounting');
    };
  }, []);

  // Log screen changes
  useEffect(() => {
    navigationLogger.info(`Screen changed to: ${currentScreen}`);
  }, [currentScreen]);

  // Check if currently loaded article still exists
  const checkArticleExists = useCallback(async () => {
    if (currentArticleId) {
      articleLogger.debug('Checking if current article exists', { articleId: currentArticleId });
      const article = await getArticleById(currentArticleId);
      if (!article) {
        articleLogger.warn('Current article was deleted, clearing form', { articleId: currentArticleId });
        clearForm();
      }
    }
  }, [currentArticleId]);

  // Check for changes compared to last saved state
  const checkForChanges = useCallback(() => {
    if (isLoadingArticle.current) return;

    const currentContent = {
      title: articleTitle,
      english: englishText,
      target: targetText,
      language,
    };

    const hasChanged = 
      currentContent.title !== lastSavedContent.title ||
      currentContent.english !== lastSavedContent.english ||
      currentContent.target !== lastSavedContent.target ||
      currentContent.language !== lastSavedContent.language;

    if (hasChanged !== hasUnsavedChanges) {
      setHasUnsavedChanges(hasChanged);
    }
    
    if (hasChanged && isSaved) {
      setIsSaved(false);
    }
  }, [articleTitle, englishText, targetText, language, lastSavedContent, hasUnsavedChanges, isSaved]);

  // Show save notification
  const showNotification = useCallback(() => {
    appLogger.debug('Showing save notification');
    setShowSaveNotification(true);
    const timer = setTimeout(() => {
      setShowSaveNotification(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const clearForm = () => {
    appLogger.info('Clearing form data', { hadArticleId: currentArticleId !== null });
    setEnglishText('');
    setTargetText('');
    setArticleTitle('');
    setCurrentArticleId(null);
    setIsSaved(false);
    setHasUnsavedChanges(false);
    setLastSavedContent({
      title: '',
      english: '',
      target: '',
      language: '',
    });
    
    if (currentScreen === 'reader') {
      navigationLogger.info('Returning to input screen after clear');
      setCurrentScreen('input');
    }
  };

  const handleSave = async () => {
    if (hasContent && articleTitle.trim()) {
      appLogger.info('Attempting to save article', {
        isUpdate: currentArticleId !== null,
        articleId: currentArticleId,
      });

      try {
        const id = await saveOrUpdateArticle({
          id: currentArticleId,
          title: articleTitle,
          english: englishText,
          target: targetText,
          language,
          timestamp: Date.now(),
        });
        
        if (id) {
          appLogger.info('Article saved successfully', { articleId: id, wasUpdate: currentArticleId !== null });
          setCurrentArticleId(id);
          setLastSavedContent({
            title: articleTitle,
            english: englishText,
            target: targetText,
            language,
          });
          
          setIsSaved(true);
          setHasUnsavedChanges(false);
          showNotification();
          checkAndPromptExport();
        } else {
          appLogger.error('Failed to save article - no ID returned');
          Alert.alert(STRINGS.COMMON.ERROR, STRINGS.NOTIFICATIONS.SAVING_FAILED);
        }
      } catch (error) {
        appLogger.error('Exception during save operation', error);
        Alert.alert(STRINGS.COMMON.ERROR, STRINGS.NOTIFICATIONS.SAVING_FAILED);
      }
    } else {
      appLogger.warn('Save attempted with missing content', {
        hasContent,
        hasTitle: articleTitle.trim().length > 0,
      });
    }
  };

  const handleClear = () => {
    appLogger.info('Clear confirmation dialog shown');
    Alert.alert(
      STRINGS.COMMON.CLEAR,
      STRINGS.NOTIFICATIONS.CLEAR_CONFIRMATION,
      [
        { 
          text: STRINGS.NOTIFICATIONS.CLEAR_CANCEL, 
          style: 'cancel',
        },
        {
          text: STRINGS.NOTIFICATIONS.CLEAR_CONFIRM,
          style: 'destructive',
          onPress: clearForm,
        },
      ]
    );
  };

  const handleLoadArticle = (article: any) => {
    appLogger.info('Loading article', {
      articleId: article.id,
      title: article.title,
    });
    
    isLoadingArticle.current = true;
    
    setArticleTitle(article.title);
    setEnglishText(article.english_text);
    setTargetText(article.target_text);
    setLanguage(article.language);
    setCurrentArticleId(article.id);
    
    const savedContent = {
      title: article.title,
      english: article.english_text,
      target: article.target_text,
      language: article.language,
    };
    
    setLastSavedContent(savedContent);
    setIsSaved(true);
    setHasUnsavedChanges(false);
    
    setTimeout(() => {
      isLoadingArticle.current = false;
    }, 100);
  };

  const handleHistoryClose = useCallback(() => {
    checkArticleExists();
  }, [checkArticleExists]);

  // Only check for changes, don't reset saved state
  useEffect(() => {
    if (!isLoadingArticle.current) {
      checkForChanges();
    }
  }, [checkForChanges]);

  const handleEnglishTextChange = useCallback((text: string) => {
    setEnglishText(text);
  }, []);

  const handleTargetTextChange = useCallback((text: string) => {
    setTargetText(text);
  }, []);

  const handleTitleChange = useCallback((text: string) => {
    setArticleTitle(text);
  }, []);

  const handleLanguageChange = useCallback((lang: string) => {
    appLogger.info(`Language changed to: ${lang}`);
    setLanguage(lang);
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="auto" />

      {currentScreen === 'input' ? (
        <InputScreen
          language={language}
          articleTitle={articleTitle}
          englishText={englishText}
          targetText={targetText}
          showSaveButton={showSaveButton}
          isSaved={isSaved}
          showSaveNotification={showSaveNotification}
          isProcessing={isProcessing}
          processingStats={processingStats}
          onLanguageChange={handleLanguageChange}
          onTitleChange={handleTitleChange}
          onEnglishTextChange={handleEnglishTextChange}
          onTargetTextChange={handleTargetTextChange}
          onLoadArticle={handleLoadArticle}
          onHistoryClose={handleHistoryClose}
          onNavigateToReader={() => setCurrentScreen('reader')}
          onSave={handleSave}
          onClear={handleClear}
          onHideSaveNotification={() => setShowSaveNotification(false)}
          hasContent={hasContent}
        />
      ) : (
        <ReaderScreen
          articleTitle={articleTitle}
          renderedContent={renderedContent}
          showSaveButton={showSaveButton}
          isSaved={isSaved}
          showSaveNotification={showSaveNotification}
          onSave={handleSave}
          onClear={handleClear}
          onBack={() => setCurrentScreen('input')}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <SQLiteProvider
      databaseName="articles.db"
      onInit={initializeDatabase}
      options={{
        enableChangeListener: true,
      }}
    >
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}