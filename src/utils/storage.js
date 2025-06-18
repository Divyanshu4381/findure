// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokens = async ({ accessToken, refreshToken }) => {
  await AsyncStorage.multiSet([
    ['accessToken', accessToken],
    ['refreshToken', refreshToken]
  ]);
};

export const getTokens = async () => {
  const [accessToken, refreshToken] = await AsyncStorage.multiGet([
    'accessToken',
    'refreshToken'
  ]);
  return {
    accessToken: accessToken[1],
    refreshToken: refreshToken[1]
  };
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(['accessToken', 'refreshToken']);
};