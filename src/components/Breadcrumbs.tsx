import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 px-4 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-[var(--color-ink-faint)] overflow-x-auto scrollbar-none whitespace-nowrap"
    >
      <Link href="/" className="shrink-0 hover:text-[var(--color-brand)]"><Home className="size-3" aria-hidden="true" /></Link>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        if (isLast) {
          return (
            <Fragment key={i}>
              <ChevronRight className="size-2.5 shrink-0" aria-hidden="true" />
              <span className="shrink-0 truncate max-w-[140px] font-extrabold normal-case text-[var(--color-brand)]" aria-current="page">{item.label}</span>
            </Fragment>
          );
        }
        return (
          <Fragment key={i}>
            <ChevronRight className="size-2.5 shrink-0" aria-hidden="true" />
            {item.href ? (
              <Link href={item.href} className="shrink-0 hover:text-[var(--color-brand)]">{item.label}</Link>
            ) : (
              <span className="shrink-0 truncate max-w-[120px]">{item.label}</span>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
