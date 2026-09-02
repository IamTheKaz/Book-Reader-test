import { useEffect } from "react";
import { BookOpen } from "lucide-react";
import { PageCanvas } from "@/components/page-canvas";
import { ReviewSidebar } from "@/components/review-sidebar";
import { UploadPanel } from "@/components/upload-panel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePageStore } from "@/store/page-store";

const STEPS = ["Upload", "Detect", "Review", "Preview", "Approve"] as const;

export function TeacherApp() {
  const image = usePageStore((s) => s.image);
  const words = usePageStore((s) => s.words);
  const ocr = usePageStore((s) => s.ocr);
  const hasPreviewed = usePageStore((s) => s.hasPreviewed);
  const approved = usePageStore((s) => s.approved);
  const selectedId = usePageStore((s) => s.selectedId);
  const editorMode = usePageStore((s) => s.editorMode);
  const showOrderEditor = usePageStore((s) => s.showOrderEditor);
  const playback = usePageStore((s) => s.playback);
  const reset = usePageStore((s) => s.reset);
  const selectWord = usePageStore((s) => s.selectWord);
  const stopPlayback = usePageStore((s) => s.stopPlayback);
  const setShowOrderEditor = usePageStore((s) => s.setShowOrderEditor);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      stopPlayback();
      selectWord(null, false);
      setShowOrderEditor(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectWord, setShowOrderEditor, stopPlayback]);

  const stepIndex = !image
    ? 0
    : ocr.status === "running"
      ? 1
      : approved
        ? 4
        : hasPreviewed
          ? 3
          : 2;

  const modeLabel = showOrderEditor
    ? "Fixing reading order"
    : selectedId && editorMode === "pronunciation"
      ? "Fixing pronunciation"
      : selectedId
        ? "Fixing spelling"
        : playback.kind === "sentence"
          ? "Playing full sentence"
          : playback.kind === "word"
            ? "Playing a single word"
            : words.length > 0
              ? "Tap a word to review it"
              : ocr.status === "running"
                ? "Detecting words"
                : "Upload a page to begin";

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-fg">
              <BookOpen className="size-5" />
            </span>
            <div>
              <p className="font-display text-xl font-medium tracking-tight">Page Aloud</p>
              <p className="text-sm text-muted">Teacher page review</p>
            </div>
          </div>
          <ol className="flex flex-wrap items-center gap-1 text-xs font-medium sm:text-sm">
            {STEPS.map((step, index) => (
              <li key={step} className="flex items-center gap-1">
                {index > 0 && <span className="px-1 text-subtle">/</span>}
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1",
                    index === stepIndex ? "bg-primary text-primary-fg" : "text-muted",
                  )}
                >
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </header>

      <div className="border-b border-border bg-primary-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <p className="text-sm font-medium text-primary" aria-live="polite">
            {modeLabel}
          </p>
          {image && (
            <Button variant="ghost" size="sm" onClick={reset}>
              New page
            </Button>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        {!image ? (
          <div className="mx-auto max-w-2xl pt-6">
            <p className="mb-8 text-center font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Turn a photographed page into a reviewed, narrated page.
            </p>
            <UploadPanel />
            <ul className="mx-auto mt-10 grid max-w-xl gap-3 text-sm text-muted">
              <li className="rounded-lg bg-surface px-4 py-3 shadow-border">
                <span className="font-medium text-fg">Spelling</span> — tap a word, hear it, correct the OCR guess in place.
              </li>
              <li className="rounded-lg bg-surface px-4 py-3 shadow-border">
                <span className="font-medium text-fg">Sound</span> — if the spelling is right but the voice is wrong, type a respelling.
              </li>
              <li className="rounded-lg bg-surface px-4 py-3 shadow-border">
                <span className="font-medium text-fg">Reading order</span> — if the sentence comes out garbled, retype it once for the whole page.
              </li>
            </ul>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,22rem)] lg:items-start">
            <section className="overflow-x-auto rounded-2xl bg-surface p-3 shadow-border sm:p-4">
              <PageCanvas />
              {ocr.status === "error" && (
                <p className="mt-3 text-sm text-danger">{ocr.message}</p>
              )}
              {ocr.status === "done" && words.length === 0 && (
                <p className="mt-3 text-sm text-muted">
                  Nothing readable was found. Try a sharper photo with higher contrast.
                </p>
              )}
            </section>
            <ReviewSidebar />
          </div>
        )}
      </main>
    </div>
  );
}
