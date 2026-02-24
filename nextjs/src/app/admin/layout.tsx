import "@/app/admin/admin.css";
import { AdminAuthProvider } from "@/components/admin/AuthProvider";
import { AdminThemeProvider } from "@/components/admin/ThemeProvider";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Di'aaru Admin | Obsidian CMS",
  description: "Management portal for Di'aaru Luxury Diamonds",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <AdminThemeProvider>
        <div className="flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
          <AdminSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <AdminHeader />
            <main className="flex-1 p-6 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </AdminThemeProvider>
    </AdminAuthProvider>
  );
}
