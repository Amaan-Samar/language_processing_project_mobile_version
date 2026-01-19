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

//   useEffect(() => {
//     const init = async () => {
//       try {
//         await loadArticleCount();
//         setIsReady(true);
//       } catch (error) {
//         console.error('Failed to initialize storage:', error);
//         setIsReady(false);
//       }
//     };
    
//     init();
//   }, []);

//   const getNextId = async (): Promise<number> => {
//     try {
//       const counterStr = await AsyncStorage.getItem(COUNTER_KEY);
//       const counter = counterStr ? parseInt(counterStr, 10) : 0;
//       const nextId = counter + 1;
//       await AsyncStorage.setItem(COUNTER_KEY, nextId.toString());
//       return nextId;
//     } catch (error) {
//       console.error('Error getting next ID:', error);
//       return Date.now(); // Fallback to timestamp
//     }
//   };

//   const loadArticles = async (): Promise<Article[]> => {
//     try {
//       const articlesJson = await AsyncStorage.getItem(ARTICLES_KEY);
//       if (!articlesJson) {
//         return [];
//       }
//       const articles = JSON.parse(articlesJson);
//       return Array.isArray(articles) ? articles : [];
//     } catch (error) {
//       console.error('Error loading articles:', error);
//       return [];
//     }
//   };

//   const saveArticles = async (articles: Article[]): Promise<void> => {
//     try {
//       await AsyncStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
//     } catch (error) {
//       console.error('Error saving articles:', error);
//       throw error;
//     }
//   };

//   const loadArticleCount = useCallback(async () => {
//     try {
//       const articles = await loadArticles();
//       const count = articles.length;
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
      
//       const articles = await loadArticles();
//       const newId = await getNextId();
      
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
//       await saveArticles(articles);
      
//       console.log('Article created with ID:', newId);
//       await loadArticleCount();
//       return newId;
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
      
//       const articles = await loadArticles();
//       const index = articles.findIndex(a => a.id === article.id);
      
//       if (index === -1) {
//         console.warn('Article not found with ID:', article.id, '- creating new one');
//         return await createArticle(article);
//       }

//       articles[index] = {
//         ...articles[index],
//         title: article.title,
//         english_text: article.english,
//         target_text: article.target,
//         language: article.language,
//         updated_at: article.timestamp,
//       };
      
//       await saveArticles(articles);
      
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
//       const articles = await loadArticles();
//       // Sort by updated_at descending
//       articles.sort((a, b) => b.updated_at - a.updated_at);
      
//       console.log('Loaded articles:', articles.length);
//       return articles;
//     } catch (error) {
//       console.error('Error loading articles:', error);
//       return [];
//     }
//   }, []);

//   const deleteArticle = useCallback(async (id: number) => {
//     try {
//       const articles = await loadArticles();
//       const filtered = articles.filter(a => a.id !== id);
      
//       await saveArticles(filtered);
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
//       const articles = await loadArticles();
//       const filtered = articles.filter(a => !ids.includes(a.id));
      
//       await saveArticles(filtered);
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
//       const articles = await loadArticles();
//       const filtered = articles.filter(a => ids.includes(a.id));
//       // Sort by updated_at descending
//       filtered.sort((a, b) => b.updated_at - a.updated_at);
      
//       return filtered;
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
//       const articles = await loadArticles();
//       await exportArticles(articles);

//       await saveArticles([]);
//       await AsyncStorage.setItem(COUNTER_KEY, '0');
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
      
//       await saveArticles([]);
//       await AsyncStorage.setItem(COUNTER_KEY, '0');
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
//       const articles = await loadArticles();
//       const article = articles.find(a => a.id === id);
      
//       if (article) {
//         console.log('Loaded article by ID:', id);
//       } else {
//         console.warn('No article found with ID:', id);
//       }
      
//       return article || null;
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
  
  // Component instance ID for logging
  const componentId = `storage-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    console.log(`[${componentId}] Hook initialized`);
    
    const init = async () => {
      console.log(`[${componentId}] Starting storage initialization...`);
      try {
        const count = await loadArticleCount();
        console.log(`[${componentId}] Initialization completed successfully`, {
          initialCount: count,
          timestamp: new Date().toISOString(),
        });
        setIsReady(true);
      } catch (error) {
        console.error(`[${componentId}] Failed to initialize storage:`, error, {
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });
        setIsReady(false);
      }
    };
    
    init();
    
    return () => {
      console.log(`[${componentId}] Hook cleanup`);
    };
  }, []);

  const getNextId = async (): Promise<number> => {
    console.log(`[${componentId}] Getting next ID...`);
    try {
      const counterStr = await AsyncStorage.getItem(COUNTER_KEY);
      const counter = counterStr ? parseInt(counterStr, 10) : 0;
      const nextId = counter + 1;
      
      console.log(`[${componentId}] Current counter: ${counter}, Next ID: ${nextId}`);
      
      await AsyncStorage.setItem(COUNTER_KEY, nextId.toString());
      console.log(`[${componentId}] Counter updated to: ${nextId}`);
      
      return nextId;
    } catch (error) {
      console.error(`[${componentId}] Error getting next ID:`, error, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
      const fallbackId = Date.now();
      console.log(`[${componentId}] Using fallback ID: ${fallbackId}`);
      return fallbackId;
    }
  };

  const loadArticles = async (): Promise<Article[]> => {
    console.log(`[${componentId}] Loading articles from storage...`);
    try {
      const articlesJson = await AsyncStorage.getItem(ARTICLES_KEY);
      
      if (!articlesJson) {
        console.log(`[${componentId}] No articles found in storage`);
        return [];
      }
      
      const articles = JSON.parse(articlesJson);
      const isValidArray = Array.isArray(articles);
      
      console.log(`[${componentId}] Articles loaded:`, {
        hasData: !!articlesJson,
        jsonLength: articlesJson.length,
        parsedCount: isValidArray ? articles.length : 'Invalid format',
        isValidArray,
      });
      
      return isValidArray ? articles : [];
    } catch (error) {
      console.error(`[${componentId}] Error loading articles:`, error, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      return [];
    }
  };

  const saveArticles = async (articles: Article[]): Promise<void> => {
    console.log(`[${componentId}] Saving articles to storage...`, {
      articleCount: articles.length,
      firstArticleId: articles[0]?.id || 'none',
      lastArticleId: articles[articles.length - 1]?.id || 'none',
    });
    
    try {
      const articlesJson = JSON.stringify(articles);
      console.log(`[${componentId}] JSON size: ${articlesJson.length} characters`);
      
      await AsyncStorage.setItem(ARTICLES_KEY, articlesJson);
      console.log(`[${componentId}] Articles saved successfully`);
    } catch (error) {
      console.error(`[${componentId}] Error saving articles:`, error, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        articleCount: articles.length,
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  };

  const loadArticleCount = useCallback(async () => {
    console.log(`[${componentId}] Loading article count...`);
    try {
      const articles = await loadArticles();
      const count = articles.length;
      
      console.log(`[${componentId}] Article count loaded:`, {
        count,
        previousCount: articleCount,
        changed: count !== articleCount,
      });
      
      setArticleCount(count);
      return count;
    } catch (error) {
      console.error(`[${componentId}] Error loading count:`, error);
      setArticleCount(0);
      return 0;
    }
  }, [articleCount]);

  const saveOrUpdateArticle = useCallback(async (article: {
    id?: number | null;
    title: string;
    english: string;
    target: string;
    language: string;
    timestamp: number;
  }): Promise<number | null> => {
    console.log(`[${componentId}] saveOrUpdateArticle called with:`, {
      id: article.id,
      titleLength: article.title.length,
      englishLength: article.english.length,
      targetLength: article.target.length,
      language: article.language,
      isUpdate: !!article.id,
    });

    try {
      if (article.id) {
        console.log(`[${componentId}] Updating existing article ID: ${article.id}`);
        const result = await updateArticle(article);
        return result;
      }
      
      console.log(`[${componentId}] Creating new article`);
      const result = await createArticle(article);
      return result;
    } catch (error) {
      console.error(`[${componentId}] Error in saveOrUpdateArticle:`, error, {
        articleData: {
          id: article.id,
          title: article.title.substring(0, 50) + (article.title.length > 50 ? '...' : ''),
          englishPreview: article.english.substring(0, 100) + (article.english.length > 100 ? '...' : ''),
          targetPreview: article.target.substring(0, 100) + (article.target.length > 100 ? '...' : ''),
        },
      });
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
    console.log(`[${componentId}] Creating new article...`, {
      title: article.title,
      language: article.language,
      timestamp: new Date(article.timestamp).toISOString(),
    });

    try {
      // Validate inputs
      if (!article.title || !article.english || !article.target || !article.language) {
        const missingFields = [];
        if (!article.title) missingFields.push('title');
        if (!article.english) missingFields.push('english');
        if (!article.target) missingFields.push('target');
        if (!article.language) missingFields.push('language');
        
        console.error(`[${componentId}] Validation failed - missing fields:`, missingFields);
        throw new Error(`Missing required article fields: ${missingFields.join(', ')}`);
      }
      
      const articles = await loadArticles();
      console.log(`[${componentId}] Current articles before creation: ${articles.length}`);
      
      const newId = await getNextId();
      console.log(`[${componentId}] Generated new ID: ${newId}`);
      
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
      console.log(`[${componentId}] Added new article to array, new count: ${articles.length}`);
      
      await saveArticles(articles);
      await loadArticleCount();
      
      console.log(`[${componentId}] Article created successfully`, {
        id: newId,
        title: article.title,
        language: article.language,
        created: new Date(article.timestamp).toISOString(),
      });
      
      return newId;
    } catch (error) {
      console.error(`[${componentId}] Error creating article:`, error, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
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
    console.log(`[${componentId}] Updating article with ID: ${article.id}`, {
      title: article.title,
      language: article.language,
      timestamp: new Date(article.timestamp).toISOString(),
    });

    try {
      const articles = await loadArticles();
      console.log(`[${componentId}] Total articles: ${articles.length}`);
      
      const index = articles.findIndex(a => a.id === article.id);
      console.log(`[${componentId}] Found article at index: ${index}`);
      
      if (index === -1) {
        console.warn(`[${componentId}] Article not found with ID: ${article.id} - creating new one`);
        return await createArticle(article);
      }

      console.log(`[${componentId}] Original article data:`, {
        title: articles[index].title,
        englishLength: articles[index].english_text.length,
        targetLength: articles[index].target_text.length,
        updated: new Date(articles[index].updated_at).toISOString(),
      });

      articles[index] = {
        ...articles[index],
        title: article.title,
        english_text: article.english,
        target_text: article.target,
        language: article.language,
        updated_at: article.timestamp,
      };
      
      console.log(`[${componentId}] Updated article data:`, {
        title: articles[index].title,
        englishLength: articles[index].english_text.length,
        targetLength: articles[index].target_text.length,
        updated: new Date(articles[index].updated_at).toISOString(),
      });
      
      await saveArticles(articles);
      await loadArticleCount();
      
      console.log(`[${componentId}] Article updated successfully`, {
        id: article.id,
        newTitle: article.title,
      });
      
      return article.id;
    } catch (error) {
      console.error(`[${componentId}] Error updating article:`, error, {
        articleId: article.id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  };

  const loadAllArticles = useCallback(async () => {
    console.log(`[${componentId}] Loading all articles...`);
    try {
      const articles = await loadArticles();
      const sortedArticles = [...articles].sort((a, b) => b.updated_at - a.updated_at);
      
      console.log(`[${componentId}] Loaded and sorted articles:`, {
        total: sortedArticles.length,
        oldest: sortedArticles.length > 0 ? new Date(sortedArticles[sortedArticles.length - 1].updated_at).toISOString() : 'none',
        newest: sortedArticles.length > 0 ? new Date(sortedArticles[0].updated_at).toISOString() : 'none',
      });
      
      return sortedArticles;
    } catch (error) {
      console.error(`[${componentId}] Error loading all articles:`, error);
      return [];
    }
  }, []);

  const deleteArticle = useCallback(async (id: number) => {
    console.log(`[${componentId}] Deleting article with ID: ${id}`);
    try {
      const articles = await loadArticles();
      const initialCount = articles.length;
      
      const filtered = articles.filter(a => a.id !== id);
      const deletedCount = initialCount - filtered.length;
      
      console.log(`[${componentId}] Deletion stats:`, {
        initialCount,
        filteredCount: filtered.length,
        deletedCount,
        wasDeleted: deletedCount > 0,
      });
      
      if (deletedCount === 0) {
        console.warn(`[${componentId}] Article with ID ${id} not found for deletion`);
      }
      
      await saveArticles(filtered);
      await loadArticleCount();
      
      console.log(`[${componentId}] Article deletion completed`, {
        id,
        success: deletedCount > 0,
        newCount: filtered.length,
      });
      
      return deletedCount > 0;
    } catch (error) {
      console.error(`[${componentId}] Error deleting article:`, error, {
        articleId: id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }, [loadArticleCount]);

  const deleteMultipleArticles = useCallback(async (ids: number[]) => {
    console.log(`[${componentId}] Deleting multiple articles:`, {
      ids,
      count: ids.length,
    });

    if (ids.length === 0) {
      console.log(`[${componentId}] No IDs provided, skipping deletion`);
      return false;
    }

    try {
      const articles = await loadArticles();
      const initialCount = articles.length;
      
      const filtered = articles.filter(a => !ids.includes(a.id));
      const deletedCount = initialCount - filtered.length;
      
      console.log(`[${componentId}] Multiple deletion stats:`, {
        initialCount,
        filteredCount: filtered.length,
        deletedCount,
        requestedIds: ids.length,
        actuallyDeleted: deletedCount,
        missingIds: ids.filter(id => !articles.find(a => a.id === id)),
      });
      
      await saveArticles(filtered);
      await loadArticleCount();
      
      console.log(`[${componentId}] Multiple articles deletion completed`, {
        success: true,
        newCount: filtered.length,
      });
      
      return true;
    } catch (error) {
      console.error(`[${componentId}] Error deleting multiple articles:`, error, {
        ids,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }, [loadArticleCount]);

  const getArticlesByIds = useCallback(async (ids: number[]) => {
    console.log(`[${componentId}] Getting articles by IDs:`, {
      ids,
      count: ids.length,
    });

    if (ids.length === 0) {
      console.log(`[${componentId}] No IDs provided, returning empty array`);
      return [];
    }

    try {
      const articles = await loadArticles();
      const filtered = articles.filter(a => ids.includes(a.id));
      const sorted = filtered.sort((a, b) => b.updated_at - a.updated_at);
      
      console.log(`[${componentId}] Retrieved articles by IDs:`, {
        requested: ids.length,
        found: filtered.length,
        missing: ids.filter(id => !filtered.find(a => a.id === id)),
        foundIds: filtered.map(a => a.id),
      });
      
      return sorted;
    } catch (error) {
      console.error(`[${componentId}] Error loading articles by IDs:`, error, {
        ids,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return [];
    }
  }, []);

  const checkAndPromptExport = useCallback(() => {
    console.log(`[${componentId}] Checking if export should be prompted...`, {
      articleCount,
      threshold: 100,
      shouldPrompt: articleCount >= 100,
    });

    if (articleCount >= 100) {
      console.log(`[${componentId}] Threshold reached, showing export prompt`);
      Alert.alert(
        'Storage Full',
        'You have 100 articles saved. Would you like to download them?',
        [
          { text: 'Later', style: 'cancel' },
          {
            text: 'Download',
            onPress: async () => {
              console.log(`[${componentId}] User chose to download articles`);
              await handleExport();
            },
          },
        ]
      );
      return true;
    }
    
    console.log(`[${componentId}] Threshold not reached (${articleCount}/100)`);
    return false;
  }, [articleCount]);

  const handleExport = useCallback(async () => {
    console.log(`[${componentId}] Starting export process...`);
    try {
      const articles = await loadArticles();
      console.log(`[${componentId}] Exporting ${articles.length} articles`);
      
      await exportArticles(articles);
      console.log(`[${componentId}] Articles exported successfully`);

      await saveArticles([]);
      console.log(`[${componentId}] Storage cleared`);
      
      await AsyncStorage.setItem(COUNTER_KEY, '0');
      console.log(`[${componentId}] Counter reset to 0`);
      
      await loadArticleCount();
      console.log(`[${componentId}] Count refreshed after export`);
      
      Alert.alert('Success', 'Articles exported and storage cleared!');
    } catch (error) {
      console.error(`[${componentId}] Error exporting articles:`, error, {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
      });
      Alert.alert('Error', 'Failed to export articles');
    }
  }, [loadArticleCount]);

  const exportSelectedArticles = useCallback(async (ids: number[]) => {
    console.log(`[${componentId}] Exporting selected articles:`, {
      ids,
      count: ids.length,
    });

    if (ids.length === 0) {
      console.log(`[${componentId}] No articles selected for export`);
      return false;
    }

    try {
      const articles = await getArticlesByIds(ids);
      console.log(`[${componentId}] Found ${articles.length} articles for export`);
      
      if (articles.length === 0) {
        console.warn(`[${componentId}] No articles found for the given IDs`);
        return false;
      }
      
      await exportArticles(articles);
      console.log(`[${componentId}] Selected articles exported successfully`);
      return true;
    } catch (error) {
      console.error(`[${componentId}] Error exporting selected articles:`, error, {
        ids,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return false;
    }
  }, [getArticlesByIds]);

  const clearAllArticles = useCallback(async () => {
    console.log(`[${componentId}] Clearing all articles...`);
    try {
      await saveArticles([]);
      console.log(`[${componentId}] Articles array cleared`);
      
      await AsyncStorage.setItem(COUNTER_KEY, '0');
      console.log(`[${componentId}] Counter reset to 0`);
      
      await loadArticleCount();
      console.log(`[${componentId}] All articles cleared successfully`);
      return true;
    } catch (error) {
      console.error(`[${componentId}] Error clearing articles:`, error);
      return false;
    }
  }, [loadArticleCount]);

  const getArticleById = useCallback(async (id: number) => {
    console.log(`[${componentId}] Getting article by ID: ${id}`);
    try {
      const articles = await loadArticles();
      const article = articles.find(a => a.id === id);
      
      if (article) {
        console.log(`[${componentId}] Article found:`, {
          id: article.id,
          title: article.title,
          language: article.language,
          created: new Date(article.created_at).toISOString(),
          updated: new Date(article.updated_at).toISOString(),
        });
      } else {
        console.warn(`[${componentId}] No article found with ID: ${id}`);
      }
      
      return article || null;
    } catch (error) {
      console.error(`[${componentId}] Error loading article by ID:`, error, {
        id,
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      });
      return null;
    }
  }, []);

  // Log hook state changes
  useEffect(() => {
    console.log(`[${componentId}] State updated:`, {
      articleCount,
      isReady,
      timestamp: new Date().toISOString(),
    });
  }, [articleCount, isReady]);

  const returnValue = {
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

  console.log(`[${componentId}] Hook returning:`, {
    articleCount: returnValue.articleCount,
    isReady: returnValue.isReady,
    functionCount: Object.keys(returnValue).filter(key => typeof returnValue[key as keyof typeof returnValue] === 'function').length,
    timestamp: new Date().toISOString(),
  });

  return returnValue;
};