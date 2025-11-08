"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Course {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  price?: number;
}

interface CourseSectionProps {
  initialCourses?: Course[];
  initialTotal?: number;
}

export default function CourseSection({ initialCourses = [], initialTotal = 0 }: CourseSectionProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [displayCount, setDisplayCount] = useState(8);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  useEffect(() => {
    loadCourses();
    loadCategories();
  }, [searchQuery, selectedCategory, displayCount]);

  async function loadCategories() {
    try {
      const res = await fetch("/api/courses?limit=1000");
      if (res.ok) {
        const data = await res.json();
        const uniqueCategories = Array.from(
          new Set(data.courses.map((c: Course) => c.category).filter(Boolean))
        ) as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  async function loadCourses() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", displayCount.toString());
      if (selectedCategory) {
        params.append("category", selectedCategory);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const res = await fetch(`/api/courses?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleShowMore() {
    setDisplayCount(displayCount + 15);
  }

  const displayedCourses = courses;
  const hasMore = total > displayCount;

  return (
    <section className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Explore our courses</h2>
        <Link
          href="/course"
          className="text-blue-600 underline hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          View all courses
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="relative flex flex-col gap-4 sm:flex-row">
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter by category
          </button>

          {/* Category Dropdown */}
          {showCategoryDropdown && (
            <div className="absolute z-10 mt-2 w-64 rounded-lg border border-zinc-300 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              <div className="p-2">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full rounded px-3 py-2 text-left text-sm ${
                    selectedCategory === null
                      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                      : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  ทั้งหมด
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setShowCategoryDropdown(false);
                    }}
                    className={`w-full rounded px-3 py-2 text-left text-sm ${
                      selectedCategory === cat
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course name or category"
            className="w-full rounded-lg border border-zinc-300 bg-white px-10 py-2.5 text-sm text-zinc-700 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:placeholder-zinc-500 dark:focus:border-orange-500"
          />
        </div>
      </div>

      {/* Display Count */}
      {!loading && (
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Displaying {displayedCourses.length > 0 ? 1 : 0}-{Math.min(displayedCourses.length, total)} ({total})
        </p>
      )}

      {/* Click outside to close dropdown */}
      {showCategoryDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowCategoryDropdown(false)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
            />
          ))}
        </div>
      )}

      {/* Course Grid */}
      {!loading && (
        <>
          {displayedCourses.length === 0 ? (
            <div className="rounded-lg border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-600 dark:text-zinc-400">ไม่พบคอร์สเรียน</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {displayedCourses.map((course) => (
                <Link
                  key={course._id}
                  href={`/course/${course._id}`}
                  className="group relative rounded-lg border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {/* Category Tag */}
                  {course.category && (
                    <div className="mb-3 inline-block rounded-md bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {course.category}
                    </div>
                  )}

                  {/* Course Title */}
                  <h3 className="mb-2 text-lg font-bold text-zinc-900 group-hover:text-orange-600 dark:text-white dark:group-hover:text-orange-400">
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  {course.description && (
                    <p className="mb-4 text-sm text-zinc-600 line-clamp-2 dark:text-zinc-400">
                      {course.description}
                    </p>
                  )}

                  {/* Arrow Icon */}
                  <div className="flex items-center justify-between">
                    {course.price !== undefined && (
                      <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
                        ฿{course.price.toLocaleString()}
                      </span>
                    )}
                    <div className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-orange-100 group-hover:text-orange-600 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-orange-900/30 dark:group-hover:text-orange-400">
                      <svg
                        className="h-4 w-4"
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
              ))}

              {/* Show More Button */}
              {hasMore && (
                <button
                  onClick={handleShowMore}
                  className="flex h-full min-h-[200px] items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-center text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                >
                  Show {Math.min(15, total - displayCount)} more
                </button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

