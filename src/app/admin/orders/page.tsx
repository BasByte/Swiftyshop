import prisma from "@/src/lib/prisma";
import OrderTable from "@/src/components/OrderTable";
import { getSession } from "@/src/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await getSession();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true
    }
  });

  return <OrderTable initialOrders={orders} role={session?.role} />;
}
