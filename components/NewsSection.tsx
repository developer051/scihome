import Link from "next/link";
import Image from "next/image";

interface NewsCard {
  label: string;
  title: string;
  description: string;
  imageUrl?: string;
  link?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface NewsSectionProps {
  cards: {
    card1?: NewsCard; // การ์ดใหญ่ทางซ้าย
    card2?: NewsCard; // การ์ดเล็กบนขวา
    card3?: NewsCard; // การ์ดเล็กล่างขวา
  };
}

export default function NewsSection({ cards }: NewsSectionProps) {
  const { card1, card2, card3 } = cards;

  // ถ้าไม่มีข้อมูลการ์ดเลย แสดงข้อความ
  if (!card1 && !card2 && !card3) {
    return (
      <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">ข่าวสารและกิจกรรม</h2>
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">ยังไม่มีข่าวสาร</p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">ข่าวสารและกิจกรรม</h2>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* การ์ดใหญ่ทางซ้าย */}
        {card1 && (
          <Link
            href={card1.link || "#"}
            className="group relative col-span-1 row-span-2 overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: card1.backgroundColor || "#f3f4f6",
              minHeight: "500px",
            }}
          >
            {card1.imageUrl ? (
              <Image
                src={card1.imageUrl}
                alt={card1.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800" />
            )}
            
            {/* Overlay gradient สำหรับข้อความ */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            
            {/* Label */}
            {card1.label && (
              <div className="absolute left-4 top-4 rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-900/90 dark:text-white">
                {card1.label}
              </div>
            )}
            
            {/* ข้อความด้านล่าง */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3
                className="mb-2 text-xl font-bold leading-tight"
                style={{ color: card1.textColor || "#ffffff" }}
              >
                {card1.title}
              </h3>
              {card1.description && (
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: card1.textColor || "#ffffff" }}
                >
                  {card1.description}
                </p>
              )}
              <div
                className="inline-flex items-center text-sm font-medium"
                style={{ color: card1.textColor || "#ffffff" }}
              >
                ดูเพิ่มเติม
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        )}

        {/* การ์ดเล็กบนขวา */}
        {card2 && (
          <Link
            href={card2.link || "#"}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: card2.backgroundColor || "#f3f4f6",
              minHeight: "240px",
            }}
          >
            {card2.imageUrl ? (
              <Image
                src={card2.imageUrl}
                alt={card2.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-red-200 to-red-300 dark:from-orange-900 dark:via-red-900 dark:to-red-800" />
            )}
            
            <div className="relative h-full p-6 flex flex-col">
              {/* Label */}
              {card2.label && (
                <div className="mb-4 inline-block w-fit rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-900/90 dark:text-white">
                  {card2.label}
                </div>
              )}
              
              {/* ข้อความ */}
              <div className="flex-1 flex flex-col justify-end">
                <h3
                  className="mb-2 text-lg font-bold leading-tight"
                  style={{ color: card2.textColor || "#1f2937" }}
                >
                  {card2.title}
                </h3>
                {card2.description && (
                  <p
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: card2.textColor || "#4b5563" }}
                  >
                    {card2.description}
                  </p>
                )}
                <div
                  className="inline-flex items-center text-sm font-medium"
                  style={{ color: card2.textColor || "#1f2937" }}
                >
                  ดูเพิ่มเติม
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* การ์ดเล็กล่างขวา */}
        {card3 && (
          <Link
            href={card3.link || "#"}
            className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02]"
            style={{
              backgroundColor: card3.backgroundColor || "#1f2937",
              minHeight: "240px",
            }}
          >
            {card3.imageUrl ? (
              <Image
                src={card3.imageUrl}
                alt={card3.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-red-950 to-black dark:from-red-950 dark:via-black dark:to-black" />
            )}
            
            <div className="relative h-full p-6 flex flex-col">
              {/* Label */}
              {card3.label && (
                <div className="mb-4 inline-block w-fit rounded-lg bg-white/90 px-3 py-1.5 text-sm font-medium text-zinc-900 dark:bg-zinc-900/90 dark:text-white">
                  {card3.label}
                </div>
              )}
              
              {/* ข้อความ */}
              <div className="flex-1 flex flex-col justify-end">
                <h3
                  className="mb-2 text-lg font-bold leading-tight"
                  style={{ color: card3.textColor || "#ffffff" }}
                >
                  {card3.title}
                </h3>
                {card3.description && (
                  <p
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: card3.textColor || "#e5e7eb" }}
                  >
                    {card3.description}
                  </p>
                )}
                <div
                  className="inline-flex items-center text-sm font-medium"
                  style={{ color: card3.textColor || "#ffffff" }}
                >
                  ดูเพิ่มเติม
                  <svg
                    className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}

