import { useState, useEffect } from 'react';
import { processText } from '../utils/pinyinProcessor';
import { RenderedContent } from '../types';

export const useArticleProcessor = (
  englishText: string,
  targetText: string,
  language: string
) => {
  const [renderedContent, setRenderedContent] = useState<RenderedContent[]>([]);

  useEffect(() => {
    if (!englishText.trim() || !targetText.trim()) {
      setRenderedContent([]);
      return;
    }

    const content = processText(englishText, targetText, language);
    setRenderedContent(content);
  }, [englishText, targetText, language]);

  return { renderedContent };
};