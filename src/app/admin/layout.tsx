"use client";

import Footer from "@/components/common/layout/footer";
import Header from "@/components/common/layout/header";
import { Sidebar } from "@/components/common/layout/sidebar";
import { useInitializeData } from "@/hooks/useAppData";

function DashboardContent({ children }: { children: React.ReactNode }) {
  useInitializeData();
  return children;
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden">
        <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col p-4 md:p-8 overflow-y-auto [scrollbar-gutter:stable]">
            <div className="flex-1">
              <DashboardContent>{children}</DashboardContent>
            </div>
            <Footer isDashboard={true} />
          </main>
        </div>
      </div>
    </div>
  );
}
