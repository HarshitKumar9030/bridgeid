import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold">Welcome, {session.user?.name}</h1>
      <DashboardOverview />
    </div>
  );
}

