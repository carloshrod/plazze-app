"use client";

import Footer from "@/components/common/layout/footer";
import Header from "@/components/common/layout/header";
import { Sidebar } from "@/components/features/admin/sidebar";
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
    <>
      <Header />
      <div className="min-h-[calc(100vh-64px)] bg-gray-50">
        <div className="flex flex-col md:flex-row">
          <Sidebar />
          <main className="flex-1 p-4 md:p-8 overflow-x-auto">
            <DashboardContent>{children}</DashboardContent>
          </main>
        </div>
        <Footer isDashboard={true} />
      </div>
    </>
  );
}
