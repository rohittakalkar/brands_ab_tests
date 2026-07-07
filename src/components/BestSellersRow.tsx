"use client";

import { useState, type ComponentType } from "react";
import { TrendingUp } from "lucide-react";
import type { Product } from "@/types";
import ViewMoreButton from "./ViewMoreButton";
import SectionHeading from "./SectionHeading";

const STEP = 8;

/** A horizontally-scrolling row of the category's leading products. Data order is treated as
    relevance/best-selling order rather than inventing a synthetic sales-count field. "View More"
    reveals the next batch from this same pool in place, rather than sending the buyer off to
    the All Products section below. */
export default function BestSellersRow({
  pool,
  CardComponent,
  brandRating,
  heading,
  variantsByProductId,
  variant = 1,
}: {
  pool: Product[];
  CardComponent: ComponentType<{ product: Product; brandRating?: number; variants?: Product[] }>;
  brandRating?: number;
  heading: string;
  variantsByProductId?: Record<string, Product[]>;
  variant?: number;
}) {
  const [count, setCount] = useState(Math.min(STEP, pool.length));
  if (pool.length === 0) return null;
  const visible = pool.slice(0, count);
  const hasMore = count < pool.length;

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <SectionHeading icon={TrendingUp} animation="bounce" accent="amber">{heading}</SectionHeading>
        {hasMore && <ViewMoreButton variant={variant} onClick={() => setCount((c) => Math.min(c + STEP, pool.length))} />}
      </div>
      <div className="-mx-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
        {visible.map((p) => (
          <div key={p.id} className="w-36 shrink-0">
            <CardComponent product={p} brandRating={brandRating} variants={variantsByProductId?.[p.id] ?? []} />
          </div>
        ))}
      </div>
    </div>
  );
}
