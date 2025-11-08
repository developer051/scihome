import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <section className="py-8">
      <h1 className="mb-4 text-2xl font-semibold">Admin Dashboard</h1>
      <p className="text-zinc-600 dark:text-zinc-400">ยินดีต้อนรับ, {(session.user?.name as string) || session.user?.email}</p>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <a href="/admin/students" className="rounded border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">ผู้เรียน</a>
        <a href="/admin/courses" className="rounded border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">คอร์ส</a>
        <a href="/admin/tutors" className="rounded border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">ติวเตอร์</a>
        <a href="/admin/content" className="rounded border p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900">คอนเทนต์</a>
      </div>
    </section>
  );
}


