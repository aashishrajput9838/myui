/**
 * Validator functions for form inputs and data
 */

export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url || !url.trim()) {
    return { valid: false, error: "URL is required" };
  }
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { valid: false, error: "URL must start with http:// or https://" };
    }
    if (url.length > 2048) {
      return { valid: false, error: "URL is too long (max 2048 characters)" };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: "Please enter a valid URL" };
  }
};

export const validateCollectionName = (name: string): { valid: boolean; error?: string } => {
  if (!name || !name.trim()) {
    return { valid: false, error: "Collection name is required" };
  }
  const trimmed = name.trim();
  if (trimmed.length < 1) {
    return { valid: false, error: "Collection name is required" };
  }
  if (trimmed.length > 100) {
    return { valid: false, error: "Collection name must be 100 characters or less" };
  }
  return { valid: true };
};

export const validateCollectionDescription = (description: string): { valid: boolean; error?: string } => {
  if (description && description.length > 500) {
    return { valid: false, error: "Description must be 500 characters or less" };
  }
  return { valid: true };
};

export const validateWebsiteName = (name: string): { valid: boolean; error?: string } => {
  if (name && name.length > 200) {
    return { valid: false, error: "Website name must be 200 characters or less" };
  }
  return { valid: true };
};

export const Validators = {
  /**
   * Validate URL format (legacy)
   */
  url: (url: string): boolean => {
    return validateUrl(url).valid;
  },

  /**
   * Validate collection name
   */
  collectionName: validateCollectionName,

  /**
   * Validate website URL
   */
  websiteUrl: validateUrl,
};
