"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";

/** PDP hero — full-bleed swipeable photo carousel with a numbered "current/total" badge
    (matches the reference IndiaMART Brands PDP) rather than plain dots, since a buyer scanning
    a 15-photo listing wants to know exactly how many more there are. */
export default function ProductGallery({ images, alt, overlay }: { images: string[]; alt: string; overlay?: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const distinct = Array.from(new Set(images));

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el || el.clientWidth === 0) return;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <div className="relative mx-4 mt-1 aspect-square overflow-hidden rounded-2xl bg-[var(--color-surface-2)]">
      <div ref={scrollerRef} onScroll={onScroll} className="flex h-full w-full snap-x-mandatory overflow-x-auto scrollbar-none">
        {distinct.map((src) => (
          <div key={src} className="h-full w-full shrink-0 snap-center">
            <img src={src} alt={alt} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
        ))}
      </div>

      {overlay && <div className="absolute left-3 top-3 flex flex-col gap-1.5">{overlay}</div>}

      {distinct.length > 1 && (
        <span className="absolute right-3 top-3 rounded-full bg-black/60 px-2 py-0.5 text-[10.5px] font-bold text-white backdrop-blur">
          {active + 1} / {distinct.length}
        </span>
      )}
    </div>
  );
}
