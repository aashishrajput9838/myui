import { NextRequest, NextResponse } from "next/server";
import { ScreenshotService } from "@/services/screenshot";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    const result = await ScreenshotService.captureWebsite(url);

    // Add safety defaults for all fields
    const safeResult = {
      thumbnailUrl: result.thumbnailUrl || "https://placehold.co/1200x800/3b82f6/ffffff",
      title: result.title || new URL(url).hostname,
      description: result.description || "",
      faviconUrl: result.faviconUrl || "https://www.google.com/s2/favicons?domain=example.com&sz=64",
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
