import { LoginForm } from "@/components/auth/LoginForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 pt-28 pb-16 selection:bg-primary/30 z-10 w-full overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
      <div className="absolute -left-1/4 top-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none mix-blend-screen opacity-50" />
      <div className="absolute -right-1/4 bottom-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none mix-blend-screen opacity-50" />
      <LoginForm />
    </div>
  );
}

