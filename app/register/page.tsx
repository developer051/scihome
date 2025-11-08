"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: payload.fullName,
          nickname: payload.nickname,
          school: payload.school,
          educationLevel: payload.educationLevel,
          interestedCourses: (payload.interestedCourses as string)?.split(",").map((s) => s.trim()).filter(Boolean) ?? [],
          interestedCareerPath: payload.interestedCareerPath,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccess("ลงทะเบียนสำเร็จ! ทางสถาบันจะติดต่อกลับโดยเร็ว");
      form.reset();
    } catch (err: any) {
      setError(err?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-8">
      <h1 className="mb-4 text-2xl font-semibold">ลงทะเบียนเรียน</h1>
      <form onSubmit={onSubmit} className="grid max-w-2xl grid-cols-1 gap-4">
        <label className="grid gap-1">
          <span>ชื่อ-นามสกุล</span>
          <input name="fullName" required className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700" />
        </label>
        <label className="grid gap-1">
          <span>ชื่อเล่น</span>
          <input name="nickname" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700" />
        </label>
        <label className="grid gap-1">
          <span>โรงเรียน</span>
          <input name="school" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700" />
        </label>
        <label className="grid gap-1">
          <span>ระดับการศึกษา</span>
          <select name="educationLevel" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700">
            <option value="มัธยมต้น">มัธยมต้น</option>
            <option value="มัธยมปลาย">มัธยมปลาย</option>
            <option value="มหาวิทยาลัย">มหาวิทยาลัย</option>
            <option value="อื่นๆ">อื่นๆ</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span>คอร์สที่สนใจ (คั่นด้วย ,)</span>
          <input name="interestedCourses" placeholder="เช่น ฟิสิกส์, เคมี" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700" />
        </label>
        <label className="grid gap-1">
          <span>สายอาชีพที่สนใจ</span>
          <input name="interestedCareerPath" className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700" />
        </label>
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {submitting ? "กำลังบันทึก..." : "ส่งแบบฟอร์ม"}
        </button>
        {success && <div className="text-green-600">{success}</div>}
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </section>
  );
}


