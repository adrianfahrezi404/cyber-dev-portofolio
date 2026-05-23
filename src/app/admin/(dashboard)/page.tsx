import { db } from "@/lib/db";
import { projectsWriteups, certificates, experiences, contactMessages } from "@/lib/db/schema";
import { count, desc, eq } from "drizzle-orm";
import Link from "next/link";
import ManualStatsForm from "@/components/admin/ManualStatsForm";

export const revalidate = 0; // Disable static cache for admin dashboard

export default async function AdminDashboardPage() {
  let stats = { projects: 0, certificates: 0, experiences: 0, messages: 0, unreadMessages: 0 };
  let recentMsgs: any[] = [];

  try {
    const [pResult] = await db.select({ value: count() }).from(projectsWriteups);
    const [cResult] = await db.select({ value: count() }).from(certificates);
    const [eResult] = await db.select({ value: count() }).from(experiences);
    const [mResult] = await db.select({ value: count() }).from(contactMessages);
    const [uResult] = await db.select({ value: count() }).from(contactMessages).where(eq(contactMessages.isRead, false));

    stats = {
      projects: pResult?.value ?? 0,
      certificates: cResult?.value ?? 0,
      experiences: eResult?.value ?? 0,
      messages: mResult?.value ?? 0,
      unreadMessages: uResult?.value ?? 0,
    };

    recentMsgs = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt))
      .limit(3);
  } catch (err) {
    console.error("Dashboard database fetch failed:", err);
  }

  const statCards = [
    {
      title: "Selected Projects",
      value: stats.projects,
      href: "/admin/content",
      color: "border-accent-cyan/20 text-accent-cyan bg-accent-cyan/5",
    },
    {
      title: "Certifications",
      value: stats.certificates,
      href: "/admin/certificates",
      color: "border-accent-purple/20 text-accent-purple bg-accent-purple/5",
    },
    {
      title: "Experiences",
      value: stats.experiences,
      href: "/admin/experiences",
      color: "border-accent-pink/20 text-accent-pink bg-accent-pink/5",
    },
    {
      title: "Messages",
      value: stats.messages,
      subtext: `${stats.unreadMessages} unread`,
      href: "/admin/messages",
      color: "border-accent-green/20 text-accent-green bg-accent-green/5",
    },
  ];

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-100">System Dashboard</h1>
        <p className="text-xs text-text-muted mt-2">
          OVERVIEW OF SYSTEM METRICS AND INCOMING TRANSMISSIONS
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className={`glass-card p-6 border transition-all hover:scale-[1.03] flex flex-col justify-between ${card.color}`}
          >
            <div>
              <p className="text-xs text-text-muted uppercase tracking-wider">{card.title}</p>
              <p className="text-4xl font-bold mt-4">{card.value}</p>
            </div>
            {card.subtext && (
              <span className="text-[10px] text-text-muted mt-2 block">
                {card.subtext}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages */}
        <div className="lg:col-span-2 glass-card p-6 border border-white/5 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent-cyan">
              Recent Inbox Transmissions
            </h3>
            <Link
              href="/admin/messages"
              className="text-xs text-accent-cyan hover:underline"
            >
              View All
            </Link>
          </div>

          {recentMsgs.length === 0 ? (
            <p className="text-xs text-text-muted italic py-4">No messages received yet.</p>
          ) : (
            <div className="space-y-4">
              {recentMsgs.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-4 rounded-lg border text-xs space-y-2 transition-all ${
                    msg.isRead
                      ? "bg-white/[0.01] border-white/5 text-text-secondary"
                      : "bg-accent-cyan/[0.02] border-accent-cyan/15 text-text-primary shadow-[0_0_10px_rgba(0,240,255,0.02)]"
                  }`}
                >
                  <div className="flex justify-between items-center font-semibold">
                    <span>{msg.name} ({msg.email})</span>
                    <span className="text-[10px] text-text-muted font-normal">
                      {new Date(msg.createdAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="font-sans leading-relaxed break-words line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 border border-white/5 space-y-6">
          <div className="border-b border-white/5 pb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-accent-purple">
              Quick Operations
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/admin/content?action=new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-medium text-text-secondary hover:text-text-primary transition-all border border-white/5"
            >
              <span>+</span> Create New Project
            </Link>
            <Link
              href="/admin/certificates?action=new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-medium text-text-secondary hover:text-text-primary transition-all border border-white/5"
            >
              <span>+</span> Add Certificate
            </Link>
            <Link
              href="/admin/experiences?action=new"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono font-medium text-text-secondary hover:text-text-primary transition-all border border-white/5"
            >
              <span>+</span> Add Timeline Entry
            </Link>
          </div>
        </div>
      </div>

      {/* Manual Stats Configuration */}
      <ManualStatsForm />
    </div>
  );
}
