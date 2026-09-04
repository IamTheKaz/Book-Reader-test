import { create } from "zustand";
import {
  createBook as buildBook,
  moveBookPage,
  parseBooks,
  removeBookPage,
  serializeBooks,
  upsertBookPage,
  type Book,
  type BookPage,
} from "@/lib/book-model";

const STORAGE_KEY = "page-aloud:books:v1";
const SAVE_DEBOUNCE_MS = 400;

type BookStore = {
  books: Book[];
  /** Set once localStorage has been read on the client (never on the server). */
  hydrated: boolean;
  /** Non-null when the last save failed (e.g. storage quota exceeded). */
  persistError: string | null;
  activeBookId: string | null;
  hydrate: () => void;
  createBook: (name: string) => string;
  deleteBook: (id: string) => void;
  openBook: (id: string) => void;
  closeBook: () => void;
  upsertPage: (bookId: string, page: BookPage) => void;
  movePage: (bookId: string, pageId: string, direction: -1 | 1) => void;
  removePage: (bookId: string, pageId: string) => void;
};

let saveTimer: ReturnType<typeof setTimeout> | null = null;

function writeBooks(books: Book[]): string | null {
  try {
    window.localStorage.setItem(STORAGE_KEY, serializeBooks(books));
    return null;
  } catch {
    return "This browser's local storage is full — the latest changes may not survive a reload.";
  }
}

/** Debounce writes: word-by-word edits sync on every keystroke. */
function schedulePersist(set: (partial: Partial<BookStore>) => void, books: Book[]) {
  if (typeof window === "undefined") return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    saveTimer = null;
    set({ persistError: writeBooks(books) });
  }, SAVE_DEBOUNCE_MS);
}

function persistNow(books: Book[]): string | null {
  if (saveTimer) {
    clearTimeout(saveTimer);
    saveTimer = null;
  }
  if (typeof window === "undefined") return null;
  return writeBooks(books);
}

export const useBookStore = create<BookStore>((set, get) => ({
  books: [],
  hydrated: false,
  persistError: null,
  activeBookId: null,

  hydrate: () => {
    if (get().hydrated || typeof window === "undefined") return;
    set({ books: parseBooks(window.localStorage.getItem(STORAGE_KEY)), hydrated: true });
  },

  createBook: (name) => {
    const book = buildBook(name);
    const books = [...get().books, book];
    set({ books, activeBookId: book.id, persistError: persistNow(books) });
    return book.id;
  },

  deleteBook: (id) => {
    const books = get().books.filter((b) => b.id !== id);
    set({
      books,
      activeBookId: get().activeBookId === id ? null : get().activeBookId,
      persistError: persistNow(books),
    });
  },

  openBook: (id) => {
    if (get().books.some((b) => b.id === id)) set({ activeBookId: id });
  },

  closeBook: () => set({ activeBookId: null }),

  upsertPage: (bookId, page) => {
    const books = get().books.map((b) => (b.id === bookId ? upsertBookPage(b, page) : b));
    set({ books });
    schedulePersist(set, books);
  },

  movePage: (bookId, pageId, direction) => {
    const books = get().books.map((b) => (b.id === bookId ? moveBookPage(b, pageId, direction) : b));
    set({ books, persistError: persistNow(books) });
  },

  removePage: (bookId, pageId) => {
    const books = get().books.map((b) => (b.id === bookId ? removeBookPage(b, pageId) : b));
    set({ books, persistError: persistNow(books) });
  },
}));

export function useActiveBook(): Book | null {
  return useBookStore((s) => s.books.find((b) => b.id === s.activeBookId) ?? null);
}

/** Flush any pending debounced save; used when the tab is hidden/closed. */
export function flushBookPersistence() {
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
