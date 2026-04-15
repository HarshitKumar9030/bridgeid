import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";

export default async function AlertsPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <AlertsPanel />;
}

