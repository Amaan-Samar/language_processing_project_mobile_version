import { useState, useEffect, useMemo, useRef } from 'react';
import { processText } from '../utils/pinyinProcessor';
import { RenderedContent } from '../types';

export const useArticleProcessor = (
  englishText: string,
  targetText: string,
  language: string
) => {
  const [renderedContent, setRenderedContent] = useState<RenderedContent[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingTimeoutRef = useRef<NodeJS.Timeout>();
  
  // Component instance ID for tracking logs
  const componentId = useRef(`processor-${Math.random().toString(36).substr(2, 9)}`);

  // Track if we have any content to process
  const hasEnglish = englishText.trim().length > 0;
  const hasTarget = targetText.trim().length > 0;
  const hasAnyContent = hasEnglish || hasTarget;

  // Log initial state
  useEffect(() => {
    console.log(`[${componentId.current}] Component initialized with:`, {
      language,
      hasEnglish,
      hasTarget,
      englishLength: englishText.length,
      targetLength: targetText.length,
    });
    
    return () => {
      console.log(`[${componentId.current}] Component unmounting`);
    };
  }, []);

  useEffect(() => {
    console.log(`[${componentId.current}] Dependency change detected:`, {
      englishTextLength: englishText.length,
      targetTextLength: targetText.length,
      language,
      hasAnyContent,
      isProcessing,
    });

    // Clear any pending processing
    if (processingTimeoutRef.current) {
      console.log(`[${componentId.current}] Clearing previous timeout`);
      clearTimeout(processingTimeoutRef.current);
    }

    // If no content at all, clear immediately
    if (!hasAnyContent) {
      console.log(`[${componentId.current}] No content to process, clearing state`);
      setRenderedContent([]);
      setIsProcessing(false);
      return;
    }

    // Set processing state immediately for UI feedback
    console.log(`[${componentId.current}] Setting isProcessing to true`);
    setIsProcessing(true);

    // Log processing stats
    const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
    const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
    
    console.log(`[${componentId.current}] Scheduling processing with:`, {
      englishParagraphs,
      targetParagraphs,
      totalParagraphs: Math.max(englishParagraphs, targetParagraphs),
      hasEnglish,
      hasTarget,
      debounceDelay: '300ms',
    });

    // Debounce the actual processing by 300ms
    // This prevents processing on every keystroke
    processingTimeoutRef.current = setTimeout(() => {
      console.log(`[${componentId.current}] Starting text processing...`);
      
      try {
        // Process whatever content we have
        // This allows partial processing (English only, or Chinese only)
        console.log(`[${componentId.current}] Calling processText with:`, {
          englishLength: englishText.length,
          targetLength: targetText.length,
          language,
          timestamp: new Date().toISOString(),
        });
        
        const content = processText(englishText, targetText, language);
        
        console.log(`[${componentId.current}] Processing completed successfully:`, {
          contentLength: content.length,
          contentTypes: content.map(item => item.type),
          firstItem: content[0] ? { 
            type: content[0].type, 
            textLength: content[0].text?.length || 0,
            hasPinyin: !!(content[0] as any).pinyin,
          } : null,
          lastItem: content[content.length - 1] ? {
            type: content[content.length - 1].type,
          } : null,
        });
        
        setRenderedContent(content);
        console.log(`[${componentId.current}] State updated with new content`);
        
      } catch (error) {
        console.error(`[${componentId.current}] Error processing text:`, error, {
          englishTextSample: englishText.substring(0, 100),
          targetTextSample: targetText.substring(0, 100),
          language,
        });
        setRenderedContent([]);
        console.log(`[${componentId.current}] State cleared due to error`);
      } finally {
        console.log(`[${componentId.current}] Setting isProcessing to false`);
        setIsProcessing(false);
      }
    }, 300);

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      console.log(`[${componentId.current}] Cleanup function called for useEffect`);
      if (processingTimeoutRef.current) {
        console.log(`[${componentId.current}] Clearing timeout in cleanup`);
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, [englishText, targetText, language, hasAnyContent]);

  // Calculate processing progress for UI feedback
  const processingStats = useMemo(() => {
    console.log(`[${componentId.current}] Recalculating processingStats...`);
    
    const englishParagraphs = englishText.split('\n').filter(p => p.trim()).length;
    const targetParagraphs = targetText.split('\n').filter(p => p.trim()).length;
    const totalParagraphs = Math.max(englishParagraphs, targetParagraphs);
    
    const stats = {
      hasEnglish,
      hasTarget,
      englishParagraphs,
      targetParagraphs,
      totalParagraphs,
      isComplete: hasEnglish && hasTarget,
    };
    
    console.log(`[${componentId.current}] New processingStats:`, stats);
    return stats;
  }, [englishText, targetText, hasEnglish, hasTarget]);

  // Log when renderedContent changes
  useEffect(() => {
    if (renderedContent.length > 0) {
      console.log(`[${componentId.current}] renderedContent updated:`, {
        length: renderedContent.length,
        contentSummary: renderedContent.slice(0, 3).map(item => ({
          type: item.type,
          textPreview: item.text?.substring(0, 50) + (item.text && item.text.length > 50 ? '...' : ''),
        })),
      });
    }
  }, [renderedContent]);

  // Log when isProcessing changes
  useEffect(() => {
    console.log(`[${componentId.current}] isProcessing changed to:`, isProcessing);
  }, [isProcessing]);

  const returnValue = { 
    renderedContent, 
    isProcessing,
    processingStats,
    hasContent: hasAnyContent,
  };

  // Log the return value for debugging
  console.log(`[${componentId.current}] Returning hook value:`, {
    renderedContentLength: returnValue.renderedContent.length,
    isProcessing: returnValue.isProcessing,
    hasContent: returnValue.hasContent,
    processingStats: returnValue.processingStats,
  });

  return returnValue;
};

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