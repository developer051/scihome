"use client";
import { useEffect, useState } from "react";

interface NewsCardData {
  label: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  backgroundColor: string;
  textColor: string;
}

export default function NewsSectionClient() {
  const [card1, setCard1] = useState<NewsCardData>({
    label: "",
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    backgroundColor: "",
    textColor: "",
  });
  const [card2, setCard2] = useState<NewsCardData>({
    label: "",
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    backgroundColor: "",
    textColor: "",
  });
  const [card3, setCard3] = useState<NewsCardData>({
    label: "",
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    backgroundColor: "",
    textColor: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content?key=news_section_card_1");
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setCard1({
            label: (data.data?.label as string) || "",
            title: data.title || "",
            description: data.body || "",
            imageUrl: (data.data?.imageUrl as string) || "",
            link: (data.data?.link as string) || "",
            backgroundColor: (data.data?.backgroundColor as string) || "",
            textColor: (data.data?.textColor as string) || "",
          });
        }
      }

      const res2 = await fetch("/api/admin/content?key=news_section_card_2");
      if (res2.ok) {
        const data = await res2.json();
        if (data) {
          setCard2({
            label: (data.data?.label as string) || "",
            title: data.title || "",
            description: data.body || "",
            imageUrl: (data.data?.imageUrl as string) || "",
            link: (data.data?.link as string) || "",
            backgroundColor: (data.data?.backgroundColor as string) || "",
            textColor: (data.data?.textColor as string) || "",
          });
        }
      }

      const res3 = await fetch("/api/admin/content?key=news_section_card_3");
      if (res3.ok) {
        const data = await res3.json();
        if (data) {
          setCard3({
            label: (data.data?.label as string) || "",
            title: data.title || "",
            description: data.body || "",
            imageUrl: (data.data?.imageUrl as string) || "",
            link: (data.data?.link as string) || "",
            backgroundColor: (data.data?.backgroundColor as string) || "",
            textColor: (data.data?.textColor as string) || "",
          });
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveCard(cardNumber: 1 | 2 | 3, cardData: NewsCardData) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: `news_section_card_${cardNumber}`,
          title: cardData.title,
          body: cardData.description,
          data: {
            label: cardData.label,
            imageUrl: cardData.imageUrl,
            link: cardData.link,
            backgroundColor: cardData.backgroundColor,
            textColor: cardData.textColor,
          },
        }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: `บันทึกการ์ด ${cardNumber} สำเร็จ` });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error("บันทึกข้อมูลล้มเหลว");
      }
    } catch (error) {
      setMessage({ type: "error", text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
    } finally {
      setSaving(false);
    }
  }

  function CardForm({
    title,
    cardData,
    setCardData,
    cardNumber,
  }: {
    title: string;
    cardData: NewsCardData;
    setCardData: (data: NewsCardData) => void;
    cardNumber: 1 | 2 | 3;
  }) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="mb-4 text-lg font-semibold">{title}</h3>
        <div className="grid gap-4">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Label</span>
            <input
              type="text"
              value={cardData.label}
              onChange={(e) => setCardData({ ...cardData, label: e.target.value })}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="เช่น Digital training"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Title</span>
            <input
              type="text"
              value={cardData.title}
              onChange={(e) => setCardData({ ...cardData, title: e.target.value })}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="หัวข้อการ์ด"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Description</span>
            <textarea
              value={cardData.description}
              onChange={(e) => setCardData({ ...cardData, description: e.target.value })}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="รายละเอียด"
              rows={3}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Image URL</span>
            <input
              type="url"
              value={cardData.imageUrl}
              onChange={(e) => setCardData({ ...cardData, imageUrl: e.target.value })}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="https://example.com/image.jpg"
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Link</span>
            <input
              type="url"
              value={cardData.link}
              onChange={(e) => setCardData({ ...cardData, link: e.target.value })}
              className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
              placeholder="https://example.com"
            />
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="grid gap-1">
              <span className="text-sm font-medium">Background Color</span>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={cardData.backgroundColor || "#f3f4f6"}
                  onChange={(e) => setCardData({ ...cardData, backgroundColor: e.target.value })}
                  className="h-10 w-20 rounded border border-zinc-300 dark:border-zinc-700"
                />
                <input
                  type="text"
                  value={cardData.backgroundColor}
                  onChange={(e) => setCardData({ ...cardData, backgroundColor: e.target.value })}
                  className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="#f3f4f6"
                />
              </div>
            </label>
            <label className="grid gap-1">
              <span className="text-sm font-medium">Text Color</span>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={cardData.textColor || "#ffffff"}
                  onChange={(e) => setCardData({ ...cardData, textColor: e.target.value })}
                  className="h-10 w-20 rounded border border-zinc-300 dark:border-zinc-700"
                />
                <input
                  type="text"
                  value={cardData.textColor}
                  onChange={(e) => setCardData({ ...cardData, textColor: e.target.value })}
                  className="flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800"
                  placeholder="#ffffff"
                />
              </div>
            </label>
          </div>
          <button
            type="button"
            onClick={() => saveCard(cardNumber, cardData)}
            disabled={saving}
            className="mt-2 rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700 disabled:opacity-60 dark:bg-orange-500 dark:hover:bg-orange-600"
          >
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>
    );
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

      <div className="grid gap-6 lg:grid-cols-3">
        <CardForm
          title="การ์ด 1 (ใหญ่ทางซ้าย)"
          cardData={card1}
          setCardData={setCard1}
          cardNumber={1}
        />
        <CardForm
          title="การ์ด 2 (เล็กบนขวา)"
          cardData={card2}
          setCardData={setCard2}
          cardNumber={2}
        />
        <CardForm
          title="การ์ด 3 (เล็กล่างขวา)"
          cardData={card3}
          setCardData={setCard3}
          cardNumber={3}
        />
      </div>
    </div>
  );
}

