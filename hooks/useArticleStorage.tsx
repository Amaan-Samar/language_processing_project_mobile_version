
// import { useEffect, useState, useCallback } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { Alert } from 'react-native';
// import { exportArticles } from '../utils/articleExporter';

// const ARTICLES_KEY = '@articles_storage';
// const COUNTER_KEY = '@articles_counter';

// interface Article {
//   id: number;
//   title: string;
//   english_text: string;
//   target_text: string;
//   language: string;
//   created_at: number;
//   updated_at: number;
// }

// export const useArticleStorage = () => {
//   const [articleCount, setArticleCount] = useState(0);
//   const [isReady, setIsReady] = useState(false);
  
//   // Component instance ID for logging
//   const componentId = `storage-${Math.random().toString(36).substr(2, 9)}`;

//   useEffect(() => {
//     console.log(`[${componentId}] Hook initialized`);
    
//     const init = async () => {
//       console.log(`[${componentId}] Starting storage initialization...`);
//       try {
//         const count = await loadArticleCount();
//         console.log(`[${componentId}] Initialization completed successfully`, {
//           initialCount: count,
//           timestamp: new Date().toISOString(),
//         });
//         setIsReady(true);
//       } catch (error) {
//         console.error(`[${componentId}] Failed to initialize storage:`, error, {
//           errorMessage: error instanceof Error ? error.message : 'Unknown error',
//           stack: error instanceof Error ? error.stack : undefined,
//         });
//         setIsReady(false);
//       }
//     };
    
//     init();
    
//     return () => {
//       console.log(`[${componentId}] Hook cleanup`);
//     };
//   }, []);

//   const getNextId = async (): Promise<number> => {
//     console.log(`[${componentId}] Getting next ID...`);
//     try {
//       const counterStr = await AsyncStorage.getItem(COUNTER_KEY);
//       const counter = counterStr ? parseInt(counterStr, 10) : 0;
//       const nextId = counter + 1;
      
//       console.log(`[${componentId}] Current counter: ${counter}, Next ID: ${nextId}`);
      
//       await AsyncStorage.setItem(COUNTER_KEY, nextId.toString());
//       console.log(`[${componentId}] Counter updated to: ${nextId}`);
      
//       return nextId;
//     } catch (error) {
//       console.error(`[${componentId}] Error getting next ID:`, error, {
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//         timestamp: new Date().toISOString(),
//       });
//       const fallbackId = Date.now();
//       console.log(`[${componentId}] Using fallback ID: ${fallbackId}`);
//       return fallbackId;
//     }
//   };

//   const loadArticles = async (): Promise<Article[]> => {
//     console.log(`[${componentId}] Loading articles from storage...`);
//     try {
//       const articlesJson = await AsyncStorage.getItem(ARTICLES_KEY);
      
//       if (!articlesJson) {
//         console.log(`[${componentId}] No articles found in storage`);
//         return [];
//       }
      
//       const articles = JSON.parse(articlesJson);
//       const isValidArray = Array.isArray(articles);
      
//       console.log(`[${componentId}] Articles loaded:`, {
//         hasData: !!articlesJson,
//         jsonLength: articlesJson.length,
//         parsedCount: isValidArray ? articles.length : 'Invalid format',
//         isValidArray,
//       });
      
//       return isValidArray ? articles : [];
//     } catch (error) {
//       console.error(`[${componentId}] Error loading articles:`, error, {
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined,
//       });
//       return [];
//     }
//   };

//   const saveArticles = async (articles: Article[]): Promise<void> => {
//     console.log(`[${componentId}] Saving articles to storage...`, {
//       articleCount: articles.length,
//       firstArticleId: articles[0]?.id || 'none',
//       lastArticleId: articles[articles.length - 1]?.id || 'none',
//     });
    
//     try {
//       const articlesJson = JSON.stringify(articles);
//       console.log(`[${componentId}] JSON size: ${articlesJson.length} characters`);
      
//       await AsyncStorage.setItem(ARTICLES_KEY, articlesJson);
//       console.log(`[${componentId}] Articles saved successfully`);
//     } catch (error) {
//       console.error(`[${componentId}] Error saving articles:`, error, {
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//         articleCount: articles.length,
//         timestamp: new Date().toISOString(),
//       });
//       throw error;
//     }
//   };

//   const loadArticleCount = useCallback(async () => {
//     console.log(`[${componentId}] Loading article count...`);
//     try {
//       const articles = await loadArticles();
//       const count = articles.length;
      
//       console.log(`[${componentId}] Article count loaded:`, {
//         count,
//         previousCount: articleCount,
//         changed: count !== articleCount,
//       });
      
//       setArticleCount(count);
//       return count;
//     } catch (error) {
//       console.error(`[${componentId}] Error loading count:`, error);
//       setArticleCount(0);
//       return 0;
//     }
//   }, [articleCount]);

//   const saveOrUpdateArticle = useCallback(async (article: {
//     id?: number | null;
//     title: string;
//     english: string;
//     target: string;
//     language: string;
//     timestamp: number;
//   }): Promise<number | null> => {
//     console.log(`[${componentId}] saveOrUpdateArticle called with:`, {
//       id: article.id,
//       titleLength: article.title.length,
//       englishLength: article.english.length,
//       targetLength: article.target.length,
//       language: article.language,
//       isUpdate: !!article.id,
//     });

//     try {
//       if (article.id) {
//         console.log(`[${componentId}] Updating existing article ID: ${article.id}`);
//         const result = await updateArticle(article);
//         return result;
//       }
      
//       console.log(`[${componentId}] Creating new article`);
//       const result = await createArticle(article);
//       return result;
//     } catch (error) {
//       console.error(`[${componentId}] Error in saveOrUpdateArticle:`, error, {
//         articleData: {
//           id: article.id,
//           title: article.title.substring(0, 50) + (article.title.length > 50 ? '...' : ''),
//           englishPreview: article.english.substring(0, 100) + (article.english.length > 100 ? '...' : ''),
//           targetPreview: article.target.substring(0, 100) + (article.target.length > 100 ? '...' : ''),
//         },
//       });
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
//     console.log(`[${componentId}] Creating new article...`, {
//       title: article.title,
//       language: article.language,
//       timestamp: new Date(article.timestamp).toISOString(),
//     });

//     try {
//       // Validate inputs
//       if (!article.title || !article.english || !article.target || !article.language) {
//         const missingFields = [];
//         if (!article.title) missingFields.push('title');
//         if (!article.english) missingFields.push('english');
//         if (!article.target) missingFields.push('target');
//         if (!article.language) missingFields.push('language');
        
//         console.error(`[${componentId}] Validation failed - missing fields:`, missingFields);
//         throw new Error(`Missing required article fields: ${missingFields.join(', ')}`);
//       }
      
//       const articles = await loadArticles();
//       console.log(`[${componentId}] Current articles before creation: ${articles.length}`);
      
//       const newId = await getNextId();
//       console.log(`[${componentId}] Generated new ID: ${newId}`);
      
//       const newArticle: Article = {
//         id: newId,
//         title: article.title,
//         english_text: article.english,
//         target_text: article.target,
//         language: article.language,
//         created_at: article.timestamp,
//         updated_at: article.timestamp,
//       };
      
//       articles.push(newArticle);
//       console.log(`[${componentId}] Added new article to array, new count: ${articles.length}`);
      
//       await saveArticles(articles);
//       await loadArticleCount();
      
//       console.log(`[${componentId}] Article created successfully`, {
//         id: newId,
//         title: article.title,
//         language: article.language,
//         created: new Date(article.timestamp).toISOString(),
//       });
      
//       return newId;
//     } catch (error) {
//       console.error(`[${componentId}] Error creating article:`, error, {
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined,
//       });
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
//     console.log(`[${componentId}] Updating article with ID: ${article.id}`, {
//       title: article.title,
//       language: article.language,
//       timestamp: new Date(article.timestamp).toISOString(),
//     });

//     try {
//       const articles = await loadArticles();
//       console.log(`[${componentId}] Total articles: ${articles.length}`);
      
//       const index = articles.findIndex(a => a.id === article.id);
//       console.log(`[${componentId}] Found article at index: ${index}`);
      
//       if (index === -1) {
//         console.warn(`[${componentId}] Article not found with ID: ${article.id} - creating new one`);
//         return await createArticle(article);
//       }

//       console.log(`[${componentId}] Original article data:`, {
//         title: articles[index].title,
//         englishLength: articles[index].english_text.length,
//         targetLength: articles[index].target_text.length,
//         updated: new Date(articles[index].updated_at).toISOString(),
//       });

//       articles[index] = {
//         ...articles[index],
//         title: article.title,
//         english_text: article.english,
//         target_text: article.target,
//         language: article.language,
//         updated_at: article.timestamp,
//       };
      
//       console.log(`[${componentId}] Updated article data:`, {
//         title: articles[index].title,
//         englishLength: articles[index].english_text.length,
//         targetLength: articles[index].target_text.length,
//         updated: new Date(articles[index].updated_at).toISOString(),
//       });
      
//       await saveArticles(articles);
//       await loadArticleCount();
      
//       console.log(`[${componentId}] Article updated successfully`, {
//         id: article.id,
//         newTitle: article.title,
//       });
      
//       return article.id;
//     } catch (error) {
//       console.error(`[${componentId}] Error updating article:`, error, {
//         articleId: article.id,
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//       });
//       throw error;
//     }
//   };

//   const loadAllArticles = useCallback(async () => {
//     console.log(`[${componentId}] Loading all articles...`);
//     try {
//       const articles = await loadArticles();
//       const sortedArticles = [...articles].sort((a, b) => b.updated_at - a.updated_at);
      
//       console.log(`[${componentId}] Loaded and sorted articles:`, {
//         total: sortedArticles.length,
//         oldest: sortedArticles.length > 0 ? new Date(sortedArticles[sortedArticles.length - 1].updated_at).toISOString() : 'none',
//         newest: sortedArticles.length > 0 ? new Date(sortedArticles[0].updated_at).toISOString() : 'none',
//       });
      
//       return sortedArticles;
//     } catch (error) {
//       console.error(`[${componentId}] Error loading all articles:`, error);
//       return [];
//     }
//   }, []);

//   const deleteArticle = useCallback(async (id: number) => {
//     console.log(`[${componentId}] Deleting article with ID: ${id}`);
//     try {
//       const articles = await loadArticles();
//       const initialCount = articles.length;
      
//       const filtered = articles.filter(a => a.id !== id);
//       const deletedCount = initialCount - filtered.length;
      
//       console.log(`[${componentId}] Deletion stats:`, {
//         initialCount,
//         filteredCount: filtered.length,
//         deletedCount,
//         wasDeleted: deletedCount > 0,
//       });
      
//       if (deletedCount === 0) {
//         console.warn(`[${componentId}] Article with ID ${id} not found for deletion`);
//       }
      
//       await saveArticles(filtered);
//       await loadArticleCount();
      
//       console.log(`[${componentId}] Article deletion completed`, {
//         id,
//         success: deletedCount > 0,
//         newCount: filtered.length,
//       });
      
//       return deletedCount > 0;
//     } catch (error) {
//       console.error(`[${componentId}] Error deleting article:`, error, {
//         articleId: id,
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//       });
//       return false;
//     }
//   }, [loadArticleCount]);

//   const deleteMultipleArticles = useCallback(async (ids: number[]) => {
//     console.log(`[${componentId}] Deleting multiple articles:`, {
//       ids,
//       count: ids.length,
//     });

//     if (ids.length === 0) {
//       console.log(`[${componentId}] No IDs provided, skipping deletion`);
//       return false;
//     }

//     try {
//       const articles = await loadArticles();
//       const initialCount = articles.length;
      
//       const filtered = articles.filter(a => !ids.includes(a.id));
//       const deletedCount = initialCount - filtered.length;
      
//       console.log(`[${componentId}] Multiple deletion stats:`, {
//         initialCount,
//         filteredCount: filtered.length,
//         deletedCount,
//         requestedIds: ids.length,
//         actuallyDeleted: deletedCount,
//         missingIds: ids.filter(id => !articles.find(a => a.id === id)),
//       });
      
//       await saveArticles(filtered);
//       await loadArticleCount();
      
//       console.log(`[${componentId}] Multiple articles deletion completed`, {
//         success: true,
//         newCount: filtered.length,
//       });
      
//       return true;
//     } catch (error) {
//       console.error(`[${componentId}] Error deleting multiple articles:`, error, {
//         ids,
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//       });
//       return false;
//     }
//   }, [loadArticleCount]);

//   const getArticlesByIds = useCallback(async (ids: number[]) => {
//     console.log(`[${componentId}] Getting articles by IDs:`, {
//       ids,
//       count: ids.length,
//     });

//     if (ids.length === 0) {
//       console.log(`[${componentId}] No IDs provided, returning empty array`);
//       return [];
//     }

//     try {
//       const articles = await loadArticles();
//       const filtered = articles.filter(a => ids.includes(a.id));
//       const sorted = filtered.sort((a, b) => b.updated_at - a.updated_at);
      
//       console.log(`[${componentId}] Retrieved articles by IDs:`, {
//         requested: ids.length,
//         found: filtered.length,
//         missing: ids.filter(id => !filtered.find(a => a.id === id)),
//         foundIds: filtered.map(a => a.id),
//       });
      
//       return sorted;
//     } catch (error) {
//       console.error(`[${componentId}] Error loading articles by IDs:`, error, {
//         ids,
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//       });
//       return [];
//     }
//   }, []);

//   const checkAndPromptExport = useCallback(() => {
//     console.log(`[${componentId}] Checking if export should be prompted...`, {
//       articleCount,
//       threshold: 100,
//       shouldPrompt: articleCount >= 100,
//     });

//     if (articleCount >= 100) {
//       console.log(`[${componentId}] Threshold reached, showing export prompt`);
//       Alert.alert(
//         'Storage Full',
//         'You have 100 articles saved. Would you like to download them?',
//         [
//           { text: 'Later', style: 'cancel' },
//           {
//             text: 'Download',
//             onPress: async () => {
//               console.log(`[${componentId}] User chose to download articles`);
//               await handleExport();
//             },
//           },
//         ]
//       );
//       return true;
//     }
    
//     console.log(`[${componentId}] Threshold not reached (${articleCount}/100)`);
//     return false;
//   }, [articleCount]);

//   const handleExport = useCallback(async () => {
//     console.log(`[${componentId}] Starting export process...`);
//     try {
//       const articles = await loadArticles();
//       console.log(`[${componentId}] Exporting ${articles.length} articles`);
      
//       await exportArticles(articles);
//       console.log(`[${componentId}] Articles exported successfully`);

//       await saveArticles([]);
//       console.log(`[${componentId}] Storage cleared`);
      
//       await AsyncStorage.setItem(COUNTER_KEY, '0');
//       console.log(`[${componentId}] Counter reset to 0`);
      
//       await loadArticleCount();
//       console.log(`[${componentId}] Count refreshed after export`);
      
//       Alert.alert('Success', 'Articles exported and storage cleared!');
//     } catch (error) {
//       console.error(`[${componentId}] Error exporting articles:`, error, {
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//         stack: error instanceof Error ? error.stack : undefined,
//       });
//       Alert.alert('Error', 'Failed to export articles');
//     }
//   }, [loadArticleCount]);

//   const exportSelectedArticles = useCallback(async (ids: number[]) => {
//     console.log(`[${componentId}] Exporting selected articles:`, {
//       ids,
//       count: ids.length,
//     });

//     if (ids.length === 0) {
//       console.log(`[${componentId}] No articles selected for export`);
//       return false;
//     }

//     try {
//       const articles = await getArticlesByIds(ids);
//       console.log(`[${componentId}] Found ${articles.length} articles for export`);
      
//       if (articles.length === 0) {
//         console.warn(`[${componentId}] No articles found for the given IDs`);
//         return false;
//       }
      
//       await exportArticles(articles);
//       console.log(`[${componentId}] Selected articles exported successfully`);
//       return true;
//     } catch (error) {
//       console.error(`[${componentId}] Error exporting selected articles:`, error, {
//         ids,
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//       });
//       return false;
//     }
//   }, [getArticlesByIds]);

//   const clearAllArticles = useCallback(async () => {
//     console.log(`[${componentId}] Clearing all articles...`);
//     try {
//       await saveArticles([]);
//       console.log(`[${componentId}] Articles array cleared`);
      
//       await AsyncStorage.setItem(COUNTER_KEY, '0');
//       console.log(`[${componentId}] Counter reset to 0`);
      
//       await loadArticleCount();
//       console.log(`[${componentId}] All articles cleared successfully`);
//       return true;
//     } catch (error) {
//       console.error(`[${componentId}] Error clearing articles:`, error);
//       return false;
//     }
//   }, [loadArticleCount]);

//   const getArticleById = useCallback(async (id: number) => {
//     console.log(`[${componentId}] Getting article by ID: ${id}`);
//     try {
//       const articles = await loadArticles();
//       const article = articles.find(a => a.id === id);
      
//       if (article) {
//         console.log(`[${componentId}] Article found:`, {
//           id: article.id,
//           title: article.title,
//           language: article.language,
//           created: new Date(article.created_at).toISOString(),
//           updated: new Date(article.updated_at).toISOString(),
//         });
//       } else {
//         console.warn(`[${componentId}] No article found with ID: ${id}`);
//       }
      
//       return article || null;
//     } catch (error) {
//       console.error(`[${componentId}] Error loading article by ID:`, error, {
//         id,
//         errorMessage: error instanceof Error ? error.message : 'Unknown error',
//       });
//       return null;
//     }
//   }, []);

//   // Log hook state changes
//   useEffect(() => {
//     console.log(`[${componentId}] State updated:`, {
//       articleCount,
//       isReady,
//       timestamp: new Date().toISOString(),
//     });
//   }, [articleCount, isReady]);

//   const returnValue = {
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

//   console.log(`[${componentId}] Hook returning:`, {
//     articleCount: returnValue.articleCount,
//     isReady: returnValue.isReady,
//     functionCount: Object.keys(returnValue).filter(key => typeof returnValue[key as keyof typeof returnValue] === 'function').length,
//     timestamp: new Date().toISOString(),
//   });

//   return returnValue;
// };


import { 
  useSQLiteContext, 
  type SQLiteDatabase,
  type SQLiteRunResult
} from 'expo-sqlite';
import { useEffect, useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { exportArticles, exportArticlesToPDF } from '../utils/articleExporter';
import { processText } from '../utils/pinyinProcessor';

// Types
interface Article {
  id: number;
  title: string;
  english_text: string;
  target_text: string;
  language: string;
  created_at: number;
  updated_at: number;
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
  renderedContent?: any[];
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

// Helper function to extract minimal pinyin data
const extractPinyinData = (renderedContent: any[]) => {
  if (!renderedContent || renderedContent.length === 0) {
    return { pinyinMap: null, indices: null };
  }

  const pinyinMap: Record<string, string> = {};
  const indices: number[] = [];
  let charIndex = 0;

  renderedContent.forEach((item) => {
    if (item.type === 'target' && item.words) {
      item.words.forEach((word: any) => {
        if (word.pinyin && word.showPinyin) {
          if (!pinyinMap[word.char]) {
            pinyinMap[word.char] = word.pinyin;
          }
          indices.push(charIndex);
        }
        charIndex += word.char.length;
      });
    }
  });

  return {
    pinyinMap: Object.keys(pinyinMap).length > 0 ? pinyinMap : null,
    indices: indices.length > 0 ? indices : null
  };
};

// Main hook that uses SQLite context
export const useArticleStorage = () => {
  const db = useSQLiteContext();
  const [articleCount, setArticleCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // const databaseReady = db && isInitialized;

  // Initialize database on mount
  // useEffect(() => {
  //   const init = async () => {
  //     if (!db) {
  //       console.error('[SQLite] Database context not available');
  //       return;
  //     }

  //     try {
  //       console.log('[useArticleStorage] Initializing with SQLite context...');
  //       await initializeDatabase(db);
  //       setIsInitialized(true);
        
  //       // Load initial count
  //       const count = await loadArticleCount();
  //       console.log('[useArticleStorage] Initial article count:', count);
        
  //       setIsReady(true);
  //     } catch (error) {
  //       console.error('[useArticleStorage] Initialization failed:', error);
  //       setIsReady(false);
  //     }
  //   };

  //   init();
  // }, [db]);

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
      isUpdate: !!article.id
    });

    try {
      const timestamp = article.timestamp || Date.now();
      
      // Extract pinyin data if provided
      let pinyinData = null;
      let firstOccurrences = null;
      
      if (article.renderedContent) {
        const extracted = extractPinyinData(article.renderedContent);
        pinyinData = extracted.pinyinMap ? JSON.stringify(extracted.pinyinMap) : null;
        firstOccurrences = extracted.indices ? JSON.stringify(extracted.indices) : null;
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
            pinyin_data = ?,
            first_occurrences = ?
           WHERE id = ?`,
          [
            article.title,
            article.english,
            article.target,
            article.language,
            timestamp,
            pinyinData,
            firstOccurrences,
            article.id
          ]
        );

        console.log('[SQLite] Article updated:', { id: article.id, changes: result.changes });
      } else {
        // Insert new article
        result = await db.runAsync(
          `INSERT INTO articles 
            (title, english_text, target_text, language, created_at, updated_at, pinyin_data, first_occurrences) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            article.title,
            article.english,
            article.target,
            article.language,
            timestamp,
            timestamp,
            pinyinData,
            firstOccurrences
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
          created_at, updated_at, pinyin_data, first_occurrences
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
      
      // Use a transaction for safety
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
      
      // Use prepared statement for safety with multiple IDs
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

  // Migration function
  const migrateFromJSON = useCallback(async (): Promise<number> => {
    if (!db || !isInitialized) {
      console.error('[SQLite] Database not ready for migration');
      return 0;
    }

    try {
      console.log('[SQLite] Starting migration from JSON...');
      
      // Try to load from AsyncStorage
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
            // Process to generate pinyin data
            const renderedContent = processText(
              article.english_text || article.englishText || '',
              article.target_text || article.targetText || '',
              article.language || 'chinese'
            );
            
            const extracted = extractPinyinData(renderedContent);
            const pinyinData = extracted.pinyinMap ? JSON.stringify(extracted.pinyinMap) : null;
            const firstOccurrences = extracted.indices ? JSON.stringify(extracted.indices) : null;

            await db.runAsync(
              `INSERT OR IGNORE INTO articles 
                (id, title, english_text, target_text, language, created_at, updated_at, pinyin_data, first_occurrences)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                article.id,
                article.title || article.articleTitle || 'Untitled',
                article.english_text || article.englishText || '',
                article.target_text || article.targetText || '',
                article.language || 'chinese',
                article.created_at || article.createdAt || Date.now(),
                article.updated_at || article.updatedAt || Date.now(),
                pinyinData,
                firstOccurrences
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