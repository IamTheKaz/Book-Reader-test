import { cleanOcrText, type PageWord } from "@/lib/page-model";

export type OcrProgress = {
  status: string;
  progress: number;
};

const MAX_OCR_EDGE = 1800;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that image."));
    image.src = src;
  });
}

async function rasterForOcr(image: HTMLImageElement): Promise<{
  canvas: HTMLCanvasElement;
  scale: number;
  width: number;
  height: number;
}> {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const scale = Math.min(1, MAX_OCR_EDGE / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available in this browser.");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return { canvas, scale, width, height };
}

function humanStatus(status: string): string {
  if (status.includes("loading language") || status.includes("downloading")) {
    return "Downloading the reading engine";
  }
  if (status.includes("initializ")) return "Starting the reading engine";
  if (status.includes("recognizing")) return "Finding words on the page";
  if (status.includes("loading tesseract") || status.includes("loading core")) {
    return "Loading the reading engine";
  }
  return "Reading the page";
}

let workerPromise: Promise<import("tesseract.js").Worker> | null = null;
let progressHandler: ((info: OcrProgress) => void) | null = null;

async function getWorker(): Promise<import("tesseract.js").Worker> {
  if (workerPromise) return workerPromise;
  workerPromise = (async () => {
    const { createWorker, PSM } = await import("tesseract.js");
    const worker = await createWorker("eng", 1, {
      workerPath: "/tesseract-worker.min.js",
      corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1",
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
      logger: (message) => {
        if (!progressHandler) return;
        const progress = typeof message.progress === "number" ? message.progress : 0;
        progressHandler({ status: humanStatus(message.status), progress });
      },
      errorHandler: (error) => {
        console.error("OCR worker error", error);
      },
    });
    await worker.setParameters({
      tessedit_pageseg_mode: PSM.AUTO,
      preserve_interword_spaces: "1",
      user_defined_dpi: "150",
    });
    return worker;
  })();
  try {
    return await workerPromise;
  } catch (error) {
    workerPromise = null;
    throw error;
  }
}

export async function detectWords(
  src: string,
  onProgress?: (info: OcrProgress) => void,
): Promise<{ words: PageWord[]; width: number; height: number }> {
  progressHandler = onProgress ?? null;
  onProgress?.({ status: "Opening the page image", progress: 0 });
  const image = await loadImage(src);
  const prepared = await rasterForOcr(image);
  const worker = await getWorker();
  const result = await worker.recognize(prepared.canvas);
  progressHandler = null;

  const scale = prepared.scale || 1;
  const words: PageWord[] = [];
  for (const raw of result.data.words ?? []) {
    const text = cleanOcrText(raw.text ?? "");
    if (!text) continue;
    if (!/[\p{L}\p{N}]/u.test(text)) continue;
    if (raw.confidence < 38) continue;
    const bbox = raw.bbox;
    const x0 = bbox.x0 / scale;
    const y0 = bbox.y0 / scale;
    const x1 = bbox.x1 / scale;
    const y1 = bbox.y1 / scale;
    if (x1 - x0 < 3 || y1 - y0 < 3) continue;
    words.push({
      id: crypto.randomUUID(),
      text,
      phonetic: null,
      bbox: { x0, y0, x1, y1 },
      confidence: raw.confidence,
      confirmed: false,
    });
  }
  return { words, width: prepared.width, height: prepared.height };
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read that file."));
    };
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

export async function samplePageDataUrl(): Promise<{ src: string; name: string }> {
  const response = await fetch("/sample-page.png");
  if (!response.ok) throw new Error("Sample page is missing.");
  const blob = await response.blob();
  const src = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not load the sample page."));
    };
    reader.onerror = () => reject(new Error("Could not load the sample page."));
    reader.readAsDataURL(blob);
  });
  return { src, name: "sample-page.png" };
}
