import { pinyin } from 'pinyin-pro';
import { RenderedContent, WordWithPinyin } from '../types';

export const processText = (
  englishText: string,
  targetText: string,
  language: string
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
      const words = processTargetLanguage(targetParagraphs[i], language, i);
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
  paragraphIndex: number
): WordWithPinyin[] => {
  if (language !== 'chinese') {
    return text.split(' ').map((word, idx) => ({
      char: word,
      pinyin: '',
      showPinyin: false,
      id: `${paragraphIndex}-${idx}`,
    }));
  }

  // Chinese processing - character by character
  const characters = text.split('');
  const seenPairs = new Map<string, boolean>(); // Track char-pinyin pairs
  const wordsWithPinyin: WordWithPinyin[] = [];

  characters.forEach((char, idx) => {
    // Skip whitespace but preserve it in output
    if (!char.trim()) {
      wordsWithPinyin.push({
        char: ' ',
        pinyin: '',
        showPinyin: false,
        id: `${paragraphIndex}-${idx}`,
      });
      return;
    }

    // Check if it's a Chinese character
    if (/[\u4e00-\u9fa5]/.test(char)) {
      const py = pinyin(char, { toneType: 'symbol' });
      const pair = `${char}-${py}`;

      // Only show pinyin if this exact char-pinyin combo hasn't appeared yet
      const isFirstOccurrence = !seenPairs.has(pair);
      seenPairs.set(pair, true);

      wordsWithPinyin.push({
        char,
        pinyin: py,
        showPinyin: isFirstOccurrence,
        id: `${paragraphIndex}-${idx}`,
      });
    } else {
      // Non-Chinese characters (punctuation, etc.)
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