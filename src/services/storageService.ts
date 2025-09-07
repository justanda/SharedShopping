/**
 * Storage service for persisting application data in localStorage
 * with versioning support for schema migrations
 */

const STORAGE_VERSION = '1.0.0';
const VERSION_KEY = 'recipe_roulette_storage_version';

// Check and handle version migrations if needed
const initializeStorage = (): void => {
  const currentVersion = localStorage.getItem(VERSION_KEY);
  
  if (!currentVersion) {
    // First-time initialization
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
    return;
  }
  
  if (currentVersion !== STORAGE_VERSION) {
    // Handle migration between versions
    // This would contain logic to transform data structure between versions
    migrateStorage(currentVersion, STORAGE_VERSION);
    localStorage.setItem(VERSION_KEY, STORAGE_VERSION);
  }
};

// Placeholder for future migration logic
const migrateStorage = (fromVersion: string, toVersion: string): void => {
  console.log(`Migrating storage from version ${fromVersion} to ${toVersion}`);
  // Implement migration strategies when needed
};

// Initialize on service import
initializeStorage();

// Generic storage service with type safety
const storageService = {
  /**
   * Get an item from localStorage with proper parsing of complex objects
   */
  getItem: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      
      // Parse stored JSON data
      const parsed = JSON.parse(item, (key, value) => {
        // Handle Date objects which are serialized as ISO strings
        if (typeof value === 'string' && 
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
          return new Date(value);
        }
        return value;
      });
      
      return parsed as T;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage:`, error);
      return defaultValue;
    }
  },
  
  /**
   * Set an item in localStorage with proper serialization of complex objects
   */
  setItem: <T>(key: string, value: T): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Error storing ${key} in storage:`, error);
    }
  },
  
  /**
   * Remove an item from localStorage
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  },
  
  /**
   * Clear all application data from localStorage
   * Preserves the version information
   */
  clear: (): void => {
    try {
      // Save version before clearing
      const version = localStorage.getItem(VERSION_KEY);
      
      // Clear all storage
      localStorage.clear();
      
      // Restore version
      if (version) {
        localStorage.setItem(VERSION_KEY, version);
      }
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

export default storageService;
