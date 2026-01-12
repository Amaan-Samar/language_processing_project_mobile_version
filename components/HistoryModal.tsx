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
import { X, MoreVertical, Trash2, FileDown, CheckSquare } from 'lucide-react-native';
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
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState<number | null>(null);
  
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

  const enterSelectionMode = () => {
    setIsSelectionMode(true);
    setDropdownVisible(null);
  };

  const exitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedArticles(new Set());
  };

  const handleExportSingle = async (article: any) => {
    try {
      await exportArticlesToPDF([article]);
      Alert.alert('Success', 'Article exported as PDF');
      setDropdownVisible(null);
    } catch (error) {
      console.error('Error exporting:', error);
      Alert.alert('Error', 'Failed to export article');
    }
  };

  const handleDeleteSingle = async (articleId: number) => {
    Alert.alert(
      'Delete Article',
      'Are you sure you want to delete this article?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteMultipleArticles([articleId]);
              if (success) {
                await loadArticles();
                Alert.alert('Success', 'Article deleted');
                setDropdownVisible(null);
                if (onHistoryClose) {
                  onHistoryClose();
                }
              } else {
                Alert.alert('Error', 'Failed to delete article');
              }
            } catch (error) {
              console.error('Error deleting:', error);
              Alert.alert('Error', 'Failed to delete article');
            }
          },
        },
      ]
    );
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
        Alert.alert('Success', `${selectedArticles.size} article(s) exported as PDF`);
        exitSelectionMode();
      } else {
        Alert.alert('Error', 'Failed to export articles');
      }
    } catch (error) {
      console.error('Error exporting selected:', error);
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
                await loadArticles();
                Alert.alert('Success', 'Articles deleted');
                exitSelectionMode();
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
    exitSelectionMode();
    if (onHistoryClose) {
      onHistoryClose();
    }
    onClose();
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const closeDropdown = () => {
      if (dropdownVisible !== null) {
        setDropdownVisible(null);
      }
    };

    // This will close dropdown when user scrolls
    return () => {
      closeDropdown();
    };
  }, [dropdownVisible]);

  return (
    <Modal 
      visible={visible} 
      animationType="slide" 
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View className="flex-1 bg-gray-50" style={{ 
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 
      }}>
        {/* Header */}
        <View className="flex-row justify-between items-center px-4 py-3 bg-white border-b border-gray-200">
          <TouchableOpacity onPress={handleClose}>
            <X size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-800">Article History</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Selection Mode Action Bar */}
        {isSelectionMode && (
          <View className="flex-row items-center px-4 py-3 bg-blue-50 border-b border-blue-200">
            <TouchableOpacity onPress={exitSelectionMode} className="mr-3">
              <Text className="text-blue-600 font-medium">Cancel</Text>
            </TouchableOpacity>
            <Text className="flex-1 text-gray-700 font-medium">
              {selectedArticles.size} selected
            </Text>
            <TouchableOpacity
              className="px-4 py-2 bg-blue-500 rounded-lg mr-2"
              onPress={handleExportSelected}
            >
              <Text className="text-white font-medium text-sm">Export</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="px-4 py-2 bg-red-500 rounded-lg"
              onPress={handleDeleteSelected}
            >
              <Text className="text-white font-medium text-sm">Delete</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Articles List */}
        <ScrollView className="flex-1 px-4 py-4">
          {articles.length === 0 ? (
            <View className="mt-8">
              <Text className="text-center text-gray-500 text-base">No saved articles</Text>
              <Text className="text-center text-gray-400 text-sm mt-2">
                Articles you save will appear here
              </Text>
            </View>
          ) : (
            articles.map((article) => (
              <View key={article.id} className="mb-4">
                {/* Dropdown Menu - Render at root level for proper z-index */}
                {dropdownVisible === article.id && (
                  <View className="absolute right-4 z-50" style={{ 
                    top: articles.indexOf(article) * 160 + 100, // Adjust based on card height
                    elevation: 9999, // For Android
                    zIndex: 9999, // For iOS
                  }}>
                    <View className="bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-48">
                      <TouchableOpacity
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                        onPress={enterSelectionMode}
                      >
                        <CheckSquare size={18} color="#3B82F6" />
                        <Text className="ml-3 text-gray-700 font-medium">Select Articles</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-row items-center px-4 py-3 border-b border-gray-100"
                        onPress={() => handleExportSingle(article)}
                      >
                        <FileDown size={18} color="#10B981" />
                        <Text className="ml-3 text-gray-700 font-medium">Export as PDF</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-row items-center px-4 py-3"
                        onPress={() => handleDeleteSingle(article.id)}
                      >
                        <Trash2 size={18} color="#EF4444" />
                        <Text className="ml-3 text-red-600 font-medium">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Article Card */}
                <TouchableOpacity
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  onPress={() => {
                    if (isSelectionMode) {
                      toggleArticleSelection(article.id);
                    } else {
                      onLoadArticle(article);
                      handleClose();
                    }
                  }}
                  activeOpacity={0.7}
                  onLongPress={enterSelectionMode}
                >
                  {/* Card Content */}
                  <View className="p-4">
                    {/* Selection Checkbox (only visible in selection mode) */}
                    {isSelectionMode && (
                      <View className="absolute top-4 left-4 z-10">
                        <TouchableOpacity
                          className={`w-6 h-6 border-2 rounded items-center justify-center ${
                            selectedArticles.has(article.id)
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white border-gray-300'
                          }`}
                          onPress={() => toggleArticleSelection(article.id)}
                        >
                          {selectedArticles.has(article.id) && (
                            <Text className="text-white font-bold text-sm">✓</Text>
                          )}
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Three Dot Menu Button (moved to header area) */}
                    {!isSelectionMode && (
                      <View className="absolute top-4 right-4 z-20">
                        <TouchableOpacity
                          onPress={(e) => {
                            e.stopPropagation();
                            setDropdownVisible(dropdownVisible === article.id ? null : article.id);
                          }}
                          className="w-8 h-8 items-center justify-center"
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <MoreVertical size={20} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Main Content with proper padding for menu button */}
                    <View 
                      className={isSelectionMode ? "ml-9" : ""}
                      style={{ 
                        paddingRight: !isSelectionMode ? 8 : 0, // Add padding to prevent text overlap
                      }}
                    >
                      {/* English Content Preview */}
                      <Text className="text-gray-700 text-sm leading-5 mb-3">
                        {truncateText(article.english_text)}
                      </Text>

                      {/* Bottom Info: Title and Metadata */}
                      <View className="border-t border-gray-100 pt-3 mt-2">
                        <Text className="text-base font-semibold text-gray-800 mb-1">
                          {article.title}
                        </Text>
                        <View className="flex-row items-center">
                          <View className="bg-blue-100 px-2 py-1 rounded mr-2">
                            <Text className="text-xs text-blue-700 font-medium">
                              {article.language}
                            </Text>
                          </View>
                          <Text className="text-xs text-gray-500">
                            {new Date(article.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}