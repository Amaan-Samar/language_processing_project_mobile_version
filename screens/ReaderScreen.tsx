import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RenderedArticle from '../components/RenderedArticle';
import { RenderedContent } from '../types';

// Import Lucide icons
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  CheckCircle,
  Bookmark,
  BookmarkCheck
} from 'lucide-react-native';

type Props = {
  articleTitle: string;
  renderedContent: RenderedContent[];
  showSaveButton: boolean;
  isSaved: boolean;
  showSaveNotification: boolean;
  fadeAnim: Animated.Value;
  onSave: () => void;
  onClear: () => void;
  onBack: () => void;
};

export default function ReaderScreen({
  articleTitle,
  renderedContent,
  showSaveButton,
  isSaved,
  showSaveNotification,
  fadeAnim,
  onSave,
  onClear,
  onBack,
}: Props) {
  // Get safe area insets (top, right, bottom, left)
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      {/* Save Notification with safe area padding */}
      {showSaveNotification && (
        <View 
          className="absolute left-0 right-0 z-50 items-center" 
          pointerEvents="none"
          style={{ top: insets.top + 16 }} // Add extra space below status bar
        >
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="bg-green-500 px-6 py-3 rounded-lg shadow-lg flex-row items-center"
          >
            <CheckCircle size={20} color="white" className="mr-2" />
            <Text className="text-white font-medium text-center">
              Article saved successfully!
            </Text>
          </Animated.View>
        </View>
      )}
      
      {/* Header with safe area padding */}
      <View 
        className="bg-white px-4 border-b border-gray-200 flex-row items-center"
        style={{ 
          paddingTop: Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 8),
          paddingBottom: 12
        }}
      >
        <TouchableOpacity
          className="mr-3 p-2 bg-gray-100 rounded-lg"
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={1}>
          {articleTitle || 'Reading Article'}
        </Text>
      </View>

      {/* Article Content */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      >
        <RenderedArticle content={renderedContent} />
      </ScrollView>

      {/* Bottom Action Buttons with safe area padding */}
      <View 
        className="absolute right-6 flex-col gap-3"
        style={{ 
          bottom: insets.bottom + 24, // Add extra space above home indicator
          right: Math.max(insets.right, 24) // Ensure minimum spacing
        }}
      >
        
        {/* Clear Button */}
        <TouchableOpacity 
          onPress={onClear}
          className="px-6 py-3 rounded-lg shadow-lg active:bg-gray-600 flex-row items-center justify-center gap-2"
        >
          <Sparkles size={40} color="#FBEF76" />
          {/* <Text className="text-white font-semibold">
            Clear
          </Text> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}