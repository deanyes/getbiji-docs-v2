"use client";

import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              Get笔记
            </span>
            <span className="text-sm text-muted-foreground font-normal hidden sm:inline">
              文档中心
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/docs/guide/getting-started" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              指南
            </Link>
            <Link href="/docs/features/ai-assistant" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              功能
            </Link>
            <Link href="/docs/faq/general" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              FAQ
            </Link>
            <Link href="/docs/changelog/v2" className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
              更新日志
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition-colors"
            aria-label="菜单"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-background px-4 py-3 space-y-1">
          <Link href="/docs/guide/getting-started" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-muted">指南</Link>
          <Link href="/docs/features/ai-assistant" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-muted">功能</Link>
          <Link href="/docs/faq/general" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-muted">FAQ</Link>
          <Link href="/docs/changelog/v2" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 text-sm rounded-md hover:bg-muted">更新日志</Link>
        </nav>
      )}
    </header>
  );
}
