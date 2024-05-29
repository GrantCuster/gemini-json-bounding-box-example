import { atomWithStorage } from "jotai/utils";
import { atom } from "jotai";

export const promptAtom = atomWithStorage<string>(
  "prompt-atom-9",
  "What is the position of the objects present in the image? Output objects in JSON format with both object names and positions as a JSON object: { name: [y_min, x_min, y_max, x_max] }. Put the annswer in a JSON code block."
);
export const responseAtom = atomWithStorage<string>("response-atom-1", "");
export const inkColorAtom = atomWithStorage<string>("ink-color-1", "#000000");
export const isGeneratingAtom = atom(false);
export const canvasRefAtom = atom<{ current: HTMLCanvasElement | null }>({
  current: null,
});
export const visibleTextPromptAtom = atomWithStorage("visible-prompt", true);
export const activeModelAtom = atomWithStorage<"flash" | "pro">("active-model-1", "flash");
