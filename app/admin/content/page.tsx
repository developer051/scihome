import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewsSectionClient from "./news-section-client";

export default async function AdminContentPage() {
  const session = await auth();
  if (!session) redirect("/admin/login");
  return (
    <section className="py-8">
      <h1 className="mb-6 text-2xl font-semibold">จัดการคอนเทนต์</h1>
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">ข่าวสารและกิจกรรม</h2>
        <NewsSectionClient />
      </div>
    </section>
  );
}


