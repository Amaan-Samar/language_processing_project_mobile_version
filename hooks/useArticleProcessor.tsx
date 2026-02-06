// import { useState, useEffect, useMemo, useRef } from 'react';
// import { processText } from '../utils/pinyinProcessor';
// import { RenderedContent } from '../types';
// import { useSettings } from './useSettings';
// import { createLogger } from '../utils/logger';

// const logger = createLogger('ArticleProcessor');

// export const useArticleProcessor = (
//   englishText: string,
//   targetText: string,
//   language: string
// ) => {
//   const [renderedContent, setRenderedContent] = useState<RenderedContent[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const processingTimeoutRef = useRef<NodeJS.Timeout>();
  
//   // Component instance ID for tracking logs
//   const componentId = useRef(`processor-${Math.random().toString(36).substr(2, 9)}`);

//   // Track if we have any content to process
//   const hasEnglish = englishText.trim().length > 0;
//   const hasTarget = targetText.trim().length > 0;
//   const hasAnyContent = hasEnglish || hasTarget;

//   // Log initial state
//   useEffect(() => {
//     console.log(`[${componentId.current}] Component initialized with:`, {
//       language,
//       hasEnglish,
//       hasTarget,
//       englishLength: englishText.length,
//       targetLength: targetText.length,
//     });
    
//     return () => {
//       console.log(`[${componentId.current}] Component unmounting`);
//     };
//   }, []);

//   useEffect(() => {
//     console.log(`[${componentId.current}] Dependency change detected:`, {
//       englishTextLength: englishText.length,
//       targetTextLength: targetText.length,
//       language,
//       hasAnyContent,
//       isProcessing,
//     });

//     // Clear any pending processing
//     if (processingTimeoutRef.current) {
//       console.log(`[${componentId.current}] Clearing previous timeout`);
//       clearTimeout(processingTimeoutRef.current);
//     }

//     // If no content at all, clear immediately
//     if (!hasAnyContent) {
//       console.log(`[${componentId.current}] No content to process, clearing state`);
//       setRenderedContent([]);
//       setIsProcessing(false);
//       return;
//     }

//     // Set processing state immediately for UI feedback
//     console.log(`[${componentId.current}] Setting isProcessing to true`);
//     setIsProcessing(true);

//     // Log processing stats
//     const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
//     const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
    
//     console.log(`[${componentId.current}] Scheduling processing with:`, {
//       englishParagraphs,
//       targetParagraphs,
//       totalParagraphs: Math.max(englishParagraphs, targetParagraphs),
//       hasEnglish,
//       hasTarget,
//       debounceDelay: '300ms',
//     });

//     // Debounce the actual processing by 300ms
//     // This prevents processing on every keystroke
//     processingTimeoutRef.current = setTimeout(() => {
//       console.log(`[${componentId.current}] Starting text processing...`);
      
//       try {
//         // Process whatever content we have
//         // This allows partial processing (English only, or Chinese only)
//         console.log(`[${componentId.current}] Calling processText with:`, {
//           englishLength: englishText.length,
//           targetLength: targetText.length,
//           language,
//           timestamp: new Date().toISOString(),
//         });
        
//         const content = processText(englishText, targetText, language);
        
//         console.log(`[${componentId.current}] Processing completed successfully:`, {
//           contentLength: content.length,
//           contentTypes: content.map(item => item.type),
//           firstItem: content[0] ? { 
//             type: content[0].type, 
//             textLength: content[0].text?.length || 0,
//             hasPinyin: !!(content[0] as any).pinyin,
//           } : null,
//           lastItem: content[content.length - 1] ? {
//             type: content[content.length - 1].type,
//           } : null,
//         });
        
//         setRenderedContent(content);
//         console.log(`[${componentId.current}] State updated with new content`);
        
//       } catch (error) {
//         console.error(`[${componentId.current}] Error processing text:`, error, {
//           englishTextSample: englishText.substring(0, 100),
//           targetTextSample: targetText.substring(0, 100),
//           language,
//         });
//         setRenderedContent([]);
//         console.log(`[${componentId.current}] State cleared due to error`);
//       } finally {
//         console.log(`[${componentId.current}] Setting isProcessing to false`);
//         setIsProcessing(false);
//       }
//     }, 300);

//     // Cleanup timeout on unmount or when dependencies change
//     return () => {
//       console.log(`[${componentId.current}] Cleanup function called for useEffect`);
//       if (processingTimeoutRef.current) {
//         console.log(`[${componentId.current}] Clearing timeout in cleanup`);
//         clearTimeout(processingTimeoutRef.current);
//       }
//     };
//   }, [englishText, targetText, language, hasAnyContent]);

//   // Calculate processing progress for UI feedback
//   const processingStats = useMemo(() => {
//     console.log(`[${componentId.current}] Recalculating processingStats...`);
    
//     const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
//     const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
//     const totalParagraphs = Math.max(englishParagraphs, targetParagraphs);
    
//     const stats = {
//       hasEnglish,
//       hasTarget,
//       englishParagraphs,
//       targetParagraphs,
//       totalParagraphs,
//       isComplete: hasEnglish && hasTarget,
//     };
    
//     console.log(`[${componentId.current}] New processingStats:`, stats);
//     return stats;
//   }, [englishText, targetText, hasEnglish, hasTarget]);

//   // Log when renderedContent changes
//   useEffect(() => {
//     if (renderedContent.length > 0) {
//       console.log(`[${componentId.current}] renderedContent updated:`, {
//         length: renderedContent.length,
//         contentSummary: renderedContent.slice(0, 3).map(item => ({
//           type: item.type,
//           textPreview: item.text?.substring(0, 50) + (item.text && item.text.length > 50 ? '...' : ''),
//         })),
//       });
//     }
//   }, [renderedContent]);

//   // Log when isProcessing changes
//   useEffect(() => {
//     console.log(`[${componentId.current}] isProcessing changed to:`, isProcessing);
//   }, [isProcessing]);

//   const returnValue = { 
//     renderedContent, 
//     isProcessing,
//     processingStats,
//     hasContent: hasAnyContent,
//   };

//   // Log the return value for debugging
//   console.log(`[${componentId.current}] Returning hook value:`, {
//     renderedContentLength: returnValue.renderedContent.length,
//     isProcessing: returnValue.isProcessing,
//     hasContent: returnValue.hasContent,
//     processingStats: returnValue.processingStats,
//   });

//   return returnValue;
// };




// // hooks/useArticleProcessor.ts
// import { useState, useEffect, useMemo, useRef } from 'react';
// import { processText, clearLanguageCache } from '../utils/romanizationProcessor';
// import { RenderedContent } from '../types';

// export const useArticleProcessor = (
//   englishText: string,
//   targetText: string,
//   language: string
// ) => {
//   const [renderedContent, setRenderedContent] = useState<RenderedContent[]>([]);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const processingTimeoutRef = useRef<NodeJS.Timeout>();
  
//   // Component instance ID for tracking logs
//   const componentId = useRef(`processor-${Math.random().toString(36).substr(2, 9)}`);

//   // Clear cache when language changes
//   useEffect(() => {
//     console.log(`[${componentId.current}] Language changed to ${language}, clearing cache`);
//     clearLanguageCache(language);
//   }, [language]);

//   // Track if we have any content to process
//   const hasEnglish = englishText.trim().length > 0;
//   const hasTarget = targetText.trim().length > 0;
//   const hasAnyContent = hasEnglish || hasTarget;

//   // Log initial state
//   useEffect(() => {
//     console.log(`[${componentId.current}] Component initialized with:`, {
//       language,
//       hasEnglish,
//       hasTarget,
//       englishLength: englishText.length,
//       targetLength: targetText.length,
//     });
    
//     return () => {
//       console.log(`[${componentId.current}] Component unmounting`);
//     };
//   }, []);

//   useEffect(() => {
//     console.log(`[${componentId.current}] Dependency change detected:`, {
//       englishTextLength: englishText.length,
//       targetTextLength: targetText.length,
//       language,
//       hasAnyContent,
//       isProcessing,
//     });

//     // Clear any pending processing
//     if (processingTimeoutRef.current) {
//       console.log(`[${componentId.current}] Clearing previous timeout`);
//       clearTimeout(processingTimeoutRef.current);
//     }

//     // If no content at all, clear immediately
//     if (!hasAnyContent) {
//       console.log(`[${componentId.current}] No content to process, clearing state`);
//       setRenderedContent([]);
//       setIsProcessing(false);
//       return;
//     }

//     // Set processing state immediately for UI feedback
//     console.log(`[${componentId.current}] Setting isProcessing to true`);
//     setIsProcessing(true);

//     // Log processing stats
//     const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
//     const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
    
//     console.log(`[${componentId.current}] Scheduling processing with:`, {
//       englishParagraphs,
//       targetParagraphs,
//       totalParagraphs: Math.max(englishParagraphs, targetParagraphs),
//       hasEnglish,
//       hasTarget,
//       debounceDelay: '300ms',
//     });

//     // Debounce the actual processing by 300ms
//     // This prevents processing on every keystroke
//     processingTimeoutRef.current = setTimeout(() => {
//       console.log(`[${componentId.current}] Starting text processing for language: ${language}...`);
      
//       try {
//         // Process whatever content we have
//         // This allows partial processing (English only, or target only)
//         console.log(`[${componentId.current}] Calling processText with:`, {
//           englishLength: englishText.length,
//           targetLength: targetText.length,
//           language,
//           timestamp: new Date().toISOString(),
//         });
        
//         const content = processText(englishText, targetText, language);
        
//         console.log(`[${componentId.current}] Processing completed successfully:`, {
//           contentLength: content.length,
//           contentTypes: content.map(item => item.type),
//           hasRomanization: content.some(item => 
//             item.type === 'target' && 
//             item.words?.some(word => word.romanization)
//           ),
//         });
        
//         setRenderedContent(content);
//         console.log(`[${componentId.current}] State updated with new content`);
        
//       } catch (error) {
//         console.error(`[${componentId.current}] Error processing text:`, error, {
//           englishTextSample: englishText.substring(0, 100),
//           targetTextSample: targetText.substring(0, 100),
//           language,
//         });
//         setRenderedContent([]);
//         console.log(`[${componentId.current}] State cleared due to error`);
//       } finally {
//         console.log(`[${componentId.current}] Setting isProcessing to false`);
//         setIsProcessing(false);
//       }
//     }, 300);

//     // Cleanup timeout on unmount or when dependencies change
//     return () => {
//       console.log(`[${componentId.current}] Cleanup function called for useEffect`);
//       if (processingTimeoutRef.current) {
//         console.log(`[${componentId.current}] Clearing timeout in cleanup`);
//         clearTimeout(processingTimeoutRef.current);
//       }
//     };
//   }, [englishText, targetText, language, hasAnyContent]);

//   // Calculate processing progress for UI feedback
//   const processingStats = useMemo(() => {
//     console.log(`[${componentId.current}] Recalculating processingStats...`);
    
//     const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
//     const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
//     const totalParagraphs = Math.max(englishParagraphs, targetParagraphs);
    
//     const stats = {
//       hasEnglish,
//       hasTarget,
//       englishParagraphs,
//       targetParagraphs,
//       totalParagraphs,
//       isComplete: hasEnglish && hasTarget,
//     };
    
//     console.log(`[${componentId.current}] New processingStats:`, stats);
//     return stats;
//   }, [englishText, targetText, hasEnglish, hasTarget]);

//   // Log when renderedContent changes
//   useEffect(() => {
//     if (renderedContent.length > 0) {
//       console.log(`[${componentId.current}] renderedContent updated:`, {
//         length: renderedContent.length,
//         hasRomanization: renderedContent.some(item => 
//           item.type === 'target' && 
//           item.words?.some(word => word.romanization && word.showRomanization)
//         ),
//       });
//     }
//   }, [renderedContent]);

//   // Log when isProcessing changes
//   useEffect(() => {
//     console.log(`[${componentId.current}] isProcessing changed to:`, isProcessing);
//   }, [isProcessing]);

//   const returnValue = { 
//     renderedContent, 
//     isProcessing,
//     processingStats,
//     hasContent: hasAnyContent,
//   };

//   // Log the return value for debugging
//   console.log(`[${componentId.current}] Returning hook value:`, {
//     renderedContentLength: returnValue.renderedContent.length,
//     isProcessing: returnValue.isProcessing,
//     hasContent: returnValue.hasContent,
//     processingStats: returnValue.processingStats,
//   });

//   return returnValue;
// };






// hooks/useArticleProcessor.ts
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { processText, processTextBatch } from '../utils/pinyinProcessor';
import { RenderedContent } from '../types';
import { useSettings } from './useSettings';
import { createLogger } from '../utils/logger';
import { STRINGS } from '../utils/strings';

const logger = createLogger('ArticleProcessor');

// Performance optimization: debounce delay based on text length
const getDebounceDelay = (textLength: number): number => {
  if (textLength < 100) return 100;      // Short text: 100ms
  if (textLength < 1000) return 250;     // Medium text: 250ms
  if (textLength < 5000) return 500;     // Long text: 500ms
  return 750;                            // Very long text: 750ms
};

// Memoize processing function to prevent recreation
const createProcessingStats = (englishText: string, targetText: string) => {
  const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
  const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
  
  return {
    hasEnglish: englishText.trim().length > 0,
    hasTarget: targetText.trim().length > 0,
    englishParagraphs,
    targetParagraphs,
    totalParagraphs: Math.max(englishParagraphs, targetParagraphs),
    isComplete: englishParagraphs === targetParagraphs,
    wordCount: {
      english: englishText.trim().split(/\s+/).filter(w => w).length,
      target: targetText.trim().split(/\s+/).filter(w => w).length,
    },
  };
};

export const useArticleProcessor = (
  englishText: string,
  targetText: string,
  language: string
) => {
  const { settings } = useSettings();
  const [renderedContent, setRenderedContent] = useState<RenderedContent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  
  // Use refs for values that don't trigger re-renders
  const processingTimeoutRef = useRef<NodeJS.Timeout>();
  const lastProcessedRef = useRef({
    englishText: '',
    targetText: '',
    language: '',
    romanizationFirstOccurrence: settings.romanizationFirstOccurrence,
  });

  // Memoized calculations
  const processingStats = useMemo(() => 
    createProcessingStats(englishText, targetText),
    [englishText, targetText]
  );

  const hasAnyContent = useMemo(() => 
    englishText.trim().length > 0 || targetText.trim().length > 0,
    [englishText, targetText]
  );

  // Cleanup function
  const cleanup = useCallback(() => {
    if (processingTimeoutRef.current) {
      clearTimeout(processingTimeoutRef.current);
      processingTimeoutRef.current = undefined;
    }
  }, []);

  // Process text with debouncing
  const processContent = useCallback(async () => {
    if (!hasAnyContent) {
      setRenderedContent([]);
      setProcessingError(null);
      return;
    }

    // Check if content has actually changed
    const currentState = {
      englishText,
      targetText,
      language,
      romanizationFirstOccurrence: settings.romanizationFirstOccurrence,
    };

    if (
      currentState.englishText === lastProcessedRef.current.englishText &&
      currentState.targetText === lastProcessedRef.current.targetText &&
      currentState.language === lastProcessedRef.current.language &&
      currentState.romanizationFirstOccurrence === lastProcessedRef.current.romanizationFirstOccurrence
    ) {
      logger.debug('Content unchanged, skipping processing');
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      logger.time('textProcessing');
      
      const content = settings.performanceMode 
        ? processTextBatch(
            englishText,
            targetText,
            language,
            {
              romanizationFirstOccurrence: settings.romanizationFirstOccurrence,
              batchSize: 500,
            }
          )
        : processText(
            englishText,
            targetText,
            language,
            settings.romanizationFirstOccurrence
          );

      setRenderedContent(content);
      lastProcessedRef.current = currentState;
      
      logger.timeEnd('textProcessing');
      logger.info('Processing completed', {
        contentLength: content.length,
        hasEnglish: processingStats.hasEnglish,
        hasTarget: processingStats.hasTarget,
        performanceMode: settings.performanceMode,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Processing failed', { 
        error: errorMessage,
        language,
        englishLength: englishText.length,
        targetLength: targetText.length,
      });
      setProcessingError(STRINGS.NOTIFICATIONS.PROCESSING_ERROR);
      setRenderedContent([]);
    } finally {
      setIsProcessing(false);
    }
  }, [
    englishText, 
    targetText, 
    language, 
    hasAnyContent, 
    settings.romanizationFirstOccurrence, 
    settings.performanceMode,
    processingStats.hasEnglish,
    processingStats.hasTarget,
  ]);

  // Main effect for processing text
  useEffect(() => {
    logger.debug('Dependencies changed', {
      englishLength: englishText.length,
      targetLength: targetText.length,
      language,
      hasAnyContent,
      romanizationFirstOccurrence: settings.romanizationFirstOccurrence,
      performanceMode: settings.performanceMode,
    });

    // Clean up previous timeout
    cleanup();

    // Calculate debounce delay based on text length
    const totalLength = englishText.length + targetText.length;
    const debounceDelay = getDebounceDelay(totalLength);

    // Schedule processing
    processingTimeoutRef.current = setTimeout(processContent, debounceDelay);

    // Cleanup on unmount or when dependencies change
    return cleanup;
  }, [englishText, targetText, language, processContent, cleanup, hasAnyContent, settings.romanizationFirstOccurrence, settings.performanceMode]);

  // Log performance metrics in development
  useEffect(() => {
    if (__DEV__ && renderedContent.length > 0) {
      logger.debug('Content rendered', {
        itemCount: renderedContent.length,
        englishItems: renderedContent.filter(item => item.type === 'english').length,
        targetItems: renderedContent.filter(item => item.type === 'target').length,
        totalWords: renderedContent.reduce((acc, item) => {
          if (item.type === 'target' && 'words' in item) {
            return acc + item.words.length;
          }
          return acc;
        }, 0),
      });
    }
  }, [renderedContent]);

  // Handle processing errors
  useEffect(() => {
    if (processingError) {
      logger.warn('Processing error state', { error: processingError });
      // You could show a notification here if needed
    }
  }, [processingError]);

  // Reset last processed state when language changes drastically
  useEffect(() => {
    // Reset if language changes to a completely different script family
    const oldLang = lastProcessedRef.current.language;
    const needsReset = oldLang && 
      ((language === 'chinese' && oldLang !== 'chinese') ||
       (language === 'japanese' && oldLang !== 'japanese') ||
       (language === 'korean' && oldLang !== 'korean'));
    
    if (needsReset) {
      lastProcessedRef.current = {
        englishText: '',
        targetText: '',
        language: '',
        romanizationFirstOccurrence: settings.romanizationFirstOccurrence,
      };
      logger.debug('Reset last processed state due to major language change');
    }
  }, [language, settings.romanizationFirstOccurrence]);

  // Return memoized value to prevent unnecessary re-renders
  return useMemo(() => ({
    renderedContent,
    isProcessing,
    processingStats: {
      ...processingStats,
      hasProcessingError: !!processingError,
      errorMessage: processingError,
      performanceMode: settings.performanceMode,
      romanizationFirstOccurrence: settings.romanizationFirstOccurrence,
    },
    hasContent: hasAnyContent,
    processingError,
    retryProcessing: processContent,
  }), [
    renderedContent,
    isProcessing,
    processingStats,
    hasAnyContent,
    processingError,
    processContent,
    settings.performanceMode,
    settings.romanizationFirstOccurrence,
  ]);
};