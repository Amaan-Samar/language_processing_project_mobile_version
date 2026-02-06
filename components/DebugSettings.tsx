// components/DebugSettings.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Settings, X, Activity } from 'lucide-react-native';
import { logger, LogLevel } from '../utils/logger';

interface DebugSettingsProps {
  visible: boolean;
  onClose: () => void;
}

const DebugSettings: React.FC<DebugSettingsProps> = ({ visible, onClose }) => {
  const [logLevel, setLogLevel] = useState<LogLevel>(LogLevel.DEBUG);
  const [performanceLogging, setPerformanceLogging] = useState(false);

  const logLevels = [
    { label: 'None', value: LogLevel.NONE },
    { label: 'Errors Only', value: LogLevel.ERROR },
    { label: 'Warnings', value: LogLevel.WARN },
    { label: 'Info', value: LogLevel.INFO },
    { label: 'Debug', value: LogLevel.DEBUG },
  ];

  const handleLogLevelChange = (level: LogLevel) => {
    setLogLevel(level);
    logger.setLevel(level);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl h-3/4">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Settings size={24} color="#374151" />
                <Text className="text-xl font-bold ml-2">Debug Settings</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <X size={24} color="#374151" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="p-4">
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Logging Level</Text>
              {logLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
                    logLevel === level.value ? 'bg-blue-50' : 'bg-gray-50'
                  }`}
                  onPress={() => handleLogLevelChange(level.value)}
                >
                  <Text className="text-gray-800">{level.label}</Text>
                  {logLevel === level.value && (
                    <View className="w-2 h-2 bg-blue-500 rounded-full" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Performance</Text>
              <View className="bg-gray-50 p-4 rounded-lg">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Activity size={20} color="#374151" className="mr-2" />
                    <Text className="text-gray-800">Performance Logging</Text>
                  </View>
                  <Switch
                    value={performanceLogging}
                    onValueChange={setPerformanceLogging}
                  />
                </View>
                <Text className="text-gray-500 text-sm mt-2">
                  Track component render times and operations
                </Text>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Cache</Text>
              <TouchableOpacity className="bg-blue-500 p-4 rounded-lg items-center">
                <Text className="text-white font-semibold">Clear Cache</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default DebugSettings;