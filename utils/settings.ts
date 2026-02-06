// utils/settings.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppSettings = {
  language: string;
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  romanizationFirstOccurrence: boolean;
  performanceMode: boolean;
  autoSave: boolean;
  notifications: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  language: 'chinese',
  theme: 'light',
  fontSize: 16,
  romanizationFirstOccurrence: true,
  performanceMode: false,
  autoSave: true,
  notifications: true,
};

const SETTINGS_KEY = '@app_settings';

export class SettingsManager {
  private settings: AppSettings = DEFAULT_SETTINGS;
  private listeners: ((settings: AppSettings) => void)[] = [];

  async initialize() {
    try {
      const savedSettings = await AsyncStorage.getItem(SETTINGS_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async getSettings(): Promise<AppSettings> {
    await this.initialize();
    return { ...this.settings };
  }

  async updateSettings(updates: Partial<AppSettings>) {
    try {
      this.settings = { ...this.settings, ...updates };
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      this.notifyListeners();
      return this.settings;
    } catch (error) {
      console.error('Failed to save settings:', error);
      throw error;
    }
  }

  async getSetting<K extends keyof AppSettings>(key: K): Promise<AppSettings[K]> {
    const settings = await this.getSettings();
    return settings[key];
  }

  async setSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]) {
    await this.updateSettings({ [key]: value });
  }

  addListener(listener: (settings: AppSettings) => void) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener({ ...this.settings }));
  }

  async resetToDefaults() {
    await this.updateSettings(DEFAULT_SETTINGS);
  }

  async exportSettings(): Promise<string> {
    const settings = await this.getSettings();
    return JSON.stringify(settings, null, 2);
  }

  async importSettings(jsonString: string) {
    try {
      const imported = JSON.parse(jsonString);
      await this.updateSettings(imported);
    } catch (error) {
      throw new Error('Invalid settings format');
    }
  }
}

// Singleton instance
export const settingsManager = new SettingsManager();