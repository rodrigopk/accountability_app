import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Platform-agnostic storage adapter wrapping AsyncStorage.
 * Provides typed get/set/delete methods with JSON serialization.
 */
export class StorageAdapter {
  /**
   * Get a value from storage by key
   * @param key Storage key
   * @returns Parsed value or null if not found
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error reading from storage key "${key}":`, error);
      return null;
    }
  }

  /**
   * Set a value in storage by key
   * @param key Storage key
   * @param value Value to store (will be JSON serialized)
   */
  async set<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error writing to storage key "${key}":`, error);
      throw error;
    }
  }

  /**
   * Delete a value from storage by key
   * @param key Storage key
   */
  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error deleting storage key "${key}":`, error);
      throw error;
    }
  }
}
