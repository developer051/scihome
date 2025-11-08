import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import StudentsClient from "./students-client";

export default async function AdminStudentsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <section className="py-8">
      <h1 className="mb-4 text-2xl font-semibold">ผู้เรียน</h1>
      <StudentsClient />
    </section>
  );
}


