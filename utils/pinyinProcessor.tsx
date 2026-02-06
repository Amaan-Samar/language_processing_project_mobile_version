// // utils/pinyinProcessor.ts
// import { pinyin } from 'pinyin-pro';
// import getSlug from 'speakingurl';
// import { RenderedContent, WordWithPinyin } from '../types';

// // Cache for romanizations
// const romanizationCache = new Map<string, string>();
// let isCacheEnabled = false; // Default enabled

// /**
//  * Enable or disable caching
//  */
// export const setCacheEnabled = (enabled: boolean) => {
//   isCacheEnabled = enabled;
//   if (!enabled) {
//     // Clear cache when disabled
//     clearAllCaches();
//   }
// };

// /**
//  * Check if cache is enabled
//  */
// export const isCacheActive = (): boolean => {
//   return isCacheEnabled;
// };

// export const processText = (
//   englishText: string,
//   targetText: string,
//   language: string
// ): RenderedContent[] => {
//   const englishParagraphs = englishText.split('\n').filter((p) => p.trim());
//   const targetParagraphs = targetText.split('\n').filter((p) => p.trim());
//   const content: RenderedContent[] = [];
//   const maxLength = Math.max(englishParagraphs.length, targetParagraphs.length);

//   for (let i = 0; i < maxLength; i++) {
//     // Add English paragraph
//     if (englishParagraphs[i]) {
//       content.push({
//         type: 'english',
//         text: englishParagraphs[i],
//         id: `en-${i}`,
//       });
//     }

//     // Add Target language paragraph
//     if (targetParagraphs[i]) {
//       const words = processTargetLanguage(targetParagraphs[i], language, i);
//       content.push({
//         type: 'target',
//         words,
//         id: `tg-${i}`,
//       });
//     }
//   }

//   return content;
// };

// const processTargetLanguage = (
//   text: string,
//   language: string,
//   paragraphIndex: number
// ): WordWithPinyin[] => {
//   const languageConfig = supportedLanguages.find(lang => lang.id === language);
  
//   if (!languageConfig?.needsRomanization) {
//     return text.split(' ').map((word, idx) => ({
//       char: word,
//       pinyin: '',
//       showPinyin: false,
//       id: `${paragraphIndex}-${idx}`,
//     }));
//   }

//   if (language === 'chinese') {
//     return processChineseCharacters(text, paragraphIndex);
//   }

//   return processWordByWord(text, language, paragraphIndex);
// };

// const processChineseCharacters = (
//   text: string,
//   paragraphIndex: number
// ): WordWithPinyin[] => {
//   const characters = text.split('');
//   const seenPairs = new Map<string, boolean>();
//   const wordsWithPinyin: WordWithPinyin[] = [];

//   characters.forEach((char, idx) => {
//     if (!char.trim()) {
//       wordsWithPinyin.push({
//         char: ' ',
//         pinyin: '',
//         showPinyin: false,
//         id: `${paragraphIndex}-${idx}`,
//       });
//       return;
//     }

//     if (/[\u4e00-\u9fa5]/.test(char)) {
//       const cacheKey = `chinese-${char}`;
//       let py: string;
      
//       if (isCacheEnabled && romanizationCache.has(cacheKey)) {
//         py = romanizationCache.get(cacheKey)!;
//       } else {
//         py = pinyin(char, { toneType: 'symbol' });
//         if (isCacheEnabled) {
//           romanizationCache.set(cacheKey, py);
//         }
//       }

//       const pair = `${char}-${py}`;
//       const isFirstOccurrence = !seenPairs.has(pair);
//       seenPairs.set(pair, true);

//       wordsWithPinyin.push({
//         char,
//         pinyin: py,
//         showPinyin: isFirstOccurrence,
//         id: `${paragraphIndex}-${idx}`,
//       });
//     } else {
//       wordsWithPinyin.push({
//         char,
//         pinyin: '',
//         showPinyin: false,
//         id: `${paragraphIndex}-${idx}`,
//       });
//     }
//   });

//   return wordsWithPinyin;
// };

// const processWordByWord = (
//   text: string,
//   language: string,
//   paragraphIndex: number
// ): WordWithPinyin[] => {
//   const tokens = text.split(/(\s+|[.,!?;:()""''—–\-\[\]{}])/);
//   const seenPairs = new Map<string, boolean>();
//   const wordsWithPinyin: WordWithPinyin[] = [];
//   let wordIndex = 0;

//   tokens.forEach((token) => {
//     if (!token) return;

//     if (/^\s+$/.test(token) || /^[.,!?;:()""''—–\-\[\]{}]+$/.test(token)) {
//       wordsWithPinyin.push({
//         char: token,
//         pinyin: '',
//         showPinyin: false,
//         id: `${paragraphIndex}-${wordIndex++}`,
//       });
//       return;
//     }

//     const romanization = getWordRomanization(token, language);
    
//     if (romanization && romanization !== token.toLowerCase()) {
//       const pair = `${token}-${romanization}`;
//       const isFirstOccurrence = !seenPairs.has(pair);
//       seenPairs.set(pair, true);

//       wordsWithPinyin.push({
//         char: token,
//         pinyin: romanization,
//         showPinyin: isFirstOccurrence,
//         id: `${paragraphIndex}-${wordIndex++}`,
//       });
//     } else {
//       wordsWithPinyin.push({
//         char: token,
//         pinyin: '',
//         showPinyin: false,
//         id: `${paragraphIndex}-${wordIndex++}`,
//       });
//     }
//   });

//   return wordsWithPinyin;
// };

// const getWordRomanization = (word: string, language: string): string => {
//   const hasNonLatin = /[^\u0000-\u007F\u0080-\u00FF]/.test(word);
//   if (!hasNonLatin) {
//     return '';
//   }

//   const cacheKey = `${language}-${word}`;
  
//   if (isCacheEnabled && romanizationCache.has(cacheKey)) {
//     return romanizationCache.get(cacheKey)!;
//   }

//   let romanization = '';
//   const langCode = getLanguageCode(language);

//   try {
//     romanization = getSlug(word, {
//       lang: langCode,
//       symbols: false,
//       maintainCase: true,
//       separator: ' '
//     }).trim();

//     if (!romanization || romanization === word.toLowerCase()) {
//       romanization = '';
//     }
//   } catch (error) {
//     console.warn(`Failed to romanize word "${word}" for language "${language}":`, error);
//     romanization = '';
//   }

//   if (isCacheEnabled) {
//     romanizationCache.set(cacheKey, romanization);
//   }
  
//   return romanization;
// };

// const getLanguageCode = (languageId: string): string | false => {
//   const langMap: Record<string, string | false> = {
//     'russian': 'ru',
//     'greek': 'gr',
//     'arabic': 'ar',
//     'persian': 'fa',
//     'ukrainian': 'uk',
//     'bulgarian': 'ru',
//     'serbian': 'sr',
//     'german': 'de',
//     'french': 'fr',
//     'spanish': 'es',
//     'italian': 'it',
//     'portuguese': 'pt',
//     'dutch': 'nl',
//     'polish': 'pl',
//     'czech': 'cs',
//     'hungarian': 'hu',
//     'romanian': 'ro',
//     'turkish': 'tr',
//     'swedish': 'sv',
//     'finnish': 'fi',
//     'slovak': 'sk',
//     'latvian': 'lv',
//     'lithuanian': 'lt',
//     'japanese': false,
//     'korean': false,
//     'thai': false,
//     'hindi': false,
//     'bengali': false,
//     'hebrew': false,
//     'urdu': false,
//   };

//   return langMap[languageId] ?? false;
// };

// export const supportedLanguages = [
//   { id: 'chinese', label: 'Chinese', flag: '🇨🇳', needsRomanization: true },
//   { id: 'russian', label: 'Russian', flag: '🇷🇺', needsRomanization: true },
//   { id: 'spanish', label: 'Spanish', flag: '🇪🇸', needsRomanization: false },
//   { id: 'french', label: 'French', flag: '🇫🇷', needsRomanization: false },
//   { id: 'german', label: 'German', flag: '🇩🇪', needsRomanization: false },
//   { id: 'italian', label: 'Italian', flag: '🇮🇹', needsRomanization: false },
//   { id: 'portuguese', label: 'Portuguese', flag: '🇵🇹', needsRomanization: false },
//   { id: 'japanese', label: 'Japanese', flag: '🇯🇵', needsRomanization: true },
//   { id: 'korean', label: 'Korean', flag: '🇰🇷', needsRomanization: true },
//   { id: 'arabic', label: 'Arabic', flag: '🇸🇦', needsRomanization: true },
//   { id: 'hindi', label: 'Hindi', flag: '🇮🇳', needsRomanization: true },
//   { id: 'bengali', label: 'Bengali', flag: '🇧🇩', needsRomanization: true },
//   { id: 'hebrew', label: 'Hebrew', flag: '🇮🇱', needsRomanization: true },
//   { id: 'greek', label: 'Greek', flag: '🇬🇷', needsRomanization: true },
//   { id: 'thai', label: 'Thai', flag: '🇹🇭', needsRomanization: true },
//   { id: 'vietnamese', label: 'Vietnamese', flag: '🇻🇳', needsRomanization: false },
//   { id: 'turkish', label: 'Turkish', flag: '🇹🇷', needsRomanization: false },
//   { id: 'dutch', label: 'Dutch', flag: '🇳🇱', needsRomanization: false },
//   { id: 'swedish', label: 'Swedish', flag: '🇸🇪', needsRomanization: false },
//   { id: 'norwegian', label: 'Norwegian', flag: '🇳🇴', needsRomanization: false },
//   { id: 'danish', label: 'Danish', flag: '🇩🇰', needsRomanization: false },
//   { id: 'finnish', label: 'Finnish', flag: '🇫🇮', needsRomanization: false },
//   { id: 'polish', label: 'Polish', flag: '🇵🇱', needsRomanization: false },
//   { id: 'czech', label: 'Czech', flag: '🇨🇿', needsRomanization: false },
//   { id: 'hungarian', label: 'Hungarian', flag: '🇭🇺', needsRomanization: false },
//   { id: 'romanian', label: 'Romanian', flag: '🇷🇴', needsRomanization: false },
//   { id: 'bulgarian', label: 'Bulgarian', flag: '🇧🇬', needsRomanization: true },
//   { id: 'ukrainian', label: 'Ukrainian', flag: '🇺🇦', needsRomanization: true },
//   { id: 'serbian', label: 'Serbian', flag: '🇷🇸', needsRomanization: true },
//   { id: 'croatian', label: 'Croatian', flag: '🇭🇷', needsRomanization: false },
//   { id: 'slovak', label: 'Slovak', flag: '🇸🇰', needsRomanization: false },
//   { id: 'slovenian', label: 'Slovenian', flag: '🇸🇮', needsRomanization: false },
//   { id: 'lithuanian', label: 'Lithuanian', flag: '🇱🇹', needsRomanization: false },
//   { id: 'latvian', label: 'Latvian', flag: '🇱🇻', needsRomanization: false },
//   { id: 'estonian', label: 'Estonian', flag: '🇪🇪', needsRomanization: false },
//   { id: 'indonesian', label: 'Indonesian', flag: '🇮🇩', needsRomanization: false },
//   { id: 'malay', label: 'Malay', flag: '🇲🇾', needsRomanization: false },
//   { id: 'filipino', label: 'Filipino', flag: '🇵🇭', needsRomanization: false },
//   { id: 'swahili', label: 'Swahili', flag: '🇰🇪', needsRomanization: false },
//   { id: 'persian', label: 'Persian', flag: '🇮🇷', needsRomanization: true },
//   { id: 'urdu', label: 'Urdu', flag: '🇵🇰', needsRomanization: true },
// ];

// export const clearAllCaches = () => {
//   romanizationCache.clear();
// };

// export const clearLanguageCache = (language: string) => {
//   const keysToDelete: string[] = [];
//   romanizationCache.forEach((_, key) => {
//     if (key.startsWith(`${language}-`)) {
//       keysToDelete.push(key);
//     }
//   });
//   keysToDelete.forEach(key => romanizationCache.delete(key));
// };

// export const getCacheStats = () => {
//   return {
//     totalEntries: romanizationCache.size,
//     cacheEnabled: isCacheEnabled,
//     languages: new Set(
//       Array.from(romanizationCache.keys()).map(key => key.split('-')[0])
//     ).size
//   };
// };



// utils/pinyinProcessor.ts
import { pinyin } from 'pinyin-pro';
import getSlug from 'speakingurl';
import { RenderedContent, WordWithPinyin } from '../types';
import { STRINGS } from './strings';

export const processText = (
  englishText: string,
  targetText: string,
  language: string,
  romanizationFirstOccurrence: boolean = true
): RenderedContent[] => {
  const englishParagraphs = englishText.split('\n').filter((p) => p.trim());
  const targetParagraphs = targetText.split('\n').filter((p) => p.trim());
  const content: RenderedContent[] = [];
  const maxLength = Math.max(englishParagraphs.length, targetParagraphs.length);

  for (let i = 0; i < maxLength; i++) {
    // Add English paragraph
    if (englishParagraphs[i]) {
      content.push({
        type: 'english',
        text: englishParagraphs[i],
        id: `en-${i}`,
      });
    }

    // Add Target language paragraph
    if (targetParagraphs[i]) {
      const words = processTargetLanguage(
        targetParagraphs[i],
        language,
        i,
        romanizationFirstOccurrence
      );
      content.push({
        type: 'target',
        words,
        id: `tg-${i}`,
      });
    }
  }

  return content;
};

const processTargetLanguage = (
  text: string,
  language: string,
  paragraphIndex: number,
  romanizationFirstOccurrence: boolean
): WordWithPinyin[] => {
  const languageConfig = supportedLanguages.find(lang => lang.id === language);
  
  if (!languageConfig?.needsRomanization) {
    return text.split(' ').map((word, idx) => ({
      char: word,
      pinyin: '',
      showPinyin: false,
      id: `${paragraphIndex}-${idx}`,
    }));
  }

  if (language === 'chinese') {
    return processChineseCharacters(text, paragraphIndex, romanizationFirstOccurrence);
  }

  return processWordByWord(text, language, paragraphIndex, romanizationFirstOccurrence);
};

const processChineseCharacters = (
  text: string,
  paragraphIndex: number,
  romanizationFirstOccurrence: boolean
): WordWithPinyin[] => {
  const characters = text.split('');
  const seenPairs = new Map<string, boolean>();
  const wordsWithPinyin: WordWithPinyin[] = [];

  characters.forEach((char, idx) => {
    if (!char.trim()) {
      wordsWithPinyin.push({
        char: ' ',
        pinyin: '',
        showPinyin: false,
        id: `${paragraphIndex}-${idx}`,
      });
      return;
    }

    if (/[\u4e00-\u9fa5]/.test(char)) {
      const py = pinyin(char, { toneType: 'symbol' });

      let showPinyin = true;
      if (romanizationFirstOccurrence) {
        const pair = `${char}-${py}`;
        const isFirstOccurrence = !seenPairs.has(pair);
        seenPairs.set(pair, true);
        showPinyin = isFirstOccurrence;
      }

      wordsWithPinyin.push({
        char,
        pinyin: py,
        showPinyin,
        id: `${paragraphIndex}-${idx}`,
      });
    } else {
      wordsWithPinyin.push({
        char,
        pinyin: '',
        showPinyin: false,
        id: `${paragraphIndex}-${idx}`,
      });
    }
  });

  return wordsWithPinyin;
};

const processWordByWord = (
  text: string,
  language: string,
  paragraphIndex: number,
  romanizationFirstOccurrence: boolean
): WordWithPinyin[] => {
  const tokens = text.split(/(\s+|[.,!?;:()""''—–\-\[\]{}])/);
  const seenPairs = new Map<string, boolean>();
  const wordsWithPinyin: WordWithPinyin[] = [];
  let wordIndex = 0;

  tokens.forEach((token) => {
    if (!token) return;

    if (/^\s+$/.test(token) || /^[.,!?;:()""''—–\-\[\]{}]+$/.test(token)) {
      wordsWithPinyin.push({
        char: token,
        pinyin: '',
        showPinyin: false,
        id: `${paragraphIndex}-${wordIndex++}`,
      });
      return;
    }

    const romanization = getWordRomanization(token, language);
    
    if (romanization && romanization !== token.toLowerCase()) {
      let showPinyin = true;
      if (romanizationFirstOccurrence) {
        const pair = `${token}-${romanization}`;
        const isFirstOccurrence = !seenPairs.has(pair);
        seenPairs.set(pair, true);
        showPinyin = isFirstOccurrence;
      }

      wordsWithPinyin.push({
        char: token,
        pinyin: romanization,
        showPinyin,
        id: `${paragraphIndex}-${wordIndex++}`,
      });
    } else {
      wordsWithPinyin.push({
        char: token,
        pinyin: '',
        showPinyin: false,
        id: `${paragraphIndex}-${wordIndex++}`,
      });
    }
  });

  return wordsWithPinyin;
};

const getWordRomanization = (word: string, language: string): string => {
  const hasNonLatin = /[^\u0000-\u007F\u0080-\u00FF]/.test(word);
  if (!hasNonLatin) {
    return '';
  }

  const langCode = getLanguageCode(language);

  try {
    const romanization = getSlug(word, {
      lang: langCode,
      symbols: false,
      maintainCase: true,
      separator: ' '
    }).trim();

    if (!romanization || romanization === word.toLowerCase()) {
      return '';
    }
    
    return romanization;
  } catch (error) {
    console.warn(`Failed to romanize word "${word}" for language "${language}":`, error);
    return '';
  }
};

const getLanguageCode = (languageId: string): string | false => {
  const langMap: Record<string, string | false> = {
    'russian': 'ru',
    'greek': 'gr',
    'arabic': 'ar',
    'persian': 'fa',
    'ukrainian': 'uk',
    'bulgarian': 'ru',
    'serbian': 'sr',
    'german': 'de',
    'french': 'fr',
    'spanish': 'es',
    'italian': 'it',
    'portuguese': 'pt',
    'dutch': 'nl',
    'polish': 'pl',
    'czech': 'cs',
    'hungarian': 'hu',
    'romanian': 'ro',
    'turkish': 'tr',
    'swedish': 'sv',
    'finnish': 'fi',
    'slovak': 'sk',
    'latvian': 'lv',
    'lithuanian': 'lt',
    'japanese': false,
    'korean': false,
    'thai': false,
    'hindi': false,
    'bengali': false,
    'hebrew': false,
    'urdu': false,
  };

  return langMap[languageId] ?? false;
};

// Move language data to separate file for better organization
export const supportedLanguages = [
  { id: 'chinese', label: STRINGS.LANGUAGES.CHINESE, flag: '🇨🇳', needsRomanization: true },
  { id: 'russian', label: STRINGS.LANGUAGES.RUSSIAN, flag: '🇷🇺', needsRomanization: true },
  { id: 'spanish', label: STRINGS.LANGUAGES.SPANISH, flag: '🇪🇸', needsRomanization: false },
  { id: 'french', label: STRINGS.LANGUAGES.FRENCH, flag: '🇫🇷', needsRomanization: false },
  { id: 'german', label: STRINGS.LANGUAGES.GERMAN, flag: '🇩🇪', needsRomanization: false },
  { id: 'italian', label: STRINGS.LANGUAGES.ITALIAN, flag: '🇮🇹', needsRomanization: false },
  { id: 'portuguese', label: STRINGS.LANGUAGES.PORTUGUESE, flag: '🇵🇹', needsRomanization: false },
  { id: 'japanese', label: STRINGS.LANGUAGES.JAPANESE, flag: '🇯🇵', needsRomanization: true },
  { id: 'korean', label: STRINGS.LANGUAGES.KOREAN, flag: '🇰🇷', needsRomanization: true },
  { id: 'arabic', label: STRINGS.LANGUAGES.ARABIC, flag: '🇸🇦', needsRomanization: true },
  { id: 'hindi', label: STRINGS.LANGUAGES.HINDI, flag: '🇮🇳', needsRomanization: true },
  { id: 'bengali', label: STRINGS.LANGUAGES.BENGALI, flag: '🇧🇩', needsRomanization: true },
  { id: 'hebrew', label: STRINGS.LANGUAGES.HEBREW, flag: '🇮🇱', needsRomanization: true },
  { id: 'greek', label: STRINGS.LANGUAGES.GREEK, flag: '🇬🇷', needsRomanization: true },
  { id: 'thai', label: STRINGS.LANGUAGES.THAI, flag: '🇹🇭', needsRomanization: true },
  { id: 'vietnamese', label: STRINGS.LANGUAGES.VIETNAMESE, flag: '🇻🇳', needsRomanization: false },
  { id: 'turkish', label: STRINGS.LANGUAGES.TURKISH, flag: '🇹🇷', needsRomanization: false },
  { id: 'dutch', label: STRINGS.LANGUAGES.DUTCH, flag: '🇳🇱', needsRomanization: false },
  { id: 'swedish', label: STRINGS.LANGUAGES.SWEDISH, flag: '🇸🇪', needsRomanization: false },
  { id: 'norwegian', label: STRINGS.LANGUAGES.NORWEGIAN, flag: '🇳🇴', needsRomanization: false },
  { id: 'danish', label: STRINGS.LANGUAGES.DANISH, flag: '🇩🇰', needsRomanization: false },
  { id: 'finnish', label: STRINGS.LANGUAGES.FINNISH, flag: '🇫🇮', needsRomanization: false },
  { id: 'polish', label: STRINGS.LANGUAGES.POLISH, flag: '🇵🇱', needsRomanization: false },
  { id: 'czech', label: STRINGS.LANGUAGES.CZECH, flag: '🇨🇿', needsRomanization: false },
  { id: 'hungarian', label: STRINGS.LANGUAGES.HUNGARIAN, flag: '🇭🇺', needsRomanization: false },
  { id: 'romanian', label: STRINGS.LANGUAGES.ROMANIAN, flag: '🇷🇴', needsRomanization: false },
  { id: 'bulgarian', label: STRINGS.LANGUAGES.BULGARIAN, flag: '🇧🇬', needsRomanization: true },
  { id: 'ukrainian', label: STRINGS.LANGUAGES.UKRAINIAN, flag: '🇺🇦', needsRomanization: true },
  { id: 'serbian', label: STRINGS.LANGUAGES.SERBIAN, flag: '🇷🇸', needsRomanization: true },
  { id: 'croatian', label: STRINGS.LANGUAGES.CROATIAN, flag: '🇭🇷', needsRomanization: false },
  { id: 'slovak', label: STRINGS.LANGUAGES.SLOVAK, flag: '🇸🇰', needsRomanization: false },
  { id: 'slovenian', label: STRINGS.LANGUAGES.SLOVENIAN, flag: '🇸🇮', needsRomanization: false },
  { id: 'lithuanian', label: STRINGS.LANGUAGES.LITHUANIAN, flag: '🇱🇹', needsRomanization: false },
  { id: 'latvian', label: STRINGS.LANGUAGES.LATVIAN, flag: '🇱🇻', needsRomanization: false },
  { id: 'estonian', label: STRINGS.LANGUAGES.ESTONIAN, flag: '🇪🇪', needsRomanization: false },
  { id: 'indonesian', label: STRINGS.LANGUAGES.INDONESIAN, flag: '🇮🇩', needsRomanization: false },
  { id: 'malay', label: STRINGS.LANGUAGES.MALAY, flag: '🇲🇾', needsRomanization: false },
  { id: 'filipino', label: STRINGS.LANGUAGES.FILIPINO, flag: '🇵🇭', needsRomanization: false },
  { id: 'swahili', label: STRINGS.LANGUAGES.SWAHILI, flag: '🇰🇪', needsRomanization: false },
  { id: 'persian', label: STRINGS.LANGUAGES.PERSIAN, flag: '🇮🇷', needsRomanization: true },
  { id: 'urdu', label: STRINGS.LANGUAGES.URDU, flag: '🇵🇰', needsRomanization: true },
];

// Add language utility functions
export const getLanguageById = (id: string) => {
  return supportedLanguages.find(lang => lang.id === id);
};

export const isLanguageSupported = (id: string) => {
  return supportedLanguages.some(lang => lang.id === id);
};

export const getLanguageDisplayName = (id: string) => {
  const lang = getLanguageById(id);
  return lang ? lang.label : STRINGS.LANGUAGES.UNKNOWN;
};

export const getLanguageFlag = (id: string) => {
  const lang = getLanguageById(id);
  return lang ? lang.flag : '🌐';
};

// Performance optimized version
export const processTextBatch = (
  englishText: string,
  targetText: string,
  language: string,
  options?: {
    romanizationFirstOccurrence?: boolean;
    batchSize?: number;
  }
): RenderedContent[] => {
  const {
    romanizationFirstOccurrence = true,
    batchSize = 1000,
  } = options || {};

  const englishParagraphs = englishText.split('\n').filter((p) => p.trim());
  const targetParagraphs = targetText.split('\n').filter((p) => p.trim());
  const content: RenderedContent[] = [];
  
  const maxLength = Math.max(englishParagraphs.length, targetParagraphs.length);
  
  // Process in batches to avoid blocking the main thread
  for (let batchStart = 0; batchStart < maxLength; batchStart += batchSize) {
    const batchEnd = Math.min(batchStart + batchSize, maxLength);
    
    for (let i = batchStart; i < batchEnd; i++) {
      if (englishParagraphs[i]) {
        content.push({
          type: 'english',
          text: englishParagraphs[i],
          id: `en-${i}`,
        });
      }

      if (targetParagraphs[i]) {
        const words = processTargetLanguage(
          targetParagraphs[i],
          language,
          i,
          romanizationFirstOccurrence
        );
        content.push({
          type: 'target',
          words,
          id: `tg-${i}`,
        });
      }
    }
  }

  return content;
};