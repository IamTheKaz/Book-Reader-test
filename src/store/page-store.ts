import { create } from "zustand";
import {
  assembledSentence,
  buildApprovedPage,
  buildSpeechPlan,
  type ApprovedPage,
  type PageImage,
  type PageLayout,
  type PageWord,
} from "@/lib/page-model";
import { detectWords, fileToDataUrl, samplePageDataUrl } from "@/lib/ocr";
import { canSpeak, cancelSpeech, speakText } from "@/lib/tts";

export type EditorMode = "spelling" | "pronunciation";
export type OcrState = {
  status: "idle" | "running" | "done" | "error";
  progress: number;
  message: string;
};
export type PlaybackState = {
  kind: "idle" | "word" | "sentence";
  wordId: string | null;
};

type PageStore = {
  image: PageImage | null;
  words: PageWord[];
  layout: PageLayout;
  sentenceOverride: string | null;
  selectedId: string | null;
  editorMode: EditorMode;
  showOrderEditor: boolean;
  orderDraft: string;
  ocr: OcrState;
  playback: PlaybackState;
  hasPreviewed: boolean;
  approved: boolean;
  approvedAt: string | null;
  ttsAvailable: boolean;
  loadFile: (file: File) => Promise<void>;
  loadSample: () => Promise<void>;
  reset: () => void;
  setLayout: (layout: PageLayout) => void;
  selectWord: (id: string | null, play?: boolean) => void;
  setEditorMode: (mode: EditorMode) => void;
  updateSpelling: (id: string, text: string) => void;
  confirmWord: (id: string) => void;
  confirmRemaining: () => void;
  setPhonetic: (id: string, phonetic: string | null) => void;
  playWord: (id: string) => void;
  previewSentence: () => void;
  stopPlayback: () => void;
  setShowOrderEditor: (open: boolean) => void;
  setOrderDraft: (value: string) => void;
  applyReadingOrder: () => void;
  clearReadingOrder: () => void;
  approve: () => void;
};

const idleOcr: OcrState = { status: "idle", progress: 0, message: "" };

function touchAfterEdit(set: (partial: Partial<PageStore>) => void) {
  set({ approved: false, approvedAt: null });
}

async function runOcr(src: string, name: string, set: (partial: Partial<PageStore>) => void) {
  cancelSpeech();
  set({
    image: { name, src, width: 0, height: 0 },
    words: [],
    sentenceOverride: null,
    selectedId: null,
    editorMode: "spelling",
    showOrderEditor: false,
    orderDraft: "",
    ocr: { status: "running", progress: 0.02, message: "Opening the page image" },
    playback: { kind: "idle", wordId: null },
    hasPreviewed: false,
    approved: false,
    approvedAt: null,
    ttsAvailable: canSpeak(),
  });
  try {
    const result = await detectWords(src, (info) => {
      set({
        ocr: {
          status: "running",
          progress: Math.max(0.04, Math.min(0.98, info.progress || 0.04)),
          message: info.status,
        },
      });
    });
    set({
      image: { name, src, width: result.width, height: result.height },
      words: result.words,
      ocr: {
        status: "done",
        progress: 1,
        message:
          result.words.length === 0
            ? "No words found — try a clearer photo"
            : `Found ${result.words.length} word${result.words.length === 1 ? "" : "s"}`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read this page.";
    set({
      ocr: { status: "error", progress: 0, message },
    });
  }
}

export const usePageStore = create<PageStore>((set, get) => ({
  image: null,
  words: [],
  layout: "single",
  sentenceOverride: null,
  selectedId: null,
  editorMode: "spelling",
  showOrderEditor: false,
  orderDraft: "",
  ocr: idleOcr,
  playback: { kind: "idle", wordId: null },
  hasPreviewed: false,
  approved: false,
  approvedAt: null,
  ttsAvailable: true,

  loadFile: async (file) => {
    const src = await fileToDataUrl(file);
    await runOcr(src, file.name || "page.png", set);
  },

  loadSample: async () => {
    const sample = await samplePageDataUrl();
    await runOcr(sample.src, sample.name, set);
  },

  reset: () => {
    cancelSpeech();
    set({
      image: null,
      words: [],
      layout: "single",
      sentenceOverride: null,
      selectedId: null,
      editorMode: "spelling",
      showOrderEditor: false,
      orderDraft: "",
      ocr: idleOcr,
      playback: { kind: "idle", wordId: null },
      hasPreviewed: false,
      approved: false,
      approvedAt: null,
    });
  },

  setLayout: (layout) => {
    const { sentenceOverride, words, image } = get();
    touchAfterEdit(set);
    set({
      layout,
      hasPreviewed: false,
      orderDraft:
        sentenceOverride ??
        (image ? assembledSentence(words, layout, image.width) : ""),
    });
  },

  selectWord: (id, play = true) => {
    if (!id) {
      set({ selectedId: null });
      return;
    }
    set({ selectedId: id, editorMode: "spelling", showOrderEditor: false });
    if (play) get().playWord(id);
  },

  setEditorMode: (mode) => set({ editorMode: mode }),

  updateSpelling: (id, text) => {
    set({
      words: get().words.map((w) => (w.id === id ? { ...w, text } : w)),
      approved: false,
      approvedAt: null,
    });
  },

  confirmWord: (id) => {
    const words = get().words.map((w) =>
      w.id === id ? { ...w, text: w.text.trim() || w.text, confirmed: true } : w,
    );
    set({ words, approved: false, approvedAt: null });
  },

  confirmRemaining: () => {
    set({
      words: get().words.map((w) => ({ ...w, confirmed: true })),
      approved: false,
      approvedAt: null,
    });
  },

  setPhonetic: (id, phonetic) => {
    const next = phonetic?.trim() ? phonetic.trim() : null;
    set({
      words: get().words.map((w) => (w.id === id ? { ...w, phonetic: next } : w)),
      approved: false,
      approvedAt: null,
    });
  },

  playWord: (id) => {
    const word = get().words.find((w) => w.id === id);
    if (!word) return;
    const text = word.phonetic?.trim() || word.text;
    set({ playback: { kind: "word", wordId: id } });
    const handle = speakText(text, { rate: 0.88 });
    void handle.done.then(() => {
      const current = get().playback;
      if (current.kind === "word" && current.wordId === id) {
        set({ playback: { kind: "idle", wordId: null } });
      }
    });
  },

  previewSentence: () => {
    const { words, layout, image, sentenceOverride } = get();
    if (!image || words.length === 0) return;
    const plan = buildSpeechPlan(words, layout, image.width, sentenceOverride);
    if (!plan.spoken) return;
    set({
      selectedId: null,
      showOrderEditor: false,
      playback: { kind: "sentence", wordId: plan.tokens[0]?.wordId ?? null },
      hasPreviewed: true,
    });
    const handle = speakText(plan.spoken, {
      rate: 0.92,
      tokens: plan.tokens,
      onToken: (token) => {
        const current = get().playback;
        if (current.kind !== "sentence") return;
        set({ playback: { kind: "sentence", wordId: token.wordId } });
      },
    });
    void handle.done.then(() => {
      if (get().playback.kind === "sentence") {
        set({ playback: { kind: "idle", wordId: null } });
      }
    });
  },

  stopPlayback: () => {
    cancelSpeech();
    set({ playback: { kind: "idle", wordId: null } });
  },

  setShowOrderEditor: (open) => {
    const { words, layout, image, sentenceOverride } = get();
    if (open) {
      get().stopPlayback();
      set({
        showOrderEditor: true,
        selectedId: null,
        orderDraft:
          sentenceOverride ??
          (image ? assembledSentence(words, layout, image.width) : ""),
      });
    } else {
      set({ showOrderEditor: false });
    }
  },

  setOrderDraft: (value) => set({ orderDraft: value }),

  applyReadingOrder: () => {
    const draft = get().orderDraft.trim();
    set({
      sentenceOverride: draft || null,
      showOrderEditor: false,
      approved: false,
      approvedAt: null,
      hasPreviewed: false,
    });
    if (draft) {
      // Auto-regenerate the full-sentence preview with the new order.
      queueMicrotask(() => get().previewSentence());
    }
  },

  clearReadingOrder: () => {
    const { words, layout, image } = get();
    set({
      sentenceOverride: null,
      orderDraft: image ? assembledSentence(words, layout, image.width) : "",
      approved: false,
      approvedAt: null,
      hasPreviewed: false,
    });
  },

  approve: () => {
    const { image, words, hasPreviewed } = get();
    if (!image || words.length === 0 || !hasPreviewed) return;
    get().stopPlayback();
    set({
      approved: true,
      approvedAt: new Date().toISOString(),
      selectedId: null,
      showOrderEditor: false,
    });
  },
}));

export function useApprovedPayload(): ApprovedPage | null {
  const image = usePageStore((s) => s.image);
  const words = usePageStore((s) => s.words);
  const layout = usePageStore((s) => s.layout);
  const sentenceOverride = usePageStore((s) => s.sentenceOverride);
  const approved = usePageStore((s) => s.approved);
  const approvedAt = usePageStore((s) => s.approvedAt);
  if (!image) return null;
  const page = buildApprovedPage({
    image,
    words,
    layout,
    sentenceOverride,
    approvedAt: approvedAt ?? new Date(0).toISOString(),
  });
  return {
    ...page,
    approved,
    approvedAt: approved ? (approvedAt ?? page.approvedAt) : null,
  };
}
