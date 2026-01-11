// import './global.css';
// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { View, Animated, Alert } from 'react-native';
// import { StatusBar } from 'expo-status-bar';
// import InputScreen from './screens/InputScreen';
// import ReaderScreen from './screens/ReaderScreen';
// import { useArticleStorage } from './hooks/useArticleStorage';
// import { useArticleProcessor } from './hooks/useArticleProcessor';

// export default function App() {
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

//   const { saveOrUpdateArticle, checkAndPromptExport } = useArticleStorage();
//   const { renderedContent } = useArticleProcessor(englishText, targetText, language);

//   const hasContent = englishText.trim() && targetText.trim();
//   const showSaveButton = hasContent && articleTitle.trim() && (hasUnsavedChanges || !isSaved);

//   // Check for changes compared to last saved state
//   const checkForChanges = useCallback(() => {
//     // Don't check for changes while loading an article
//     if (isLoadingArticle.current) {
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

//     setHasUnsavedChanges(hasChanged);
    
//     if (hasChanged) {
//       setIsSaved(false);
//     }
//   }, [articleTitle, englishText, targetText, language, lastSavedContent]);

//   // Show save notification with animation
//   const showNotification = () => {
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
//     });
//   };

//   const handleSave = async () => {
//     if (hasContent && articleTitle.trim()) {
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
//           Alert.alert('Error', 'Failed to save article. Please try again.');
//         }
//       } catch (error) {
//         console.error('Save error:', error);
//         Alert.alert('Error', 'Failed to save article. Please try again.');
//       }
//     }
//   };

//   const handleClear = () => {
//     Alert.alert(
//       'Clear Article',
//       'Are you sure you want to clear all content? This cannot be undone.',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Clear',
//           style: 'destructive',
//           onPress: () => {
//             setEnglishText('');
//             setTargetText('');
//             setArticleTitle('');
//             setCurrentArticleId(null);
//             setIsSaved(false);
//             setHasUnsavedChanges(false);
//             setLastSavedContent({
//               title: '',
//               english: '',
//               target: '',
//               language: '',
//             });
//             // Navigate back to input screen if on reader screen
//             if (currentScreen === 'reader') {
//               setCurrentScreen('input');
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handleLoadArticle = (article: any) => {
//     console.log('Loading article:', article.id);
    
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
//     }, 100);
    
//     console.log('Article loaded successfully');
//   };

//   // Only check for changes, don't reset saved state
//   useEffect(() => {
//     if (!isLoadingArticle.current) {
//       checkForChanges();
//     }
//   }, [checkForChanges]);

//   const handleEnglishTextChange = useCallback((text: string) => {
//     setEnglishText(text);
//   }, []);

//   const handleTargetTextChange = useCallback((text: string) => {
//     setTargetText(text);
//   }, []);

//   const handleTitleChange = useCallback((text: string) => {
//     setArticleTitle(text);
//   }, []);

//   const handleLanguageChange = useCallback((lang: string) => {
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
//           onLanguageChange={handleLanguageChange}
//           onTitleChange={handleTitleChange}
//           onEnglishTextChange={handleEnglishTextChange}
//           onTargetTextChange={handleTargetTextChange}
//           onLoadArticle={handleLoadArticle}
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



import './global.css';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Animated, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import InputScreen from './screens/InputScreen';
import ReaderScreen from './screens/ReaderScreen';
import { useArticleStorage } from './hooks/useArticleStorage';
import { useArticleProcessor } from './hooks/useArticleProcessor';

export default function App() {
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

  const fadeAnim = useState(new Animated.Value(0))[0];
  const isLoadingArticle = useRef(false);

  const { saveOrUpdateArticle, checkAndPromptExport, getArticleById } = useArticleStorage();
  const { renderedContent } = useArticleProcessor(englishText, targetText, language);

  const hasContent = englishText.trim() && targetText.trim();
  const showSaveButton = hasContent && articleTitle.trim() && (hasUnsavedChanges || !isSaved);

  // Check if currently loaded article still exists
  const checkArticleExists = useCallback(async () => {
    if (currentArticleId) {
      const article = await getArticleById(currentArticleId);
      if (!article) {
        // Article was deleted, clear the form
        console.log('Current article was deleted, clearing form');
        clearForm();
      }
    }
  }, [currentArticleId]);

  // Check for changes compared to last saved state
  const checkForChanges = useCallback(() => {
    // Don't check for changes while loading an article
    if (isLoadingArticle.current) {
      return;
    }

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

    setHasUnsavedChanges(hasChanged);
    
    if (hasChanged) {
      setIsSaved(false);
    }
  }, [articleTitle, englishText, targetText, language, lastSavedContent]);

  // Show save notification with animation
  const showNotification = () => {
    setShowSaveNotification(true);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSaveNotification(false);
    });
  };

  const clearForm = () => {
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
    // Navigate back to input screen if on reader screen
    if (currentScreen === 'reader') {
      setCurrentScreen('input');
    }
  };

  const handleSave = async () => {
    if (hasContent && articleTitle.trim()) {
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
          Alert.alert('Error', 'Failed to save article. Please try again.');
        }
      } catch (error) {
        console.error('Save error:', error);
        Alert.alert('Error', 'Failed to save article. Please try again.');
      }
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Article',
      'Are you sure you want to clear all content? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearForm,
        },
      ]
    );
  };

  const handleLoadArticle = (article: any) => {
    console.log('Loading article:', article.id);
    
    // Set loading flag to prevent change detection
    isLoadingArticle.current = true;
    
    // Update all state at once
    setArticleTitle(article.title);
    setEnglishText(article.english_text);
    setTargetText(article.target_text);
    setLanguage(article.language);
    setCurrentArticleId(article.id);
    
    // Set saved content to match loaded article
    const savedContent = {
      title: article.title,
      english: article.english_text,
      target: article.target_text,
      language: article.language,
    };
    
    setLastSavedContent(savedContent);
    setIsSaved(true);
    setHasUnsavedChanges(false);
    
    // Clear loading flag after a brief delay to ensure all state updates have processed
    setTimeout(() => {
      isLoadingArticle.current = false;
    }, 100);
    
    console.log('Article loaded successfully');
  };

  // Add handler to check if article exists when coming back from history
  const handleHistoryClose = useCallback(() => {
    // Check if the currently loaded article still exists
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
          fadeAnim={fadeAnim}
          onLanguageChange={handleLanguageChange}
          onTitleChange={handleTitleChange}
          onEnglishTextChange={handleEnglishTextChange}
          onTargetTextChange={handleTargetTextChange}
          onLoadArticle={handleLoadArticle}
          onHistoryClose={handleHistoryClose}
          onNavigateToReader={() => setCurrentScreen('reader')}
          onSave={handleSave}
          onClear={handleClear}
          hasContent={hasContent}
        />
      ) : (
        <ReaderScreen
          articleTitle={articleTitle}
          renderedContent={renderedContent}
          showSaveButton={showSaveButton}
          isSaved={isSaved}
          showSaveNotification={showSaveNotification}
          fadeAnim={fadeAnim}
          onSave={handleSave}
          onClear={handleClear}
          onBack={() => setCurrentScreen('input')}
        />
      )}
    </View>
  );
}