export type WordWithRomanization = {
  char: string;
  romanization: string;
  showRomanization: boolean;
  id: string;
};

export type RenderedContent = {
  type: 'english' | 'target';
  id: string;
  text?: string;
  words?: WordWithRomanization[];
};

export type Article = {
  english: string;
  target: string;
  language: string;
  timestamp: number;
  title?: string;
};

// Romanization method interface
export interface RomanizationMethod {
  // Convert a character/word to its romanized form
  romanize(text: string): string;
  
  // Optional: Check if a character needs romanization
  needsRomanization?(char: string): boolean;
  
  // Optional: Pre-load any required data
  initialize?(): Promise<void>;
}

export type RomanizationConfig = {
  languageId: string;
  languageName: string;
  method: RomanizationMethod;
};