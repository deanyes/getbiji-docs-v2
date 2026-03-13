import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface DocMeta {
  title: string;
  description: string;
  platform: string;
  updated: string;
  category: string;
  order: number;
  slug: string;
}

export interface DocPage {
  meta: DocMeta;
  content: string;
}

export interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export interface NavCategory {
  label: string;
  slug: string;
  items: DocMeta[];
}

const categoryLabels: Record<string, string> = {
  guide: "使用指南",
  features: "功能介绍",
  faq: "常见问题",
  changelog: "更新日志",
};

const categoryOrder = ["guide", "features", "faq", "changelog"];

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

export function getDocBySlug(category: string, slug: string): DocPage | null {
  const dir = path.join(contentDir, category);
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);

  const filePath = fs.existsSync(mdxPath) ? mdxPath : fs.existsSync(mdPath) ? mdPath : null;
  if (!filePath) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    meta: {
      title: data.title || slug,
      description: data.description || "",
      platform: data.platform || "全平台",
      updated: String(data.updated || ""),
      category: data.category || category,
      order: data.order || 999,
      slug,
    },
    content,
  };
}

export function getAllDocs(): DocMeta[] {
  const docs: DocMeta[] = [];
  for (const cat of categoryOrder) {
    const dir = path.join(contentDir, cat);
    for (const file of getMdxFiles(dir)) {
      const slug = file.replace(/\.(mdx|md)$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data } = matter(raw);
      docs.push({
        title: data.title || slug,
        description: data.description || "",
        platform: data.platform || "全平台",
        updated: String(data.updated || ""),
        category: data.category || cat,
        order: data.order || 999,
        slug,
      });
    }
  }
  return docs;
}

export function getNavigation(): NavCategory[] {
  const docs = getAllDocs();
  return categoryOrder
    .map((cat) => ({
      label: categoryLabels[cat] || cat,
      slug: cat,
      items: docs
        .filter((d) => d.category === cat)
        .sort((a, b) => a.order - b.order),
    }))
    .filter((c) => c.items.length > 0);
}

export function extractTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{2,4})\s+(.+)$/gm;
  const items: TOCItem[] = [];
  let match;
  while ((match = headingRegex.exec(content)) !== null) {
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fff]+/g, "-")
      .replace(/(^-|-$)/g, "");
    items.push({ id, text, level: match[1].length });
  }
  return items;
}
