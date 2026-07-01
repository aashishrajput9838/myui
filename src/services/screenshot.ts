import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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
      const microlinkUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=true&embed=screenshot.url&waitFor=5000`;
      
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
      
      console.log("☁️ Uploading to Cloudinary...");
      
      // Upload screenshot from Microlink to Cloudinary
      const uploadResult = await cloudinary.uploader.upload(screenshotUrl, {
        folder: "myui-screenshots",
        resource_type: "image",
      });
      
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
      
      return {
        thumbnailUrl: uploadResult.secure_url,
        title,
        description,
        faviconUrl,
      };
    } catch (error: any) {
      console.error("❌ Screenshot error details:", error);
      throw error;
    }
  },
};
