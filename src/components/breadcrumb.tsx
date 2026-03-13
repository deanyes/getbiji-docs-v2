import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

const categoryLabels: Record<string, string> = {
  guide: "使用指南",
  features: "功能介绍",
  faq: "常见问题",
  changelog: "更新日志",
};

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-6">
      <Link href="/" className="hover:text-foreground transition-colors">
        首页
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mx-2 opacity-40">
            <path d="M9 18l6-6-6-6" />
          </svg>
          {item.href ? (
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {categoryLabels[item.label] || item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
