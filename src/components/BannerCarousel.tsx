"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export interface Banner {
  href: string;
  image: string;
  eyebrow: string;
  title: string;
  cta: string;
}

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setActive(idx);
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x-mandatory overflow-x-auto scrollbar-none"
      >
        {banners.map((b, i) => (
          <Link key={i} href={b.href} className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden">
            <img src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/80">{b.eyebrow}</p>
              <h2 className="mt-1 text-xl font-black leading-tight text-white text-balance">{b.title}</h2>
              <span className="mt-3 inline-flex items-center rounded-full bg-white px-4 py-2 text-[11px] font-extrabold text-[var(--color-ink)]">
                {b.cta}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
        {banners.map((_, i) => (
          <span key={i} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
}
