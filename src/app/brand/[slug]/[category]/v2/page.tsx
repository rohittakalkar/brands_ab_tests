import { loadBrandMcatContext, brandMcatStaticParams } from "@/lib/brandMcatContext";
import BrandMcatPageBody from "@/components/BrandMcatPageBody";
import ProductCardV2 from "@/components/ProductCardV2";

export function generateStaticParams() {
  return brandMcatStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const ctx = loadBrandMcatContext(slug, category);
  return { title: ctx ? `${ctx.line.name} — ${ctx.cat.name} | Brands` : "Brand Catalog — Brands" };
}

export default async function BrandMcatV2({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  return <BrandMcatPageBody slug={slug} category={category} active={2} CardComponent={ProductCardV2} />;
}
