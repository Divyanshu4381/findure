import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save tokens to AsyncStorage.
 * 'token' is added for compatibility with BusinessForm,
 * while 'accessToken' and 'refreshToken' are used in AuthContext and SignInForm.
 */
export const saveTokens = async ({ accessToken, refreshToken }) => {
  try {
    await AsyncStorage.multiSet([
      ['token', accessToken],           // ✅ For BusinessForm
      ['accessToken', accessToken],     // ✅ For AuthContext
      ['refreshToken', refreshToken]    // ✅ For AuthContext
    ]);
  } catch (error) {
    console.error('Error saving tokens:', error);
  }
};

/**
 * Retrieve access and refresh tokens from AsyncStorage.
 */
export const getTokens = async () => {
  try {
    const [accessToken, refreshToken] = await AsyncStorage.multiGet([
      'accessToken',
      'refreshToken'
    ]);
    return {
      accessToken: accessToken[1],
      refreshToken: refreshToken[1]
    };
  } catch (error) {
    console.error('Error getting tokens:', error);
    return {
      accessToken: null,
      refreshToken: null
    };
  }
};

/**
 * Remove all token keys from AsyncStorage.
 * Ensures user is logged out completely.
 */
export const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'accessToken', 'refreshToken']);
  } catch (error) {
    console.error('Error clearing tokens:', error);
  }
};
