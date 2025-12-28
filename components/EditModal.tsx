// import { Text, View } from 'react-native';

// export const EditScreenInfo = ({ path }: { path: string }) => {
//   const title = 'Open up the code for this screen:';
//   const description =
//     'Change any of the text, save the file, and your app will automatically update.';

//   return (
//     <View>
//       <View className={styles.getStartedContainer}>
//         <Text className={styles.getStartedText}>{title}</Text>
//         <View className={styles.codeHighlightContainer + styles.homeScreenFilename}>
//           <Text>{path}</Text>
//         </View>
//         <Text className={styles.getStartedText}>{description}</Text>
//       </View>
//     </View>
//   );
// };

// const styles = {
//   codeHighlightContainer: `rounded-md px-1`,
//   getStartedContainer: `items-center mx-12`,
//   getStartedText: `text-lg leading-6 text-center`,
//   helpContainer: `items-center mx-5 mt-4`,
//   helpLink: `py-4`,
//   helpLinkText: `text-center`,
//   homeScreenFilename: `my-2`,
// };



import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';

type Props = {
  visible: boolean;
  title: string;
  text: string;
  onTextChange: (text: string) => void;
  onClose: () => void;
};

export default function EditModal({ visible, title, text, onTextChange, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className={styles.container}>
        {/* Header */}
        <View className={styles.header}>
          <TouchableOpacity onPress={onClose} className={styles.doneButton}>
            <Text className={styles.doneText}>Done</Text>
          </TouchableOpacity>
          <Text className={styles.title}>Edit {title}</Text>
          <View className={styles.spacer} />
        </View>

        {/* Text Input */}
        <TextInput
          className={styles.input}
          multiline
          autoFocus
          value={text}
          onChangeText={onTextChange}
          placeholder={`Enter ${title} text...`}
          placeholderTextColor="#9CA3AF"
        />
      </View>
    </Modal>
  );
}

const styles = {
  container: 'flex-1 bg-white',
  header: 'flex-row justify-between items-center px-4 py-3 border-b border-gray-200',
  doneButton: 'py-1 px-2',
  doneText: 'text-blue-500 text-base font-medium',
  title: 'text-base font-semibold text-gray-800',
  spacer: 'w-12',
  input: 'flex-1 p-4 text-base text-gray-800',
};
