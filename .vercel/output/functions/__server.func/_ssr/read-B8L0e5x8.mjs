import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as ChevronLeft, b as BookOpen, g as ChevronRight, l as Play, o as Timer, s as Square, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { _ as fetchBooks, b as speakText, h as cancelSpeech, n as Button, o as apiRecordScore, p as buildSpeechPlan, r as Input, t as Badge } from "./tts-Csa31ETN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read-B8L0e5x8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentApp() {
	const [phase, setPhase] = (0, import_react.useState)("loading");
	const [books, setBooks] = (0, import_react.useState)([]);
	const [book, setBook] = (0, import_react.useState)(null);
	const [name, setName] = (0, import_react.useState)("");
	const [nameInput, setNameInput] = (0, import_react.useState)("");
	const [pageIndex, setPageIndex] = (0, import_react.useState)(0);
	const [finishedPages, setFinishedPages] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [elapsedMs, setElapsedMs] = (0, import_react.useState)(0);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [activeWordId, setActiveWordId] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const startAtRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		fetchBooks().then((b) => setBooks(b.filter((x) => x.pages.length > 0))).catch(() => setBooks([])).finally(() => setPhase("pick"));
		return () => cancelSpeech();
	}, []);
	const allDone = book !== null && book.pages.length > 0 && finishedPages.size >= book.pages.length;
	(0, import_react.useEffect)(() => {
		if (phase !== "read" || startAtRef.current === null || allDone) return;
		const id = window.setInterval(() => {
			if (startAtRef.current !== null) setElapsedMs(Date.now() - startAtRef.current);
		}, 250);
		return () => window.clearInterval(id);
	}, [phase, allDone]);
	const pages = (0, import_react.useMemo)(() => book?.pages ?? [], [book]);
	const page = pages[pageIndex] ?? null;
	const plan = (0, import_react.useMemo)(() => page ? buildSpeechPlan(page.words, page.layout, page.image.width, page.sentenceOverride) : null, [page]);
	function chooseBook(b) {
		setBook(b);
		setPhase("name");
	}
	function startReading() {
		const trimmed = nameInput.trim();
		if (!trimmed) return;
		setName(trimmed);
		setPageIndex(0);
		setFinishedPages(/* @__PURE__ */ new Set());
		setElapsedMs(0);
		setSaved(false);
		startAtRef.current = Date.now();
		setPhase("read");
	}
	function markPageDone(id) {
		setFinishedPages((prev) => prev.has(id) ? prev : new Set(prev).add(id));
	}
	function play() {
		if (!page || !plan || !plan.spoken) return;
		cancelSpeech();
		setPlaying(true);
		speakText(plan.spoken, {
			rate: .5,
			tokens: plan.tokens,
			onToken: (t) => setActiveWordId(t.wordId)
		}).done.then(() => {
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
	function goTo(index) {
		stop();
		setPageIndex(Math.max(0, Math.min(pages.length - 1, index)));
	}
	(0, import_react.useEffect)(() => {
		if (!book || !allDone || saved) return;
		stop();
		const timeMs = startAtRef.current !== null ? Date.now() - startAtRef.current : null;
		setElapsedMs(timeMs ?? 0);
		setSaved(true);
		apiRecordScore({
			studentName: name,
			bookId: book.id,
			completedPages: [...finishedPages],
			timeMs
		}).catch(() => void 0);
	}, [
		allDone,
		saved,
		book
	]);
	function restart() {
		stop();
		setBook(null);
		setName("");
		setNameInput("");
		setFinishedPages(/* @__PURE__ */ new Set());
		setPageIndex(0);
		setElapsedMs(0);
		setSaved(false);
		startAtRef.current = null;
		setPhase("pick");
	}
	if (phase === "loading") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CenteredNote, { children: "Loading books…" });
	if (phase === "pick") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center font-display text-3xl font-medium tracking-tight",
				children: "Pick a book to read"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-center text-muted",
				children: "Tap a book, type your name, and read along."
			}),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-10 rounded-2xl bg-surface px-6 py-12 text-center text-muted shadow-border",
				children: "No books are ready yet. Ask your teacher to add some pages."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: books.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => chooseBook(b),
					className: "flex w-full items-center gap-3 rounded-xl bg-surface p-4 text-left shadow-border transition-shadow hover:shadow-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-display text-lg font-medium tracking-tight",
							children: b.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm text-muted",
							children: [
								b.pages.length,
								" page",
								b.pages.length === 1 ? "" : "s"
							]
						})]
					})]
				}) }, b.id))
			})
		]
	});
	if (phase === "name" && book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex max-w-md flex-col justify-center pt-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl bg-surface p-6 shadow-border sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-medium tracking-tight",
					children: "What's your name?"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"Your teacher uses it to see who read “",
						book.name,
						"” and how long it took."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-5 flex flex-col gap-3",
					onSubmit: (e) => {
						e.preventDefault();
						startReading();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							autoFocus: true,
							value: nameInput,
							onChange: (e) => setNameInput(e.target.value),
							placeholder: "Type your first name",
							"aria-label": "Your name",
							maxLength: 40
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: !nameInput.trim(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), "Start reading"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => setPhase("pick"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "Pick a different book"]
						})
					]
				})
			]
		})
	});
	if (phase === "read" && book && page) {
		const doneCount = finishedPages.size;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-4xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: restart,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "Done"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Timer, { className: "mr-1 size-3" }), formatMs(elapsedMs)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "muted",
							children: [
								doneCount,
								"/",
								pages.length,
								" pages"
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 text-center font-display text-2xl font-medium tracking-tight",
					children: book.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-center text-sm text-muted",
					children: ["Reading as ", name]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative mx-auto mt-5 max-w-2xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative inline-block max-w-full touch-manipulation select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: page.image.src,
							alt: `Page ${pageIndex + 1}`,
							className: "block h-auto max-h-[min(60vh,640px)] w-auto max-w-full rounded-md bg-surface-2",
							draggable: false
						}), page.image.width > 0 && plan && page.words.map((w) => {
							const left = w.bbox.x0 / page.image.width * 100;
							const top = w.bbox.y0 / page.image.height * 100;
							const width = (w.bbox.x1 - w.bbox.x0) / page.image.width * 100;
							const height = (w.bbox.y1 - w.bbox.y0) / page.image.height * 100;
							const karaoke = activeWordId === w.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "word-box pointer-events-none",
								"data-karaoke": karaoke ? "true" : "false",
								style: {
									left: `${left}%`,
									top: `${top}%`,
									width: `${width}%`,
									height: `${height}%`
								}
							}, w.id);
						})]
					})
				}),
				plan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-4 max-w-2xl rounded-md bg-surface px-4 py-3 text-center font-display text-xl leading-relaxed shadow-border",
					children: plan.displaySentence
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => goTo(pageIndex - 1),
							disabled: pageIndex === 0,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {}), "Back"]
						}),
						playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "secondary",
							onClick: stop,
							className: "min-w-36",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {}), "Stop"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: play,
							className: "min-w-36",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {}), finishedPages.has(page.id) ? "Read again" : "Read to me"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => goTo(pageIndex + 1),
							disabled: pageIndex === pages.length - 1,
							children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})]
						})
					]
				}),
				allDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto mt-6 max-w-2xl rounded-2xl bg-primary-soft p-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-medium tracking-tight text-primary",
							children: "You finished the book!"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-primary",
							children: [
								"Great reading, ",
								name,
								". Time: ",
								formatMs(elapsedMs),
								"."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							variant: "secondary",
							onClick: restart,
							children: "Read another book"
						})
					]
				})
			]
		});
	}
	return null;
}
function CenteredNote({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto flex min-h-[40vh] max-w-md items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children
		})
	});
}
function formatMs(ms) {
	const total = Math.max(0, Math.round(ms / 1e3));
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${String(s).padStart(2, "0")}`;
}
var SplitComponent = () => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "min-h-dvh bg-bg px-4 py-6 text-fg sm:px-6 sm:py-8",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentApp, {})
});
//#endregion
export { SplitComponent as component };
