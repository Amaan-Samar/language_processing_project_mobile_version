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
    // For other languages, just split by spaces
    return text.split(' ').map((word, idx) => ({
      char: word,
      pinyin: '',
      showPinyin: false,
      id: `${paragraphIndex}-${idx}`,
    }));
  }

  // Chinese processing
  const characters = text.split('');
  const pinyinArray = pinyin(text, {
    toneType: 'symbol',
    type: 'array',
  });

  const seenPairs = new Set<string>();
  const wordsWithPinyin: WordWithPinyin[] = [];

  characters.forEach((char, idx) => {
    if (char.trim()) {
      const py = pinyinArray[idx] || char;
      const pair = `${char}-${py}`;

      const showPinyin = !seenPairs.has(pair);
      seenPairs.add(pair);

      wordsWithPinyin.push({
        char,
        pinyin: py,
        showPinyin,
        id: `${paragraphIndex}-${idx}`,
      });
    }
  });

  return wordsWithPinyin;
};