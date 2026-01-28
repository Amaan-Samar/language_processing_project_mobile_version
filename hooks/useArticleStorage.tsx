// import { 
//   useSQLiteContext, 
//   type SQLiteDatabase,
//   type SQLiteRunResult
// } from 'expo-sqlite';
// import { useEffect, useState, useCallback } from 'react';
// import { Alert } from 'react-native';
// import { exportArticles } from '../utils/articleExporter';
// import { processText } from '../utils/pinyinProcessor';

// // Types
// interface Article {
//   id: number;
//   title: string;
//   english_text: string;
//   target_text: string;
//   language: string;
//   created_at: number;
//   updated_at: number;
//   pinyin_data?: string;
//   first_occurrences?: string;
// }

// interface ArticleInput {
//   id?: number | null;
//   title: string;
//   english: string;
//   target: string;
//   language: string;
//   timestamp: number;
//   renderedContent?: any[];
// }

// // Database initialization function
// export const initializeDatabase = async (db: SQLiteDatabase) => {
//   console.log('[SQLite] Initializing database schema...');
  
//   await db.execAsync(`
//     PRAGMA journal_mode = WAL;
//     PRAGMA foreign_keys = ON;
//     PRAGMA busy_timeout = 5000;
    
//     CREATE TABLE IF NOT EXISTS articles (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       english_text TEXT NOT NULL,
//       target_text TEXT NOT NULL,
//       language TEXT NOT NULL,
//       created_at INTEGER NOT NULL,
//       updated_at INTEGER NOT NULL,
//       pinyin_data TEXT,
//       first_occurrences TEXT
//     );
    
//     CREATE INDEX IF NOT EXISTS idx_articles_updated ON articles(updated_at DESC);
//     CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);
    
//     -- Initialize the SQLite sequence if it doesn't exist
//     INSERT OR IGNORE INTO sqlite_sequence (name, seq) VALUES ('articles', 0);
//   `);
  
//   console.log('[SQLite] Database schema initialized');
// };

// // Helper function to extract minimal pinyin data
// const extractPinyinData = (renderedContent: any[]) => {
//   if (!renderedContent || renderedContent.length === 0) {
//     return { pinyinMap: null, indices: null };
//   }

//   const pinyinMap: Record<string, string> = {};
//   const indices: number[] = [];
//   let charIndex = 0;

//   renderedContent.forEach((item) => {
//     if (item.type === 'target' && item.words) {
//       item.words.forEach((word: any) => {
//         if (word.pinyin && word.showPinyin) {
//           if (!pinyinMap[word.char]) {
//             pinyinMap[word.char] = word.pinyin;
//           }
//           indices.push(charIndex);
//         }
//         charIndex += word.char.length;
//       });
//     }
//   });

//   return {
//     pinyinMap: Object.keys(pinyinMap).length > 0 ? pinyinMap : null,
//     indices: indices.length > 0 ? indices : null
//   };
// };

// // Main hook that uses SQLite context
// export const useArticleStorage = () => {
//   const db = useSQLiteContext();
//   const [articleCount, setArticleCount] = useState(0);
//   const [isReady, setIsReady] = useState(false);
//   const [isInitialized, setIsInitialized] = useState(false);

//     useEffect(() => {
//         const init = async () => {
//         if (!db) {
//           console.error('[SQLite] Database context not available');
//           return;
//         }

//         try {
//           console.log('[useArticleStorage] Initializing with SQLite context...');
//           await initializeDatabase(db);
          
//           // Load count directly without checking isInitialized
//           const result = await db.getFirstAsync<{ count: number }>(
//             'SELECT COUNT(*) as count FROM articles'
//           );
//           const count = result?.count || 0;
//           setArticleCount(count);
//           console.log('[useArticleStorage] Initial article count:', count);
          
//           // Set both flags at the end
//           setIsInitialized(true);
//           setIsReady(true);
//         } catch (error) {
//           console.error('[useArticleStorage] Initialization failed:', error);
//           setIsReady(false);
//         }
//       };

//       init();
//     }, [db]);

//   const loadArticleCount = useCallback(async (): Promise<number> => {
//     if (!db || !isInitialized) {
//       console.warn('[SQLite] Database not ready for loading count');
//       return 0;
//     }

//     try {
//       const result = await db.getFirstAsync<{ count: number }>(
//         'SELECT COUNT(*) as count FROM articles'
//       );
//       const count = result?.count || 0;
//       setArticleCount(count);
//       console.log('[SQLite] Article count loaded:', count);
//       return count;
//     } catch (error) {
//       console.error('[SQLite] Error loading article count:', error);
//       setArticleCount(0);
//       return 0;
//     }
//   }, [db, isInitialized]);

//   const saveOrUpdateArticle = useCallback(async (article: ArticleInput): Promise<number | null> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for save/update');
//       Alert.alert('Error', 'Database not ready. Please try again.');
//       return null;
//     }

//     console.log('[SQLite] saveOrUpdateArticle:', {
//       id: article.id,
//       titleLength: article.title.length,
//       language: article.language,
//       isUpdate: !!article.id
//     });

//     try {
//       const timestamp = article.timestamp || Date.now();
      
//       // Extract pinyin data if provided
//       let pinyinData = null;
//       let firstOccurrences = null;
      
//       if (article.renderedContent) {
//         const extracted = extractPinyinData(article.renderedContent);
//         pinyinData = extracted.pinyinMap ? JSON.stringify(extracted.pinyinMap) : null;
//         firstOccurrences = extracted.indices ? JSON.stringify(extracted.indices) : null;
//       }

//       let result: SQLiteRunResult;
      
//       if (article.id) {
//         // Update existing article
//         result = await db.runAsync(
//           `UPDATE articles SET 
//             title = ?, 
//             english_text = ?, 
//             target_text = ?, 
//             language = ?, 
//             updated_at = ?,
//             pinyin_data = ?,
//             first_occurrences = ?
//            WHERE id = ?`,
//           [
//             article.title,
//             article.english,
//             article.target,
//             article.language,
//             timestamp,
//             pinyinData,
//             firstOccurrences,
//             article.id
//           ]
//         );

//         console.log('[SQLite] Article updated:', { id: article.id, changes: result.changes });
//       } else {
//         // Insert new article
//         result = await db.runAsync(
//           `INSERT INTO articles 
//             (title, english_text, target_text, language, created_at, updated_at, pinyin_data, first_occurrences) 
//            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//           [
//             article.title,
//             article.english,
//             article.target,
//             article.language,
//             timestamp,
//             timestamp,
//             pinyinData,
//             firstOccurrences
//           ]
//         );

//         console.log('[SQLite] Article created:', { 
//           id: result.lastInsertRowId, 
//           changes: result.changes 
//         });
//       }

//       await loadArticleCount();
//       return article.id || Number(result.lastInsertRowId);
//     } catch (error) {
//       console.error('[SQLite] Error in saveOrUpdateArticle:', error);
//       Alert.alert('Error', 'Failed to save article. Please try again.');
//       return null;
//     }
//   }, [db, isInitialized, loadArticleCount]);

//   const loadAllArticles = useCallback(async (): Promise<Article[]> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for loading articles');
//       return [];
//     }

//     try {
//       console.log('[SQLite] Loading all articles...');
//       const articles = await db.getAllAsync<Article>(
//         `SELECT 
//           id, title, english_text, target_text, language, 
//           created_at, updated_at, pinyin_data, first_occurrences
//          FROM articles 
//          ORDER BY updated_at DESC`
//       );

//       console.log('[SQLite] Loaded articles:', articles.length);
//       return articles;
//     } catch (error) {
//       console.error('[SQLite] Error loading articles:', error);
//       return [];
//     }
//   }, [db, isInitialized]);

//   const deleteArticle = useCallback(async (id: number): Promise<boolean> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for deletion');
//       return false;
//     }

//     try {
//       console.log('[SQLite] Deleting article:', id);
//       const result = await db.runAsync('DELETE FROM articles WHERE id = ?', id);
//       const success = result.changes > 0;
      
//       if (success) {
//         await loadArticleCount();
//         console.log('[SQLite] Article deleted:', { id, changes: result.changes });
//       } else {
//         console.warn('[SQLite] Article not found for deletion:', id);
//       }
      
//       return success;
//     } catch (error) {
//       console.error('[SQLite] Error deleting article:', error);
//       return false;
//     }
//   }, [db, isInitialized, loadArticleCount]);

//   const deleteMultipleArticles = useCallback(async (ids: number[]): Promise<boolean> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for multiple deletions');
//       return false;
//     }

//     if (ids.length === 0) {
//       console.log('[SQLite] No articles to delete');
//       return false;
//     }

//     try {
//       console.log('[SQLite] Deleting multiple articles:', ids);
      
//       // Use a transaction for safety
//       let totalChanges = 0;
//       await db.withExclusiveTransactionAsync(async () => {
//         for (const id of ids) {
//           const result = await db.runAsync('DELETE FROM articles WHERE id = ?', id);
//           totalChanges += result.changes;
//         }
//       });

//       const success = totalChanges > 0;
      
//       if (success) {
//         await loadArticleCount();
//         console.log('[SQLite] Articles deleted:', { count: totalChanges, ids });
//       }
      
//       return success;
//     } catch (error) {
//       console.error('[SQLite] Error deleting multiple articles:', error);
//       return false;
//     }
//   }, [db, isInitialized, loadArticleCount]);

//   const getArticlesByIds = useCallback(async (ids: number[]): Promise<Article[]> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for query by IDs');
//       return [];
//     }

//     if (ids.length === 0) {
//       return [];
//     }

//     try {
//       console.log('[SQLite] Getting articles by IDs:', ids);
      
//       // Use prepared statement for safety with multiple IDs
//       const placeholders = ids.map(() => '?').join(',');
//       const query = `SELECT * FROM articles WHERE id IN (${placeholders}) ORDER BY updated_at DESC`;
      
//       const articles = await db.getAllAsync<Article>(query, ...ids);
//       console.log('[SQLite] Found articles:', articles.length);
      
//       return articles;
//     } catch (error) {
//       console.error('[SQLite] Error getting articles by IDs:', error);
//       return [];
//     }
//   }, [db, isInitialized]);

//   const getArticleById = useCallback(async (id: number): Promise<Article | null> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for query by ID');
//       return null;
//     }

//     try {
//       console.log('[SQLite] Getting article by ID:', id);
//       const article = await db.getFirstAsync<Article>(
//         'SELECT * FROM articles WHERE id = ?',
//         id
//       );

//       return article || null;
//     } catch (error) {
//       console.error('[SQLite] Error getting article by ID:', error);
//       return null;
//     }
//   }, [db, isInitialized]);

//   const exportSelectedArticles = useCallback(async (ids: number[]): Promise<boolean> => {
//     try {
//       const articles = await getArticlesByIds(ids);
      
//       if (articles.length === 0) {
//         console.warn('[SQLite] No articles found for export');
//         return false;
//       }

//       console.log('[SQLite] Exporting articles:', articles.length);
//       await exportArticles(articles);
//       return true;
//     } catch (error) {
//       console.error('[SQLite] Error exporting selected articles:', error);
//       return false;
//     }
//   }, [getArticlesByIds]);

//   const checkAndPromptExport = useCallback(() => {
//     console.log('[SQLite] Checking export threshold:', {
//       articleCount,
//       threshold: 100,
//       shouldPrompt: articleCount >= 100
//     });

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
//       return true;
//     }
    
//     return false;
//   }, [articleCount]);

//   const handleExport = useCallback(async () => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for export');
//       return;
//     }

//     try {
//       console.log('[SQLite] Exporting all articles...');
//       const articles = await loadAllArticles();
      
//       if (articles.length === 0) {
//         Alert.alert('Info', 'No articles to export');
//         return;
//       }

//       console.log('[SQLite] Exporting', articles.length, 'articles');
//       await exportArticles(articles);

//       // Clear database after export
//       await db.runAsync('DELETE FROM articles');
//       await db.runAsync('UPDATE sqlite_sequence SET seq = 0 WHERE name = "articles"');
      
//       await loadArticleCount();
      
//       Alert.alert('Success', 'Articles exported and storage cleared!');
//     } catch (error) {
//       console.error('[SQLite] Error exporting articles:', error);
//       Alert.alert('Error', 'Failed to export articles');
//     }
//   }, [db, isInitialized, loadAllArticles, loadArticleCount]);

//   const clearAllArticles = useCallback(async (): Promise<boolean> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for clearing');
//       return false;
//     }

//     try {
//       console.log('[SQLite] Clearing all articles...');
//       await db.runAsync('DELETE FROM articles');
//       await db.runAsync('UPDATE sqlite_sequence SET seq = 0 WHERE name = "articles"');
      
//       await loadArticleCount();
//       console.log('[SQLite] All articles cleared');
//       return true;
//     } catch (error) {
//       console.error('[SQLite] Error clearing articles:', error);
//       return false;
//     }
//   }, [db, isInitialized, loadArticleCount]);

//   // Migration function
//   const migrateFromJSON = useCallback(async (): Promise<number> => {
//     if (!db || !isInitialized) {
//       console.error('[SQLite] Database not ready for migration');
//       return 0;
//     }

//     try {
//       console.log('[SQLite] Starting migration from JSON...');
      
//       // Try to load from AsyncStorage
//       const AsyncStorage = await import('@react-native-async-storage/async-storage');
//       const articlesJson = await AsyncStorage.default.getItem('@articles_storage');
      
//       if (!articlesJson) {
//         console.log('[SQLite] No JSON data to migrate');
//         return 0;
//       }

//       const articles = JSON.parse(articlesJson);
//       if (!Array.isArray(articles) || articles.length === 0) {
//         console.log('[SQLite] Empty or invalid JSON data');
//         return 0;
//       }

//       console.log('[SQLite] Migrating', articles.length, 'articles');
//       let migratedCount = 0;

//       await db.withExclusiveTransactionAsync(async () => {
//         for (const article of articles) {
//           try {
//             // Process to generate pinyin data
//             const renderedContent = processText(
//               article.english_text || article.englishText || '',
//               article.target_text || article.targetText || '',
//               article.language || 'chinese'
//             );
            
//             const extracted = extractPinyinData(renderedContent);
//             const pinyinData = extracted.pinyinMap ? JSON.stringify(extracted.pinyinMap) : null;
//             const firstOccurrences = extracted.indices ? JSON.stringify(extracted.indices) : null;

//             await db.runAsync(
//               `INSERT OR IGNORE INTO articles 
//                 (id, title, english_text, target_text, language, created_at, updated_at, pinyin_data, first_occurrences)
//                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//               [
//                 article.id,
//                 article.title || article.articleTitle || 'Untitled',
//                 article.english_text || article.englishText || '',
//                 article.target_text || article.targetText || '',
//                 article.language || 'chinese',
//                 article.created_at || article.createdAt || Date.now(),
//                 article.updated_at || article.updatedAt || Date.now(),
//                 pinyinData,
//                 firstOccurrences
//               ]
//             );
//             migratedCount++;
//           } catch (error) {
//             console.warn('[SQLite] Failed to migrate article:', article.id, error);
//           }
//         }
//       });

//       console.log('[SQLite] Migration complete:', migratedCount, 'articles migrated');
//       await loadArticleCount();
      
//       return migratedCount;
//     } catch (error) {
//       console.error('[SQLite] Migration failed:', error);
//       return 0;
//     }
//   }, [db, isInitialized, loadArticleCount]);

//   return {
//     // Core operations
//     saveOrUpdateArticle,
//     loadAllArticles,
//     deleteArticle,
//     deleteMultipleArticles,
//     getArticlesByIds,
//     getArticleById,
    
//     // Export operations
//     exportSelectedArticles,
//     checkAndPromptExport,
//     handleExport,
//     clearAllArticles,
    
//     // Migration
//     migrateFromJSON,
    
//     // State
//     articleCount,
//     isReady,
//     isInitialized,
//   };
// };





import { 
  useSQLiteContext, 
  type SQLiteDatabase,
  type SQLiteRunResult
} from 'expo-sqlite';
import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { exportArticles } from '../utils/articleExporter';
import { processText } from '../utils/pinyinProcessor';
import { RenderedContent } from '../types';

// Types
interface Article {
  id: number;
  title: string;
  english_text: string;
  target_text: string;
  language: string;
  created_at: number;
  updated_at: number;
  rendered_content: string; // NEW: Full rendered structure as JSON
  // Deprecated but kept for migration compatibility:
  pinyin_data?: string;
  first_occurrences?: string;
}

interface ArticleInput {
  id?: number | null;
  title: string;
  english: string;
  target: string;
  language: string;
  timestamp: number;
  renderedContent?: RenderedContent[];
}

// Database initialization function
export const initializeDatabase = async (db: SQLiteDatabase) => {
  console.log('[SQLite] Initializing database schema...');
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      english_text TEXT NOT NULL,
      target_text TEXT NOT NULL,
      language TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      rendered_content TEXT,
      pinyin_data TEXT,
      first_occurrences TEXT
    );
    
    CREATE INDEX IF NOT EXISTS idx_articles_updated ON articles(updated_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_language ON articles(language);
    
    -- Initialize the SQLite sequence if it doesn't exist
    INSERT OR IGNORE INTO sqlite_sequence (name, seq) VALUES ('articles', 0);
  `);
  
  console.log('[SQLite] Database schema initialized');
};

// Main hook that uses SQLite context
export const useArticleStorage = () => {
  const db = useSQLiteContext();
  const [articleCount, setArticleCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!db) {
        console.error('[SQLite] Database context not available');
        return;
      }

      try {
        console.log('[useArticleStorage] Initializing with SQLite context...');
        await initializeDatabase(db);
        
        // Load count directly without checking isInitialized
        const result = await db.getFirstAsync<{ count: number }>(
          'SELECT COUNT(*) as count FROM articles'
        );
        const count = result?.count || 0;
        setArticleCount(count);
        console.log('[useArticleStorage] Initial article count:', count);
        
        // Set both flags at the end
        setIsInitialized(true);
        setIsReady(true);
      } catch (error) {
        console.error('[useArticleStorage] Initialization failed:', error);
        setIsReady(false);
      }
    };

    init();
  }, [db]);

  const loadArticleCount = useCallback(async (): Promise<number> => {
    if (!db || !isInitialized) {
      console.warn('[SQLite] Database not ready for loading count');
      return 0;
    }

    try {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM articles'
      );
      const count = result?.count || 0;
      setArticleCount(count);
      console.log('[SQLite] Article count loaded:', count);
      return count;
    } catch (error) {
      console.error('[SQLite] Error loading article count:', error);
      setArticleCount(0);
      return 0;
    }
  }, [db, isInitialized]);

  const saveOrUpdateArticle = useCallback(async (article: ArticleInput): Promise<number | null> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for save/update');
      Alert.alert('Error', 'Database not ready. Please try again.');
      return null;
    }

    console.log('[SQLite] saveOrUpdateArticle:', {
      id: article.id,
      titleLength: article.title.length,
      language: article.language,
      isUpdate: !!article.id,
      hasRenderedContent: !!article.renderedContent
    });

    try {
      const timestamp = article.timestamp || Date.now();
      
      // Store the complete rendered content structure
      let renderedContentJson: string | null = null;
      
      if (article.renderedContent && article.renderedContent.length > 0) {
        // Store the full rendered structure
        renderedContentJson = JSON.stringify(article.renderedContent);
        console.log('[SQLite] Storing rendered content:', {
          paragraphs: article.renderedContent.length,
          sizeKB: Math.round(renderedContentJson.length / 1024)
        });
      } else {
        // If not provided, generate it
        console.log('[SQLite] Generating rendered content from raw text');
        const rendered = processText(article.english, article.target, article.language);
        renderedContentJson = JSON.stringify(rendered);
      }

      let result: SQLiteRunResult;
      
      if (article.id) {
        // Update existing article
        result = await db.runAsync(
          `UPDATE articles SET 
            title = ?, 
            english_text = ?, 
            target_text = ?, 
            language = ?, 
            updated_at = ?,
            rendered_content = ?
           WHERE id = ?`,
          [
            article.title,
            article.english,
            article.target,
            article.language,
            timestamp,
            renderedContentJson,
            article.id
          ]
        );

        console.log('[SQLite] Article updated:', { id: article.id, changes: result.changes });
      } else {
        // Insert new article
        result = await db.runAsync(
          `INSERT INTO articles 
            (title, english_text, target_text, language, created_at, updated_at, rendered_content) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            article.title,
            article.english,
            article.target,
            article.language,
            timestamp,
            timestamp,
            renderedContentJson
          ]
        );

        console.log('[SQLite] Article created:', { 
          id: result.lastInsertRowId, 
          changes: result.changes 
        });
      }

      await loadArticleCount();
      return article.id || Number(result.lastInsertRowId);
    } catch (error) {
      console.error('[SQLite] Error in saveOrUpdateArticle:', error);
      Alert.alert('Error', 'Failed to save article. Please try again.');
      return null;
    }
  }, [db, isInitialized, loadArticleCount]);

  const loadAllArticles = useCallback(async (): Promise<Article[]> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for loading articles');
      return [];
    }

    try {
      console.log('[SQLite] Loading all articles...');
      const articles = await db.getAllAsync<Article>(
        `SELECT 
          id, title, english_text, target_text, language, 
          created_at, updated_at, rendered_content
         FROM articles 
         ORDER BY updated_at DESC`
      );

      console.log('[SQLite] Loaded articles:', articles.length);
      return articles;
    } catch (error) {
      console.error('[SQLite] Error loading articles:', error);
      return [];
    }
  }, [db, isInitialized]);

  const deleteArticle = useCallback(async (id: number): Promise<boolean> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for deletion');
      return false;
    }

    try {
      console.log('[SQLite] Deleting article:', id);
      const result = await db.runAsync('DELETE FROM articles WHERE id = ?', id);
      const success = result.changes > 0;
      
      if (success) {
        await loadArticleCount();
        console.log('[SQLite] Article deleted:', { id, changes: result.changes });
      } else {
        console.warn('[SQLite] Article not found for deletion:', id);
      }
      
      return success;
    } catch (error) {
      console.error('[SQLite] Error deleting article:', error);
      return false;
    }
  }, [db, isInitialized, loadArticleCount]);

  const deleteMultipleArticles = useCallback(async (ids: number[]): Promise<boolean> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for multiple deletions');
      return false;
    }

    if (ids.length === 0) {
      console.log('[SQLite] No articles to delete');
      return false;
    }

    try {
      console.log('[SQLite] Deleting multiple articles:', ids);
      
      let totalChanges = 0;
      await db.withExclusiveTransactionAsync(async () => {
        for (const id of ids) {
          const result = await db.runAsync('DELETE FROM articles WHERE id = ?', id);
          totalChanges += result.changes;
        }
      });

      const success = totalChanges > 0;
      
      if (success) {
        await loadArticleCount();
        console.log('[SQLite] Articles deleted:', { count: totalChanges, ids });
      }
      
      return success;
    } catch (error) {
      console.error('[SQLite] Error deleting multiple articles:', error);
      return false;
    }
  }, [db, isInitialized, loadArticleCount]);

  const getArticlesByIds = useCallback(async (ids: number[]): Promise<Article[]> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for query by IDs');
      return [];
    }

    if (ids.length === 0) {
      return [];
    }

    try {
      console.log('[SQLite] Getting articles by IDs:', ids);
      
      const placeholders = ids.map(() => '?').join(',');
      const query = `SELECT * FROM articles WHERE id IN (${placeholders}) ORDER BY updated_at DESC`;
      
      const articles = await db.getAllAsync<Article>(query, ...ids);
      console.log('[SQLite] Found articles:', articles.length);
      
      return articles;
    } catch (error) {
      console.error('[SQLite] Error getting articles by IDs:', error);
      return [];
    }
  }, [db, isInitialized]);

  const getArticleById = useCallback(async (id: number): Promise<Article | null> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for query by ID');
      return null;
    }

    try {
      console.log('[SQLite] Getting article by ID:', id);
      const article = await db.getFirstAsync<Article>(
        'SELECT * FROM articles WHERE id = ?',
        id
      );

      return article || null;
    } catch (error) {
      console.error('[SQLite] Error getting article by ID:', error);
      return null;
    }
  }, [db, isInitialized]);

  const exportSelectedArticles = useCallback(async (ids: number[]): Promise<boolean> => {
    try {
      const articles = await getArticlesByIds(ids);
      
      if (articles.length === 0) {
        console.warn('[SQLite] No articles found for export');
        return false;
      }

      console.log('[SQLite] Exporting articles:', articles.length);
      await exportArticles(articles);
      return true;
    } catch (error) {
      console.error('[SQLite] Error exporting selected articles:', error);
      return false;
    }
  }, [getArticlesByIds]);

  const checkAndPromptExport = useCallback(() => {
    console.log('[SQLite] Checking export threshold:', {
      articleCount,
      threshold: 100,
      shouldPrompt: articleCount >= 100
    });

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
      return true;
    }
    
    return false;
  }, [articleCount]);

  const handleExport = useCallback(async () => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for export');
      return;
    }

    try {
      console.log('[SQLite] Exporting all articles...');
      const articles = await loadAllArticles();
      
      if (articles.length === 0) {
        Alert.alert('Info', 'No articles to export');
        return;
      }

      console.log('[SQLite] Exporting', articles.length, 'articles');
      await exportArticles(articles);

      // Clear database after export
      await db.runAsync('DELETE FROM articles');
      await db.runAsync('UPDATE sqlite_sequence SET seq = 0 WHERE name = "articles"');
      
      await loadArticleCount();
      
      Alert.alert('Success', 'Articles exported and storage cleared!');
    } catch (error) {
      console.error('[SQLite] Error exporting articles:', error);
      Alert.alert('Error', 'Failed to export articles');
    }
  }, [db, isInitialized, loadAllArticles, loadArticleCount]);

  const clearAllArticles = useCallback(async (): Promise<boolean> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for clearing');
      return false;
    }

    try {
      console.log('[SQLite] Clearing all articles...');
      await db.runAsync('DELETE FROM articles');
      await db.runAsync('UPDATE sqlite_sequence SET seq = 0 WHERE name = "articles"');
      
      await loadArticleCount();
      console.log('[SQLite] All articles cleared');
      return true;
    } catch (error) {
      console.error('[SQLite] Error clearing articles:', error);
      return false;
    }
  }, [db, isInitialized, loadArticleCount]);

  // Migration function - updated to generate rendered content
  const migrateFromJSON = useCallback(async (): Promise<number> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for migration');
      return 0;
    }

    try {
      console.log('[SQLite] Starting migration from JSON...');
      
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const articlesJson = await AsyncStorage.default.getItem('@articles_storage');
      
      if (!articlesJson) {
        console.log('[SQLite] No JSON data to migrate');
        return 0;
      }

      const articles = JSON.parse(articlesJson);
      if (!Array.isArray(articles) || articles.length === 0) {
        console.log('[SQLite] Empty or invalid JSON data');
        return 0;
      }

      console.log('[SQLite] Migrating', articles.length, 'articles');
      let migratedCount = 0;

      await db.withExclusiveTransactionAsync(async () => {
        for (const article of articles) {
          try {
            // Process to generate full rendered content
            const renderedContent = processText(
              article.english_text || article.englishText || '',
              article.target_text || article.targetText || '',
              article.language || 'chinese'
            );
            
            const renderedContentJson = JSON.stringify(renderedContent);

            await db.runAsync(
              `INSERT OR IGNORE INTO articles 
                (id, title, english_text, target_text, language, created_at, updated_at, rendered_content)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                article.id,
                article.title || article.articleTitle || 'Untitled',
                article.english_text || article.englishText || '',
                article.target_text || article.targetText || '',
                article.language || 'chinese',
                article.created_at || article.createdAt || Date.now(),
                article.updated_at || article.updatedAt || Date.now(),
                renderedContentJson
              ]
            );
            migratedCount++;
          } catch (error) {
            console.warn('[SQLite] Failed to migrate article:', article.id, error);
          }
        }
      });

      console.log('[SQLite] Migration complete:', migratedCount, 'articles migrated');
      await loadArticleCount();
      
      return migratedCount;
    } catch (error) {
      console.error('[SQLite] Migration failed:', error);
      return 0;
    }
  }, [db, isInitialized, loadArticleCount]);

  return {
    // Core operations
    saveOrUpdateArticle,
    loadAllArticles,
    deleteArticle,
    deleteMultipleArticles,
    getArticlesByIds,
    getArticleById,
    
    // Export operations
    exportSelectedArticles,
    checkAndPromptExport,
    handleExport,
    clearAllArticles,
    
    // Migration
    migrateFromJSON,
    
    // State
    articleCount,
    isReady,
    isInitialized,
  };
};