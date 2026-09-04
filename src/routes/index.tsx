import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { TeacherGate } from "@/components/teacher-gate";
import { TeacherApp } from "@/components/teacher-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <TeacherGate>
      <TeacherApp />
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 text-xs text-subtle sm:px-6">
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" />
            Page Aloud — teacher studio
          </span>
          <Link to="/read" className="font-medium text-primary hover:underline">
            Open student reading view
          </Link>
        </div>
      </footer>
    </TeacherGate>
  );
}
