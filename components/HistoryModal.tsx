// // import React, { useState, useEffect } from 'react';
// // import {
// //   View,
// //   Text,
// //   Modal,
// //   TouchableOpacity,
// //   ScrollView,
// //   Alert,
// //   Platform,
// //   StatusBar,
// // } from 'react-native';
// // import * as SQLite from 'expo-sqlite';
// // import { exportArticlesToPDF } from '../utils/articleExporter';
// // import { X } from 'lucide-react-native';

// // type Props = {
// //   visible: boolean;
// //   onClose: () => void;
// //   onLoadArticle: (article: any) => void;
// // };

// // export default function HistoryModal({ visible, onClose, onLoadArticle }: Props) {
// //   const [articles, setArticles] = useState<any[]>([]);
// //   const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());

// //   useEffect(() => {
// //     if (visible) {
// //       loadArticles();
// //     }
// //   }, [visible]);

// //   const loadArticles = async () => {
// //     try {
// //       const db = await SQLite.openDatabaseAsync('articles.db');
// //       const result = await db.getAllAsync(
// //         'SELECT * FROM articles ORDER BY created_at DESC;'
// //       );
// //       setArticles(result);
// //     } catch (error) {
// //       console.error('Error loading articles:', error);
// //     }
// //   };

// //   const toggleArticleSelection = (id: number) => {
// //     const newSet = new Set(selectedArticles);
// //     if (newSet.has(id)) {
// //       newSet.delete(id);
// //     } else {
// //       newSet.add(id);
// //     }
// //     setSelectedArticles(newSet);
// //   };

// //   const handleExportSelected = async () => {
// //     if (selectedArticles.size === 0) {
// //       Alert.alert('No Selection', 'Please select articles to export');
// //       return;
// //     }

// //     const selected = articles.filter((a) => selectedArticles.has(a.id));
// //     await exportArticlesToPDF(selected);
// //     Alert.alert('Success', 'Articles exported as PDF');
// //   };

// //   const handleExportAll = async () => {
// //     if (articles.length === 0) {
// //       Alert.alert('No Articles', 'No articles to export');
// //       return;
// //     }

// //     await exportArticlesToPDF(articles);
// //     Alert.alert('Success', 'All articles exported as PDF');
// //   };

// //   const handleDeleteSelected = async () => {
// //     if (selectedArticles.size === 0) {
// //       Alert.alert('No Selection', 'Please select articles to delete');
// //       return;
// //     }

// //     Alert.alert(
// //       'Delete Articles',
// //       `Delete ${selectedArticles.size} article(s)?`,
// //       [
// //         { text: 'Cancel', style: 'cancel' },
// //         {
// //           text: 'Delete',
// //           style: 'destructive',
// //           onPress: async () => {
// //             try {
// //               const db = await SQLite.openDatabaseAsync('articles.db');
// //               const ids = Array.from(selectedArticles).join(',');
// //               await db.runAsync(`DELETE FROM articles WHERE id IN (${ids});`);
// //               setSelectedArticles(new Set());
// //               await loadArticles();
// //               Alert.alert('Success', 'Articles deleted');
// //             } catch (error) {
// //               Alert.alert('Error', 'Failed to delete articles');
// //             }
// //           },
// //         },
// //       ]
// //     );
// //   };

// //   return (
// //     <Modal 
// //       visible={visible} 
// //       animationType="slide" 
// //       onRequestClose={onClose}
// //       statusBarTranslucent={true}
// //     >
// //       <View className="flex-1 bg-white" style={{ 
// //         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
// //       }}>
// //         {/* Header */}
// //         <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
// //           <TouchableOpacity onPress={onClose}>
// //             <X size={24} color="#374151" />
// //           </TouchableOpacity>
// //           <Text className="text-lg font-semibold text-gray-800">Article History</Text>
// //           <View style={{ width: 24 }} />
// //         </View>

// //         {/* Action Buttons */}
// //         <View className="flex-row px-4 py-3 gap-2 border-b border-gray-200">
// //           <TouchableOpacity
// //             className="flex-1 px-3 py-2 bg-blue-100 rounded-lg"
// //             onPress={handleExportSelected}
// //           >
// //             <Text className="text-blue-700 text-xs font-medium text-center">📄 Export Selected</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity 
// //             className="flex-1 px-3 py-2 bg-blue-100 rounded-lg" 
// //             onPress={handleExportAll}
// //           >
// //             <Text className="text-blue-700 text-xs font-medium text-center">📚 Export All</Text>
// //           </TouchableOpacity>
// //           <TouchableOpacity
// //             className="flex-1 px-3 py-2 bg-red-100 rounded-lg"
// //             onPress={handleDeleteSelected}
// //           >
// //             <Text className="text-red-700 text-xs font-medium text-center">🗑️ Delete</Text>
// //           </TouchableOpacity>
// //         </View>

// //         {/* Articles List */}
// //         <ScrollView className="flex-1 px-4">
// //           {articles.length === 0 ? (
// //             <Text className="text-center text-gray-500 mt-8">No saved articles</Text>
// //           ) : (
// //             articles.map((article) => (
// //               <TouchableOpacity
// //                 key={article.id}
// //                 className="py-3 border-b border-gray-100"
// //                 onPress={() => onLoadArticle(article)}
// //                 onLongPress={() => toggleArticleSelection(article.id)}
// //               >
// //                 <View className="flex-row items-start gap-3 flex-1">
// //                   <TouchableOpacity
// //                     className={`w-6 h-6 border-2 border-gray-300 rounded items-center justify-center ${
// //                       selectedArticles.has(article.id) ? 'bg-blue-500 border-blue-500' : ''
// //                     }`}
// //                     onPress={() => toggleArticleSelection(article.id)}
// //                   >
// //                     {selectedArticles.has(article.id) && (
// //                       <Text className="text-white font-bold text-sm">✓</Text>
// //                     )}
// //                   </TouchableOpacity>
// //                   <View className="flex-1">
// //                     <Text className="text-base font-semibold text-gray-800 mb-1">{article.title}</Text>
// //                     <Text className="text-xs text-gray-500">
// //                       {article.language} • {new Date(article.created_at).toLocaleDateString()}
// //                     </Text>
// //                   </View>
// //                 </View>
// //               </TouchableOpacity>
// //             ))
// //           )}
// //         </ScrollView>
// //       </View>
// //     </Modal>
// //   );
// // }


// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   Modal,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Platform,
//   StatusBar,
// } from 'react-native';
// import { exportArticlesToPDF } from '../utils/articleExporter';
// import { X } from 'lucide-react-native';
// import { useArticleStorage } from '../hooks/useArticleStorage';

// type Props = {
//   visible: boolean;
//   onClose: () => void;
//   onLoadArticle: (article: any) => void;
// };

// export default function HistoryModal({ visible, onClose, onLoadArticle }: Props) {
//   const [articles, setArticles] = useState<any[]>([]);
//   const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());
  
//   const {
//     loadAllArticles,
//     deleteMultipleArticles,
//     exportSelectedArticles,
//   } = useArticleStorage();

//   useEffect(() => {
//     if (visible) {
//       loadArticles();
//     }
//   }, [visible]);

//   const loadArticles = async () => {
//     try {
//       console.log('Loading articles in history modal...');
//       const result = await loadAllArticles();
//       console.log('Articles loaded:', result.length);
//       setArticles(result);
//     } catch (error) {
//       console.error('Error loading articles:', error);
//       setArticles([]);
//     }
//   };

//   const toggleArticleSelection = (id: number) => {
//     const newSet = new Set(selectedArticles);
//     if (newSet.has(id)) {
//       newSet.delete(id);
//     } else {
//       newSet.add(id);
//     }
//     setSelectedArticles(newSet);
//   };

//   const handleExportSelected = async () => {
//     if (selectedArticles.size === 0) {
//       Alert.alert('No Selection', 'Please select articles to export');
//       return;
//     }

//     try {
//       const selectedIds = Array.from(selectedArticles);
//       const success = await exportSelectedArticles(selectedIds);
      
//       if (success) {
//         Alert.alert('Success', 'Articles exported as PDF');
//       } else {
//         Alert.alert('Error', 'Failed to export articles');
//       }
//     } catch (error) {
//       console.error('Error exporting selected:', error);
//       Alert.alert('Error', 'Failed to export articles');
//     }
//   };

//   const handleExportAll = async () => {
//     if (articles.length === 0) {
//       Alert.alert('No Articles', 'No articles to export');
//       return;
//     }

//     try {
//       await exportArticlesToPDF(articles);
//       Alert.alert('Success', 'All articles exported as PDF');
//     } catch (error) {
//       console.error('Error exporting all:', error);
//       Alert.alert('Error', 'Failed to export articles');
//     }
//   };

//   const handleDeleteSelected = async () => {
//     if (selectedArticles.size === 0) {
//       Alert.alert('No Selection', 'Please select articles to delete');
//       return;
//     }

//     Alert.alert(
//       'Delete Articles',
//       `Delete ${selectedArticles.size} article(s)?`,
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               const selectedIds = Array.from(selectedArticles);
//               const success = await deleteMultipleArticles(selectedIds);
              
//               if (success) {
//                 setSelectedArticles(new Set());
//                 await loadArticles();
//                 Alert.alert('Success', 'Articles deleted');
//               } else {
//                 Alert.alert('Error', 'Failed to delete articles');
//               }
//             } catch (error) {
//               console.error('Error deleting articles:', error);
//               Alert.alert('Error', 'Failed to delete articles');
//             }
//           },
//         },
//       ]
//     );
//   };

//   return (
//     <Modal 
//       visible={visible} 
//       animationType="slide" 
//       onRequestClose={onClose}
//       statusBarTranslucent={true}
//     >
//       <View className="flex-1 bg-white" style={{ 
//         paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
//       }}>
//         {/* Header */}
//         <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
//           <TouchableOpacity onPress={onClose}>
//             <X size={24} color="#374151" />
//           </TouchableOpacity>
//           <Text className="text-lg font-semibold text-gray-800">Article History</Text>
//           <View style={{ width: 24 }} />
//         </View>

//         {/* Action Buttons */}
//         <View className="flex-row px-4 py-3 gap-2 border-b border-gray-200">
//           <TouchableOpacity
//             className="flex-1 px-3 py-2 bg-blue-100 rounded-lg"
//             onPress={handleExportSelected}
//           >
//             <Text className="text-blue-700 text-xs font-medium text-center">📄 Export Selected</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             className="flex-1 px-3 py-2 bg-blue-100 rounded-lg" 
//             onPress={handleExportAll}
//           >
//             <Text className="text-blue-700 text-xs font-medium text-center">📚 Export All</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             className="flex-1 px-3 py-2 bg-red-100 rounded-lg"
//             onPress={handleDeleteSelected}
//           >
//             <Text className="text-red-700 text-xs font-medium text-center">🗑️ Delete</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Articles List */}
//         <ScrollView className="flex-1 px-4">
//           {articles.length === 0 ? (
//             <View className="mt-8">
//               <Text className="text-center text-gray-500 text-base">No saved articles</Text>
//               <Text className="text-center text-gray-400 text-sm mt-2">
//                 Articles you save will appear here
//               </Text>
//             </View>
//           ) : (
//             articles.map((article) => (
//               <TouchableOpacity
//                 key={article.id}
//                 className="py-3 border-b border-gray-100"
//                 onPress={() => {
//                   onLoadArticle(article);
//                   onClose();
//                 }}
//                 onLongPress={() => toggleArticleSelection(article.id)}
//               >
//                 <View className="flex-row items-start gap-3 flex-1">
//                   <TouchableOpacity
//                     className={`w-6 h-6 border-2 border-gray-300 rounded items-center justify-center ${
//                       selectedArticles.has(article.id) ? 'bg-blue-500 border-blue-500' : ''
//                     }`}
//                     onPress={() => toggleArticleSelection(article.id)}
//                   >
//                     {selectedArticles.has(article.id) && (
//                       <Text className="text-white font-bold text-sm">✓</Text>
//                     )}
//                   </TouchableOpacity>
//                   <View className="flex-1">
//                     <Text className="text-base font-semibold text-gray-800 mb-1">{article.title}</Text>
//                     <Text className="text-xs text-gray-500">
//                       {article.language} • {new Date(article.created_at).toLocaleDateString()}
//                     </Text>
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             ))
//           )}
//         </ScrollView>
//       </View>
//     </Modal>
//   );
// }

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { exportArticlesToPDF } from '../utils/articleExporter';
import { X } from 'lucide-react-native';
import { useArticleStorage } from '../hooks/useArticleStorage';

type Props = {
  visible: boolean;
  onClose: () => void;
  onLoadArticle: (article: any) => void;
  onHistoryClose?: () => void;
};

export default function HistoryModal({ visible, onClose, onLoadArticle, onHistoryClose }: Props) {
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticles, setSelectedArticles] = useState<Set<number>>(new Set());
  
  const {
    loadAllArticles,
    deleteMultipleArticles,
    exportSelectedArticles,
  } = useArticleStorage();

  useEffect(() => {
    if (visible) {
      loadArticles();
    }
  }, [visible]);

  const loadArticles = async () => {
    try {
      console.log('Loading articles in history modal...');
      const result = await loadAllArticles();
      console.log('Articles loaded:', result.length);
      setArticles(result);
    } catch (error) {
      console.error('Error loading articles:', error);
      setArticles([]);
    }
  };

  const toggleArticleSelection = (id: number) => {
    const newSet = new Set(selectedArticles);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedArticles(newSet);
  };

  const handleExportSelected = async () => {
    if (selectedArticles.size === 0) {
      Alert.alert('No Selection', 'Please select articles to export');
      return;
    }

    try {
      const selectedIds = Array.from(selectedArticles);
      const success = await exportSelectedArticles(selectedIds);
      
      if (success) {
        Alert.alert('Success', 'Articles exported as PDF');
      } else {
        Alert.alert('Error', 'Failed to export articles');
      }
    } catch (error) {
      console.error('Error exporting selected:', error);
      Alert.alert('Error', 'Failed to export articles');
    }
  };

  const handleExportAll = async () => {
    if (articles.length === 0) {
      Alert.alert('No Articles', 'No articles to export');
      return;
    }

    try {
      await exportArticlesToPDF(articles);
      Alert.alert('Success', 'All articles exported as PDF');
    } catch (error) {
      console.error('Error exporting all:', error);
      Alert.alert('Error', 'Failed to export articles');
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedArticles.size === 0) {
      Alert.alert('No Selection', 'Please select articles to delete');
      return;
    }

    Alert.alert(
      'Delete Articles',
      `Delete ${selectedArticles.size} article(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const selectedIds = Array.from(selectedArticles);
              const success = await deleteMultipleArticles(selectedIds);
              
              if (success) {
                setSelectedArticles(new Set());
                await loadArticles();
                Alert.alert('Success', 'Articles deleted');
                
                // Call the callback to check if current article was deleted
                if (onHistoryClose) {
                  onHistoryClose();
                }
              } else {
                Alert.alert('Error', 'Failed to delete articles');
              }
            } catch (error) {
              console.error('Error deleting articles:', error);
              Alert.alert('Error', 'Failed to delete articles');
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    // Call the onHistoryClose callback before closing
    if (onHistoryClose) {
      onHistoryClose();
    }
    onClose();
  };

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-white" style={{ 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
      }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">Article History</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Action Buttons */}
        <View className="flex-row px-4 py-3 gap-2 border-b border-gray-200">
          <TouchableOpacity
            className="flex-1 px-3 py-2 bg-blue-100 rounded-lg"
            onPress={handleExportSelected}
          >
            <Text className="text-blue-700 text-xs font-medium text-center">📄 Export Selected</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-1 px-3 py-2 bg-blue-100 rounded-lg" 
            onPress={handleExportAll}
          >
            <Text className="text-blue-700 text-xs font-medium text-center">📚 Export All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 px-3 py-2 bg-red-100 rounded-lg"
            onPress={handleDeleteSelected}
          >
            <Text className="text-red-700 text-xs font-medium text-center">🗑️ Delete</Text>
          </TouchableOpacity>
        </View>

        {/* Articles List */}
        <ScrollView className="flex-1 px-4">
          {articles.length === 0 ? (
            <View className="mt-8">
              <Text className="text-center text-gray-500 text-base">No saved articles</Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Articles you save will appear here
              </Text>
            </View>
          ) : (
            articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                className="py-3 border-b border-gray-100"
                onPress={() => {
                  onLoadArticle(article);
                  handleClose();
                }}
                onLongPress={() => toggleArticleSelection(article.id)}
              >
                <View className="flex-row items-start gap-3 flex-1">
                  <TouchableOpacity
                    className={`w-6 h-6 border-2 border-gray-300 rounded items-center justify-center ${
                      selectedArticles.has(article.id) ? 'bg-blue-500 border-blue-500' : ''
                    }`}
                    onPress={() => toggleArticleSelection(article.id)}
                  >
                    {selectedArticles.has(article.id) && (
                      <Text className="text-white font-bold text-sm">✓</Text>
                    )}
                  </TouchableOpacity>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-800 mb-1">{article.title}</Text>
                    <Text className="text-xs text-gray-500">
                      {article.language} • {new Date(article.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}