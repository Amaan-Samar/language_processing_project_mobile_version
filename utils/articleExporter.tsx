import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export const exportArticles = async (articles: any[]) => {
  try {
    const jsonContent = JSON.stringify(articles, null, 2);
    const fileName = `articles_${Date.now()}.json`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, jsonContent);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      console.log('Sharing not available');
    }
  } catch (error) {
    console.error('Error exporting articles:', error);
  }
};