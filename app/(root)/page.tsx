import ProductList from "@/components/shared/product/ProductList";
import { getLatestProducuts } from "@/lib/actions/product.actions";

export default async function Home() {
  const latestProducts = await getLatestProducuts()
  return (
    <>
      <ProductList data={latestProducts} title="Newest Arrivals" limit={4} />
    </>
  );
}
