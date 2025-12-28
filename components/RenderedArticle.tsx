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
              <View className={styles.wordsContainer}>
                {item.words.map((word) => (
                  <View key={word.id} className={styles.wordWrapper}>
                    <Text className={styles.character}>{word.char}</Text>
                    {word.showPinyin && (
                      <Text className={styles.pinyin}>{word.pinyin}</Text>
                    )}
                  </View>
                ))}
              </View>
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
  wordsContainer: 'flex-row flex-wrap',
  wordWrapper: 'mr-3 mb-2',
  character: 'text-xl text-gray-900',
  pinyin: 'text-xs text-gray-600 text-center mt-0.5',
};