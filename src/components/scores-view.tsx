import { useEffect, useState } from "react";
import { ArrowLeft, Timer, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchScores } from "@/lib/api";
import type { StudentScore } from "@/server/scores";

export function ScoresView({ onBack }: { onBack: () => void }) {
  const [scores, setScores] = useState<StudentScore[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    void fetchScores()
      .then(setScores)
      .catch(() => setError(true));
  }, []);

  const byStudent = scores
    ? [...scores].sort((a, b) => a.studentName.localeCompare(b.studentName) || a.bookName.localeCompare(b.bookName))
    : null;
  const studentCount = scores ? new Set(scores.map((s) => s.studentName)).size : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft />
          Library
        </Button>
        <h1 className="font-display text-2xl font-medium tracking-tight">Student scores</h1>
      </div>
      <p className="mt-2 text-sm text-muted">
        Who read each book and how long it took. Names are typed by the student — no accounts.
      </p>

      {scores === null && !error && <p className="mt-8 text-sm text-muted">Loading scores…</p>}
      {error && <p className="mt-8 text-sm text-danger">Couldn't load scores. Please try again.</p>}

      {scores !== null && scores.length === 0 && (
        <div className="mt-8 flex flex-col items-center rounded-2xl bg-surface px-6 py-12 text-center shadow-border">
          <span className="flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Users className="size-6" />
          </span>
          <p className="mt-4 font-display text-lg font-medium tracking-tight">No reading yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted">
            Once a student finishes a book on the reading link, their name, time, and pages read show up here.
          </p>
        </div>
      )}

      {byStudent && byStudent.length > 0 && (
        <>
          <p className="mt-6 text-sm text-muted">
            {studentCount} student{studentCount === 1 ? "" : "s"} · {byStudent.length} book run
            {byStudent.length === 1 ? "" : "s"}
          </p>
          <ul className="mt-3 grid gap-3">
            {byStudent.map((s) => (
              <li
                key={`${s.studentName}:${s.bookId}`}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-surface p-4 shadow-border"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-medium tracking-tight">{s.studentName}</p>
                  <p className="truncate text-sm text-muted">{s.bookName}</p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant={s.completedPages.length >= s.pageCount && s.pageCount > 0 ? "default" : "muted"}>
                    {s.completedPages.length}/{s.pageCount} pages
                  </Badge>
                  {s.bestTimeMs !== null && (
                    <Badge variant="outline">
                      <Timer className="mr-1 size-3" />
                      best {formatMs(s.bestTimeMs)}
                    </Badge>
                  )}
                  {s.timeMs !== null && <Badge variant="muted">last {formatMs(s.timeMs)}</Badge>}
                  {s.runs > 1 && <Badge variant="muted">{s.runs} runs</Badge>}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function formatMs(ms: number): string {
  const total = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
