import { getProducts, getBrands } from "@/lib/data";
import Breadcrumbs from "@/components/Breadcrumbs";
import WishlistView from "@/components/WishlistView";

export const metadata = { title: "Wishlist — Brands" };

export default function WishlistPage() {
  const products = getProducts();
  const brandsById = new Map(getBrands().map((b) => [b.id, b]));

  return (
    <div className="pb-6">
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <div className="px-4 pt-2 pb-1">
        <h1 className="text-lg font-black">My Wishlist</h1>
      </div>
      <WishlistView products={products} brandsById={brandsById} />
    </div>
  );
}
