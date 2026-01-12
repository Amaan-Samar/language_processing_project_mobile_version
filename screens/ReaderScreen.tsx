// import React from 'react';
// import { 
//   View, 
//   Text, 
//   ScrollView, 
//   TouchableOpacity, 
//   Animated,
//   Platform,
//   StatusBar,
//   SafeAreaView 
// } from 'react-native';
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
//       {/* Status Bar Background for Android */}
//       {Platform.OS === 'android' && (
//         <View style={{ height: StatusBar.currentHeight, backgroundColor: 'white' }} />
//       )}

//       {/* Save Notification */}
//       {showSaveNotification && (
//         <View className="absolute top-4 left-0 right-0 z-50 items-center" 
//           style={{ marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
//           pointerEvents="none"
//         >
//           <Animated.View 
//             style={{ opacity: fadeAnim }}
//             className="bg-green-500 px-6 py-3 rounded-lg shadow-lg"
//           >
//             <Text className="text-white font-medium text-center">
//               ✅ Article saved successfully!
//             </Text>
//           </Animated.View>
//         </View>
//       )}

//       {/* Header with Back Button */}
//       <View className="bg-white border-b border-gray-200">
//         {/* Safe area spacing for iOS */}
//         <SafeAreaView edges={['top']}>
//           <View className="flex-row items-center px-4 py-3">
//             <TouchableOpacity
//               className="mr-3 p-2 bg-gray-100 rounded-lg"
//               onPress={onBack}
//               hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//             >
//               <Text className="text-2xl leading-6">←</Text>
//             </TouchableOpacity>
//             <Text 
//               className="text-xl font-bold text-gray-800 flex-1" 
//               numberOfLines={1}
//               ellipsizeMode="tail"
//             >
//               {articleTitle || 'Reading Article'}
//             </Text>
//           </View>
//         </SafeAreaView>
//       </View>

//       {/* Article Content */}
//       <ScrollView 
//         className="flex-1 px-4"
//         showsVerticalScrollIndicator={true}
//         contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for bottom buttons
//       >
//         <RenderedArticle content={renderedContent} />
//       </ScrollView>

//       {/* Bottom Action Buttons */}
//       <SafeAreaView edges={['bottom']} className="absolute bottom-0 left-0 right-0">
//         <View className="flex-row justify-end px-6 pb-6 pt-3 bg-transparent">
//           <View className="flex-col gap-3">
//             {/* Save Button */}
//             {showSaveButton && !isSaved && (
//               <TouchableOpacity 
//                 onPress={onSave}
//                 className="bg-green-500 px-6 py-3 rounded-lg shadow-lg active:opacity-80"
//               >
//                 <Text className="text-white font-semibold text-center">
//                   💾 Save
//                 </Text>
//               </TouchableOpacity>
//             )}
            
//             {/* Clear Button */}
//             <TouchableOpacity 
//               onPress={onClear}
//               className="bg-red-500 px-6 py-3 rounded-lg shadow-lg active:opacity-80"
//             >
//               <Text className="text-white font-semibold text-center">
//                 🗑️ Clear
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     </View>
//   );
// }


// import React from 'react';
// import { View, Text, ScrollView, TouchableOpacity, Animated, Platform } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context'; // Import the hook
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
//   // Get safe area insets (top, right, bottom, left)
//   const insets = useSafeAreaInsets();

//   return (
//     <View className="flex-1 bg-gray-50">
//       {/* Save Notification with safe area padding */}
//       {showSaveNotification && (
//         <View 
//           className="absolute left-0 right-0 z-50 items-center" 
//           pointerEvents="none"
//           style={{ top: insets.top + 16 }} // Add extra space below status bar
//         >
//           <Animated.View 
//             style={{ opacity: fadeAnim }}
//             className="bg-green-500 px-6 py-3 rounded-lg shadow-lg"
//           >
//             <Text className="text-white font-medium text-center">
//               ✅ Article saved successfully!
//             </Text>
//           </Animated.View>
//         </View>
//       )}
      
//       {/* Header with safe area padding */}
//       <View 
//         className="bg-white px-4 border-b border-gray-200 flex-row items-center"
//         style={{ 
//           paddingTop: Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 8),
//           paddingBottom: 12
//         }}
//       >
//         <TouchableOpacity
//           className="mr-3 p-2 bg-gray-100 rounded-lg"
//           onPress={onBack}
//           hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
//         >
//           <Text className="text-2xl leading-6">←</Text>
//         </TouchableOpacity>
//         <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={1}>
//           {articleTitle || 'Reading Article'}
//         </Text>
//       </View>

//       {/* Article Content */}
//       <ScrollView 
//         className="flex-1"
//         showsVerticalScrollIndicator={true}
//         contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
//       >
//         <RenderedArticle content={renderedContent} />
//       </ScrollView>

//       {/* Bottom Action Buttons with safe area padding */}
//       <View 
//         className="absolute right-6 flex-col gap-3"
//         style={{ 
//           bottom: insets.bottom + 24, // Add extra space above home indicator
//           right: Math.max(insets.right, 24) // Ensure minimum spacing
//         }}
//       >
//         {/* Save Button */}
//         {showSaveButton && !isSaved && (
//           <TouchableOpacity 
//             onPress={onSave}
//             className="bg-green-500 px-6 py-3 rounded-lg shadow-lg active:bg-green-600"
//           >
//             <Text className="text-white font-semibold text-center">
//               💾 Save
//             </Text>
//           </TouchableOpacity>
//         )}
        
//         {/* Clear Button */}
//         <TouchableOpacity 
//           onPress={onClear}
//           className="bg-red-500 px-6 py-3 rounded-lg shadow-lg active:bg-red-600"
//         >
//           <Text className="text-white font-semibold text-center">
//             🗑️ Clear
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

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
        {/* Save Button */}
        {/* {showSaveButton && (
          <TouchableOpacity 
            onPress={onSave}
            className={`px-6 py-3 rounded-lg shadow-lg flex-row items-center justify-center gap-2 ${
              isSaved ? 'bg-green-600 active:bg-green-700' : 'bg-green-500 active:bg-green-600'
            }`}
          >
            {isSaved ? (
              <>
                <BookmarkCheck size={20} color="white" />
                <Text className="text-white font-semibold">
                  Saved
                </Text>
              </>
            ) : (
              <>
                <Save size={20} color="white" />
                <Text className="text-white font-semibold">
                  Save
                </Text>
              </>
            )}
          </TouchableOpacity>
        )} */}
        
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