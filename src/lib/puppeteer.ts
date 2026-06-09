import puppeteer, { Browser } from "puppeteer";

export interface ScreenshotResult {
  thumbnailUrl?: string;
  title: string;
  description: string;
  favicon: string;
}

/**
 * Utility for handling Puppeteer operations.
 */
export const PuppeteerUtils = {
  /**
   * Launch a browser instance with optimized settings
   */
  launchBrowser: async () => {
    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox", 
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-gpu"
      ],
    });
  },

  /**
   * Extract metadata and take a screenshot of a URL
   */
  processUrl: async (browser: Browser, url: string) => {
    const page = await browser.newPage();
    
    // Set a realistic viewport
    await page.setViewport({ width: 1440, height: 900 });
    
    // Set a realistic user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
      // Go to the URL with a timeout
      await page.goto(url, { 
        waitUntil: "networkidle2", 
        timeout: 45000 
      });

      // Extract metadata
      const metaData = await page.evaluate(() => {
        const getMeta = (name: string) => 
          document.querySelector(`meta[name="${name}"]`)?.getAttribute('content') || 
          document.querySelector(`meta[property="og:${name}"]`)?.getAttribute('content') || "";

        return {
          title: document.title || new URL(window.location.href).hostname,
          description: getMeta('description') || getMeta('og:description') || "",
          favicon: document.querySelector('link[rel="icon"]')?.getAttribute('href') || 
                   document.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') || 
                   "/favicon.ico",
        };
      });

      // Handle relative favicon URLs
      if (metaData.favicon && !metaData.favicon.startsWith("http")) {
        const urlObj = new URL(url);
        metaData.favicon = `${urlObj.origin}${metaData.favicon.startsWith("/") ? "" : "/"}${metaData.favicon}`;
      }

      // Take a high-quality screenshot
      const screenshotBuffer = await page.screenshot({
        type: "jpeg",
        quality: 85,
        fullPage: true,
      });

      return {
        metaData,
        screenshotBuffer
      };
    } finally {
      await page.close();
    }
  }
};
