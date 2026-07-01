interface ScreenshotResult {
  thumbnailUrl: string;
  title: string;
  description: string;
  faviconUrl: string;
}

/**
 * Service for capturing website screenshots using Microlink API
 */
export const ScreenshotService = {
  /**
   * Capture a screenshot of a website using Microlink (free tier)
   */
  captureWebsite: async (url: string): Promise<ScreenshotResult> => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      console.log("🚀 Capturing screenshot via Microlink for:", hostname);
      
      // Use Microlink API to get screenshot and metadata
      const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=true&waitFor=5000`;
      
      const response = await fetch(microlinkUrl);
      if (!response.ok) {
        throw new Error(`Microlink API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.data) {
        throw new Error("No data received from Microlink");
      }
      
      const screenshotUrl = data.data.screenshot?.url;
      const title = data.data.title || hostname;
      const description = data.data.description || `Saved website from ${hostname}`;
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
      
      console.log("✅ Screenshot captured successfully!");
      
      return {
        thumbnailUrl: screenshotUrl,
        title,
        description,
        faviconUrl,
      };
    } catch (error: any) {
      console.error("❌ Screenshot error details:", error);
      // Fallback to placeholder if anything fails
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      return {
        thumbnailUrl: `https://placehold.co/1200x800/3b82f6/ffffff?text=${encodeURIComponent(hostname)}`,
        title: hostname,
        description: `Saved website from ${hostname}`,
        faviconUrl: `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
      };
    }
  },
};
