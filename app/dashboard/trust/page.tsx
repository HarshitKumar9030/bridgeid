import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { TrustWorkspace } from "@/components/dashboard/TrustWorkspace";

export default async function TrustPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <TrustWorkspace />;
}

