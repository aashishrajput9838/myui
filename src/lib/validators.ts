/**
 * Validator functions for form inputs
 */

export const Validators = {
  /**
   * Validate URL format
   */
  url: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate collection name
   */
  collectionName: (name: string): { valid: boolean; error?: string } => {
    if (!name.trim()) {
      return { valid: false, error: "Collection name is required" };
    }
    if (name.length > 50) {
      return { valid: false, error: "Collection name must be 50 characters or less" };
    }
    return { valid: true };
  },

  /**
   * Validate website URL
   */
  websiteUrl: (url: string): { valid: boolean; error?: string } => {
    if (!url.trim()) {
      return { valid: false, error: "Website URL is required" };
    }
    try {
      new URL(url);
      return { valid: true };
    } catch {
      return { valid: false, error: "Please enter a valid URL" };
    }
  },
};
