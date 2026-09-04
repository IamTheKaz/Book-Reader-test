import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";

export type StudentScore = {
  studentName: string;
  bookId: string;
  bookName: string;
  completedPages: string[];
  pageCount: number;
  timeMs: number | null;
  bestTimeMs: number | null;
  runs: number;
  updatedAt: string;
};

type ScoreRow = {
  student_name: string;
  book_id: string;
  book_name: string;
  completed_pages: unknown;
  time_ms: number | null;
  best_time_ms: number | null;
  runs: number;
  updated_at: string;
  page_count: number;
};

/**
 * Record a finished reading run: upsert the (student, book) row with the latest
 * completion and times. Demo-level tracking — no login, name only.
 */
export const recordScoreFn = createServerFn({ method: "POST" })
  .validator((input: {
    studentName: string;
    bookId: string;
    completedPages: string[];
    timeMs: number | null;
  }) => {
    if (typeof input?.studentName !== "string" || !input.studentName.trim()) {
      throw new Error("studentName required");
    }
    if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
    const timeMs =
      typeof input.timeMs === "number" && Number.isFinite(input.timeMs) && input.timeMs >= 0
        ? Math.round(input.timeMs)
        : null;
    return {
      studentName: input.studentName.trim().slice(0, 60),
      bookId: input.bookId,
      completedPages: Array.isArray(input.completedPages)
        ? input.completedPages.filter((x) => typeof x === "string")
        : [],
      timeMs,
    };
  })
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const sql = await getSql();
    const id = `${data.studentName}:${data.bookId}`;
    const existing = await sql<{ best_time_ms: number | null; runs: number }>`
      select best_time_ms, runs from student_scores where id = ${id}
    `;
    const prevBest = existing[0]?.best_time_ms ?? null;
    const best =
      data.timeMs === null ? prevBest : prevBest === null ? data.timeMs : Math.min(prevBest, data.timeMs);
    const runs = (existing[0]?.runs ?? 0) + 1;
    await sql`
      insert into student_scores (id, student_name, book_id, completed_pages, time_ms, best_time_ms, runs, updated_at)
      values (
        ${id},
        ${data.studentName},
        ${data.bookId},
        ${JSON.stringify(data.completedPages)}::jsonb,
        ${data.timeMs},
        ${best},
        ${runs},
        now()
      )
      on conflict (id) do update set
        completed_pages = ${JSON.stringify(data.completedPages)}::jsonb,
        time_ms = ${data.timeMs},
        best_time_ms = ${best},
        runs = ${runs},
        updated_at = now()
    `;
    return { ok: true };
  });

/** All recorded scores, newest first, joined with book names. Teacher view. */
export const listScoresFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<StudentScore[]> => {
    const sql = await getSql();
    const rows = await sql<ScoreRow>`
      select
        s.student_name, s.book_id, b.name as book_name,
        s.completed_pages, s.time_ms, s.best_time_ms, s.runs, s.updated_at,
        (select count(*) from book_pages p where p.book_id = s.book_id) as page_count
      from student_scores s
      join books b on b.id = s.book_id
      order by s.updated_at desc
    `;
    return rows.map((r) => ({
      studentName: r.student_name,
      bookId: r.book_id,
      bookName: r.book_name,
      completedPages: Array.isArray(r.completed_pages) ? (r.completed_pages as string[]) : [],
      pageCount: Number(r.page_count) || 0,
      timeMs: r.time_ms,
      bestTimeMs: r.best_time_ms,
      runs: Number(r.runs) || 0,
      updatedAt: r.updated_at,
    }));
  },
);
