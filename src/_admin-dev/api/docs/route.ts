import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

interface DocEntry {
  category: string;
  slug: string;
  path: string;
  filePath: string;
  order?: number;
  [key: string]: unknown;
}

const contentDir = path.join(process.cwd(), "content");

export async function GET() {
  try {
    const docs: DocEntry[] = [];
    const categories = fs.readdirSync(contentDir);

    for (const category of categories) {
      const categoryPath = path.join(contentDir, category);
      if (!fs.statSync(categoryPath).isDirectory()) continue;

      const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith(".mdx"));
      for (const file of files) {
        const filePath = path.join(categoryPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(content);
        const slug = file.replace(".mdx", "");

        docs.push({
          category,
          slug,
          ...data,
          path: `/docs/${category}/${slug}`,
          filePath: `content/${category}/${file}`,
        });
      }
    }

    // Sort by category and order
    docs.sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return (a.order ?? 0) - (b.order ?? 0);
    });

    return NextResponse.json({ docs, total: docs.length });
  } catch {
    return NextResponse.json({ error: "Failed to list docs" }, { status: 500 });
  }
}
