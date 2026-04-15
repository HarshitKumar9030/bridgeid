import { ReactNode } from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-72 transition-all duration-300">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/5 p-4 pt-20 md:p-8 md:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}

