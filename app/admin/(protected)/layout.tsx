import { redirect } from "next/navigation";

import { AdminHeader } from "@/components/admin/admin-header";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ToastProvider } from "@/components/ui/toast-provider";
import { getServerAuthSession } from "@/lib/auth/auth";

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerAuthSession();

  if (!session?.user?.isActive) {
    redirect("/admin/login");
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-agromassa-cream text-agromassa-ink lg:flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <AdminHeader
            userEmail={session.user.email}
            userName={session.user.name}
          />
          {children}
        </div>
      </div>
    </ToastProvider>
  );
}
