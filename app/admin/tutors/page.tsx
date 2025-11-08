import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminTutorsPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <section className="py-8">
      <h1 className="mb-4 text-2xl font-semibold">จัดการติวเตอร์</h1>
      <p className="text-zinc-600 dark:text-zinc-400">จะเพิ่มตาราง/ฟอร์มจัดการติวเตอร์ภายหลัง</p>
    </section>
  );
}


