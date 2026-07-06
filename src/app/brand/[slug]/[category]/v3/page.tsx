import { loadBrandMcatContext, brandMcatStaticParams } from "@/lib/brandMcatContext";
import BrandMcatPageBody from "@/components/BrandMcatPageBody";
import ProductCardV3 from "@/components/ProductCardV3";

export function generateStaticParams() {
  return brandMcatStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  const ctx = loadBrandMcatContext(slug, category);
  return { title: ctx ? `${ctx.line.name} — ${ctx.cat.name} | Brands` : "Brand Catalog — Brands" };
}

export default async function BrandMcatV3({ params }: { params: Promise<{ slug: string; category: string }> }) {
  const { slug, category } = await params;
  return <BrandMcatPageBody slug={slug} category={category} active={3} CardComponent={ProductCardV3} />;
}
