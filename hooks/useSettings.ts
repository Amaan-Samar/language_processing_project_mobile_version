// hooks/useSettings.ts
import { useState, useEffect, useCallback } from 'react';
import { AppSettings, settingsManager } from '../utils/settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<AppSettings>(settingsManager.getSettings());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await settingsManager.getSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();

    // Subscribe to settings changes
    const unsubscribe = settingsManager.addListener((newSettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const updateSettings = useCallback(async (updates: Partial<AppSettings>) => {
    try {
      const newSettings = await settingsManager.updateSettings(updates);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    resetToDefaults: () => settingsManager.resetToDefaults(),
  };
};