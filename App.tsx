// import { ScreenContent } from 'components/ScreenContent';
// import { StatusBar } from 'expo-status-bar';


// export default function App() {
//   return (
//     <>
//       <ScreenContent title="Home" path="App.tsx"></ScreenContent>
//       <StatusBar style="auto" />
//     </>
//   );
// }


import './global.css';
import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import LanguageSelector from './components/LanguageSelector';
import InputArea from './components/InputArea';
import RenderedArticle from './components/RenderedArticle';
import ClearButton from './components/ClearButton';
import EditModal from './components/EditModal';
import { useArticleStorage } from './hooks/useArticleStorage';
import { useScrollVisibility } from './hooks/useScrollVisibility';
import { useArticleProcessor } from './hooks/useArticleProcessor';

export default function App() {
  const [language, setLanguage] = useState('chinese');
  const [englishText, setEnglishText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [editMode, setEditMode] = useState<'english' | 'target' | null>(null);

  const { saveArticle, checkAndPromptExport } = useArticleStorage();
  const { scrollY, showButton, handleScroll } = useScrollVisibility();
  const { renderedContent } = useArticleProcessor(
    englishText,
    targetText,
    language
  );

  // const handleSave = () => {
  //   if (englishText.trim() && targetText.trim()) {
  //     saveArticle({
  //       english: englishText,
  //       target: targetText,
  //       language,
  //       timestamp: Date.now(),
  //     });
  //     checkAndPromptExport();
  //   }
  // };

  const handleSave = async () => {
  if (englishText.trim() && targetText.trim()) {
    await saveArticle({
      english: englishText,
      target: targetText,
      language,
      timestamp: Date.now(),
    });
    checkAndPromptExport();
  }
};

  const handleClear = () => {
    setEnglishText('');
    setTargetText('');
  };

  return (
    <View className={styles.container}>
      <StatusBar style="auto" />
      
      <LanguageSelector 
        selectedLanguage={language} 
        onLanguageChange={setLanguage} 
      />
      
      <InputArea
        englishText={englishText}
        targetText={targetText}
        language={language}
        onEditEnglish={() => setEditMode('english')}
        onEditTarget={() => setEditMode('target')}
      />

      <ScrollView
        className={styles.scrollView}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <RenderedArticle content={renderedContent} />
      </ScrollView>

      <ClearButton visible={showButton} onPress={handleClear} />

      <EditModal
        visible={editMode !== null}
        title={editMode === 'english' ? 'English' : language}
        text={editMode === 'english' ? englishText : targetText}
        onTextChange={editMode === 'english' ? setEnglishText : setTargetText}
        onClose={() => setEditMode(null)}
      />
    </View>
  );
}

const styles = {
  container: 'flex-1 bg-gray-50',
  scrollView: 'flex-1 px-4',
};