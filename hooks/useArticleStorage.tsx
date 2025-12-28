// import { useEffect, useState } from 'react';
// import * as SQLite from 'expo-sqlite';
// import { Alert } from 'react-native';
// import { exportArticles } from '../utils/articleExporter';

// const db = SQLite.openDatabase('articles.db');

// export const useArticleStorage = () => {
//   const [articleCount, setArticleCount] = useState(0);

//   useEffect(() => {
//     initDatabase();
//     loadArticleCount();
//   }, []);

//   const initDatabase = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         `CREATE TABLE IF NOT EXISTS articles (
//           id INTEGER PRIMARY KEY AUTOINCREMENT,
//           english_text TEXT,
//           target_text TEXT,
//           language TEXT,
//           created_at INTEGER
//         );`,
//         [],
//         () => console.log('Database initialized'),
//         (_, error) => {
//           console.error('Error creating table:', error);
//           return false;
//         }
//       );
//     });
//   };

//   const loadArticleCount = () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT COUNT(*) as count FROM articles;',
//         [],
//         (_, { rows }) => {
//           setArticleCount(rows._array[0].count);
//         },
//         (_, error) => {
//           console.error('Error loading count:', error);
//           return false;
//         }
//       );
//     });
//   };

//   const saveArticle = (article: {
//     english: string;
//     target: string;
//     language: string;
//     timestamp: number;
//   }) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'INSERT INTO articles (english_text, target_text, language, created_at) VALUES (?, ?, ?, ?);',
//         [article.english, article.target, article.language, article.timestamp],
//         () => {
//           setArticleCount((prev) => prev + 1);
//           console.log('Article saved');
//         },
//         (_, error) => {
//           console.error('Error saving article:', error);
//           return false;
//         }
//       );
//     });
//   };

//   const checkAndPromptExport = () => {
//     if (articleCount >= 100) {
//       Alert.alert(
//         'Storage Full',
//         'You have 100 articles saved. Would you like to download them?',
//         [
//           { text: 'Later', style: 'cancel' },
//           {
//             text: 'Download',
//             onPress: async () => {
//               await handleExport();
//             },
//           },
//         ]
//       );
//     }
//   };

//   const handleExport = async () => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         'SELECT * FROM articles;',
//         [],
//         async (_, { rows }) => {
//           const articles = rows._array;
//           await exportArticles(articles);
          
//           // Clear database after export
//           tx.executeSql(
//             'DELETE FROM articles;',
//             [],
//             () => {
//               setArticleCount(0);
//               Alert.alert('Success', 'Articles exported and storage cleared!');
//             }
//           );
//         }
//       );
//     });
//   };

//   return { saveArticle, checkAndPromptExport, articleCount };
// };


import { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { Alert } from 'react-native';
import { exportArticles } from '../utils/articleExporter';

let db: SQLite.SQLiteDatabase | null = null;

export const useArticleStorage = () => {
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    initDatabase();
  }, []);

  const initDatabase = async () => {
    try {
      // Open database with new API
      db = await SQLite.openDatabaseAsync('articles.db');
      
      // Create table
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS articles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          english_text TEXT,
          target_text TEXT,
          language TEXT,
          created_at INTEGER
        );
      `);
      
      console.log('Database initialized');
      await loadArticleCount();
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  const loadArticleCount = async () => {
    if (!db) return;
    
    try {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM articles;'
      );
      setArticleCount(result?.count || 0);
    } catch (error) {
      console.error('Error loading count:', error);
    }
  };

  const saveArticle = async (article: {
    english: string;
    target: string;
    language: string;
    timestamp: number;
  }) => {
    if (!db) {
      console.error('Database not initialized');
      return;
    }

    try {
      await db.runAsync(
        'INSERT INTO articles (english_text, target_text, language, created_at) VALUES (?, ?, ?, ?);',
        [article.english, article.target, article.language, article.timestamp]
      );
      
      setArticleCount((prev) => prev + 1);
      console.log('Article saved');
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const checkAndPromptExport = () => {
    if (articleCount >= 100) {
      Alert.alert(
        'Storage Full',
        'You have 100 articles saved. Would you like to download them?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              await handleExport();
            },
          },
        ]
      );
    }
  };

  const handleExport = async () => {
    if (!db) return;

    try {
      const articles = await db.getAllAsync('SELECT * FROM articles;');
      await exportArticles(articles);
      
      // Clear database after export
      await db.runAsync('DELETE FROM articles;');
      setArticleCount(0);
      Alert.alert('Success', 'Articles exported and storage cleared!');
    } catch (error) {
      console.error('Error exporting articles:', error);
      Alert.alert('Error', 'Failed to export articles');
    }
  };

  return { saveArticle, checkAndPromptExport, articleCount };
};