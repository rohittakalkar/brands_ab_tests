"use client";

import { useRef, useState } from "react";
import Link from "next/link";

/**
 * Multi-slide card media: real photo(s) first, then a data slide summarizing the specs that
 * don't fit in the card's text area — a slide that adds information rather than repeating the
 * same picture. Photo slides are only duplicated when the underlying pool genuinely has more
 * than one distinct image for this product.
 */
export default function ProductImageCarousel({
  photos,
  specHighlights,
  productId,
  productName,
  aspectClassName,
  className = "",
  overlayTopLeft,
  overlayTopRight,
}: {
  photos: string[];
  specHighlights: [string, string][];
  productId: string;
  productName: string;
  aspectClassName: string;
  className?: string;
  overlayTopLeft?: React.ReactNode;
  overlayTopRight?: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const distinctPhotos = Array.from(new Set(photos));
  const slideCount = distinctPhotos.length + (specHighlights.length > 0 ? 1 : 0);

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className={`relative w-full overflow-hidden bg-[var(--color-surface-2)] ${aspectClassName} ${className}`}>
      <div ref={scrollerRef} onScroll={onScroll} className="flex h-full w-full snap-x-mandatory overflow-x-auto scrollbar-none">
        {distinctPhotos.map((src, i) => (
          <Link key={src} href={`/product/${productId}`} className="h-full w-full shrink-0 snap-center" tabIndex={i === 0 ? 0 : -1}>
            <img src={src} alt={productName} className="h-full w-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
          </Link>
        ))}
        {specHighlights.length > 0 && (
          <Link
            href={`/product/${productId}`}
            className="flex h-full w-full shrink-0 snap-center flex-col justify-center gap-1 bg-[var(--color-ink)] p-3"
          >
            <span className="mb-0.5 text-[8.5px] font-black uppercase tracking-wide text-white/50">Key Specs</span>
            {specHighlights.slice(0, 4).map(([k, v]) => (
              <p key={k} className="truncate text-[10px] leading-tight text-white">
                <span className="text-white/55">{k}: </span>
                <span className="font-bold">{v}</span>
              </p>
            ))}
          </Link>
        )}
      </div>

      {slideCount > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-1.5 flex justify-center gap-1 rounded-full">
          {Array.from({ length: slideCount }).map((_, i) => (
            <span key={i} className={`size-1.5 rounded-full ${i === active ? "bg-white" : "bg-white/45"}`} />
          ))}
        </div>
      )}

      {overlayTopLeft && <div className="pointer-events-none absolute left-0 top-0">{overlayTopLeft}</div>}
      {overlayTopRight && <div className="absolute right-0 top-0">{overlayTopRight}</div>}
    </div>
  );
}
