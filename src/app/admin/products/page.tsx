import prisma from "@/src/lib/prisma";
import ProductTable from "@/src/components/ProductTable";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <ProductTable initialProducts={products} />;
}
