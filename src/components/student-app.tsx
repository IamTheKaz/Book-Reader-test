import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Play, Square, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Book, BookPage } from "@/lib/book-model";
import { apiRecordScore, fetchBooks } from "@/lib/api";
import { buildSpeechPlan } from "@/lib/page-model";
import { cancelSpeech, speakText } from "@/lib/tts";

type Phase = "loading" | "pick" | "name" | "read";

export function StudentApp() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [books, setBooks] = useState<Book[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [finishedPages, setFinishedPages] = useState<Set<string>>(new Set());
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [activeWordId, setActiveWordId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const startAtRef = useRef<number | null>(null);

  useEffect(() => {
    void fetchBooks()
      .then((b) => setBooks(b.filter((x) => x.pages.length > 0)))
      .catch(() => setBooks([]))
      .finally(() => setPhase("pick"));
    return () => cancelSpeech();
  }, []);

  // Ticking run timer while reading (until every page is finished).
  const allDone = book !== null && book.pages.length > 0 && finishedPages.size >= book.pages.length;
  useEffect(() => {
    if (phase !== "read" || startAtRef.current === null || allDone) return;
    const id = window.setInterval(() => {
      if (startAtRef.current !== null) setElapsedMs(Date.now() - startAtRef.current);
    }, 250);
    return () => window.clearInterval(id);
  }, [phase, allDone]);

  const pages = useMemo(() => book?.pages ?? [], [book]);
  const page: BookPage | null = pages[pageIndex] ?? null;
  const plan = useMemo(
    () => (page ? buildSpeechPlan(page.words, page.layout, page.image.width, page.sentenceOverride) : null),
    [page],
  );

  function chooseBook(b: Book) {
    setBook(b);
    setPhase("name");
  }

  function startReading() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    setName(trimmed);
    setPageIndex(0);
    setFinishedPages(new Set());
    setElapsedMs(0);
    setSaved(false);
    startAtRef.current = Date.now();
    setPhase("read");
  }

  function markPageDone(id: string) {
    setFinishedPages((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }

  function play() {
    if (!page || !plan || !plan.spoken) return;
    cancelSpeech();
    setPlaying(true);
    const handle = speakText(plan.spoken, {
      rate: 0.5,
      tokens: plan.tokens,
      onToken: (t) => setActiveWordId(t.wordId),
    });
    void handle.done.then(() => {
      setPlaying(false);
      setActiveWordId(null);
      markPageDone(page.id);
    });
  }

  function stop() {
    cancelSpeech();
    setPlaying(false);
    setActiveWordId(null);
  }

  function goTo(index: number) {
    stop();
    setPageIndex(Math.max(0, Math.min(pages.length - 1, index)));
  }

  // When the whole book is finished, stop the clock and record the score once.
  useEffect(() => {
    if (!book || !allDone || saved) return;
    stop();
    const timeMs = startAtRef.current !== null ? Date.now() - startAtRef.current : null;
    setElapsedMs(timeMs ?? 0);
    setSaved(true);
    void apiRecordScore({
      studentName: name,
      bookId: book.id,
      completedPages: [...finishedPages],
      timeMs,
    }).catch(() => undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone, saved, book]);

  function restart() {
    stop();
    setBook(null);
    setName("");
    setNameInput("");
    setFinishedPages(new Set());
    setPageIndex(0);
    setElapsedMs(0);
    setSaved(false);
    startAtRef.current = null;
    setPhase("pick");
  }

  if (phase === "loading") {
    return <CenteredNote>Loading books…</CenteredNote>;
  }

  if (phase === "pick") {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-center font-display text-3xl font-medium tracking-tight">Pick a book to read</p>
        <p className="mt-2 text-center text-muted">Tap a book, type your name, and read along.</p>
        {books.length === 0 ? (
          <p className="mt-10 rounded-2xl bg-surface px-6 py-12 text-center text-muted shadow-border">
            No books are ready yet. Ask your teacher to add some pages.
          </p>
        ) : (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {books.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => chooseBook(b)}
                  className="flex w-full items-center gap-3 rounded-xl bg-surface p-4 text-left shadow-border transition-shadow hover:shadow-md"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                    <BookOpen className="size-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-lg font-medium tracking-tight">{b.name}</span>
                    <span className="text-sm text-muted">{b.pages.length} page{b.pages.length === 1 ? "" : "s"}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (phase === "name" && book) {
    return (
      <div className="mx-auto flex max-w-md flex-col justify-center pt-8">
        <div className="rounded-2xl bg-surface p-6 shadow-border sm:p-8">
          <h1 className="font-display text-2xl font-medium tracking-tight">What's your name?</h1>
          <p className="mt-2 text-sm text-muted">
            Your teacher uses it to see who read “{book.name}” and how long it took.
          </p>
          <form
            className="mt-5 flex flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              startReading();
            }}
          >
            <Input
              autoFocus
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Type your first name"
              aria-label="Your name"
              maxLength={40}
            />
            <Button type="submit" disabled={!nameInput.trim()}>
              <Play />
              Start reading
            </Button>
            <Button type="button" variant="ghost" onClick={() => setPhase("pick")}>
              <ArrowLeft />
              Pick a different book
            </Button>
          </form>
        </div>
      </div>
    );
  }

  if (phase === "read" && book && page) {
    const doneCount = finishedPages.size;
    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={restart}>
            <ArrowLeft />
            Done
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              <Timer className="mr-1 size-3" />
              {formatMs(elapsedMs)}
            </Badge>
            <Badge variant="muted">
              {doneCount}/{pages.length} pages
            </Badge>
          </div>
        </div>

        <h1 className="mt-4 text-center font-display text-2xl font-medium tracking-tight">{book.name}</h1>
        <p className="mt-1 text-center text-sm text-muted">Reading as {name}</p>

        <div className="relative mx-auto mt-5 max-w-2xl">
          <div className="relative inline-block max-w-full touch-manipulation select-none">
            <img
              src={page.image.src}
              alt={`Page ${pageIndex + 1}`}
              className="block h-auto max-h-[min(60vh,640px)] w-auto max-w-full rounded-md bg-surface-2"
              draggable={false}
            />
            {page.image.width > 0 &&
              plan &&
              page.words.map((w) => {
                const left = (w.bbox.x0 / page.image.width) * 100;
                const top = (w.bbox.y0 / page.image.height) * 100;
                const width = ((w.bbox.x1 - w.bbox.x0) / page.image.width) * 100;
                const height = ((w.bbox.y1 - w.bbox.y0) / page.image.height) * 100;
                const karaoke = activeWordId === w.id;
                return (
                  <span
                    key={w.id}
                    className="word-box pointer-events-none"
                    data-karaoke={karaoke ? "true" : "false"}
                    style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
                  />
                );
              })}
          </div>
        </div>

        {plan && (
          <p className="mx-auto mt-4 max-w-2xl rounded-md bg-surface px-4 py-3 text-center font-display text-xl leading-relaxed shadow-border">
            {plan.displaySentence}
          </p>
        )}

        <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2">
          <Button variant="outline" onClick={() => goTo(pageIndex - 1)} disabled={pageIndex === 0}>
            <ChevronLeft />
            Back
          </Button>
          {playing ? (
            <Button variant="secondary" onClick={stop} className="min-w-36">
              <Square />
              Stop
            </Button>
          ) : (
            <Button onClick={play} className="min-w-36">
              <Play />
              {finishedPages.has(page.id) ? "Read again" : "Read to me"}
            </Button>
          )}
          <Button variant="outline" onClick={() => goTo(pageIndex + 1)} disabled={pageIndex === pages.length - 1}>
            Next
            <ChevronRight />
          </Button>
        </div>

        {allDone && (
          <div className="mx-auto mt-6 max-w-2xl rounded-2xl bg-primary-soft p-6 text-center">
            <p className="font-display text-2xl font-medium tracking-tight text-primary">You finished the book!</p>
            <p className="mt-1 text-sm text-primary">
              Great reading, {name}. Time: {formatMs(elapsedMs)}.
            </p>
            <Button className="mt-4" variant="secondary" onClick={restart}>
              Read another book
            </Button>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function CenteredNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-md items-center justify-center">
      <p className="text-muted">{children}</p>
    </div>
  );
}

function formatMs(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
