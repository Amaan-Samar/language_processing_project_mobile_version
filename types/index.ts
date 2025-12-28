export type WordWithPinyin = {
  char: string;
  pinyin: string;
  showPinyin: boolean;
  id: string;
};

export type RenderedContent = {
  type: 'english' | 'target';
  id: string;
  text?: string;
  words?: WordWithPinyin[];
};

export type Article = {
  english: string;
  target: string;
  language: string;
  timestamp: number;
};