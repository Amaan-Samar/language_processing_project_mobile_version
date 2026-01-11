// // import { useEffect, useState, useCallback } from 'react';
// // import * as SQLite from 'expo-sqlite';
// // import { Alert } from 'react-native';
// // import { exportArticles } from '../utils/articleExporter';

// // // TRUE SINGLETON - survives all React lifecycles
// // class DatabaseManager {
// //   private static instance: DatabaseManager;
// //   private db: SQLite.SQLiteDatabase | null = null;
// //   private initialized: boolean = false;
// //   private initPromise: Promise<void> | null = null;

// //   private constructor() {}

// //   static getInstance(): DatabaseManager {
// //     if (!DatabaseManager.instance) {
// //       DatabaseManager.instance = new DatabaseManager();
// //     }
// //     return DatabaseManager.instance;
// //   }

// //   async ensureInitialized(): Promise<SQLite.SQLiteDatabase> {
// //     // If already initialized and db exists, return it
// //     if (this.initialized && this.db) {
// //       return this.db;
// //     }

// //     // If initialization is in progress, wait for it
// //     if (this.initPromise) {
// //       await this.initPromise;
// //       if (!this.db) {
// //         throw new Error('Database initialization failed');
// //       }
// //       return this.db;
// //     }

// //     // Start new initialization
// //     this.initPromise = this.initialize();
// //     await this.initPromise;
    
// //     if (!this.db) {
// //       throw new Error('Database not available after initialization');
// //     }
    
// //     return this.db;
// //   }

// //   private async initialize(): Promise<void> {
// //     try {
// //       console.log('DatabaseManager: Initializing database...');
      
// //       // Close existing connection if any
// //       if (this.db) {
// //         try {
// //           await this.db.closeAsync();
// //           console.log('DatabaseManager: Closed existing connection');
// //         } catch (e) {
// //           console.log('DatabaseManager: Error closing existing db:', e);
// //         }
// //         this.db = null;
// //       }
// //       await SQLite.deleteDatabaseAsync('articles.db');
// //       // Open new connection
// //       this.db = await SQLite.openDatabaseAsync('articles.db');
// //       console.log('DatabaseManager: Database connection opened');

// //       await this.db.execAsync(`
// //         CREATE TABLE IF NOT EXISTS articles (
// //           id INTEGER PRIMARY KEY AUTOINCREMENT,
// //           title TEXT NOT NULL,
// //           english_text TEXT NOT NULL,
// //           target_text TEXT NOT NULL,
// //           language TEXT NOT NULL,
// //           created_at INTEGER NOT NULL,
// //           updated_at INTEGER NOT NULL
// //         );
// //       `);

// //       this.initialized = true;
// //       console.log('DatabaseManager: Database initialized successfully');
// //     } catch (error) {
// //       console.error('DatabaseManager: Error initializing database:', error);
// //       this.db = null;
// //       this.initialized = false;
// //       throw error;
// //     } finally {
// //       this.initPromise = null;
// //     }
// //   }

// //   async getDatabase(): Promise<SQLite.SQLiteDatabase> {
// //     return this.ensureInitialized();
// //   }

// //   isReady(): boolean {
// //     return this.initialized && this.db !== null;
// //   }
// // }

// // export const useArticleStorage = () => {
// //   const [articleCount, setArticleCount] = useState(0);
// //   const [isReady, setIsReady] = useState(false);
// //   const dbManager = DatabaseManager.getInstance();

// //   useEffect(() => {
// //     const init = async () => {
// //       try {
// //         await dbManager.ensureInitialized();
// //         setIsReady(true);
// //         await loadArticleCount();
// //       } catch (error) {
// //         console.error('useArticleStorage: Failed to initialize:', error);
// //         setIsReady(false);
// //       }
// //     };
    
// //     init();
// //   }, []);

// //   const loadArticleCount = useCallback(async () => {
// //     try {
// //       const db = await dbManager.getDatabase();
// //       const result = await db.getFirstAsync<{ count: number }>(
// //         'SELECT COUNT(*) as count FROM articles;'
// //       );
// //       const count = result?.count || 0;
// //       setArticleCount(count);
// //       console.log('Loaded article count:', count);
// //       return count;
// //     } catch (error) {
// //       console.error('Error loading count:', error);
// //       setArticleCount(0);
// //       return 0;
// //     }
// //   }, []);

// //   const saveOrUpdateArticle = useCallback(async (article: {
// //     id?: number | null;
// //     title: string;
// //     english: string;
// //     target: string;
// //     language: string;
// //     timestamp: number;
// //   }): Promise<number | null> => {
// //     try {
// //       console.log('Saving article, current ID:', article.id);
      
// //       // Ensure DB is ready
// //       await dbManager.ensureInitialized();
      
// //       if (article.id) {
// //         return await updateArticle(article);
// //       }
      
// //       return await createArticle(article);
// //     } catch (error) {
// //       console.error('Error saving/updating article:', error);
// //       Alert.alert('Error', 'Failed to save article. Please try again.');
// //       return null;
// //     }
// //   }, []);

// //   const createArticle = async (article: {
// //     title: string;
// //     english: string;
// //     target: string;
// //     language: string;
// //     timestamp: number;
// //   }): Promise<number | null> => {
// //     try {
// //       console.log('Creating new article...');
// //       const db = await dbManager.getDatabase();
      
// //       // Validate inputs
// //       if (!article.title || !article.english || !article.target || !article.language) {
// //         throw new Error('Missing required article fields');
// //       }
      
// //       console.log('Executing INSERT query...');
// //       const result = await db.runAsync(
// //         'INSERT INTO articles (title, english_text, target_text, language, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);',
// //         [article.title, article.english, article.target, article.language, article.timestamp, article.timestamp]
// //       );
      
// //       console.log('Article created with ID:', result.lastInsertRowId);
// //       await loadArticleCount();
// //       return result.lastInsertRowId;
// //     } catch (error) {
// //       console.error('Error creating article:', error);
// //       throw error;
// //     }
// //   };

// //   const updateArticle = async (article: {
// //     id: number;
// //     title: string;
// //     english: string;
// //     target: string;
// //     language: string;
// //     timestamp: number;
// //   }): Promise<number | null> => {
// //     try {
// //       console.log('Updating article with ID:', article.id);
// //       const db = await dbManager.getDatabase();
      
// //       // First verify the article exists
// //       const existingArticle = await getArticleById(article.id);
// //       if (!existingArticle) {
// //         console.warn('Article not found with ID:', article.id, '- creating new one');
// //         return await createArticle(article);
// //       }

// //       console.log('Executing UPDATE query...');
// //       await db.runAsync(
// //         'UPDATE articles SET title = ?, english_text = ?, target_text = ?, language = ?, updated_at = ? WHERE id = ?;',
// //         [article.title, article.english, article.target, article.language, article.timestamp, article.id]
// //       );
      
// //       console.log('Article updated with ID:', article.id);
// //       await loadArticleCount();
// //       return article.id;
// //     } catch (error) {
// //       console.error('Error updating article:', error);
// //       throw error;
// //     }
// //   };

// //   const loadAllArticles = useCallback(async () => {
// //     try {
// //       const db = await dbManager.getDatabase();
      
// //       const articles = await db.getAllAsync<{
// //         id: number;
// //         title: string;
// //         english_text: string;
// //         target_text: string;
// //         language: string;
// //         created_at: number;
// //         updated_at: number;
// //       }>(
// //         'SELECT * FROM articles ORDER BY updated_at DESC;'
// //       );
      
// //       console.log('Loaded articles:', articles.length);
// //       return articles;
// //     } catch (error) {
// //       console.error('Error loading articles:', error);
// //       return [];
// //     }
// //   }, []);

// //   const deleteArticle = useCallback(async (id: number) => {
// //     try {
// //       const db = await dbManager.getDatabase();
      
// //       await db.runAsync('DELETE FROM articles WHERE id = ?;', [id]);
// //       await loadArticleCount();
// //       console.log('Deleted article with ID:', id);
// //       return true;
// //     } catch (error) {
// //       console.error('Error deleting article:', error);
// //       return false;
// //     }
// //   }, [loadArticleCount]);

// //   const deleteMultipleArticles = useCallback(async (ids: number[]) => {
// //     if (ids.length === 0) return false;

// //     try {
// //       const db = await dbManager.getDatabase();
      
// //       const placeholders = ids.map(() => '?').join(',');
// //       await db.runAsync(
// //         `DELETE FROM articles WHERE id IN (${placeholders});`,
// //         ids
// //       );
// //       await loadArticleCount();
// //       console.log('Deleted articles:', ids.length);
// //       return true;
// //     } catch (error) {
// //       console.error('Error deleting multiple articles:', error);
// //       return false;
// //     }
// //   }, [loadArticleCount]);

// //   const getArticlesByIds = useCallback(async (ids: number[]) => {
// //     if (ids.length === 0) return [];

// //     try {
// //       const db = await dbManager.getDatabase();
      
// //       const placeholders = ids.map(() => '?').join(',');
// //       const articles = await db.getAllAsync<{
// //         id: number;
// //         title: string;
// //         english_text: string;
// //         target_text: string;
// //         language: string;
// //         created_at: number;
// //         updated_at: number;
// //       }>(
// //         `SELECT * FROM articles WHERE id IN (${placeholders}) ORDER BY updated_at DESC;`,
// //         ids
// //       );
// //       return articles;
// //     } catch (error) {
// //       console.error('Error loading articles by IDs:', error);
// //       return [];
// //     }
// //   }, []);

// //   const checkAndPromptExport = useCallback(() => {
// //     if (articleCount >= 100) {
// //       Alert.alert(
// //         'Storage Full',
// //         'You have 100 articles saved. Would you like to download them?',
// //         [
// //           { text: 'Later', style: 'cancel' },
// //           {
// //             text: 'Download',
// //             onPress: async () => {
// //               await handleExport();
// //             },
// //           },
// //         ]
// //       );
// //     }
// //   }, [articleCount]);

// //   const handleExport = useCallback(async () => {
// //     try {
// //       const db = await dbManager.getDatabase();
      
// //       const articles = await db.getAllAsync('SELECT * FROM articles;');
// //       await exportArticles(articles);

// //       await db.runAsync('DELETE FROM articles;');
// //       await loadArticleCount();
// //       Alert.alert('Success', 'Articles exported and storage cleared!');
// //     } catch (error) {
// //       console.error('Error exporting articles:', error);
// //       Alert.alert('Error', 'Failed to export articles');
// //     }
// //   }, [loadArticleCount]);

// //   const exportSelectedArticles = useCallback(async (ids: number[]) => {
// //     if (ids.length === 0) return false;

// //     try {
// //       const articles = await getArticlesByIds(ids);
// //       await exportArticles(articles);
// //       return true;
// //     } catch (error) {
// //       console.error('Error exporting selected articles:', error);
// //       return false;
// //     }
// //   }, [getArticlesByIds]);

// //   const clearAllArticles = useCallback(async () => {
// //     try {
// //       console.log('Clearing all articles...');
// //       const db = await dbManager.getDatabase();
      
// //       await db.runAsync('DELETE FROM articles;');
// //       await loadArticleCount();
// //       console.log('All articles cleared successfully');
// //       return true;
// //     } catch (error) {
// //       console.error('Error clearing articles:', error);
// //       return false;
// //     }
// //   }, [loadArticleCount]);

// //   const getArticleById = useCallback(async (id: number) => {
// //     try {
// //       const db = await dbManager.getDatabase();
      
// //       const article = await db.getFirstAsync<{
// //         id: number;
// //         title: string;
// //         english_text: string;
// //         target_text: string;
// //         language: string;
// //         created_at: number;
// //         updated_at: number;
// //       }>(
// //         'SELECT * FROM articles WHERE id = ?;',
// //         [id]
// //       );
      
// //       if (article) {
// //         console.log('Loaded article by ID:', id);
// //       } else {
// //         console.warn('No article found with ID:', id);
// //       }
      
// //       return article;
// //     } catch (error) {
// //       console.error('Error loading article by ID:', error);
// //       return null;
// //     }
// //   }, []);

// //   return {
// //     saveOrUpdateArticle, 
// //     createArticle,       
// //     updateArticle,       
// //     loadAllArticles,
// //     deleteArticle,
// //     deleteMultipleArticles,
// //     getArticlesByIds,
// //     checkAndPromptExport,
// //     handleExport,
// //     exportSelectedArticles,
// //     clearAllArticles,
// //     getArticleById,
// //     articleCount,
// //     isReady,
// //   };
// // };

// import { useEffect, useState, useCallback } from 'react';
// import * as SQLite from 'expo-sqlite';
// import { Alert } from 'react-native';
// import { exportArticles } from '../utils/articleExporter';

// // ALTERNATIVE APPROACH: Fresh connection for each operation
// // This avoids the stale connection issue entirely

// const DB_NAME = 'articles.db';

// // Helper to get a fresh database connection
// const getFreshDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
//   try {
//     console.log('Opening fresh database connection...');
//     const db = await SQLite.openDatabaseAsync(DB_NAME);
    
//     // Ensure table exists
//     await db.execAsync(`
//       CREATE TABLE IF NOT EXISTS articles (
//         id INTEGER PRIMARY KEY AUTOINCREMENT,
//         title TEXT NOT NULL,
//         english_text TEXT NOT NULL,
//         target_text TEXT NOT NULL,
//         language TEXT NOT NULL,
//         created_at INTEGER NOT NULL,
//         updated_at INTEGER NOT NULL
//       );
//     `);
    
//     console.log('Fresh database connection ready');
//     return db;
//   } catch (error) {
//     console.error('Error getting fresh database:', error);
//     throw error;
//   }
// };

// // Helper to execute with fresh connection and auto-close
// const withDatabase = async <T,>(
//   operation: (db: SQLite.SQLiteDatabase) => Promise<T>
// ): Promise<T> => {
//   const db = await getFreshDatabase();
//   try {
//     const result = await operation(db);
//     await db.closeAsync();
//     return result;
//   } catch (error) {
//     try {
//       await db.closeAsync();
//     } catch (closeError) {
//       console.log('Error closing db after operation failed:', closeError);
//     }
//     throw error;
//   }
// };

// export const useArticleStorage = () => {
//   const [articleCount, setArticleCount] = useState(0);
//   const [isReady, setIsReady] = useState(false);

//   useEffect(() => {
//     const init = async () => {
//       try {
//         // Initialize database on mount
//         await getFreshDatabase().then(db => db.closeAsync());
//         setIsReady(true);
//         await loadArticleCount();
//       } catch (error) {
//         console.error('Failed to initialize database:', error);
//         setIsReady(false);
//       }
//     };
    
//     init();
//   }, []);

//   const loadArticleCount = useCallback(async () => {
//     try {
//       const count = await withDatabase(async (db) => {
//         const result = await db.getFirstAsync<{ count: number }>(
//           'SELECT COUNT(*) as count FROM articles;'
//         );
//         return result?.count || 0;
//       });
      
//       setArticleCount(count);
//       console.log('Loaded article count:', count);
//       return count;
//     } catch (error) {
//       console.error('Error loading count:', error);
//       setArticleCount(0);
//       return 0;
//     }
//   }, []);

//   const saveOrUpdateArticle = useCallback(async (article: {
//     id?: number | null;
//     title: string;
//     english: string;
//     target: string;
//     language: string;
//     timestamp: number;
//   }): Promise<number | null> => {
//     try {
//       console.log('Saving article, current ID:', article.id);
      
//       if (article.id) {
//         return await updateArticle(article);
//       }
      
//       return await createArticle(article);
//     } catch (error) {
//       console.error('Error saving/updating article:', error);
//       Alert.alert('Error', 'Failed to save article. Please try again.');
//       return null;
//     }
//   }, []);

//   const createArticle = async (article: {
//     title: string;
//     english: string;
//     target: string;
//     language: string;
//     timestamp: number;
//   }): Promise<number | null> => {
//     try {
//       console.log('Creating new article...');
      
//       // Validate inputs
//       if (!article.title || !article.english || !article.target || !article.language) {
//         throw new Error('Missing required article fields');
//       }
      
//       const id = await withDatabase(async (db) => {
//         console.log('Executing INSERT query...');
//         const result = await db.runAsync(
//           'INSERT INTO articles (title, english_text, target_text, language, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);',
//           [article.title, article.english, article.target, article.language, article.timestamp, article.timestamp]
//         );
//         return result.lastInsertRowId;
//       });
      
//       console.log('Article created with ID:', id);
//       await loadArticleCount();
//       return id;
//     } catch (error) {
//       console.error('Error creating article:', error);
//       throw error;
//     }
//   };

//   const updateArticle = async (article: {
//     id: number;
//     title: string;
//     english: string;
//     target: string;
//     language: string;
//     timestamp: number;
//   }): Promise<number | null> => {
//     try {
//       console.log('Updating article with ID:', article.id);
      
//       // First verify the article exists
//       const existingArticle = await getArticleById(article.id);
//       if (!existingArticle) {
//         console.warn('Article not found with ID:', article.id, '- creating new one');
//         return await createArticle(article);
//       }

//       await withDatabase(async (db) => {
//         console.log('Executing UPDATE query...');
//         await db.runAsync(
//           'UPDATE articles SET title = ?, english_text = ?, target_text = ?, language = ?, updated_at = ? WHERE id = ?;',
//           [article.title, article.english, article.target, article.language, article.timestamp, article.id]
//         );
//       });
      
//       console.log('Article updated with ID:', article.id);
//       await loadArticleCount();
//       return article.id;
//     } catch (error) {
//       console.error('Error updating article:', error);
//       throw error;
//     }
//   };

//   const loadAllArticles = useCallback(async () => {
//     try {
//       const articles = await withDatabase(async (db) => {
//         return await db.getAllAsync<{
//           id: number;
//           title: string;
//           english_text: string;
//           target_text: string;
//           language: string;
//           created_at: number;
//           updated_at: number;
//         }>(
//           'SELECT * FROM articles ORDER BY updated_at DESC;'
//         );
//       });
      
//       console.log('Loaded articles:', articles.length);
//       return articles;
//     } catch (error) {
//       console.error('Error loading articles:', error);
//       return [];
//     }
//   }, []);

//   const deleteArticle = useCallback(async (id: number) => {
//     try {
//       await withDatabase(async (db) => {
//         await db.runAsync('DELETE FROM articles WHERE id = ?;', [id]);
//       });
      
//       await loadArticleCount();
//       console.log('Deleted article with ID:', id);
//       return true;
//     } catch (error) {
//       console.error('Error deleting article:', error);
//       return false;
//     }
//   }, [loadArticleCount]);

//   const deleteMultipleArticles = useCallback(async (ids: number[]) => {
//     if (ids.length === 0) return false;

//     try {
//       await withDatabase(async (db) => {
//         const placeholders = ids.map(() => '?').join(',');
//         await db.runAsync(
//           `DELETE FROM articles WHERE id IN (${placeholders});`,
//           ids
//         );
//       });
      
//       await loadArticleCount();
//       console.log('Deleted articles:', ids.length);
//       return true;
//     } catch (error) {
//       console.error('Error deleting multiple articles:', error);
//       return false;
//     }
//   }, [loadArticleCount]);

//   const getArticlesByIds = useCallback(async (ids: number[]) => {
//     if (ids.length === 0) return [];

//     try {
//       const articles = await withDatabase(async (db) => {
//         const placeholders = ids.map(() => '?').join(',');
//         return await db.getAllAsync<{
//           id: number;
//           title: string;
//           english_text: string;
//           target_text: string;
//           language: string;
//           created_at: number;
//           updated_at: number;
//         }>(
//           `SELECT * FROM articles WHERE id IN (${placeholders}) ORDER BY updated_at DESC;`,
//           ids
//         );
//       });
      
//       return articles;
//     } catch (error) {
//       console.error('Error loading articles by IDs:', error);
//       return [];
//     }
//   }, []);

//   const checkAndPromptExport = useCallback(() => {
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
//   }, [articleCount]);

//   const handleExport = useCallback(async () => {
//     try {
//       const articles = await withDatabase(async (db) => {
//         return await db.getAllAsync('SELECT * FROM articles;');
//       });
      
//       await exportArticles(articles);

//       await withDatabase(async (db) => {
//         await db.runAsync('DELETE FROM articles;');
//       });
      
//       await loadArticleCount();
//       Alert.alert('Success', 'Articles exported and storage cleared!');
//     } catch (error) {
//       console.error('Error exporting articles:', error);
//       Alert.alert('Error', 'Failed to export articles');
//     }
//   }, [loadArticleCount]);

//   const exportSelectedArticles = useCallback(async (ids: number[]) => {
//     if (ids.length === 0) return false;

//     try {
//       const articles = await getArticlesByIds(ids);
//       await exportArticles(articles);
//       return true;
//     } catch (error) {
//       console.error('Error exporting selected articles:', error);
//       return false;
//     }
//   }, [getArticlesByIds]);

//   const clearAllArticles = useCallback(async () => {
//     try {
//       console.log('Clearing all articles...');
      
//       await withDatabase(async (db) => {
//         await db.runAsync('DELETE FROM articles;');
//       });
      
//       await loadArticleCount();
//       console.log('All articles cleared successfully');
//       return true;
//     } catch (error) {
//       console.error('Error clearing articles:', error);
//       return false;
//     }
//   }, [loadArticleCount]);

//   const getArticleById = useCallback(async (id: number) => {
//     try {
//       const article = await withDatabase(async (db) => {
//         return await db.getFirstAsync<{
//           id: number;
//           title: string;
//           english_text: string;
//           target_text: string;
//           language: string;
//           created_at: number;
//           updated_at: number;
//         }>(
//           'SELECT * FROM articles WHERE id = ?;',
//           [id]
//         );
//       });
      
//       if (article) {
//         console.log('Loaded article by ID:', id);
//       } else {
//         console.warn('No article found with ID:', id);
//       }
      
//       return article;
//     } catch (error) {
//       console.error('Error loading article by ID:', error);
//       return null;
//     }
//   }, []);

//   return {
//     saveOrUpdateArticle, 
//     createArticle,       
//     updateArticle,       
//     loadAllArticles,
//     deleteArticle,
//     deleteMultipleArticles,
//     getArticlesByIds,
//     checkAndPromptExport,
//     handleExport,
//     exportSelectedArticles,
//     clearAllArticles,
//     getArticleById,
//     articleCount,
//     isReady,
//   };
// };


import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { exportArticles } from '../utils/articleExporter';

const ARTICLES_KEY = '@articles_storage';
const COUNTER_KEY = '@articles_counter';

interface Article {
  id: number;
  title: string;
  english_text: string;
  target_text: string;
  language: string;
  created_at: number;
  updated_at: number;
}

export const useArticleStorage = () => {
  const [articleCount, setArticleCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await loadArticleCount();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize storage:', error);
        setIsReady(false);
      }
    };
    
    init();
  }, []);

  const getNextId = async (): Promise<number> => {
    try {
      const counterStr = await AsyncStorage.getItem(COUNTER_KEY);
      const counter = counterStr ? parseInt(counterStr, 10) : 0;
      const nextId = counter + 1;
      await AsyncStorage.setItem(COUNTER_KEY, nextId.toString());
      return nextId;
    } catch (error) {
      console.error('Error getting next ID:', error);
      return Date.now(); // Fallback to timestamp
    }
  };

  const loadArticles = async (): Promise<Article[]> => {
    try {
      const articlesJson = await AsyncStorage.getItem(ARTICLES_KEY);
      if (!articlesJson) {
        return [];
      }
      const articles = JSON.parse(articlesJson);
      return Array.isArray(articles) ? articles : [];
    } catch (error) {
      console.error('Error loading articles:', error);
      return [];
    }
  };

  const saveArticles = async (articles: Article[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
    } catch (error) {
      console.error('Error saving articles:', error);
      throw error;
    }
  };

  const loadArticleCount = useCallback(async () => {
    try {
      const articles = await loadArticles();
      const count = articles.length;
      setArticleCount(count);
      console.log('Loaded article count:', count);
      return count;
    } catch (error) {
      console.error('Error loading count:', error);
      setArticleCount(0);
      return 0;
    }
  }, []);

  const saveOrUpdateArticle = useCallback(async (article: {
    id?: number | null;
    title: string;
    english: string;
    target: string;
    language: string;
    timestamp: number;
  }): Promise<number | null> => {
    try {
      console.log('Saving article, current ID:', article.id);
      
      if (article.id) {
        return await updateArticle(article);
      }
      
      return await createArticle(article);
    } catch (error) {
      console.error('Error saving/updating article:', error);
      Alert.alert('Error', 'Failed to save article. Please try again.');
      return null;
    }
  }, []);

  const createArticle = async (article: {
    title: string;
    english: string;
    target: string;
    language: string;
    timestamp: number;
  }): Promise<number | null> => {
    try {
      console.log('Creating new article...');
      
      // Validate inputs
      if (!article.title || !article.english || !article.target || !article.language) {
        throw new Error('Missing required article fields');
      }
      
      const articles = await loadArticles();
      const newId = await getNextId();
      
      const newArticle: Article = {
        id: newId,
        title: article.title,
        english_text: article.english,
        target_text: article.target,
        language: article.language,
        created_at: article.timestamp,
        updated_at: article.timestamp,
      };
      
      articles.push(newArticle);
      await saveArticles(articles);
      
      console.log('Article created with ID:', newId);
      await loadArticleCount();
      return newId;
    } catch (error) {
      console.error('Error creating article:', error);
      throw error;
    }
  };

  const updateArticle = async (article: {
    id: number;
    title: string;
    english: string;
    target: string;
    language: string;
    timestamp: number;
  }): Promise<number | null> => {
    try {
      console.log('Updating article with ID:', article.id);
      
      const articles = await loadArticles();
      const index = articles.findIndex(a => a.id === article.id);
      
      if (index === -1) {
        console.warn('Article not found with ID:', article.id, '- creating new one');
        return await createArticle(article);
      }

      articles[index] = {
        ...articles[index],
        title: article.title,
        english_text: article.english,
        target_text: article.target,
        language: article.language,
        updated_at: article.timestamp,
      };
      
      await saveArticles(articles);
      
      console.log('Article updated with ID:', article.id);
      await loadArticleCount();
      return article.id;
    } catch (error) {
      console.error('Error updating article:', error);
      throw error;
    }
  };

  const loadAllArticles = useCallback(async () => {
    try {
      const articles = await loadArticles();
      // Sort by updated_at descending
      articles.sort((a, b) => b.updated_at - a.updated_at);
      
      console.log('Loaded articles:', articles.length);
      return articles;
    } catch (error) {
      console.error('Error loading articles:', error);
      return [];
    }
  }, []);

  const deleteArticle = useCallback(async (id: number) => {
    try {
      const articles = await loadArticles();
      const filtered = articles.filter(a => a.id !== id);
      
      await saveArticles(filtered);
      await loadArticleCount();
      console.log('Deleted article with ID:', id);
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      return false;
    }
  }, [loadArticleCount]);

  const deleteMultipleArticles = useCallback(async (ids: number[]) => {
    if (ids.length === 0) return false;

    try {
      const articles = await loadArticles();
      const filtered = articles.filter(a => !ids.includes(a.id));
      
      await saveArticles(filtered);
      await loadArticleCount();
      console.log('Deleted articles:', ids.length);
      return true;
    } catch (error) {
      console.error('Error deleting multiple articles:', error);
      return false;
    }
  }, [loadArticleCount]);

  const getArticlesByIds = useCallback(async (ids: number[]) => {
    if (ids.length === 0) return [];

    try {
      const articles = await loadArticles();
      const filtered = articles.filter(a => ids.includes(a.id));
      // Sort by updated_at descending
      filtered.sort((a, b) => b.updated_at - a.updated_at);
      
      return filtered;
    } catch (error) {
      console.error('Error loading articles by IDs:', error);
      return [];
    }
  }, []);

  const checkAndPromptExport = useCallback(() => {
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
  }, [articleCount]);

  const handleExport = useCallback(async () => {
    try {
      const articles = await loadArticles();
      await exportArticles(articles);

      await saveArticles([]);
      await AsyncStorage.setItem(COUNTER_KEY, '0');
      await loadArticleCount();
      Alert.alert('Success', 'Articles exported and storage cleared!');
    } catch (error) {
      console.error('Error exporting articles:', error);
      Alert.alert('Error', 'Failed to export articles');
    }
  }, [loadArticleCount]);

  const exportSelectedArticles = useCallback(async (ids: number[]) => {
    if (ids.length === 0) return false;

    try {
      const articles = await getArticlesByIds(ids);
      await exportArticles(articles);
      return true;
    } catch (error) {
      console.error('Error exporting selected articles:', error);
      return false;
    }
  }, [getArticlesByIds]);

  const clearAllArticles = useCallback(async () => {
    try {
      console.log('Clearing all articles...');
      
      await saveArticles([]);
      await AsyncStorage.setItem(COUNTER_KEY, '0');
      await loadArticleCount();
      console.log('All articles cleared successfully');
      return true;
    } catch (error) {
      console.error('Error clearing articles:', error);
      return false;
    }
  }, [loadArticleCount]);

  const getArticleById = useCallback(async (id: number) => {
    try {
      const articles = await loadArticles();
      const article = articles.find(a => a.id === id);
      
      if (article) {
        console.log('Loaded article by ID:', id);
      } else {
        console.warn('No article found with ID:', id);
      }
      
      return article || null;
    } catch (error) {
      console.error('Error loading article by ID:', error);
      return null;
    }
  }, []);

  return {
    saveOrUpdateArticle, 
    createArticle,       
    updateArticle,       
    loadAllArticles,
    deleteArticle,
    deleteMultipleArticles,
    getArticlesByIds,
    checkAndPromptExport,
    handleExport,
    exportSelectedArticles,
    clearAllArticles,
    getArticleById,
    articleCount,
    isReady,
  };
};