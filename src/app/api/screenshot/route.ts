import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { PuppeteerUtils } from "@/lib/puppeteer";

/**
 * API route for capturing website screenshots and metadata.
 * Uses Puppeteer to crawl the site and Firebase Storage to store the image.
 */
export async function POST(req: NextRequest) {
  let browser;
  
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Launch browser
    browser = await PuppeteerUtils.launchBrowser();
    
    // Process URL
    const { metaData, screenshotBuffer } = await PuppeteerUtils.processUrl(browser, url);

    // Upload to Firebase Storage
    const fileName = `screenshots/${uuidv4()}.jpg`;
    const storageRef = ref(storage, fileName);
    
    await uploadBytes(storageRef, screenshotBuffer, {
      contentType: "image/jpeg",
    });

    const thumbnailUrl = await getDownloadURL(storageRef);

    return NextResponse.json({
      success: true,
      data: {
        thumbnailUrl,
        ...metaData,
      },
    });
  } catch (error: any) {
    console.error("Screenshot error:", error);
    
    const status = error.name === 'TimeoutError' ? 504 : 500;
    const message = error.name === 'TimeoutError' 
      ? "The website took too long to respond. Please try again." 
      : (error.message || "Failed to capture screenshot");

    return NextResponse.json({ error: message }, { status });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
