import { NextRequest, NextResponse } from "next/server";
import { ScreenshotService } from "@/services/screenshot";
import { validateUrl } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    const validation = validateUrl(url);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Parse and validate URL
    const parsedUrl = new URL(url);
    
    // Block internal/localhost URLs for security
    const hostname = parsedUrl.hostname;
    const blockedHosts = ['localhost', '127.0.0.1', '0.0.0.0', '::1'];
    if (blockedHosts.includes(hostname) || hostname.includes('internal') || hostname.includes('private')) {
      return NextResponse.json(
        { error: "URL is not allowed" },
        { status: 403 }
      );
    }

    const result = await ScreenshotService.captureWebsite(url);

    // Add safety defaults for all fields
    const safeResult = {
      thumbnailUrl: result.thumbnailUrl || "https://placehold.co/1200x800/3b82f6/ffffff",
      title: result.title || hostname,
      description: result.description || "",
      faviconUrl: result.faviconUrl || `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`,
    };

    return NextResponse.json({ success: true, data: safeResult });
  } catch (error: any) {
    console.error("🔥 API Screenshot Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process website" },
      { status: 500 }
    );
  }
}
