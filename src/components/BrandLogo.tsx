"use client";

import { useState } from "react";

export default function BrandLogo({ logo, name, className = "w-full h-full object-contain" }: { logo: string; name: string; className?: string }) {
  const [error, setError] = useState(false);
  const isUrl = logo && logo.startsWith("http");

  if (!isUrl || error) {
    const text = !isUrl && logo ? logo.toUpperCase() : name.split(" ").filter((w) => !["Limited", "India", "Pvt", "Ltd"].includes(w)).map((w) => w[0]).join("").toUpperCase().slice(0, 3);
    return (
      <span className="font-extrabold text-[var(--color-brand)] text-[9px] tracking-tight uppercase select-none text-center leading-none line-clamp-2 px-0.5">
        {text}
      </span>
    );
  }

  return (
    <img src={logo} alt={name} className={className} referrerPolicy="no-referrer" loading="lazy" onError={() => setError(true)} />
  );
}
