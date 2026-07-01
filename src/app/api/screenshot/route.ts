import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Use Puppeteer + Cloudinary for real website screenshots!
 */
export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const urlObj = new URL(url);
    const hostname = urlObj.hostname;

    console.log("Launching browser...");
    // Launch Puppeteer
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

    console.log("Navigating to URL:", url);
    // Wait for the page to load completely!
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    console.log("Taking screenshot...");
    // Take screenshot
    const screenshotBuffer = await page.screenshot({ type: "jpeg", quality: 80 });

    console.log("Getting metadata...");
    // Get page title and description
    const pageData = await page.evaluate(() => {
      return {
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") || "",
      };
    });

    await browser.close();

    console.log("Uploading to Cloudinary...");
    // Upload screenshot to Cloudinary!
    const uploadResult = await new Promise((resolve, reject) => {
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

    // Google's free favicon service
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

    return NextResponse.json({
      success: true,
      data: {
        thumbnailUrl: (uploadResult as any).secure_url,
        title: pageData.title || hostname,
        description: pageData.description || `Saved website from ${hostname}`,
        favicon: faviconUrl,
      },
    });
  } catch (error: any) {
    console.error("Screenshot error details:", error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json({ error: error.message || "Failed to process website" }, { status: 500 });
  }
}