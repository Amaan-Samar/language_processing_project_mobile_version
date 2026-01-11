// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
// import RenderedArticle from '../components/RenderedArticle';
// import { RenderedContent } from '../types';

// type Props = {
//   articleTitle: string;
//   renderedContent: RenderedContent[];
//   showSaveButton: boolean;
//   isSaved: boolean;
//   showSaveNotification: boolean;
//   fadeAnim: Animated.Value;
//   onSave: () => void;
//   onClear: () => void;
//   onBack: () => void;
// };

// export default function ReaderScreen({
//   articleTitle,
//   renderedContent,
//   showSaveButton,
//   isSaved,
//   showSaveNotification,
//   fadeAnim,
//   onSave,
//   onClear,
//   onBack,
// }: Props) {
//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Save Notification */}
//       {showSaveNotification && (
//         <Animated.View 
//           style={{ opacity: fadeAnim }}
//           className="absolute top-4 left-1/2 z-50 bg-green-500 px-6 py-3 rounded-lg shadow-lg"
//           pointerEvents="none"
//         >
//           <Text className="text-white font-medium text-center">
//             ✅ Article saved successfully!
//           </Text>
//         </Animated.View>
//       )}

//       {/* Header with Back Button */}
//       <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
//         <TouchableOpacity
//           className="mr-3 p-2"
//           onPress={onBack}
//         >
//           <Text className="text-2xl">←</Text>
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={1}>
//           {articleTitle || 'Reading Article'}
//         </Text>
//       </View>

//       {/* Article Content */}
//       <ScrollView 
//         className="flex-1 px-4"
//         showsVerticalScrollIndicator={true}
//       >
//         <RenderedArticle content={renderedContent} />
//       </ScrollView>

//       {/* Bottom Action Buttons */}
//       <View className="absolute bottom-4 right-4 flex-col gap-3">
//         {/* Save Button */}
//         {showSaveButton && !isSaved && (
//           <TouchableOpacity
//             className="bg-green-500 rounded-full px-6 py-4 shadow-lg"
//             onPress={onSave}
//           >
//             <Text className="text-white font-bold text-center">💾 Save</Text>
//           </TouchableOpacity>
//         )}

//         {/* Clear Button */}
//         <TouchableOpacity
//           className="bg-red-500 rounded-full px-6 py-4 shadow-lg"
//           onPress={onClear}
//         >
//           <Text className="text-white font-bold text-center">🗑️ Clear</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }


import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import RenderedArticle from '../components/RenderedArticle';
import { RenderedContent } from '../types';

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
  return (
    <View className="flex-1 bg-gray-50">
      {/* Save Notification */}
{/* Save Notification */}

      {showSaveNotification && (
        <View className="absolute top-4 left-0 right-0 z-50 items-center" pointerEvents="none">
          <Animated.View 
            style={{ opacity: fadeAnim }}
            className="bg-green-500 px-6 py-3 rounded-lg shadow-lg"
          >
            <Text className="text-white font-medium text-center">
              ✅ Article saved successfully!
            </Text>
          </Animated.View>
        </View>
      )}
      {/* Header with Back Button */}
      <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
        <TouchableOpacity
          className="mr-3 p-2 bg-gray-100 rounded-lg"
          onPress={onBack}
        >
          <Text className="text-2xl leading-6">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={1}>
          {articleTitle || 'Reading Article'}
        </Text>
      </View>

      {/* Article Content */}
      <ScrollView 
        className="flex-1 px-4"
        showsVerticalScrollIndicator={true}
      >
        <RenderedArticle content={renderedContent} />
      </ScrollView>

      {/* Bottom Action Buttons */}
      <View className="absolute bottom-6 right-6 flex-col gap-3">
        {/* Save Button */}
        {showSaveButton && !isSaved && (
          <TouchableOpacity 
            onPress={onSave}
            className="bg-green-500 px-6 py-3 rounded-lg shadow-lg"
          >
            <Text className="text-white font-semibold text-center">
              💾 Save
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Clear Button */}
        <TouchableOpacity 
          onPress={onClear}
          className="bg-red-500 px-6 py-3 rounded-lg shadow-lg"
        >
          <Text className="text-white font-semibold text-center">
            🗑️ Clear
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}