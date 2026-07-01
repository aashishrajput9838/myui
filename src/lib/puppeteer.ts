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
    console.log("Launching Puppeteer...");
    return puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
        "--disable-software-rasterizer",
        "--disable-extensions",
        "--disable-default-apps",
        "--disable-background-networking",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
      ],
    });
  },

  /**
   * Extract metadata and take a screenshot of a URL
   */
  processUrl: async (browser: Browser, url: string) => {
    console.log("Creating new page...");
    const page = await browser.newPage();
    
    console.log("Setting viewport...");
    await page.setViewport({ width: 1440, height: 900 });
    
    console.log("Setting user agent...");
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    try {
      console.log("Navigating to URL:", url);
      // Go to the URL with a timeout
      await page.goto(url, { 
        waitUntil: "domcontentloaded", 
        timeout: 90000 // 90 seconds!
      });

      console.log("Page loaded! Waiting to settle...");
      // Wait a little bit to let the page settle
      await page.waitForTimeout(1000);

      console.log("Extracting metadata...");
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

      console.log("Metadata extracted:", metaData);

      // Handle relative favicon URLs
      if (metaData.favicon && !metaData.favicon.startsWith("http")) {
        const urlObj = new URL(url);
        metaData.favicon = `${urlObj.origin}${metaData.favicon.startsWith("/") ? "" : "/"}${metaData.favicon}`;
      }

      console.log("Taking screenshot...");
      // Take a high-quality screenshot
      const screenshotBuffer = await page.screenshot({
        type: "jpeg",
        quality: 85,
        fullPage: true,
      });

      console.log("Screenshot taken!");

      return {
        metaData,
        screenshotBuffer
      };
    } finally {
      console.log("Closing page...");
      await page.close();
    }
  }
};
