"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import type { Product, Supplier } from "@/types";
import SellerCard from "./SellerCard";
import ViewMoreButton from "./ViewMoreButton";
import SectionHeading from "./SectionHeading";

const STEP = 8;

/** The Best Sellers section specifically — seller-first cards rather than the product-first
    cards used everywhere else on the page. "View More" reveals the next batch from this same
    pool in place, rather than sending the buyer off to the All Products section below. */
export default function SellerRow({
  pool,
  heading,
  variantsByProductId,
  variant = 1,
}: {
  pool: { product: Product; supplier: Supplier | null }[];
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
        <SectionHeading icon={Flame} animation="pulse" accent="rose">{heading}</SectionHeading>
        {hasMore && <ViewMoreButton variant={variant} onClick={() => setCount((c) => Math.min(c + STEP, pool.length))} />}
      </div>
      <div className="-mx-2 flex items-start gap-2 overflow-x-auto scrollbar-none px-2 pb-1">
        {visible.map(({ product, supplier }) => (
          <SellerCard key={product.id} product={product} supplier={supplier} variants={variantsByProductId?.[product.id] ?? []} />
        ))}
      </div>
    </div>
  );
}
