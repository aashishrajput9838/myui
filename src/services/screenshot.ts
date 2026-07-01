import puppeteer from "puppeteer";
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
 * Service for capturing website screenshots and uploading to Cloudinary
 */
export const ScreenshotService = {
  /**
   * Capture a screenshot of a website and upload to Cloudinary
   */
  captureWebsite: async (url: string): Promise<ScreenshotResult> => {
    let browser: any = null;

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      console.log("🚀 Launching Puppeteer for:", hostname);
      browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });

      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 800 });

      console.log("🌐 Navigating to:", url);
      await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

      console.log("📸 Capturing screenshot...");
      const screenshotBuffer = await page.screenshot({ 
        type: "jpeg", 
        quality: 80 
      });

      console.log("📄 Extracting metadata...");
      const pageData = await page.evaluate(() => {
        return {
          title: document.title,
          description:
            document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
        };
      });

      await browser.close();

      console.log("☁️ Uploading to Cloudinary...");
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "myui-screenshots",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(screenshotBuffer);
      });

      const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

      return {
        thumbnailUrl: uploadResult.secure_url,
        title: pageData.title || hostname,
        description: pageData.description || `Saved website from ${hostname}`,
        faviconUrl,
      };
    } catch (error: any) {
      if (browser) {
        await browser.close();
      }
      console.error("❌ Screenshot error details:", error);
      throw error;
    }
  },
};
