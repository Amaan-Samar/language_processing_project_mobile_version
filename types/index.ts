// export type WordWithPinyin = {
//   char: string;
//   pinyin: string;
//   showPinyin: boolean;
//   id: string;
// };

// export type RenderedContent = {
//   type: 'english' | 'target';
//   id: string;
//   text?: string;
//   words?: WordWithPinyin[];
// };

// export type Article = {
//   english: string;
//   target: string;
//   language: string;
//   timestamp: number;
// };

// // types.ts
// export interface WordWithRomanization {
//   char: string;
//   romanization: string;
//   showRomanization: boolean;
//   id: string;
// }


// types/index.ts (or types.ts)

/**
 * Represents a single word/character with optional pinyin/romanization
 */
export interface WordWithPinyin {
  char: string;           // The actual character or word
  pinyin: string;         // Romanization (pinyin for Chinese, etc.)
  showPinyin: boolean;    // Whether to display pinyin (first occurrence only)
  id: string;            // Unique identifier for this word instance
}

/**
 * Represents a content block - either English text or target language words
 */
export type RenderedContent = 
  | {
      type: 'english';
      text: string;
      id: string;
    }
  | {
      type: 'target';
      words: WordWithPinyin[];
      id: string;
    };

/**
 * Article as stored in the database
 */
export interface Article {
  id: number;
  title: string;
  english_text: string;
  target_text: string;
  language: string;
  created_at: number;
  updated_at: number;
  rendered_content: string; // JSON stringified RenderedContent[]
  // Legacy fields (deprecated, kept for migration):
  pinyin_data?: string;
  first_occurrences?: string;
}

/**
 * Input for creating or updating an article
 */
export interface ArticleInput {
  id?: number | null;
  title: string;
  english: string;
  target: string;
  language: string;
  timestamp: number;
  renderedContent?: RenderedContent[]; // Optional: if not provided, will be generated
}

/**
 * Parsed article with rendered content as object (not JSON string)
 */
export interface ArticleWithParsedContent extends Omit<Article, 'rendered_content'> {
  rendered_content: RenderedContent[];
}