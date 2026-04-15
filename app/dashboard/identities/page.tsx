import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { IdentitiesWorkspace } from "@/components/dashboard/IdentitiesWorkspace";

export default async function IdentitiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <IdentitiesWorkspace />;
}

