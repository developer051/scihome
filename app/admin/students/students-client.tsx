"use client";
import { useEffect, useState } from "react";

interface StudentRow {
  _id: string;
  fullName: string;
  nickname?: string;
  isActive: boolean;
}

export default function StudentsClient() {
  const [rows, setRows] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/students");
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setRows(data);
    } catch (e: any) {
      setError(e?.message || "โหลดข้อมูลล้มเหลว");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(id: string) {
    const res = await fetch(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggleActive" }),
    });
    if (res.ok) load();
  }

  return (
    <div className="rounded border">
      {loading ? (
        <div className="p-4">กำลังโหลด...</div>
      ) : error ? (
        <div className="p-4 text-red-600">{error}</div>
      ) : rows.length === 0 ? (
        <div className="p-4 text-zinc-600">ยังไม่มีผู้เรียน</div>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-zinc-50 text-left dark:bg-zinc-900">
              <th className="p-2">ชื่อ</th>
              <th className="p-2">สถานะ</th>
              <th className="p-2">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id} className="border-t">
                <td className="p-2">{r.fullName}</td>
                <td className="p-2">{r.isActive ? "Active" : "Inactive"}</td>
                <td className="p-2">
                  <button
                    onClick={() => toggleActive(r._id)}
                    className="rounded border px-3 py-1 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    {r.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


