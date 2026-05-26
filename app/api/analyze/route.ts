import { NextRequest, NextResponse } from "next/server";
import { analyzeSkin } from "@/lib/perfectcorp";

// Polling dapat memakan waktu hingga 40 detik
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large (max 10MB)" }, { status: 400 });
    }

    const result = await analyzeSkin(imageFile);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Skin analysis failed";
    console.error("[/api/analyze]", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
