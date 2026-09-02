import { createFileRoute } from "@tanstack/react-router";
import { TeacherApp } from "@/components/teacher-app";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <TeacherApp />;
}
