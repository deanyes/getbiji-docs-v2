import { notFound } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { MobileSidebar } from "@/components/mobile-sidebar";
import { TableOfContents } from "@/components/toc";
import { Breadcrumb } from "@/components/breadcrumb";
import { getDocBySlug, getNavigation, extractTOC, getAllDocs } from "@/lib/docs";
import { renderMDX } from "@/lib/mdx";
import type { Metadata } from "next";

interface Props {
  params: { category: string; slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const doc = getDocBySlug(params.category, params.slug);
  if (!doc) return {};
  return {
    title: doc.meta.title,
    description: doc.meta.description,
  };
}

export async function generateStaticParams() {
  const docs = getAllDocs();
  return docs.map((doc) => ({
    category: doc.category,
    slug: doc.slug,
  }));
}

export default async function DocPage({ params }: Props) {
  const doc = getDocBySlug(params.category, params.slug);
  if (!doc) notFound();

  const navigation = getNavigation();
  const toc = extractTOC(doc.content);
  const content = await renderMDX(doc.content);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-10">
        <Sidebar navigation={navigation} />
        <article className="min-w-0 flex-1 max-w-3xl">
          <MobileSidebar navigation={navigation} />
          <Breadcrumb
            items={[
              { label: params.category, href: `/docs/${params.category}/${navigation.find(n => n.slug === params.category)?.items[0]?.slug || ""}` },
              { label: doc.meta.title },
            ]}
          />
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {doc.meta.title}
            </h1>
            {doc.meta.description && (
              <p className="text-lg text-muted-foreground mb-4">
                {doc.meta.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {doc.meta.platform && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium">
                  {doc.meta.platform}
                </span>
              )}
              {doc.meta.updated && (
                <span>更新于 {doc.meta.updated}</span>
              )}
            </div>
          </header>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {content}
          </div>
        </article>
        <TableOfContents items={toc} />
      </div>
    </div>
  );
}
