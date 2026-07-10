import { getBrands, getMcats, getPMcats } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandDirectory from "@/components/BrandDirectory";

export const metadata = { title: "All Brands — Brands" };

export default function BrandDirectoryPage() {
  const brands = [...getBrands()].sort((a, b) => b.rating - a.rating);
  const mcats = getMcats();
  const pcats = getPMcats().filter((p) => mcats.some((m) => m.pmcatId === p.id && getBrands({ mcatId: m.id }).length > 0));
  const mcatIdsByPcatId = Object.fromEntries(pcats.map((p) => [p.id, mcats.filter((m) => m.pmcatId === p.id).map((m) => m.id)]));

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Brands" }]} />
      <BrandDirectory brands={brands} pcats={pcats} mcatIdsByPcatId={mcatIdsByPcatId} />
    </div>
  );
}
