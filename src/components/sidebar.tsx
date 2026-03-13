"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavCategory } from "@/lib/docs";

interface SidebarProps {
  navigation: NavCategory[];
}

export function Sidebar({ navigation }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <nav className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto pb-10 pr-4 -mr-4 scrollbar-thin">
        <div className="space-y-6">
          {navigation.map((cat) => (
            <div key={cat.slug}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-3">
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
                        className={`block px-3 py-1.5 text-sm rounded-md transition-colors ${
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
        </div>
      </nav>
    </aside>
  );
}
