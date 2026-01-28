
import React from 'react';
import { View, Text } from 'react-native';
import { RenderedContent } from '../types';

type Props = {
  content: RenderedContent[];
};

export default function RenderedArticle({ content }: Props) {
  return (
    <View className={styles.container}>
      {content.map((item) => {
        if (item.type === 'english') {
          return (
            <View key={item.id} className={styles.englishParagraph}>
              <Text className={styles.englishText}>{item.text}</Text>
            </View>
          );
        } else {
          return (
            <View key={item.id} className={styles.targetParagraph}>
              <Text className={styles.targetText}>
                {item.words?.map((word) => {
                  // For whitespace, just render the space
                  if (word.char === ' ') {
                    return <Text key={word.id}> </Text>;
                  }
                  
                  // For characters with pinyin, render inline
                  if (word.showPinyin && word.pinyin) {
                    return (
                      <Text key={word.id}>
                        <Text className={styles.character}>{word.char}</Text>
                        <Text className={styles.pinyin}>{word.pinyin}</Text>
                      </Text>
                    );
                  }
                  
                  // For characters without pinyin (punctuation or already seen)
                  return (
                    <Text key={word.id} className={styles.character}>
                      {word.char}
                    </Text>
                  );
                })}
              </Text>
            </View>
          );
        }
      })}
    </View>
  );
}

const styles = {
  container: 'py-2',
  englishParagraph: 'py-4',
  englishText: 'text-base leading-6 text-gray-800',
  targetParagraph: 'py-3 bg-blue-50 rounded-lg px-3 mb-3',
  targetText: 'text-xl leading-8',
  character: 'text-gray-900',
  pinyin: 'text-sm text-blue-600',
};