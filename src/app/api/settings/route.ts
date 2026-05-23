import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { siteStats } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// ── GET: Fetch site stats settings (Admin only) ──
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    let stats = await db.select().from(siteStats).limit(1).then(res => res[0]);

    if (!stats) {
      // Create initial row if it doesn't exist
      [stats] = await db.insert(siteStats).values({ pageViews: 0 }).returning();
    }

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("GET site stats error:", error);
    return NextResponse.json({ error: "Failed to fetch site stats." }, { status: 500 });
  }
}

// ── PUT: Update manual site stats (Admin only) ──
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { manualProjectsCount, manualCertsCount, manualCtfsCount, manualYearsExp, manualMonthsExp } = body;

    let stats = await db.select().from(siteStats).limit(1).then(res => res[0]);

    if (!stats) {
      [stats] = await db.insert(siteStats).values({ 
        pageViews: 0,
        manualProjectsCount: manualProjectsCount !== "" ? parseInt(manualProjectsCount) : null,
        manualCertsCount: manualCertsCount !== "" ? parseInt(manualCertsCount) : null,
        manualCtfsCount: manualCtfsCount !== "" ? parseInt(manualCtfsCount) : null,
        manualYearsExp: manualYearsExp !== "" ? parseInt(manualYearsExp) : null,
        manualMonthsExp: manualMonthsExp !== "" ? parseInt(manualMonthsExp) : null,
      }).returning();
    } else {
      [stats] = await db.update(siteStats).set({
        manualProjectsCount: manualProjectsCount !== "" ? parseInt(manualProjectsCount) : null,
        manualCertsCount: manualCertsCount !== "" ? parseInt(manualCertsCount) : null,
        manualCtfsCount: manualCtfsCount !== "" ? parseInt(manualCtfsCount) : null,
        manualYearsExp: manualYearsExp !== "" ? parseInt(manualYearsExp) : null,
        manualMonthsExp: manualMonthsExp !== "" ? parseInt(manualMonthsExp) : null,
      }).returning();
    }
    // Purge Next.js router/static cache for the homepage
    revalidatePath("/");

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("PUT site stats error:", error);
    return NextResponse.json({ error: "Failed to update site stats." }, { status: 500 });
  }
}
