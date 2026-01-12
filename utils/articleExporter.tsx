// import * as FileSystem from 'expo-file-system';
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
//   }
// };

// export const exportArticlesToPDF = async (articles: any[]) => {
//   try {
//     // Generate HTML for PDF (only rendered content)
//     let html = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; }
//           .article { margin-bottom: 40px; page-break-after: always; }
//           .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
//           .paragraph { margin-bottom: 20px; }
//           .english { font-size: 16px; line-height: 1.6; margin-bottom: 15px; }
//           .chinese { background: #f0f7ff; padding: 10px; border-radius: 8px; margin-bottom: 15px; }
//           .word { display: inline-block; margin-right: 12px; margin-bottom: 8px; }
//           .char { font-size: 20px; display: block; }
//           .pinyin { font-size: 12px; color: #666; text-align: center; margin-top: 2px; }
//         </style>
//       </head>
//       <body>
//     `;

//     articles.forEach((article) => {
//       html += `<div class="article">`;
//       html += `<div class="title">${article.title}</div>`;

//       // Parse and render content
//       const englishParagraphs = article.english_text.split('\n').filter((p: string) => p.trim());
//       const targetParagraphs = article.target_text.split('\n').filter((p: string) => p.trim());

//       for (let i = 0; i < Math.max(englishParagraphs.length, targetParagraphs.length); i++) {
//         html += `<div class="paragraph">`;

//         if (englishParagraphs[i]) {
//           html += `<div class="english">${englishParagraphs[i]}</div>`;
//         }

//         if (targetParagraphs[i]) {
//           html += `<div class="chinese">`;
//           // Render Chinese with pinyin (simplified for PDF)
//           const chars = targetParagraphs[i].split('');
//           chars.forEach((char: string) => {
//             if (/[\u4e00-\u9fa5]/.test(char)) {
//               html += `<span class="word"><span class="char">${char}</span></span>`;
//             } else {
//               html += char;
//             }
//           });
//           html += `</div>`;
//         }

//         html += `</div>`;
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

import * as FileSystem from 'expo-file-system/legacy'; // Changed import
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export const exportArticles = async (articles: any[]) => {
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

export const exportArticlesToPDF = async (articles: any[]) => {
  try {
    // Generate HTML for PDF (only rendered content)
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .article { margin-bottom: 40px; page-break-after: always; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
          .metadata { font-size: 12px; color: #666; margin-bottom: 20px; }
          .paragraph { margin-bottom: 20px; }
          .english { font-size: 16px; line-height: 1.6; margin-bottom: 15px; }
          .target { background: #f0f7ff; padding: 10px; border-radius: 8px; margin-bottom: 15px; }
          .word { display: inline-block; margin-right: 12px; margin-bottom: 8px; }
          .char { font-size: 20px; display: block; }
          .pinyin { font-size: 12px; color: #666; text-align: center; margin-top: 2px; }
        </style>
      </head>
      <body>
    `;

    articles.forEach((article) => {
      html += `<div class="article">`;
      html += `<div class="title">${article.title || article.articleTitle || 'Untitled'}</div>`;
      html += `<div class="metadata">Language: ${article.language || 'Unknown'} • Created: ${new Date(article.created_at || article.createdAt || Date.now()).toLocaleDateString()}</div>`;

      // Use correct field names (camelCase)
      const englishText = article.englishText || article.english_text || '';
      const targetText = article.targetText || article.target_text || '';

      // Parse and render content
      const englishParagraphs = englishText.split('\n').filter((p: string) => p.trim());
      const targetParagraphs = targetText.split('\n').filter((p: string) => p.trim());

      for (let i = 0; i < Math.max(englishParagraphs.length, targetParagraphs.length); i++) {
        html += `<div class="paragraph">`;

        if (englishParagraphs[i]) {
          html += `<div class="english">${englishParagraphs[i]}</div>`;
        }

        if (targetParagraphs[i]) {
          html += `<div class="target">`;
          // Render target language with pinyin (simplified for PDF)
          const chars = targetParagraphs[i].split('');
          chars.forEach((char: string) => {
            if (/[\u4e00-\u9fa5]/.test(char)) {
              html += `<span class="word"><span class="char">${char}</span></span>`;
            } else {
              html += char;
            }
          });
          html += `</div>`;
        }

        html += `</div>`;
      }

      html += `</div>`;
    });

    html += `</body></html>`;

    // Generate PDF
    const { uri } = await Print.printToFileAsync({ html });

    // Share PDF
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    }
  } catch (error) {
    console.error('Error exporting PDF:', error);
    throw error;
  }
};