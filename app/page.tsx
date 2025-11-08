import Link from "next/link";
import NewsSection from "@/components/NewsSection";
import CourseSection from "@/components/CourseSection";
import { getContentCollection } from "@/models/Content";

export default async function Home() {
  // ดึงข่าวสาร/กิจกรรมล่าสุด (หาก API ยังไม่พร้อม จะ fallback เป็นอาร์เรย์ว่าง)
  let news: { _id: string; title: string; summary?: string; date?: string }[] = [];
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/news`, {
      // ขอ ISR แบบง่าย
      next: { revalidate: 60 },
    });
    if (res.ok) news = await res.json();
  } catch {}

  // ดึงข้อมูลการ์ดข่าวสารและกิจกรรมโดยตรงจาก database (เร็วกว่าและไม่ timeout)
  let newsSectionCards: {
    card1?: any;
    card2?: any;
    card3?: any;
  } = {};
  try {
    const col = await getContentCollection();
    const [card1, card2, card3] = await Promise.all([
      col.findOne({ key: "news_section_card_1" }).catch(() => null),
      col.findOne({ key: "news_section_card_2" }).catch(() => null),
      col.findOne({ key: "news_section_card_3" }).catch(() => null),
    ]);

    newsSectionCards = {
      card1: card1 ? {
        label: (card1.data?.label as string) || "",
        title: card1.title || "",
        description: card1.body || "",
        imageUrl: (card1.data?.imageUrl as string) || undefined,
        link: (card1.data?.link as string) || undefined,
        backgroundColor: (card1.data?.backgroundColor as string) || undefined,
        textColor: (card1.data?.textColor as string) || undefined,
      } : undefined,
      card2: card2 ? {
        label: (card2.data?.label as string) || "",
        title: card2.title || "",
        description: card2.body || "",
        imageUrl: (card2.data?.imageUrl as string) || undefined,
        link: (card2.data?.link as string) || undefined,
        backgroundColor: (card2.data?.backgroundColor as string) || undefined,
        textColor: (card2.data?.textColor as string) || undefined,
      } : undefined,
      card3: card3 ? {
        label: (card3.data?.label as string) || "",
        title: card3.title || "",
        description: card3.body || "",
        imageUrl: (card3.data?.imageUrl as string) || undefined,
        link: (card3.data?.link as string) || undefined,
        backgroundColor: (card3.data?.backgroundColor as string) || undefined,
        textColor: (card3.data?.textColor as string) || undefined,
      } : undefined,
    };
  } catch (error: any) {
    // จัดการ error ต่างๆ เช่น authentication error, connection error
    if (error?.message?.includes("authentication") || error?.code === 8000) {
      console.error("MongoDB authentication error. Please check MONGODB_URI includes username and password.");
    } else {
      console.error("Error loading news section cards:", error);
    }
    // ถ้าเกิด error ให้ใช้ค่าว่าง (จะแสดง "ยังไม่มีข่าวสาร")
  }

  // ดึงข้อมูลคอร์สเรียนสำหรับแสดงในหน้าแรก
  let coursesData: { courses: any[]; total: number } = { courses: [], total: 0 };
  try {
    const coursesRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/api/courses?limit=8`, {
      next: { revalidate: 60 },
    });
    if (coursesRes.ok) {
      coursesData = await coursesRes.json();
    }
  } catch (error) {
    console.error("Error loading courses:", error);
  }

  return (
    <div className="w-full space-y-16 sm:space-y-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-orange-50 via-white to-blue-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950" />
        <div className="ml-auto mr-8 max-w-4xl text-right sm:mr-12 lg:mr-16">
          <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white">
            ScienceHome
          </h1>
          <p className="animate-fade-in ml-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 sm:text-xl dark:text-zinc-400">
            สถาบันกวดวิชาสายวิทย์-เทคโนโลยี เพื่อพัฒนาศักยภาพของผู้เรียนให้พร้อมสู่อนาคต
          </p>
          <div className="animate-fade-in mt-10 flex flex-col items-end justify-end gap-4 sm:flex-row">
            <Link
              href="/register"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/50 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:from-orange-500 dark:to-orange-600"
            >
              <span className="relative z-10">ลงทะเบียนเรียน</span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
            <Link
              href="/course"
              className="inline-flex items-center justify-center rounded-xl border-2 border-zinc-300 bg-white px-8 py-3.5 text-base font-semibold text-zinc-900 transition-all duration-300 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:border-orange-500 dark:hover:bg-orange-950/30 dark:hover:text-orange-400"
            >
              ดูคอร์สเรียน
              <svg
                className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/course"
          className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
            คอร์สเรียน
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            ดูคอร์สเรียนทั้งหมดที่เรามีให้เลือก พร้อมเนื้อหาครบถ้วนและอัปเดตสม่ำเสมอ
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400">
            ดูเพิ่มเติม
            <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/tutor"
          className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
            ติวเตอร์
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            รู้จักทีมติวเตอร์ที่มีประสบการณ์และเชี่ยวชาญในสาขาวิชาต่างๆ
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400">
            ดูเพิ่มเติม
            <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/mockexam"
          className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-orange-300 hover:shadow-lg hover:shadow-orange-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-orange-800"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-bold text-zinc-900 transition-colors group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
            Mock Exam
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400">
            ทดสอบความรู้ด้วยข้อสอบจำลองที่ออกแบบมาเพื่อเตรียมความพร้อม
          </p>
          <div className="mt-4 inline-flex items-center text-sm font-medium text-orange-600 dark:text-orange-400">
            ดูเพิ่มเติม
            <svg className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </section>

      {/* Course Section */}
      <CourseSection initialCourses={coursesData.courses} initialTotal={coursesData.total} />

      {/* News Section */}
      <NewsSection cards={newsSectionCards} />

      {/* Getting Started Section */}
      <section className="rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-8 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
        <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">เริ่มต้นกับเรา</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
              <span className="text-lg font-bold">1</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">ดูคอร์สเรียน</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              ดูรายละเอียดคอร์สเรียนทั้งหมดที่เรามีให้เลือก
            </p>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
              <span className="text-lg font-bold">2</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">รู้จักติวเตอร์</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              ทำความรู้จักกับทีมติวเตอร์ที่มีประสบการณ์ของเรา
            </p>
          </div>
          <div className="flex flex-col items-start">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400">
              <span className="text-lg font-bold">3</span>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-white">ลงทะเบียนเรียน</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              ลงทะเบียนเรียนและเริ่มต้นการเรียนของคุณวันนี้
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
