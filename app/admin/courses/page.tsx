import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CoursesClient from "./courses-client";

export default async function AdminCoursesPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <section className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">จัดการคอร์ส</h1>
      <CoursesClient />
    </section>
  );
}


