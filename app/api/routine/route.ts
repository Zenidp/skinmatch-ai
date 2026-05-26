import { NextRequest, NextResponse } from "next/server";
import { generateRoutine } from "@/lib/fallback-chain";
import type { SkinAnalysisResult } from "@/lib/perfectcorp";

export async function POST(req: NextRequest) {
  try {
    const skinData: SkinAnalysisResult = await req.json();
    const routine = await generateRoutine(skinData);
    return NextResponse.json(routine);
  } catch (error) {
    console.error("[/api/routine]", error);
    return NextResponse.json({ error: "Routine generation failed" }, { status: 500 });
  }
}
