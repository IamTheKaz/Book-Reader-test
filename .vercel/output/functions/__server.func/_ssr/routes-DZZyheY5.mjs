import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Square, c as LoaderCircle, d as ChevronUp, f as ChevronRight, g as ArrowLeft, h as BookOpen, i as Trash2, l as ListOrdered, m as Check, n as Volume2, o as Plus, p as ChevronDown, r as TriangleAlert, s as Play, t as X, u as ImagePlus } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as assetUrl, r as cn } from "./router-BHc8LRoY.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DZZyheY5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
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
var MAX_OCR_EDGE = 1800;
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		image.onload = () => resolve(image);
		image.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that image."));
		image.src = src;
	});
}
async function rasterForOcr(image) {
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
	return {
		canvas,
		scale,
		width,
		height
	};
}
function humanStatus(status) {
	if (status.includes("loading language") || status.includes("downloading")) return "Downloading the reading engine";
	if (status.includes("initializ")) return "Starting the reading engine";
	if (status.includes("recognizing")) return "Finding words on the page";
	if (status.includes("loading tesseract") || status.includes("loading core")) return "Loading the reading engine";
	return "Reading the page";
}
var workerPromise = null;
var progressHandler = null;
async function getWorker() {
	if (workerPromise) return workerPromise;
	workerPromise = (async () => {
		const { createWorker, PSM } = await import("../_libs/tesseract.js.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
		const worker = await createWorker("eng", 1, {
			workerPath: new URL(assetUrl("/tesseract-worker.min.js"), window.location.origin).href,
			corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1",
			langPath: "https://tessdata.projectnaptha.com/4.0.0",
			logger: (message) => {
				if (!progressHandler) return;
				const progress = typeof message.progress === "number" ? message.progress : 0;
				progressHandler({
					status: humanStatus(message.status),
					progress
				});
			},
			errorHandler: (error) => {
				console.error("OCR worker error", error);
			}
		});
		await worker.setParameters({
			tessedit_pageseg_mode: PSM.AUTO,
			preserve_interword_spaces: "1",
			user_defined_dpi: "150"
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
async function detectWords(src, onProgress) {
	progressHandler = onProgress ?? null;
	onProgress?.({
		status: "Opening the page image",
		progress: 0
	});
	const image = await loadImage(src);
	const width = image.naturalWidth || image.width;
	const height = image.naturalHeight || image.height;
	const prepared = await rasterForOcr(image);
	const result = await (await getWorker()).recognize(prepared.canvas);
	progressHandler = null;
	const scale = prepared.scale || 1;
	const words = [];
	for (const raw of result.data.words ?? []) {
		const rawText = (raw.text ?? "").trim();
		const text = cleanOcrText(rawText);
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
			rawText: rawText || text,
			phonetic: null,
			bbox: {
				x0,
				y0,
				x1,
				y1
			},
			confidence: raw.confidence,
			confirmed: false
		});
	}
	return {
		words,
		width,
		height
	};
}
var MAX_STORE_EDGE = 1600;
function fileToDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") resolve(reader.result);
			else reject(/* @__PURE__ */ new Error("Could not read that file."));
		};
		reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not read that file."));
		reader.readAsDataURL(file);
	}).then(async (original) => {
		try {
			const image = await loadImage(original);
			const width = image.naturalWidth || image.width;
			const height = image.naturalHeight || image.height;
			const scale = Math.min(1, MAX_STORE_EDGE / Math.max(width, height));
			if (scale >= 1 || width === 0 || height === 0) return original;
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(width * scale));
			canvas.height = Math.max(1, Math.round(height * scale));
			const ctx = canvas.getContext("2d");
			if (!ctx) return original;
			ctx.fillStyle = "#ffffff";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.imageSmoothingEnabled = true;
			ctx.imageSmoothingQuality = "high";
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
			return canvas.toDataURL("image/jpeg", .85);
		} catch {
			return original;
		}
	});
}
async function samplePageDataUrl() {
	const response = await fetch(assetUrl("/sample-page.png"));
	if (!response.ok) throw new Error("Sample page is missing.");
	const blob = await response.blob();
	return {
		src: await new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				if (typeof reader.result === "string") resolve(reader.result);
				else reject(/* @__PURE__ */ new Error("Could not load the sample page."));
			};
			reader.onerror = () => reject(/* @__PURE__ */ new Error("Could not load the sample page."));
			reader.readAsDataURL(blob);
		}),
		name: "sample-page.png"
	};
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
function createBook(name) {
	return {
		id: crypto.randomUUID(),
		name: name.trim(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		pages: []
	};
}
function bookStats(book) {
	const approved = book.pages.filter((p) => p.approved).length;
	return {
		pages: book.pages.length,
		approved,
		drafts: book.pages.length - approved
	};
}
/** Insert or replace a page by id, preserving its original createdAt. */
function upsertBookPage(book, page) {
	const index = book.pages.findIndex((p) => p.id === page.id);
	if (index === -1) return {
		...book,
		pages: [...book.pages, page]
	};
	const pages = [...book.pages];
	pages[index] = {
		...page,
		createdAt: pages[index].createdAt
	};
	return {
		...book,
		pages
	};
}
/** Move a page one step earlier (-1) or later (+1). No-op at the edges. */
function moveBookPage(book, pageId, direction) {
	const index = book.pages.findIndex((p) => p.id === pageId);
	const target = index + direction;
	if (index === -1 || target < 0 || target >= book.pages.length) return book;
	const pages = [...book.pages];
	const [page] = pages.splice(index, 1);
	pages.splice(target, 0, page);
	return {
		...book,
		pages
	};
}
function removeBookPage(book, pageId) {
	return {
		...book,
		pages: book.pages.filter((p) => p.id !== pageId)
	};
}
function pagePosition(book, pageId) {
	return book.pages.findIndex((p) => p.id === pageId);
}
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function parsePage(value) {
	if (!isRecord(value)) return null;
	if (typeof value.id !== "string" || !isRecord(value.image)) return null;
	if (typeof value.image.src !== "string" || typeof value.image.name !== "string") return null;
	if (!Array.isArray(value.words)) return null;
	return {
		id: value.id,
		createdAt: typeof value.createdAt === "string" ? value.createdAt : (/* @__PURE__ */ new Date(0)).toISOString(),
		image: {
			name: value.image.name,
			src: value.image.src,
			width: typeof value.image.width === "number" ? value.image.width : 0,
			height: typeof value.image.height === "number" ? value.image.height : 0
		},
		words: value.words,
		layout: value.layout === "spread" ? "spread" : "single",
		sentenceOverride: typeof value.sentenceOverride === "string" ? value.sentenceOverride : null,
		hasPreviewed: Boolean(value.hasPreviewed),
		approved: Boolean(value.approved),
		approvedAt: typeof value.approvedAt === "string" ? value.approvedAt : null
	};
}
function parseBooks(raw) {
	if (!raw) return [];
	try {
		const value = JSON.parse(raw);
		if (!Array.isArray(value)) return [];
		const books = [];
		for (const item of value) {
			if (!isRecord(item)) continue;
			if (typeof item.id !== "string" || typeof item.name !== "string") continue;
			const pages = (Array.isArray(item.pages) ? item.pages : []).map(parsePage).filter((p) => p !== null);
			books.push({
				id: item.id,
				name: item.name,
				createdAt: typeof item.createdAt === "string" ? item.createdAt : (/* @__PURE__ */ new Date(0)).toISOString(),
				pages
			});
		}
		return books;
	} catch {
		return [];
	}
}
function serializeBooks(books) {
	return JSON.stringify(books);
}
var STORAGE_KEY = "page-aloud:books:v1";
var SAVE_DEBOUNCE_MS = 400;
var saveTimer = null;
function writeBooks(books) {
	try {
		window.localStorage.setItem(STORAGE_KEY, serializeBooks(books));
		return null;
	} catch {
		return "This browser's local storage is full — the latest changes may not survive a reload.";
	}
}
/** Debounce writes: word-by-word edits sync on every keystroke. */
function schedulePersist(set, books) {
	if (typeof window === "undefined") return;
	if (saveTimer) clearTimeout(saveTimer);
	saveTimer = setTimeout(() => {
		saveTimer = null;
		set({ persistError: writeBooks(books) });
	}, SAVE_DEBOUNCE_MS);
}
function persistNow(books) {
	if (saveTimer) {
		clearTimeout(saveTimer);
		saveTimer = null;
	}
	if (typeof window === "undefined") return null;
	return writeBooks(books);
}
var useBookStore = create((set, get) => ({
	books: [],
	hydrated: false,
	persistError: null,
	activeBookId: null,
	hydrate: () => {
		if (get().hydrated || typeof window === "undefined") return;
		set({
			books: parseBooks(window.localStorage.getItem(STORAGE_KEY)),
			hydrated: true
		});
	},
	createBook: (name) => {
		const book = createBook(name);
		const books = [...get().books, book];
		set({
			books,
			activeBookId: book.id,
			persistError: persistNow(books)
		});
		return book.id;
	},
	deleteBook: (id) => {
		const books = get().books.filter((b) => b.id !== id);
		set({
			books,
			activeBookId: get().activeBookId === id ? null : get().activeBookId,
			persistError: persistNow(books)
		});
	},
	openBook: (id) => {
		if (get().books.some((b) => b.id === id)) set({ activeBookId: id });
	},
	closeBook: () => set({ activeBookId: null }),
	upsertPage: (bookId, page) => {
		const books = get().books.map((b) => b.id === bookId ? upsertBookPage(b, page) : b);
		set({ books });
		schedulePersist(set, books);
	},
	movePage: (bookId, pageId, direction) => {
		const books = get().books.map((b) => b.id === bookId ? moveBookPage(b, pageId, direction) : b);
		set({
			books,
			persistError: persistNow(books)
		});
	},
	removePage: (bookId, pageId) => {
		const books = get().books.map((b) => b.id === bookId ? removeBookPage(b, pageId) : b);
		set({
			books,
			persistError: persistNow(books)
		});
	}
}));
function useActiveBook() {
	return useBookStore((s) => s.books.find((b) => b.id === s.activeBookId) ?? null);
}
/** Flush any pending debounced save; used when the tab is hidden/closed. */
function flushBookPersistence() {
	const { books } = useBookStore.getState();
	if (books.length === 0 && saveTimer === null) return;
	const error = persistNow(books);
	if (error) useBookStore.setState({ persistError: error });
}
if (typeof window !== "undefined") {
	window.addEventListener("beforeunload", flushBookPersistence);
	document.addEventListener("visibilitychange", () => {
		if (document.visibilityState === "hidden") flushBookPersistence();
	});
}
var idleOcr = {
	status: "idle",
	progress: 0,
	message: ""
};
/** Give the upcoming upload a page id so it syncs into the active book. */
function mintPageIdForBook(get, set) {
	if (get().bookId && !get().pageId) set({ pageId: crypto.randomUUID() });
}
function touchAfterEdit(set) {
	set({
		approved: false,
		approvedAt: null
	});
}
async function runOcr(src, name, set) {
	cancelSpeech();
	set({
		image: {
			name,
			src,
			width: 0,
			height: 0
		},
		words: [],
		sentenceOverride: null,
		selectedId: null,
		editorMode: "spelling",
		showOrderEditor: false,
		orderDraft: "",
		ocr: {
			status: "running",
			progress: .02,
			message: "Opening the page image"
		},
		playback: {
			kind: "idle",
			wordId: null
		},
		hasPreviewed: false,
		approved: false,
		approvedAt: null,
		ttsAvailable: canSpeak()
	});
	try {
		const result = await detectWords(src, (info) => {
			set({ ocr: {
				status: "running",
				progress: Math.max(.04, Math.min(.98, info.progress || .04)),
				message: info.status
			} });
		});
		set({
			image: {
				name,
				src,
				width: result.width,
				height: result.height
			},
			words: result.words,
			ocr: {
				status: "done",
				progress: 1,
				message: result.words.length === 0 ? "No words found — try a clearer photo" : `Found ${result.words.length} word${result.words.length === 1 ? "" : "s"}`
			}
		});
	} catch (error) {
		set({ ocr: {
			status: "error",
			progress: 0,
			message: error instanceof Error ? error.message : "Could not read this page."
		} });
	}
}
var usePageStore = create((set, get) => ({
	image: null,
	words: [],
	layout: "single",
	sentenceOverride: null,
	bookId: null,
	pageId: null,
	selectedId: null,
	editorMode: "spelling",
	showOrderEditor: false,
	orderDraft: "",
	ocr: idleOcr,
	playback: {
		kind: "idle",
		wordId: null
	},
	hasPreviewed: false,
	approved: false,
	approvedAt: null,
	ttsAvailable: true,
	loadFile: async (file) => {
		mintPageIdForBook(get, set);
		await runOcr(await fileToDataUrl(file), file.name || "page.png", set);
	},
	loadSample: async () => {
		mintPageIdForBook(get, set);
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
			bookId: null,
			pageId: null,
			selectedId: null,
			editorMode: "spelling",
			showOrderEditor: false,
			orderDraft: "",
			ocr: idleOcr,
			playback: {
				kind: "idle",
				wordId: null
			},
			hasPreviewed: false,
			approved: false,
			approvedAt: null
		});
	},
	beginBookPage: (bookId) => {
		cancelSpeech();
		set({
			image: null,
			words: [],
			layout: "single",
			sentenceOverride: null,
			bookId,
			pageId: null,
			selectedId: null,
			editorMode: "spelling",
			showOrderEditor: false,
			orderDraft: "",
			ocr: idleOcr,
			playback: {
				kind: "idle",
				wordId: null
			},
			hasPreviewed: false,
			approved: false,
			approvedAt: null
		});
	},
	openBookPage: (bookId, pageId) => {
		const page = useBookStore.getState().books.find((b) => b.id === bookId)?.pages.find((p) => p.id === pageId);
		if (!page) return;
		cancelSpeech();
		set({
			image: page.image,
			words: page.words,
			layout: page.layout,
			sentenceOverride: page.sentenceOverride,
			bookId,
			pageId,
			selectedId: null,
			editorMode: "spelling",
			showOrderEditor: false,
			orderDraft: "",
			ocr: {
				status: "done",
				progress: 1,
				message: page.words.length === 0 ? "No words found — try a clearer photo" : `Found ${page.words.length} word${page.words.length === 1 ? "" : "s"}`
			},
			playback: {
				kind: "idle",
				wordId: null
			},
			hasPreviewed: page.hasPreviewed,
			approved: page.approved,
			approvedAt: page.approvedAt,
			ttsAvailable: canSpeak()
		});
	},
	setLayout: (layout) => {
		const { sentenceOverride, words, image } = get();
		touchAfterEdit(set);
		set({
			layout,
			hasPreviewed: false,
			orderDraft: sentenceOverride ?? (image ? assembledSentence(words, layout, image.width) : "")
		});
	},
	selectWord: (id, play = true) => {
		if (!id) {
			set({ selectedId: null });
			return;
		}
		set({
			selectedId: id,
			editorMode: "spelling",
			showOrderEditor: false
		});
		if (play) get().playWord(id);
	},
	setEditorMode: (mode) => set({ editorMode: mode }),
	updateSpelling: (id, text) => {
		set({
			words: get().words.map((w) => w.id === id ? {
				...w,
				text
			} : w),
			approved: false,
			approvedAt: null
		});
	},
	confirmWord: (id) => {
		set({
			words: get().words.map((w) => w.id === id ? {
				...w,
				text: w.text.trim() || w.text,
				confirmed: true
			} : w),
			approved: false,
			approvedAt: null
		});
	},
	confirmRemaining: () => {
		set({
			words: get().words.map((w) => ({
				...w,
				confirmed: true
			})),
			approved: false,
			approvedAt: null
		});
	},
	setPhonetic: (id, phonetic) => {
		const next = phonetic?.trim() ? phonetic.trim() : null;
		set({
			words: get().words.map((w) => w.id === id ? {
				...w,
				phonetic: next
			} : w),
			approved: false,
			approvedAt: null
		});
	},
	playWord: (id) => {
		const word = get().words.find((w) => w.id === id);
		if (!word) return;
		const text = word.phonetic?.trim() || word.text;
		set({ playback: {
			kind: "word",
			wordId: id
		} });
		speakText(text, { rate: .5 }).done.then(() => {
			const current = get().playback;
			if (current.kind === "word" && current.wordId === id) set({ playback: {
				kind: "idle",
				wordId: null
			} });
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
			playback: {
				kind: "sentence",
				wordId: plan.tokens[0]?.wordId ?? null
			},
			hasPreviewed: true
		});
		speakText(plan.spoken, {
			rate: .5,
			tokens: plan.tokens,
			onToken: (token) => {
				if (get().playback.kind !== "sentence") return;
				set({ playback: {
					kind: "sentence",
					wordId: token.wordId
				} });
			}
		}).done.then(() => {
			if (get().playback.kind === "sentence") set({ playback: {
				kind: "idle",
				wordId: null
			} });
		});
	},
	stopPlayback: () => {
		cancelSpeech();
		set({ playback: {
			kind: "idle",
			wordId: null
		} });
	},
	setShowOrderEditor: (open) => {
		const { words, layout, image, sentenceOverride } = get();
		if (open) {
			get().stopPlayback();
			set({
				showOrderEditor: true,
				selectedId: null,
				orderDraft: sentenceOverride ?? (image ? assembledSentence(words, layout, image.width) : "")
			});
		} else set({ showOrderEditor: false });
	},
	setOrderDraft: (value) => set({ orderDraft: value }),
	applyReadingOrder: () => {
		const draft = get().orderDraft.trim();
		set({
			sentenceOverride: draft || null,
			showOrderEditor: false,
			approved: false,
			approvedAt: null,
			hasPreviewed: false
		});
		if (draft) queueMicrotask(() => get().previewSentence());
	},
	clearReadingOrder: () => {
		const { words, layout, image } = get();
		set({
			sentenceOverride: null,
			orderDraft: image ? assembledSentence(words, layout, image.width) : "",
			approved: false,
			approvedAt: null,
			hasPreviewed: false
		});
	},
	approve: () => {
		const { image, words, hasPreviewed } = get();
		if (!image || words.length === 0 || !hasPreviewed) return;
		get().stopPlayback();
		set({
			approved: true,
			approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
			selectedId: null,
			showOrderEditor: false
		});
	}
}));
/**
* Keep the active book's copy of the page in sync with the editor. Any change
* to the persisted fields (image, words, layout, sentence, preview, approval)
* upserts a snapshot into the book store, which persists it to localStorage.
* Books stay usable in any partial state — no save step, no completion gate.
*/
usePageStore.subscribe((state, prev) => {
	const { bookId, pageId } = state;
	if (!bookId || !pageId || !state.image) return;
	if (state.image === prev.image && state.words === prev.words && state.layout === prev.layout && state.sentenceOverride === prev.sentenceOverride && state.hasPreviewed === prev.hasPreviewed && state.approved === prev.approved && state.approvedAt === prev.approvedAt) return;
	const books = useBookStore.getState();
	if (!books.books.some((b) => b.id === bookId)) return;
	books.upsertPage(bookId, {
		id: pageId,
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		image: state.image,
		words: state.words,
		layout: state.layout,
		sentenceOverride: state.sentenceOverride,
		hasPreviewed: state.hasPreviewed,
		approved: state.approved,
		approvedAt: state.approvedAt
	});
});
function WordPopover({ word }) {
	const editorMode = usePageStore((s) => s.editorMode);
	const playback = usePageStore((s) => s.playback);
	const setEditorMode = usePageStore((s) => s.setEditorMode);
	const updateSpelling = usePageStore((s) => s.updateSpelling);
	const confirmWord = usePageStore((s) => s.confirmWord);
	const setPhonetic = usePageStore((s) => s.setPhonetic);
	const playWord = usePageStore((s) => s.playWord);
	const spellingRef = (0, import_react.useRef)(null);
	const soundRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handle = window.setTimeout(() => {
			if (editorMode === "spelling") spellingRef.current?.focus();
			else soundRef.current?.focus();
		}, 30);
		return () => window.clearTimeout(handle);
	}, [editorMode, word.id]);
	const playingThis = playback.kind !== "idle" && playback.wordId === word.id;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-[min(18.5rem,calc(100vw-2rem))] rounded-lg bg-surface p-3 shadow-border",
		onPointerDown: (event) => event.stopPropagation(),
		role: "dialog",
		"aria-label": editorMode === "spelling" ? "Fix spelling" : "Fix pronunciation",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeSwitch, {
				mode: editorMode,
				onChange: setEditorMode
			}),
			editorMode === "spelling" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "On-page spelling"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						ref: spellingRef,
						value: word.text,
						"aria-label": "Word spelling",
						onChange: (event) => updateSpelling(word.id, event.target.value),
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								confirmWord(word.id);
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "w-full",
						size: "sm",
						onClick: () => confirmWord(word.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), word.confirmed ? "Spelling saved" : "Save spelling"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 space-y-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium text-muted",
						children: "How it should sound"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						ref: soundRef,
						value: word.phonetic ?? "",
						placeholder: `e.g. a respelling of “${word.text}”`,
						"aria-label": "Phonetic respelling",
						onChange: (event) => setPhonetic(word.id, event.target.value),
						onKeyDown: (event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								playWord(word.id);
							}
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs leading-snug text-subtle",
						children: [
							"Display stays “",
							word.text,
							"”. Only the spoken audio changes."
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "mt-3 w-full",
				onClick: () => playWord(word.id),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {}), playingThis ? "Playing…" : editorMode === "pronunciation" ? "Play sound" : "Play this word"]
			})
		]
	});
}
function ModeSwitch({ mode, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 rounded-sm bg-bg-sunken p-1",
		role: "tablist",
		"aria-label": "What to fix",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeTab, {
			active: mode === "spelling",
			onClick: () => onChange("spelling"),
			label: "Spelling"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModeTab, {
			active: mode === "pronunciation",
			onClick: () => onChange("pronunciation"),
			label: "Sound"
		})]
	});
}
function ModeTab({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		role: "tab",
		"aria-selected": active,
		onClick,
		className: cn("h-8 rounded-xs text-xs font-medium transition-[background-color,color,box-shadow] duration-150 ease-out", active ? "bg-surface text-fg shadow-border" : "text-muted hover:text-fg"),
		children: label
	});
}
function PageCanvas() {
	const image = usePageStore((s) => s.image);
	const words = usePageStore((s) => s.words);
	const ocr = usePageStore((s) => s.ocr);
	const selectedId = usePageStore((s) => s.selectedId);
	const playback = usePageStore((s) => s.playback);
	const editorMode = usePageStore((s) => s.editorMode);
	const selectWord = usePageStore((s) => s.selectWord);
	const selected = (0, import_react.useMemo)(() => words.find((w) => w.id === selectedId) ?? null, [words, selectedId]);
	if (!image) return null;
	const running = ocr.status === "running";
	const popoverBelow = selected ? selected.bbox.y1 < image.height * .62 : true;
	const popoverStyle = selected ? {
		left: `${Math.min(58, Math.max(1, selected.bbox.x0 / image.width * 100))}%`,
		top: popoverBelow ? `${selected.bbox.y1 / image.height * 100}%` : `${selected.bbox.y0 / image.height * 100}%`,
		transform: popoverBelow ? "translateY(8px)" : "translateY(calc(-100% - 8px))"
	} : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative inline-block max-w-full touch-manipulation select-none",
			onPointerDown: () => {
				if (!running) selectWord(null, false);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: image.src,
					alt: image.name,
					className: "block h-auto max-h-[min(72vh,760px)] w-auto max-w-full rounded-md bg-surface-2",
					draggable: false
				}),
				image.width > 0 && words.map((word) => {
					const left = word.bbox.x0 / image.width * 100;
					const top = word.bbox.y0 / image.height * 100;
					const width = (word.bbox.x1 - word.bbox.x0) / image.width * 100;
					const height = (word.bbox.y1 - word.bbox.y0) / image.height * 100;
					const selectedBox = word.id === selectedId;
					const karaoke = playback.kind === "sentence" && playback.wordId === word.id;
					const wordPlay = playback.kind === "word" && playback.wordId === word.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "word-box min-h-4 min-w-4",
						style: {
							left: `${left}%`,
							top: `${top}%`,
							width: `${width}%`,
							height: `${height}%`
						},
						"data-confirmed": word.confirmed ? "true" : "false",
						"data-selected": selectedBox ? "true" : "false",
						"data-karaoke": karaoke || wordPlay ? "true" : "false",
						"aria-label": `Word: ${word.text}`,
						onPointerDown: (event) => {
							event.stopPropagation();
							selectWord(word.id, true);
						}
					}, word.id);
				}),
				selected && image.width > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-0 z-30 bg-fg/30 sm:hidden",
					onPointerDown: () => selectWord(null, false),
					"aria-hidden": "true"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "fixed inset-x-0 bottom-0 z-40 max-h-[82dvh] overflow-y-auto p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:contents",
					onPointerDown: (event) => event.stopPropagation(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "sm:absolute sm:z-20 sm:w-[min(18.5rem,calc(100%-0.5rem))]",
						style: popoverStyle,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WordPopover, { word: selected })
					})
				})] }),
				running && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center justify-center rounded-md bg-fg/40",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mx-4 w-72 rounded-lg bg-surface p-4 shadow-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin text-primary" }), ocr.message || "Reading the page"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 h-1.5 overflow-hidden rounded-full bg-bg-sunken",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full bg-primary transition-[width] duration-200 ease-out",
									style: { width: `${Math.round(ocr.progress * 100)}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "First run downloads the reading engine."
							})
						]
					})
				})
			]
		}), selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: editorMode === "pronunciation" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Fixing ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-fg",
					children: "pronunciation"
				}),
				" for “",
				selected.text,
				"”. Spelling on the page stays the same."
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"Fixing ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium text-fg",
					children: "spelling"
				}),
				" for this word. Tap Sound if it is spelled right but spoken wrong."
			] })
		})]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-28 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-base text-fg shadow-border", "placeholder:text-subtle", "transition-[box-shadow,border-color] duration-150 ease-out", "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35", "disabled:cursor-not-allowed disabled:opacity-50", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function ReviewSidebar() {
	const image = usePageStore((s) => s.image);
	const words = usePageStore((s) => s.words);
	const layout = usePageStore((s) => s.layout);
	const setLayout = usePageStore((s) => s.setLayout);
	const sentenceOverride = usePageStore((s) => s.sentenceOverride);
	const showOrderEditor = usePageStore((s) => s.showOrderEditor);
	const setShowOrderEditor = usePageStore((s) => s.setShowOrderEditor);
	const orderDraft = usePageStore((s) => s.orderDraft);
	const setOrderDraft = usePageStore((s) => s.setOrderDraft);
	const applyReadingOrder = usePageStore((s) => s.applyReadingOrder);
	const clearReadingOrder = usePageStore((s) => s.clearReadingOrder);
	const confirmRemaining = usePageStore((s) => s.confirmRemaining);
	const previewSentence = usePageStore((s) => s.previewSentence);
	const stopPlayback = usePageStore((s) => s.stopPlayback);
	const playback = usePageStore((s) => s.playback);
	const hasPreviewed = usePageStore((s) => s.hasPreviewed);
	const approved = usePageStore((s) => s.approved);
	const approve = usePageStore((s) => s.approve);
	const beginBookPage = usePageStore((s) => s.beginBookPage);
	const ocr = usePageStore((s) => s.ocr);
	const ttsAvailable = usePageStore((s) => s.ttsAvailable);
	const activeBook = useActiveBook();
	if (!image) return null;
	const confirmed = words.filter((w) => w.confirmed).length;
	const playingSentence = playback.kind === "sentence";
	const plan = buildSpeechPlan(words, layout, image.width, sentenceOverride);
	const autoSentence = assembledSentence(words, layout, image.width);
	const ready = words.length > 0 && ocr.status === "done";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-medium tracking-tight",
							children: "Review"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: words.length === 0 ? ocr.status === "error" ? ocr.message : "Waiting for words on the page." : `${confirmed} of ${words.length} words saved`
						})] }), approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Approved" }) : hasPreviewed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							children: "Previewed"
						}) : null]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-2 rounded-sm bg-bg-sunken p-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-9 rounded-xs text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out", layout === "single" ? "bg-surface text-fg shadow-border" : "text-muted"),
							onClick: () => setLayout("single"),
							children: "Single page"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: cn("h-9 rounded-xs text-sm font-medium transition-[background-color,color,box-shadow] duration-150 ease-out", layout === "spread" ? "bg-surface text-fg shadow-border" : "text-muted"),
							onClick: () => setLayout("spread"),
							children: "Two-page spread"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-md bg-bg-sunken px-3 py-2 text-sm leading-relaxed text-fg",
						children: plan.displaySentence || "No sentence yet."
					}),
					sentenceOverride ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Using your retyped reading order as the TTS source."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-muted",
						children: [
							"Auto order is top-to-bottom, then left-to-right",
							layout === "spread" ? ", left page then right page" : "",
							"."
						]
					}),
					!ttsAvailable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-danger",
						children: "This browser has no speech engine. Preview highlighting still runs."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-2",
						children: [
							playingSentence ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: stopPlayback,
								variant: "secondary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}), "Stop preview"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: previewSentence,
								disabled: !ready,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), "Preview narration"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: showOrderEditor ? "secondary" : "outline",
								onClick: () => setShowOrderEditor(!showOrderEditor),
								disabled: !ready,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListOrdered, {}), "Fix reading order"]
							}),
							confirmed < words.length && words.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: confirmRemaining,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), "Save remaining spellings"]
							})
						]
					})
				]
			}),
			showOrderEditor && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-lg font-medium tracking-tight",
							children: "Reading order"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: "Whole sentence"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Retype the sentence in the order it should be read. Words are matched back to boxes by spelling. Unmatched words still play, without a highlight."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "mt-3",
						value: orderDraft,
						onChange: (event) => setOrderDraft(event.target.value),
						"aria-label": "Correct full sentence"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: applyReadingOrder,
							disabled: !orderDraft.trim(),
							children: "Use this order"
						}), sentenceOverride && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: clearReadingOrder,
							children: "Restore auto order"
						})]
					}),
					autoSentence && sentenceOverride && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: ["Auto order was: ", autoSentence]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-medium tracking-tight",
						children: "Approve page"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Marks this page final once the full read-aloud sounds right."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3 w-full",
						onClick: approve,
						disabled: !ready || !hasPreviewed || approved,
						children: approved ? "Page approved" : "Approve page"
					}),
					!hasPreviewed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Preview the narration at least once before approving."
					}),
					approved && activeBook && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						className: "mt-2 w-full",
						onClick: () => beginBookPage(activeBook.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add next page"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "flex items-start gap-2 text-xs text-subtle",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "mt-0.5 size-3.5 shrink-0" }), "Tap a word on the page to hear it alone and fix spelling or sound. Use Preview narration for the full sentence in context."]
			})
		]
	});
}
function UploadPanel() {
	const inputRef = (0, import_react.useRef)(null);
	const loadFile = usePageStore((s) => s.loadFile);
	const loadSample = usePageStore((s) => s.loadSample);
	const ocr = usePageStore((s) => s.ocr);
	const activeBook = useActiveBook();
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(null);
	async function onFile(file) {
		if (!file || !file.type.startsWith("image/")) return;
		setBusy("file");
		try {
			await loadFile(file);
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex w-full max-w-xl flex-col items-stretch gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("rounded-2xl bg-surface p-3 shadow-border transition-[box-shadow,background-color] duration-200 ease-out", dragOver && "bg-primary-soft"),
			onDragOver: (event) => {
				event.preventDefault();
				setDragOver(true);
			},
			onDragLeave: () => setDragOver(false),
			onDrop: (event) => {
				event.preventDefault();
				setDragOver(false);
				onFile(event.dataTransfer.files[0]);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-56 w-full flex-col items-center justify-center rounded-xl bg-bg-sunken px-6 py-10 text-center",
				onClick: () => inputRef.current?.click(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-12 items-center justify-center rounded-lg bg-surface text-primary shadow-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-4 font-display text-2xl font-medium tracking-tight",
						children: activeBook ? `Add a page to “${activeBook.name}”` : "Upload a book page"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-2 max-w-sm text-sm text-muted",
						children: activeBook ? "A photo of one page or a two-page spread. It lands at the end of the book — you can reorder pages afterwards." : "A photo of one page or a two-page spread. Words are detected automatically and laid on the image."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-5 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-fg",
						children: "Choose image"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				accept: "image/*",
				className: "sr-only",
				onChange: (event) => {
					onFile(event.target.files?.[0]);
					event.target.value = "";
				}
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			className: "w-full",
			disabled: busy !== null || ocr.status === "running",
			onClick: () => {
				setBusy("sample");
				loadSample().finally(() => setBusy(null));
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {}), busy === "sample" ? "Loading sample…" : "Try a sample page"]
		})]
	});
}
function BookView({ book }) {
	const image = usePageStore((s) => s.image);
	const words = usePageStore((s) => s.words);
	const editorBookId = usePageStore((s) => s.bookId);
	const editorPageId = usePageStore((s) => s.pageId);
	const ocr = usePageStore((s) => s.ocr);
	const beginBookPage = usePageStore((s) => s.beginBookPage);
	const openBookPage = usePageStore((s) => s.openBookPage);
	const resetEditor = usePageStore((s) => s.reset);
	const closeBook = useBookStore((s) => s.closeBook);
	const movePage = useBookStore((s) => s.movePage);
	const removePage = useBookStore((s) => s.removePage);
	const stats = bookStats(book);
	const ocrRunning = ocr.status === "running";
	const editorOpen = image !== null && editorBookId === book.id;
	const currentIndex = editorPageId ? pagePosition(book, editorPageId) : -1;
	function handleBack() {
		resetEditor();
		closeBook();
	}
	function handleRemovePage(pageId, index) {
		if (!window.confirm(`Remove page ${index + 1} from “${book.name}”?`)) return;
		if (editorPageId === pageId) beginBookPage(book.id);
		removePage(book.id, pageId);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-2xl bg-surface p-4 shadow-border sm:p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: handleBack,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "All books"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 basis-full order-last sm:order-none sm:basis-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-xl font-medium tracking-tight sm:text-2xl",
							children: book.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									children: [
										stats.pages,
										" page",
										stats.pages === 1 ? "" : "s"
									]
								}),
								stats.approved > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [stats.approved, " approved"] }),
								stats.drafts > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "muted",
									children: [
										stats.drafts,
										" draft",
										stats.drafts === 1 ? "" : "s"
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => beginBookPage(book.id),
						disabled: ocrRunning,
						size: "sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Add page"]
					})
				]
			}), book.pages.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-4 flex gap-3 overflow-x-auto pb-1",
				"aria-label": "Pages in reading order",
				children: book.pages.map((page, index) => {
					const active = editorOpen && editorPageId === page.id;
					const reading = ocrRunning && editorPageId === page.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: cn("flex w-32 shrink-0 flex-col rounded-lg bg-bg-sunken p-2 transition-shadow sm:w-28", active && "shadow-[0_0_0_2px_var(--color-primary)]"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "group relative text-left",
							onClick: () => openBookPage(book.id, page.id),
							disabled: ocrRunning,
							"aria-label": `Open page ${index + 1}`,
							"aria-current": active ? "true" : void 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "relative block overflow-hidden rounded-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: page.image.src,
									alt: page.image.name,
									className: "h-24 w-full rounded-sm object-cover",
									draggable: false
								}), reading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-0 flex items-center justify-center bg-fg/40 text-primary-fg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "mt-1.5 flex items-center justify-between gap-1 text-xs font-medium",
								children: [
									"Page ",
									index + 1,
									page.approved ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "px-1.5 py-0 text-[10px]",
										children: "Approved"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "muted",
										className: "px-1.5 py-0 text-[10px]",
										children: "Draft"
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex items-center justify-between border-t border-border pt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex size-8 items-center justify-center rounded-xs text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30",
									"aria-label": `Move page ${index + 1} earlier`,
									disabled: index === 0 || ocrRunning,
									onClick: () => movePage(book.id, page.id, -1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "size-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "flex size-8 items-center justify-center rounded-xs text-muted transition-colors hover:bg-surface hover:text-fg disabled:opacity-30",
									"aria-label": `Move page ${index + 1} later`,
									disabled: index === book.pages.length - 1 || ocrRunning,
									onClick: () => movePage(book.id, page.id, 1),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex size-8 items-center justify-center rounded-xs text-subtle transition-colors hover:bg-danger-soft hover:text-danger",
								"aria-label": `Remove page ${index + 1}`,
								onClick: () => handleRemovePage(page.id, index),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
							})]
						})]
					}, page.id);
				})
			})]
		}), editorOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(20rem,22rem)] lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-x-auto rounded-2xl bg-surface p-3 shadow-border sm:p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageCanvas, {}),
					ocr.status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-danger",
						children: ocr.message
					}),
					ocr.status === "done" && words.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "Nothing readable was found. Try a sharper photo with higher contrast."
					}),
					ocr.status === "done" && currentIndex !== -1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-subtle",
						children: [
							"Page ",
							currentIndex + 1,
							" of ",
							book.pages.length,
							" — changes save to the book automatically."
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReviewSidebar, {})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto w-full max-w-2xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadPanel, {})
		})]
	});
}
function LibraryView() {
	const books = useBookStore((s) => s.books);
	const hydrated = useBookStore((s) => s.hydrated);
	const persistError = useBookStore((s) => s.persistError);
	const createBook = useBookStore((s) => s.createBook);
	const deleteBook = useBookStore((s) => s.deleteBook);
	const openBook = useBookStore((s) => s.openBook);
	const editorBookId = usePageStore((s) => s.bookId);
	const beginBookPage = usePageStore((s) => s.beginBookPage);
	const openBookPage = usePageStore((s) => s.openBookPage);
	const resetEditor = usePageStore((s) => s.reset);
	const [name, setName] = (0, import_react.useState)("");
	function handleCreate() {
		const trimmed = name.trim();
		if (!trimmed) return;
		const id = createBook(trimmed);
		setName("");
		beginBookPage(id);
	}
	function handleOpen(book) {
		openBook(book.id);
		const first = book.pages[0];
		if (first) openBookPage(book.id, first.id);
		else beginBookPage(book.id);
	}
	function handleDelete(book) {
		const label = bookStats(book);
		const detail = label.pages > 0 ? ` and its ${label.pages} page${label.pages === 1 ? "" : "s"}` : "";
		if (!window.confirm(`Delete “${book.name}”${detail}? This can't be undone.`)) return;
		if (editorBookId === book.id) resetEditor();
		deleteBook(book.id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-surface p-4 shadow-border sm:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-medium tracking-tight",
						children: "Start a new book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Name it now, add pages one photo at a time — drafts are fine, you can finish later."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "mt-4 flex flex-col gap-2 sm:flex-row",
						onSubmit: (event) => {
							event.preventDefault();
							handleCreate();
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: name,
							onChange: (event) => setName(event.target.value),
							placeholder: "e.g. The Hungry Caterpillar, Week 3 reader",
							"aria-label": "Book name",
							maxLength: 80
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: !name.trim(),
							className: "shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Create book"]
						})]
					})
				]
			}),
			persistError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 flex items-start gap-2 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0" }), persistError]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-medium tracking-tight",
					children: "Your books"
				}), !hydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "Loading your books…"
				}) : books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col items-center rounded-2xl bg-surface px-6 py-12 text-center shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-12 items-center justify-center rounded-lg bg-primary-soft text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-display text-lg font-medium tracking-tight",
							children: "No books yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-muted",
							children: "Create your first book above, then photograph pages into it. Each page is reviewed and approved on its own — a half-finished book still opens fine."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: books.map((book) => {
						const stats = bookStats(book);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-col rounded-xl bg-surface p-4 shadow-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate font-display text-lg font-medium tracking-tight",
											children: book.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-0.5 text-xs text-subtle",
											children: ["Created ", new Date(book.createdAt).toLocaleDateString()]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										className: "flex size-9 items-center justify-center rounded-md text-subtle transition-colors hover:bg-danger-soft hover:text-danger",
										"aria-label": `Delete ${book.name}`,
										onClick: () => handleDelete(book),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											children: [
												stats.pages,
												" page",
												stats.pages === 1 ? "" : "s"
											]
										}),
										stats.approved > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [stats.approved, " approved"] }),
										stats.drafts > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "muted",
											children: [
												stats.drafts,
												" draft",
												stats.drafts === 1 ? "" : "s"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "mt-4 w-full",
									variant: "secondary",
									onClick: () => handleOpen(book),
									children: ["Open book", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})]
								})
							]
						}, book.id);
					})
				})]
			})
		]
	});
}
var STEPS = [
	"Upload",
	"Detect",
	"Review",
	"Preview",
	"Approve"
];
function TeacherApp() {
	const image = usePageStore((s) => s.image);
	const words = usePageStore((s) => s.words);
	const ocr = usePageStore((s) => s.ocr);
	const hasPreviewed = usePageStore((s) => s.hasPreviewed);
	const approved = usePageStore((s) => s.approved);
	const selectedId = usePageStore((s) => s.selectedId);
	const editorMode = usePageStore((s) => s.editorMode);
	const showOrderEditor = usePageStore((s) => s.showOrderEditor);
	const playback = usePageStore((s) => s.playback);
	const selectWord = usePageStore((s) => s.selectWord);
	const stopPlayback = usePageStore((s) => s.stopPlayback);
	const setShowOrderEditor = usePageStore((s) => s.setShowOrderEditor);
	const activeBook = useActiveBook();
	const hydrate = useBookStore((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.key !== "Escape") return;
			stopPlayback();
			selectWord(null, false);
			setShowOrderEditor(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [
		selectWord,
		setShowOrderEditor,
		stopPlayback
	]);
	const editorOpen = Boolean(activeBook && image);
	const stepIndex = !image ? 0 : ocr.status === "running" ? 1 : approved ? 4 : hasPreviewed ? 3 : 2;
	const modeLabel = !activeBook ? "Your books" : !image ? `Add a page to “${activeBook.name}”` : showOrderEditor ? "Fixing reading order" : selectedId && editorMode === "pronunciation" ? "Fixing pronunciation" : selectedId ? "Fixing spelling" : playback.kind === "sentence" ? "Playing full sentence" : playback.kind === "word" ? "Playing a single word" : words.length > 0 ? "Tap a word to review it" : ocr.status === "running" ? "Detecting words" : "Upload a page to begin";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-10 items-center justify-center rounded-md bg-primary text-primary-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-medium tracking-tight",
							children: "Page Aloud"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Teacher book studio"
						})] })]
					}), editorOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "flex flex-wrap items-center gap-1 text-xs font-medium sm:text-sm",
						children: STEPS.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center gap-1",
							children: [index > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "px-1 text-subtle",
								children: "/"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("rounded-full px-2.5 py-1", index === stepIndex ? "bg-primary text-primary-fg" : "text-muted"),
								children: step
							})]
						}, step))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border bg-primary-soft",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-primary",
						"aria-live": "polite",
						children: modeLabel
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8",
				children: activeBook ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookView, { book: activeBook }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LibraryView, {})
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TeacherApp, {});
}
//#endregion
export { Home as component };
