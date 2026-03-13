import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 text-center">
      <h2 className="text-2xl font-bold mb-2">页面未找到</h2>
      <p className="text-muted-foreground mb-6">你访问的文档页面不存在。</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
      >
        返回首页
      </Link>
    </div>
  );
}
