
/**
 * Utility functions for local storage operations
 */

export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      // Parse the saved data and ensure dates are properly converted
      return JSON.parse(saved, (k, v) => {
        if (k === "createdAt") {
          return new Date(v);
        }
        return v;
      });
    }
    return defaultValue;
  } catch (error) {
    console.error(`Error parsing ${key} from storage:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key: string, data: any): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error);
  }
};
