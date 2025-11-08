"use client";
import { useEffect, useState } from "react";

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CoursesClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Course>>({
    title: "",
    description: "",
    category: "",
    price: undefined,
    isActive: true,
  });

  useEffect(() => {
    loadCourses();
  }, []);

  async function loadCourses() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการโหลดข้อมูล" });
    } finally {
      setLoading(false);
    }
  }

  async function saveCourse() {
    if (!formData.title?.trim()) {
      setMessage({ type: "error", text: "กรุณากรอกชื่อคอร์ส" });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      const url = editingId ? "/api/admin/courses" : "/api/admin/courses";
      const method = editingId ? "PUT" : "POST";
      const body = editingId
        ? { _id: editingId, ...formData }
        : { ...formData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setMessage({ type: "success", text: editingId ? "อัปเดตคอร์สสำเร็จ" : "เพิ่มคอร์สสำเร็จ" });
        setTimeout(() => setMessage(null), 3000);
        resetForm();
        loadCourses();
      } else {
        throw new Error("บันทึกข้อมูลล้มเหลว");
      }
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    } finally {
      setSaving(false);
    }
  }

  async function deleteCourse(_id: string) {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบคอร์สนี้?")) return;

    try {
      const res = await fetch(`/api/admin/courses?_id=${_id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setMessage({ type: "success", text: "ลบคอร์สสำเร็จ" });
        setTimeout(() => setMessage(null), 3000);
        loadCourses();
      } else {
        throw new Error("ลบข้อมูลล้มเหลว");
      }
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการลบข้อมูล" });
    }
  }

  function editCourse(course: Course) {
    setFormData({
      title: course.title,
      description: course.description || "",
      category: course.category || "",
      price: course.price,
      isActive: course.isActive,
    });
    setEditingId(course._id);
    setShowForm(true);
  }

  function resetForm() {
    setFormData({
      title: "",
      description: "",
      category: "",
      price: undefined,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  }

  if (loading) {
    return <div className="p-4">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-lg p-4 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">จัดการคอร์สเรียน</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
        >
          + เพิ่มคอร์สใหม่
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h3 className="mb-4 text-lg font-semibold">{editingId ? "แก้ไขคอร์ส" : "เพิ่มคอร์สใหม่"}</h3>
          <div className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">ชื่อคอร์ส *</span>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="เช่น Amazon Q Developer"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">หมวดหมู่</span>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="เช่น Generative AI, Storage, Compute"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">คำอธิบาย</span>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="คำอธิบายคอร์ส"
                rows={3}
              />
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">ราคา</span>
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })
                }
                className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                placeholder="เช่น 5000"
              />
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isActive !== false}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="rounded border-zinc-300 dark:border-zinc-700"
              />
              <span className="text-sm font-medium">แสดงในหน้าแรก</span>
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={saveCourse}
                disabled={saving}
                className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-60 dark:bg-orange-500 dark:hover:bg-orange-600"
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="rounded border border-zinc-300 px-4 py-2 text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-zinc-200 dark:border-zinc-800">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900">
              <th className="border border-zinc-200 px-4 py-2 text-left text-sm font-semibold dark:border-zinc-800">
                ชื่อคอร์ส
              </th>
              <th className="border border-zinc-200 px-4 py-2 text-left text-sm font-semibold dark:border-zinc-800">
                หมวดหมู่
              </th>
              <th className="border border-zinc-200 px-4 py-2 text-left text-sm font-semibold dark:border-zinc-800">
                คำอธิบาย
              </th>
              <th className="border border-zinc-200 px-4 py-2 text-left text-sm font-semibold dark:border-zinc-800">
                ราคา
              </th>
              <th className="border border-zinc-200 px-4 py-2 text-left text-sm font-semibold dark:border-zinc-800">
                สถานะ
              </th>
              <th className="border border-zinc-200 px-4 py-2 text-left text-sm font-semibold dark:border-zinc-800">
                จัดการ
              </th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={6} className="border border-zinc-200 px-4 py-8 text-center text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
                  ยังไม่มีคอร์สเรียน
                </td>
              </tr>
            ) : (
              courses.map((course) => (
                <tr key={course._id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900">
                  <td className="border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">{course.title}</td>
                  <td className="border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">
                    {course.category || "-"}
                  </td>
                  <td className="border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">
                    <div className="max-w-xs truncate">{course.description || "-"}</div>
                  </td>
                  <td className="border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">
                    {course.price ? `฿${course.price.toLocaleString()}` : "-"}
                  </td>
                  <td className="border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">
                    <span
                      className={`inline-block rounded px-2 py-1 text-xs font-medium ${
                        course.isActive
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {course.isActive ? "แสดง" : "ซ่อน"}
                    </span>
                  </td>
                  <td className="border border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() => editCourse(course)}
                        className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                      >
                        แก้ไข
                      </button>
                      <button
                        onClick={() => deleteCourse(course._id)}
                        className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                      >
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

