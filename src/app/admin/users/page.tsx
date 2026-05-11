import prisma from "@/src/lib/prisma";
import UserTable from "@/src/components/UserTable";
import { getSession } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await getSession();
  if (session?.role !== "admin") {
    redirect("/admin");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    }
  });

  return <UserTable initialUsers={users} />;
}
