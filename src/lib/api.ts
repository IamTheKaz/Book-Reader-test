import type { Book } from "@/lib/book-model";
import type { StudentScore } from "@/server/scores";
import {
  createBookFn,
  deleteBookFn,
  listBooks,
  removePageFn,
  setPageOrderFn,
  upsertPageFn,
} from "@/server/books";
import { listScoresFn, recordScoreFn } from "@/server/scores";
import { getTeacherStatus, setTeacherPassword, verifyTeacherPassword } from "@/server/teacher";
import type { BookPage } from "@/lib/book-model";

export function fetchBooks(): Promise<Book[]> {
  return listBooks();
}

export function apiCreateBook(id: string, name: string) {
  return createBookFn({ data: { id, name } });
}

export function apiUpsertPage(bookId: string, page: BookPage) {
  return upsertPageFn({ data: { bookId, page } });
}

export function apiSetPageOrder(bookId: string, pageIds: string[]) {
  return setPageOrderFn({ data: { bookId, pageIds } });
}

export function apiRemovePage(pageId: string) {
  return removePageFn({ data: { pageId } });
}

export function apiDeleteBook(bookId: string) {
  return deleteBookFn({ data: { bookId } });
}

export function fetchTeacherStatus(): Promise<{ hasPassword: boolean }> {
  return getTeacherStatus();
}

export function apiSetTeacherPassword(password: string) {
  return setTeacherPassword({ data: { password } });
}

export function apiVerifyTeacherPassword(password: string) {
  return verifyTeacherPassword({ data: { password } });
}

export function fetchScores(): Promise<StudentScore[]> {
  return listScoresFn();
}

export function apiRecordScore(input: {
  studentName: string;
  bookId: string;
  completedPages: string[];
  timeMs: number | null;
}) {
  return recordScoreFn({ data: input });
}
