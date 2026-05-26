import type { SkinType } from "./perfectcorp";
import type { RoutineResult } from "./fallback-chain";
import staticRoutines from "@/data/static-routines.json";

export function getStaticRoutine(skinType: SkinType): RoutineResult {
  const routine = (staticRoutines as Record<string, Omit<RoutineResult, "llm_source">>)[skinType]
    ?? staticRoutines["combination"];
  return { ...routine, llm_source: "static" };
}
