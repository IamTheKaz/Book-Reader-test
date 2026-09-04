import { t as createServerFn } from "./ssr.mjs";
import { n as getSql, t as createServerRpc } from "./db-C6EIAQY0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scores-DKaHJrlI.js
/**
* Record a finished reading run: upsert the (student, book) row with the latest
* completion and times. Demo-level tracking — no login, name only.
*/
var recordScoreFn_createServerFn_handler = createServerRpc({
	id: "c04377a4d984de961b21955fdfe7cb0b50ba1ffd9ba51aa2e9acab05b0110c7c",
	name: "recordScoreFn",
	filename: "src/server/scores.ts"
}, (opts) => recordScoreFn.__executeServer(opts));
var recordScoreFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.studentName !== "string" || !input.studentName.trim()) throw new Error("studentName required");
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	const timeMs = typeof input.timeMs === "number" && Number.isFinite(input.timeMs) && input.timeMs >= 0 ? Math.round(input.timeMs) : null;
	return {
		studentName: input.studentName.trim().slice(0, 60),
		bookId: input.bookId,
		completedPages: Array.isArray(input.completedPages) ? input.completedPages.filter((x) => typeof x === "string") : [],
		timeMs
	};
}).handler(recordScoreFn_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = `${data.studentName}:${data.bookId}`;
	const existing = await sql`
      select best_time_ms, runs from student_scores where id = ${id}
    `;
	const prevBest = existing[0]?.best_time_ms ?? null;
	const best = data.timeMs === null ? prevBest : prevBest === null ? data.timeMs : Math.min(prevBest, data.timeMs);
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
var listScoresFn_createServerFn_handler = createServerRpc({
	id: "1eb8368d3119ffc8358a537e9fd3df705b7c75f5c845933580d706eb21503ada",
	name: "listScoresFn",
	filename: "src/server/scores.ts"
}, (opts) => listScoresFn.__executeServer(opts));
var listScoresFn = createServerFn({ method: "GET" }).handler(listScoresFn_createServerFn_handler, async () => {
	return (await (await getSql())`
      select
        s.student_name, s.book_id, b.name as book_name,
        s.completed_pages, s.time_ms, s.best_time_ms, s.runs, s.updated_at,
        (select count(*) from book_pages p where p.book_id = s.book_id) as page_count
      from student_scores s
      join books b on b.id = s.book_id
      order by s.updated_at desc
    `).map((r) => ({
		studentName: r.student_name,
		bookId: r.book_id,
		bookName: r.book_name,
		completedPages: Array.isArray(r.completed_pages) ? r.completed_pages : [],
		pageCount: Number(r.page_count) || 0,
		timeMs: r.time_ms,
		bestTimeMs: r.best_time_ms,
		runs: Number(r.runs) || 0,
		updatedAt: r.updated_at
	}));
});
//#endregion
export { listScoresFn_createServerFn_handler, recordScoreFn_createServerFn_handler };
