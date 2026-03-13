"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { NavCategory } from "@/lib/docs";

interface MobileSidebarProps {
  navigation: NavCategory[];
}

export function MobileSidebar({ navigation }: MobileSidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg border border-border w-full"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        文档导航
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={`ml-auto transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <nav className="mt-2 border border-border rounded-lg bg-card p-3 space-y-4">
          {navigation.map((cat) => (
            <div key={cat.slug}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5 px-2">
                {cat.label}
              </h4>
              <ul className="space-y-0.5">
                {cat.items.map((item) => {
                  const href = `/docs/${cat.slug}/${item.slug}`;
                  const isActive = pathname === href;
                  return (
                    <li key={item.slug}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`block px-2 py-1.5 text-sm rounded-md ${
                          isActive
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      )}
    </div>
  );
}
