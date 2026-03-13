import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params;
    const filePath = path.join(contentDir, category, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Doc not found" }, { status: 404 });
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const { data, content: body } = matter(content);

    return NextResponse.json({
      category,
      slug,
      ...data,
      content: body,
      raw: content,
    });
  } catch {
    return NextResponse.json({ error: "Failed to get doc" }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 });
    }

    const categoryPath = path.join(contentDir, category);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
    }

    const filePath = path.join(categoryPath, `${slug}.mdx`);
    fs.writeFileSync(filePath, content, "utf-8");

    return NextResponse.json({ success: true, path: filePath });
  } catch {
    return NextResponse.json({ error: "Failed to save doc" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { category: string; slug: string } }
) {
  try {
    const { category, slug } = params;
    const filePath = path.join(contentDir, category, `${slug}.mdx`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Doc not found" }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete doc" }, { status: 500 });
  }
}
