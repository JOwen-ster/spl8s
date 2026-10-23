import type { SupportMode, SupportPair } from "./types";

export function shuffleArray(array: string[]): string[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function areSlayersEqual(arr1: string[], arr2: string[]): boolean {
  if (arr1.length !== arr2.length) return false;
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);
  return set1.size === set2.size && [...set1].every((x) => set2.has(x));
}

export function shuffleSupports(
  mode: SupportMode,
  current: SupportPair,
  fixed: SupportPair,
): SupportPair {
  if (mode === "static") return fixed;
  if (mode === "random" && Math.random() < 0.5) return current;
  return [current[1], current[0]];
}
