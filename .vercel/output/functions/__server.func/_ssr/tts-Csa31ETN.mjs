import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { r as cn } from "./router-CjzUIeb-.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tts-Csa31ETN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 btn-press", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg shadow-border hover:opacity-90",
			secondary: "bg-primary-soft text-primary hover:opacity-90",
			outline: "bg-surface text-fg shadow-border hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			danger: "bg-danger-soft text-danger hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-sm",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-sm border border-border bg-surface px-3 text-base text-fg shadow-border", "placeholder:text-subtle", "transition-[box-shadow,border-color] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35", "disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Every book with its pages in reading order. Unowned (no auth), demo-level. */
var listBooks = createServerFn({ method: "GET" }).handler(createSsrRpc("dc9ab8f5b8f0a6c5592c674bb26a3df0d183aa99f6dfafe03455f08d43d8cf6f"));
/** Create a book; returns the new book id. */
var createBookFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.id !== "string" || !input.id) throw new Error("id required");
	if (typeof input?.name !== "string" || !input.name.trim()) throw new Error("name required");
	return {
		id: input.id,
		name: input.name.trim().slice(0, 120)
	};
}).handler(createSsrRpc("ed8d75948fc2dbca9d517706781e942beb2d7d087017f12371c2c8e6c01ee73b"));
/**
* Insert or replace one page's snapshot, preserving its created_at and keeping
* it at its existing position (or appending). The position column is the page's
* order in the book.
*/
var upsertPageFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	if (typeof input?.page?.id !== "string" || !input.page.id) throw new Error("page.id required");
	return input;
}).handler(createSsrRpc("a78dbec5a49799062b773e387e2eec594d9881979012aababfd2675427de4944"));
/** Persist a full ordering of page ids for a book (position = array index). */
var setPageOrderFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	if (!Array.isArray(input?.pageIds)) throw new Error("pageIds required");
	return {
		bookId: input.bookId,
		pageIds: input.pageIds.filter((x) => typeof x === "string")
	};
}).handler(createSsrRpc("4f5c83a10f806df29509af56a37f6a46ffb7a86c6708a06f1cb7e3b3bee0d426"));
/** Remove a single page from its book. */
var removePageFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.pageId !== "string" || !input.pageId) throw new Error("pageId required");
	return { pageId: input.pageId };
}).handler(createSsrRpc("39f4e3f486628be25f601462385d1f4f199df88a5eeacafe4e3043aa8646b597"));
/** Remove one book (and its pages via cascade). Not a bulk delete. */
var deleteBookFn = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.bookId !== "string" || !input.bookId) throw new Error("bookId required");
	return { bookId: input.bookId };
}).handler(createSsrRpc("a02958249d4648b3c5ada81d79934dc678211b2f898476e43d5b0be831cc7542"));
/**
* Record a finished reading run: upsert the (student, book) row with the latest
* completion and times. Demo-level tracking — no login, name only.
*/
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
}).handler(createSsrRpc("c04377a4d984de961b21955fdfe7cb0b50ba1ffd9ba51aa2e9acab05b0110c7c"));
/** All recorded scores, newest first, joined with book names. Teacher view. */
var listScoresFn = createServerFn({ method: "GET" }).handler(createSsrRpc("1eb8368d3119ffc8358a537e9fd3df705b7c75f5c845933580d706eb21503ada"));
/** True once a shared teacher password has been set. */
var getTeacherStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("4f6d0050629100f17e6ad798c6dd96090c3b7f92fde95153896b47bf43c06733"));
/** Set the shared teacher password the first time only (no password exists yet). */
var setTeacherPassword = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.password !== "string" || input.password.trim().length < 4) throw new Error("Choose a password of at least 4 characters.");
	return { password: input.password.trim() };
}).handler(createSsrRpc("cee2d11779fc2bf39d94c5502b054f357ee042be15c1e8ab053600561356ed90"));
/** Verify the shared teacher password to unlock editing. */
var verifyTeacherPassword = createServerFn({ method: "POST" }).validator((input) => {
	if (typeof input?.password !== "string") throw new Error("Password required.");
	return { password: input.password };
}).handler(createSsrRpc("a68c30833b8ec422f1ef2f159d1f4a3d677a85476606e3aa7c69a9641d45f3b9"));
function fetchBooks() {
	return listBooks();
}
function apiCreateBook(id, name) {
	return createBookFn({ data: {
		id,
		name
	} });
}
function apiUpsertPage(bookId, page) {
	return upsertPageFn({ data: {
		bookId,
		page
	} });
}
function apiSetPageOrder(bookId, pageIds) {
	return setPageOrderFn({ data: {
		bookId,
		pageIds
	} });
}
function apiRemovePage(pageId) {
	return removePageFn({ data: { pageId } });
}
function apiDeleteBook(bookId) {
	return deleteBookFn({ data: { bookId } });
}
function fetchTeacherStatus() {
	return getTeacherStatus();
}
function apiSetTeacherPassword(password) {
	return setTeacherPassword({ data: { password } });
}
function apiVerifyTeacherPassword(password) {
	return verifyTeacherPassword({ data: { password } });
}
function fetchScores() {
	return listScoresFn();
}
function apiRecordScore(input) {
	return recordScoreFn({ data: input });
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight", {
	variants: { variant: {
		default: "bg-primary-soft text-primary",
		muted: "bg-bg-sunken text-muted",
		outline: "shadow-border text-muted",
		danger: "bg-danger-soft text-danger"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function cleanOcrText(raw) {
	const trimmed = raw.replace(/\s+/g, " ").trim();
	if (!trimmed) return "";
	return trimmed.replace(/^[^\p{L}\p{N}]+/u, "").replace(/[^\p{L}\p{N}'’-]+$/u, "").trim() || trimmed;
}
function tokenizeSentence(sentence) {
	return sentence.trim().split(/\s+/).map((t) => t.trim()).filter(Boolean);
}
function normalizeToken(value) {
	return (value.toLowerCase().match(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)*/gu)?.join("") ?? value.toLowerCase()).replace(/[’]/g, "'");
}
/** Cluster by Y, then left-to-right. Spread mode reads the left half fully, then the right. */
function sortReadingOrder(words, layout, pageWidth) {
	if (words.length === 0) return [];
	if (layout === "spread") {
		const mid = pageWidth / 2;
		const left = words.filter((w) => (w.bbox.x0 + w.bbox.x1) / 2 < mid);
		const right = words.filter((w) => (w.bbox.x0 + w.bbox.x1) / 2 >= mid);
		return [...sortLines(left), ...sortLines(right)];
	}
	return sortLines(words);
}
function sortLines(words) {
	if (words.length === 0) return [];
	const heights = words.map((w) => Math.max(1, w.bbox.y1 - w.bbox.y0)).sort((a, b) => a - b);
	const threshold = (heights[Math.floor(heights.length / 2)] ?? 24) * .65;
	const remaining = [...words].sort((a, b) => a.bbox.y0 - b.bbox.y0 || a.bbox.x0 - b.bbox.x0);
	const lines = [];
	for (const word of remaining) {
		const cy = (word.bbox.y0 + word.bbox.y1) / 2;
		let target;
		for (const line of lines) {
			const ly = line.reduce((sum, item) => sum + (item.bbox.y0 + item.bbox.y1) / 2, 0) / line.length;
			if (Math.abs(cy - ly) < threshold) {
				target = line;
				break;
			}
		}
		if (target) target.push(word);
		else lines.push([word]);
	}
	lines.sort((a, b) => {
		return a.reduce((sum, item) => sum + (item.bbox.y0 + item.bbox.y1) / 2, 0) / a.length - b.reduce((sum, item) => sum + (item.bbox.y0 + item.bbox.y1) / 2, 0) / b.length;
	});
	return lines.flatMap((line) => line.sort((a, b) => a.bbox.x0 - b.bbox.x0));
}
function getSpokenWordText(word) {
	const baseText = word.phonetic?.trim() || word.text;
	const raw = word.rawText?.trim();
	if (!raw) return baseText;
	const leadingPunct = raw.match(/^[^\p{L}\p{N}]+/u)?.[0] ?? "";
	const trailingPunct = raw.match(/[^\p{L}\p{N}'’-]+$/u)?.[0] ?? "";
	let result = baseText;
	if (leadingPunct && !result.startsWith(leadingPunct)) result = `${leadingPunct}${result}`;
	if (trailingPunct && !result.endsWith(trailingPunct)) result = `${result}${trailingPunct}`;
	return result;
}
function assembledSentence(words, layout, pageWidth) {
	return sortReadingOrder(words, layout, pageWidth).map((w) => getSpokenWordText(w)).join(" ").trim();
}
/**
* Build a spoken plan. Override text (if any) is the TTS source; detected boxes
* are matched by spelling so karaoke still lands on the page.
*/
function buildSpeechPlan(words, layout, pageWidth, sentenceOverride) {
	if (sentenceOverride && sentenceOverride.trim()) {
		const tokensIn = tokenizeSentence(sentenceOverride);
		const used = /* @__PURE__ */ new Set();
		const tokens = [];
		let cursor = 0;
		for (const raw of tokensIn) {
			const key = normalizeToken(raw);
			const match = words.find((w) => !used.has(w.id) && normalizeToken(w.text) === key);
			if (match) used.add(match.id);
			let speak;
			if (match?.phonetic?.trim()) {
				const leadingPunct = raw.match(/^[^\p{L}\p{N}]+/u)?.[0] ?? "";
				const trailingPunct = raw.match(/[^\p{L}\p{N}'’-]+$/u)?.[0] ?? "";
				let formatted = match.phonetic.trim();
				if (leadingPunct && !formatted.startsWith(leadingPunct)) formatted = `${leadingPunct}${formatted}`;
				if (trailingPunct && !formatted.endsWith(trailingPunct)) formatted = `${formatted}${trailingPunct}`;
				speak = formatted;
			} else speak = raw;
			const start = cursor;
			const end = start + speak.length;
			tokens.push({
				display: match?.text ?? cleanOcrText(raw),
				speak,
				wordId: match?.id ?? null,
				start,
				end
			});
			cursor = end + 1;
		}
		return {
			spoken: tokens.map((t) => t.speak).join(" "),
			tokens,
			displaySentence: tokensIn.join(" ")
		};
	}
	const ordered = sortReadingOrder(words, layout, pageWidth);
	const tokens = [];
	let cursor = 0;
	for (const word of ordered) {
		const speak = getSpokenWordText(word);
		const start = cursor;
		const end = start + speak.length;
		tokens.push({
			display: word.text,
			speak,
			wordId: word.id,
			start,
			end
		});
		cursor = end + 1;
	}
	return {
		spoken: tokens.map((t) => t.speak).join(" "),
		tokens,
		displaySentence: tokens.map((t) => t.speak).join(" ")
	};
}
function tokenAtChar(tokens, charIndex) {
	if (tokens.length === 0) return void 0;
	const hit = tokens.find((t) => charIndex >= t.start && charIndex < t.end);
	if (hit) return hit;
	for (let i = tokens.length - 1; i >= 0; i -= 1) {
		const token = tokens[i];
		if (token && charIndex >= token.start) return token;
	}
	return tokens[0];
}
function waitForVoices() {
	if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve([]);
	const existing = window.speechSynthesis.getVoices();
	if (existing.length > 0) return Promise.resolve(existing);
	return new Promise((resolve) => {
		const finish = () => resolve(window.speechSynthesis.getVoices());
		window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
		window.setTimeout(finish, 600);
	});
}
async function pickVoice() {
	const voices = await waitForVoices();
	return voices.filter((v) => /^en([-_]|$)/i.test(v.lang)).map((voice) => {
		let score = 0;
		if (/en-US/i.test(voice.lang)) score += 2;
		if (/Google|Natural|Premium|Neural|Samantha|Aria|Jenny/i.test(voice.name)) score += 3;
		if (voice.localService) score += 1;
		return {
			voice,
			score
		};
	}).sort((a, b) => b.score - a.score)[0]?.voice ?? voices[0] ?? null;
}
function estimateMs(text, rate) {
	const ms = Math.max(text.trim().length, 1) / 13 * (1e3 / rate);
	return Math.max(160, Math.min(2200, ms));
}
var active = null;
function cancelSpeech() {
	active?.cancel();
	active = null;
	if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
}
function canSpeak() {
	return typeof window !== "undefined" && "speechSynthesis" in window;
}
function speakText(text, options) {
	cancelSpeech();
	const spoken = text.trim();
	const rate = options?.rate ?? .5;
	let cancelled = false;
	const timeouts = [];
	let utterance = null;
	let settle;
	const done = new Promise((resolve) => {
		settle = resolve;
	});
	const finish = () => {
		for (const id of timeouts) window.clearTimeout(id);
		timeouts.length = 0;
		if (active && utterance && window.speechSynthesis) window.speechSynthesis.cancel();
		utterance = null;
		if (active?.cancel === cancel) active = null;
		settle?.();
		settle = void 0;
	};
	const cancel = () => {
		cancelled = true;
		finish();
	};
	active = { cancel };
	if (!spoken || !canSpeak()) {
		queueMicrotask(() => {
			if (!cancelled) finish();
		});
		return {
			cancel,
			done
		};
	}
	(async () => {
		if (cancelled) return;
		const voice = await pickVoice();
		if (cancelled) return;
		await new Promise((r) => window.setTimeout(r, 40));
		if (cancelled) return;
		const u = new SpeechSynthesisUtterance(spoken);
		u.rate = rate;
		u.pitch = 1;
		u.lang = voice?.lang || "en-US";
		if (voice) u.voice = voice;
		utterance = u;
		let usedEngineBoundaries = false;
		u.onboundary = (event) => {
			if (cancelled) return;
			if (event.name && event.name !== "word") return;
			usedEngineBoundaries = true;
			const index = event.charIndex ?? 0;
			options?.onBoundary?.(index);
			if (options?.tokens) {
				const token = tokenAtChar(options.tokens, index);
				if (token) options.onToken?.(token);
			}
		};
		u.onend = () => {
			if (!cancelled) finish();
		};
		u.onerror = () => {
			if (!cancelled) finish();
		};
		if (options?.tokens && options.tokens.length > 0) {
			let elapsed = 0;
			for (const token of options.tokens) {
				const startAt = elapsed;
				const id = window.setTimeout(() => {
					if (cancelled || usedEngineBoundaries) return;
					options.onToken?.(token);
				}, startAt);
				timeouts.push(id);
				elapsed += estimateMs(token.speak, rate);
			}
		}
		window.speechSynthesis.speak(u);
	})();
	return {
		cancel,
		done
	};
}
//#endregion
export { fetchBooks as _, apiDeleteBook as a, speakText as b, apiSetPageOrder as c, apiVerifyTeacherPassword as d, assembledSentence as f, cleanOcrText as g, cancelSpeech as h, apiCreateBook as i, apiSetTeacherPassword as l, canSpeak as m, Button as n, apiRecordScore as o, buildSpeechPlan as p, Input as r, apiRemovePage as s, Badge as t, apiUpsertPage as u, fetchScores as v, fetchTeacherStatus as y };
