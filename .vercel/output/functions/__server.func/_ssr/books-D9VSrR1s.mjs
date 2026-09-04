import { t as createServerFn } from "./ssr.mjs";
import { n as getSql, t as createServerRpc } from "./db-C6EIAQY0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/books-D9VSrR1s.js
/** Every book with its pages in reading order. Unowned (no auth), demo-level. */
var listBooks_createServerFn_handler = createServerRpc({
	id: "dc9ab8f5b8f0a6c5592c674bb26a3df0d183aa99f6dfafe03455f08d43d8cf6f",
	name: "listBooks",
	filename: "src/server/books.ts"
}, (opts) => listBooks.__executeServer(opts));
var listBooks = createServerFn({ method: "GET" }).handler(listBooks_createServerFn_handler, async () => {
	const sql = await getSql();
	const books = await sql`select id, name, created_at from books order by created_at asc`;
	if (books.length === 0) return [];
	const pages = await sql`
    select id, book_id, position, created_at, payload
    from book_pages order by book_id, position asc
  `;
	const byBook = /* @__PURE__ */ new Map();
	for (const p of pages) {
		const list = byBook.get(p.book_id) ?? [];
		list.push({
			...p.payload,
			id: p.id
		});
		byBook.set(p.book_id, list);
	}
	return books.map((b) => ({
		id: b.id,
		name: b.name,
		createdAt: b.created_at,
		pages: byBook.get(b.id) ?? []
	}));
});
var createBookFn_createServerFn_handler = createServerRpc({
	id: "ed8d75948fc2dbca9d517706781e942beb2d7d087017f12371c2c8e6c01ee73b",
	name: "createBookFn",
	filename: "src/server/books.ts"
}, (opts) => createBookFn.__executeServer(opts));
var createBookFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.id !== "string" || !input.id) throw new Error("id required");
	if (typeof input?.name !== "string" || !input.name.trim()) throw new Error("name required");
	return {
		id: input.id,
		name: input.name.trim().slice(0, 120)
	};
}).handler(createBookFn_createServerFn_handler, async ({ data }) => {
	await (await getSql())`insert into books (id, name) values (${data.id}, ${data.name})`;
	return { id: data.id };
});
var upsertPageFn_createServerFn_handler = createServerRpc({
	id: "a78dbec5a49799062b773e387e2eec594d9881979012aababfd2675427de4944",
	name: "upsertPageFn",
	filename: "src/server/books.ts"
}, (opts) => upsertPageFn.__executeServer(opts));
var upsertPageFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	if (typeof input?.page?.id !== "string" || !input.page.id) throw new Error("page.id required");
	return input;
}).handler(upsertPageFn_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const existing = await sql`
      select position, created_at from book_pages where id = ${data.page.id}
    `;
	let position;
	if (existing[0]) position = existing[0].position;
	else position = ((await sql`
        select max(position) as m from book_pages where book_id = ${data.bookId}
      `)[0]?.m ?? -1) + 1;
	await sql`
      insert into book_pages (id, book_id, position, created_at, payload)
      values (
        ${data.page.id},
        ${data.bookId},
        ${position},
        ${existing[0]?.created_at ?? (/* @__PURE__ */ new Date()).toISOString()},
        ${JSON.stringify(data.page)}::jsonb
      )
      on conflict (id) do update set payload = ${JSON.stringify(data.page)}::jsonb, book_id = ${data.bookId}
    `;
	return { ok: true };
});
var setPageOrderFn_createServerFn_handler = createServerRpc({
	id: "4f5c83a10f806df29509af56a37f6a46ffb7a86c6708a06f1cb7e3b3bee0d426",
	name: "setPageOrderFn",
	filename: "src/server/books.ts"
}, (opts) => setPageOrderFn.__executeServer(opts));
var setPageOrderFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	if (!Array.isArray(input?.pageIds)) throw new Error("pageIds required");
	return {
		bookId: input.bookId,
		pageIds: input.pageIds.filter((x) => typeof x === "string")
	};
}).handler(setPageOrderFn_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	for (let i = 0; i < data.pageIds.length; i += 1) await sql`update book_pages set position = ${i} where id = ${data.pageIds[i]} and book_id = ${data.bookId}`;
	return { ok: true };
});
var removePageFn_createServerFn_handler = createServerRpc({
	id: "39f4e3f486628be25f601462385d1f4f199df88a5eeacafe4e3043aa8646b597",
	name: "removePageFn",
	filename: "src/server/books.ts"
}, (opts) => removePageFn.__executeServer(opts));
var removePageFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.pageId !== "string" || !input.pageId) throw new Error("pageId required");
	return { pageId: input.pageId };
}).handler(removePageFn_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from book_pages where id = ${data.pageId}`;
	return { ok: true };
});
var deleteBookFn_createServerFn_handler = createServerRpc({
	id: "a02958249d4648b3c5ada81d79934dc678211b2f898476e43d5b0be831cc7542",
	name: "deleteBookFn",
	filename: "src/server/books.ts"
}, (opts) => deleteBookFn.__executeServer(opts));
var deleteBookFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	return { bookId: input.bookId };
}).handler(deleteBookFn_createServerFn_handler, async ({ data }) => {
	await (await getSql())`delete from books where id = ${data.bookId}`;
	return { ok: true };
});
//#endregion
export { createBookFn_createServerFn_handler, deleteBookFn_createServerFn_handler, listBooks_createServerFn_handler, removePageFn_createServerFn_handler, setPageOrderFn_createServerFn_handler, upsertPageFn_createServerFn_handler };
