import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CYBER.DEV | Admin",
  description: "Administrative Control Panel",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-[#0a0e1a] text-slate-100">{children}</div>;
}
