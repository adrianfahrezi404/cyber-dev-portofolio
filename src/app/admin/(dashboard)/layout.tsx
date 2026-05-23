import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AuthenticatedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <div className="pl-64 min-h-screen flex flex-col">
        <main className="flex-1 p-8 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
