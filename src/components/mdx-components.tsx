import type { MDXComponents } from "mdx/types";

function Callout({ children, type = "info" }: { children: React.ReactNode; type?: "info" | "warning" | "tip" }) {
  const styles = {
    info: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300",
    warning: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
    tip: "border-green-500/30 bg-green-500/5 text-green-700 dark:text-green-300",
  };
  const icons = {
    info: "i",
    warning: "!",
    tip: "✓",
  };

  return (
    <div className={`my-6 rounded-lg border-l-4 p-4 ${styles[type]}`}>
      <div className="flex gap-3">
        <span className="font-bold text-sm mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center border border-current/20">
          {icons[type]}
        </span>
        <div className="text-sm [&>p]:m-0">{children}</div>
      </div>
    </div>
  );
}

function PlatformBadge({ platform }: { platform: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {platform}
    </span>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  PlatformBadge,
  h1: (props) => <h1 className="text-3xl font-bold tracking-tight mt-2 mb-4" {...props} />,
  h2: (props) => <h2 className="text-2xl font-semibold tracking-tight mt-10 mb-4 pb-2 border-b border-border" {...props} />,
  h3: (props) => <h3 className="text-xl font-semibold mt-8 mb-3" {...props} />,
  h4: (props) => <h4 className="text-lg font-semibold mt-6 mb-2" {...props} />,
  p: (props) => <p className="leading-7 [&:not(:first-child)]:mt-4" {...props} />,
  ul: (props) => <ul className="my-4 ml-6 list-disc space-y-2 [&>li]:leading-7" {...props} />,
  ol: (props) => <ol className="my-4 ml-6 list-decimal space-y-2 [&>li]:leading-7" {...props} />,
  li: (props) => <li className="leading-7" {...props} />,
  blockquote: (props) => (
    <blockquote className="mt-4 border-l-4 border-primary/30 pl-4 text-muted-foreground italic" {...props} />
  ),
  table: (props) => (
    <div className="my-6 w-full overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-muted/50" {...props} />,
  th: (props) => <th className="px-4 py-2.5 text-left font-medium text-foreground border-b border-border" {...props} />,
  td: (props) => <td className="px-4 py-2.5 border-b border-border" {...props} />,
  pre: (props) => (
    <pre className="my-4 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm" {...props} />
  ),
  code: ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className;
    if (isInline) {
      return <code className="rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono" {...props} />;
    }
    return <code className={className} {...props} />;
  },
  a: (props) => (
    <a className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity" target={props.href?.startsWith("http") ? "_blank" : undefined} {...props} />
  ),
  hr: () => <hr className="my-8 border-border" />,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img className="rounded-lg border border-border my-6" alt={props.alt || ""} {...props} />
  ),
};
