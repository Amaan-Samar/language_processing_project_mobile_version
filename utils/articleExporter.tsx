// import * as FileSystem from 'expo-file-system/legacy'; // Changed import
// import * as Sharing from 'expo-sharing';
// import * as Print from 'expo-print';

// export const exportArticles = async (articles: any[]) => {
//   try {
//     const jsonContent = JSON.stringify(articles, null, 2);
//     const fileName = `articles_${Date.now()}.json`;
//     const fileUri = FileSystem.documentDirectory + fileName;

//     await FileSystem.writeAsStringAsync(fileUri, jsonContent);

//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(fileUri);
//     }
//   } catch (error) {
//     console.error('Error exporting articles:', error);
//     throw error;
//   }
// };

// export const exportArticlesToPDF = async (articles: any[]) => {
//   try {
//     let html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; }
//           .article { margin-bottom: 40px; page-break-after: always; }
//           .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
//           .metadata { font-size: 12px; color: #666; margin-bottom: 20px; }
//           .paragraph { margin-bottom: 20px; }
//           .english { font-size: 16px; line-height: 1.6; margin-bottom: 15px; }
//           .target { background: #f0f7ff; padding: 10px; border-radius: 8px; margin-bottom: 15px; }
//           .word { display: inline-block; margin-right: 12px; margin-bottom: 8px; }
//           .char { font-size: 20px; display: block; }
//           .pinyin { font-size: 12px; color: #666; text-align: center; margin-top: 2px; }
//         </style>
//       </head>
//       <body>
//     `;

//     articles.forEach((article) => {
//       html += `<div class="article">`;
//       html += `<div class="title">${article.title || 'Untitled'}</div>`;
//       html += `<div class="metadata">Language: ${article.language || 'Unknown'} • Created: ${new Date(article.created_at || Date.now()).toLocaleDateString()}</div>`;

//       // Use pinyin data if available
//       if (article.pinyin_data && article.first_occurrences) {
//         try {
//           const pinyinMap: Record<string, string> = JSON.parse(article.pinyin_data);
//           const firstOccurrences: number[] = JSON.parse(article.first_occurrences);
//           const text = article.target_text;
          
//           // Render with pinyin
//           html += `<div class="target">`;
//           let charIndex = 0;
          
//           for (const char of text) {
//             if (firstOccurrences.includes(charIndex) && pinyinMap[char]) {
//               html += `<span class="word">
//                 <span class="char">${char}</span>
//                 <span class="pinyin">${pinyinMap[char]}</span>
//               </span>`;
//             } else {
//               html += char === ' ' ? ' ' : `<span>${char}</span>`;
//             }
//             charIndex += char.length;
//           }
          
//           html += `</div>`;
//         } catch (error) {
//           console.warn('Failed to parse pinyin data, falling back:', error);
//           // Fallback to simple text
//           html += `<div class="target">${article.target_text}</div>`;
//         }
//       } else {
//         // Fallback to simple text
//         html += `<div class="target">${article.target_text}</div>`;
//       }

//       // Add English text
//       if (article.english_text) {
//         const englishParagraphs = article.english_text.split('\n').filter((p: string) => p.trim());
//         englishParagraphs.forEach((paragraph: string) => {
//           html += `<div class="english">${paragraph}</div>`;
//         });
//       }

//       html += `</div>`;
//     });

//     html += `</body></html>`;

//     // Generate PDF
//     const { uri } = await Print.printToFileAsync({ html });

//     // Share PDF
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(uri);
//     }
//   } catch (error) {
//     console.error('Error exporting PDF:', error);
//     throw error;
//   }
// };

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { RenderedContent } from '../types';

export type PDFExportMode = 'desktop' | 'mobile';

interface PDFStyleConfig {
  pageWidth: number;      // in points (1 point = 1/72 inch)
  bodyPadding: string;
  titleSize: string;
  englishSize: string;
  targetSize: string;
  pinyinSize: string;
  lineHeight: string;
  marginBottom: string;
}

const PDF_STYLES: Record<PDFExportMode, PDFStyleConfig> = {
  desktop: {
    pageWidth: 612,        // 8.5 inches
    bodyPadding: '20px',
    titleSize: '28px',
    englishSize: '16px',
    targetSize: '18px',
    pinyinSize: '10px',
    lineHeight: '1.8',
    marginBottom: '60px'
  },
  mobile: {
    pageWidth: 375,        // ~5.2 inches (iPhone width)
    bodyPadding: '12px',
    titleSize: '20px',
    englishSize: '14px',
    targetSize: '16px',
    pinyinSize: '9px',
    lineHeight: '1.6',
    marginBottom: '40px'
  }
};
interface Article {
  id: number;
  title: string;
  english_text: string;
  target_text: string;
  language: string;
  created_at: number;
  updated_at: number;
  rendered_content: string; // JSON stringified RenderedContent[]
}


export const exportArticles = async (articles: Article[]) => {
  try {
    const jsonContent = JSON.stringify(articles, null, 2);
    const fileName = `articles_${Date.now()}.json`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, jsonContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  } catch (error) {
    console.error('Error exporting articles:', error);
    throw error;
  }
};

export const exportArticlesToPDF = async (
  articles: Article[], 
  mode: PDFExportMode = 'mobile') => {
  const styles = PDF_STYLES[mode];
  try {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; 
            padding: 20px; 
            line-height: 1.8;
          }
          .article { 
            margin-bottom: 60px; 
            page-break-after: always; 
          }
          .title { 
            font-size: 28px; 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #1a1a1a;
          }
          .metadata { 
            font-size: 13px; 
            color: #666; 
            margin-bottom: 30px; 
            padding-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
          }
          .content-block { 
            margin-bottom: 20px; 
          }
          .english { 
            font-size: 16px; 
            line-height: 1.8; 
            color: #333;
            margin-bottom: 8px;
          }
          .target { 
            font-size: 18px;
            line-height: 1.6;
            margin-bottom: 8px;
          }
          /* Interlinear format: character with superscript pinyin */
          .char-with-pinyin {
            position: relative;
            display: inline-block;
            margin-right: 2px;
          }
          .char-with-pinyin .char {
            font-size: 18px;
            font-weight: 500;
          }
          .char-with-pinyin .pinyin {
            position: absolute;
            top: -10px;
            left: 50%;
            transform: translateX(-50%);
            font-size: 10px;
            color: #666;
            white-space: nowrap;
            font-weight: 400;
          }
          .no-pinyin {
            display: inline;
            font-size: 18px;
          }
        </style>
      </head>
      <body>
    `;

    articles.forEach((article) => {
      html += `<div class="article">`;
      html += `<div class="title">${escapeHtml(article.title || 'Untitled')}</div>`;
      html += `<div class="metadata">
        Language: ${escapeHtml(article.language || 'Unknown')} • 
        Created: ${new Date(article.created_at || Date.now()).toLocaleDateString()} •
        Last Updated: ${new Date(article.updated_at || Date.now()).toLocaleDateString()}
      </div>`;

      try {
        // Parse the pre-rendered content
        const renderedContent: RenderedContent[] = JSON.parse(article.rendered_content);
        
        console.log(`[PDF Export] Rendering article "${article.title}" with ${renderedContent.length} content blocks`);

        // Render using the pre-computed structure
        renderedContent.forEach((block) => {
          html += `<div class="content-block">`;
          
          if (block.type === 'english') {
            // English paragraph
            html += `<div class="english">${escapeHtml(block.text)}</div>`;
          } else if (block.type === 'target' && block.words) {
            // Target language paragraph with interlinear pinyin
            html += `<div class="target">`;
            
            block.words.forEach((word) => {
              if (word.showPinyin && word.pinyin) {
                // Character with pinyin superscript (interlinear format)
                html += `<span class="char-with-pinyin">
                  <span class="pinyin">${escapeHtml(word.pinyin)}</span>
                  <span class="char">${escapeHtml(word.char)}</span>
                </span>`;
              } else {
                // Just the character (space, punctuation, or repeated character)
                if (word.char === ' ') {
                  html += ' ';
                } else if (word.char === '\n') {
                  html += '<br>';
                } else {
                  html += `<span class="no-pinyin">${escapeHtml(word.char)}</span>`;
                }
              }
            });
            
            html += `</div>`;
          }
          
          html += `</div>`;
        });

      } catch (error) {
        console.error(`[PDF Export] Failed to parse rendered content for article ${article.id}:`, error);
        
        // Fallback: render plain text
        html += `<div class="content-block">`;
        html += `<div class="english">${escapeHtml(article.english_text)}</div>`;
        html += `<div class="target">${escapeHtml(article.target_text)}</div>`;
        html += `</div>`;
      }

      html += `</div>`;
    });

    html += `</body></html>`;

    console.log('[PDF Export] Generating PDF from HTML...');
    
    // Generate PDF
    const { uri } = await Print.printToFileAsync({ 
      html,
      width: styles.pageWidth,
      height: mode === 'desktop' ? 792 : 667
    });

    console.log('[PDF Export] PDF generated successfully:', uri);

    // Share PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Export Articles PDF'
      });
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};


const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};


export const exportSingleArticleToPDF = async (article: Article) => {
  return exportArticlesToPDF([article]);
};


export const generatePlainTextFormat = (articles: Article[]): string => {
  let output = '';
  
  articles.forEach((article, articleIndex) => {
    if (articleIndex > 0) {
      output += '\n\n' + '='.repeat(80) + '\n\n';
    }
    
    output += `${article.title}\n`;
    output += `Language: ${article.language} | Created: ${new Date(article.created_at).toLocaleDateString()}\n\n`;
    
    try {
      const renderedContent: RenderedContent[] = JSON.parse(article.rendered_content);
      
      renderedContent.forEach((block) => {
        if (block.type === 'english') {
          output += block.text + '\n';
        } else if (block.type === 'target' && block.words) {
          // Build the interlinear text line
          let targetLine = '';
          
          block.words.forEach((word) => {
            if (word.showPinyin && word.pinyin) {
              targetLine += `${word.char}${word.pinyin}`;
            } else {
              targetLine += word.char;
            }
          });
          
          output += targetLine + '\n';
        }
      });
      
    } catch (error) {
      console.error('Failed to parse rendered content:', error);
      output += article.english_text + '\n';
      output += article.target_text + '\n';
    }
  });
  
  return output;
};


export const exportArticlesAsText = async (articles: Article[]) => {
  try {
    const textContent = generatePlainTextFormat(articles);
    const fileName = `articles_${Date.now()}.txt`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, textContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    }
  } catch (error) {
    console.error('Error exporting articles as text:', error);
    throw error;
  }
};


export const getExportStats = (articles: Article[]) => {
  const totalSize = articles.reduce((acc, article) => {
    return acc + (article.rendered_content?.length || 0);
  }, 0);

  const totalWords = articles.reduce((acc, article) => {
    try {
      const rendered: RenderedContent[] = JSON.parse(article.rendered_content);
      return acc + rendered.reduce((wordCount, block) => {
        if (block.type === 'target' && block.words) {
          return wordCount + block.words.length;
        }
        return wordCount;
      }, 0);
    } catch {
      return acc;
    }
  }, 0);

  return {
    articleCount: articles.length,
    totalSizeKB: Math.round(totalSize / 1024),
    averageSizeKB: Math.round(totalSize / articles.length / 1024),
    totalWords,
    averageWordsPerArticle: Math.round(totalWords / articles.length)
  };
};