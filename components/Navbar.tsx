"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navItems = [
  { 
    href: "/", 
    label: "หน้าหลัก",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: "/course", 
    label: "Course",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  { 
    href: "/tutor", 
    label: "Tutor",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    href: "/mockexam", 
    label: "Mock Exam",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  { 
    href: "/aboutus", 
    label: "AboutUs",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  { 
    href: "/contactus", 
    label: "ContactUs",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )
  },
  { 
    href: "/register", 
    label: "Register",
    icon: (
      <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    )
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 dark:border-zinc-800/80 dark:bg-zinc-950/90 supports-[backdrop-filter]:dark:bg-zinc-950/80 shadow-sm shadow-zinc-200/50 dark:shadow-zinc-900/50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <Link 
          href="/" 
          className="group relative flex items-center gap-2 text-xl font-bold tracking-tight"
        >
          <span className="absolute -inset-1 rounded-lg bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 opacity-0 blur transition-opacity duration-300 group-hover:opacity-20 dark:opacity-0 dark:group-hover:opacity-30"></span>
          <span className="relative flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            <span className="bg-gradient-to-r from-zinc-900 via-orange-600 to-zinc-900 bg-clip-text text-transparent transition-all duration-300 group-hover:from-orange-600 group-hover:via-orange-500 group-hover:to-orange-600 dark:from-white dark:via-orange-400 dark:to-white dark:group-hover:from-orange-400 dark:group-hover:via-orange-300 dark:group-hover:to-orange-400">
              ScienceHome
            </span>
          </span>
        </Link>
        
        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-2 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group relative flex items-center gap-2 overflow-hidden rounded-xl px-4 py-2.5 transition-all duration-300 ${
                    active
                      ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 shadow-md shadow-orange-500/20 dark:from-orange-950/40 dark:to-orange-900/20 dark:text-orange-400 dark:shadow-orange-500/10"
                      : "text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-900 hover:shadow-md hover:shadow-zinc-200/50 dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white dark:hover:shadow-zinc-800/50"
                  }`}
                >
                  {/* Hover background effect */}
                  <span className={`absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 transition-opacity duration-300 ${
                    !active && "group-hover:opacity-100"
                  }`}></span>
                  
                  {/* Icon */}
                  <span className={`relative z-10 transition-transform duration-300 ${
                    active 
                      ? "text-orange-600 dark:text-orange-400" 
                      : "text-zinc-500 group-hover:scale-110 group-hover:text-orange-600 dark:text-zinc-400 dark:group-hover:text-orange-400"
                  }`}>
                    {item.icon}
                  </span>
                  
                  {/* Label */}
                  <span className="relative z-10 font-medium">{item.label}</span>
                  
                  {/* Active indicator */}
                  {active && (
                    <>
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent dark:via-orange-400"></span>
                      <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 dark:bg-orange-400 dark:shadow-orange-400/50"></span>
                    </>
                  )}
                  
                  {/* Hover ripple effect */}
                  {!active && (
                    <span className="absolute inset-0 -z-0 scale-0 rounded-full bg-orange-500/20 opacity-0 transition-all duration-500 group-hover:scale-150 group-hover:opacity-100"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="group relative rounded-xl p-2.5 text-zinc-700 transition-all duration-300 hover:bg-zinc-100 hover:shadow-md dark:text-zinc-300 dark:hover:bg-zinc-800 md:hidden"
          aria-label="Toggle menu"
        >
          <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
          <svg
            className={`relative z-10 h-6 w-6 transition-transform duration-300 ${mobileMenuOpen ? "rotate-90" : ""}`}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div className={`overflow-hidden transition-all duration-500 ease-in-out md:hidden ${
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="border-t border-zinc-200/80 bg-white/95 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/95">
          <ul className="space-y-1 px-4 py-3">
            {navItems.map((item, index) => {
              const active = pathname === item.href;
              return (
                <li 
                  key={item.href}
                  className={`transition-all duration-300 ${
                    mobileMenuOpen 
                      ? "translate-x-0 opacity-100" 
                      : "translate-x-4 opacity-0"
                  }`}
                  style={{ 
                    transitionDelay: mobileMenuOpen ? `${index * 50}ms` : '0ms' 
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      active
                        ? "bg-gradient-to-r from-orange-50 to-orange-100/50 text-orange-600 shadow-md shadow-orange-500/20 dark:from-orange-950/40 dark:to-orange-900/20 dark:text-orange-400 dark:shadow-orange-500/10"
                        : "text-zinc-700 hover:bg-zinc-100/80 hover:text-zinc-900 hover:shadow-sm dark:text-zinc-300 dark:hover:bg-zinc-800/80 dark:hover:text-white"
                    }`}
                  >
                    <span className={`transition-transform duration-300 ${
                      active 
                        ? "text-orange-600 dark:text-orange-400" 
                        : "text-zinc-500 group-hover:scale-110 group-hover:text-orange-600 dark:text-zinc-400 dark:group-hover:text-orange-400"
                    }`}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-orange-500 shadow-lg shadow-orange-500/50 dark:bg-orange-400 dark:shadow-orange-400/50"></span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}


