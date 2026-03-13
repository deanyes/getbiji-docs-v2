import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const contentDir = path.join(process.cwd(), "content");

export async function POST(request: NextRequest) {
  try {
    const { category, slug, title, description, platform, content } = await request.json();

    if (!category || !slug || !title) {
      return NextResponse.json(
        { error: "category, slug, and title are required" },
        { status: 400 }
      );
    }

    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }

    const filePath = path.join(categoryPath, `${slug}.mdx`);
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Doc already exists" }, { status: 409 });
    }

    const now = new Date().toISOString().split("T")[0];
    const mdxContent = `---
title: ${title}
description: ${description || title}
platform: ${platform || "全平台"}
updated: ${now}
category: ${category}
order: 99
---

${content || `# ${title}\n\n内容待补充...`}
`;

    fs.writeFileSync(filePath, mdxContent, "utf-8");

    return NextResponse.json({
      success: true,
      path: `/docs/${category}/${slug}`,
      filePath: `content/${category}/${slug}.mdx`,
    });
  } catch {
    return NextResponse.json({ error: "Failed to create doc" }, { status: 500 });
  }
}
