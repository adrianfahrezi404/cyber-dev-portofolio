import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { technologies } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── GET: Fetch all technologies ──
export async function GET() {
  try {
    const list = await db
      .select()
      .from(technologies)
      .orderBy(desc(technologies.id));
    return NextResponse.json({ success: true, technologies: list });
  } catch (error) {
    console.error("GET technologies error:", error);
    return NextResponse.json({ error: "Failed to fetch technologies." }, { status: 500 });
  }
}

// ── POST: Add a new technology (Admin only) ──
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { name, iconUrl, category, experienceYears, experienceMonths } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const [inserted] = await db
      .insert(technologies)
      .values({
        name,
        iconUrl: iconUrl || null,
        category: category || "OTHER",
        experienceYears: experienceYears || 0,
        experienceMonths: experienceMonths || 0,
      })
      .returning();

    revalidatePath("/");
    return NextResponse.json({ success: true, technology: inserted }, { status: 201 });
  } catch (error: any) {
    console.error("POST technology error:", error);
    if (error.code === '23505') { // Unique violation in Postgres
      return NextResponse.json({ error: "Technology name already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to save technology." }, { status: 500 });
  }
}

// ── PUT: Update an existing technology (Admin only) ──
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, name, iconUrl, category, experienceYears, experienceMonths } = body;

    if (!id || !name) {
      return NextResponse.json({ error: "ID and Name are required." }, { status: 400 });
    }

    const [updated] = await db
      .update(technologies)
      .set({
        name,
        iconUrl: iconUrl || null,
        category: category || "OTHER",
        experienceYears: experienceYears || 0,
        experienceMonths: experienceMonths || 0,
      })
      .where(eq(technologies.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Technology not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, technology: updated });
  } catch (error: any) {
    console.error("PUT technology error:", error);
    if (error.code === '23505') { // Unique violation in Postgres
      return NextResponse.json({ error: "Technology name already exists." }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update technology." }, { status: 500 });
  }
}

// ── DELETE: Remove a technology (Admin only) ──
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    if (!idStr) {
      return NextResponse.json({ error: "ID required." }, { status: 400 });
    }

    const id = parseInt(idStr);
    const [deleted] = await db
      .delete(technologies)
      .where(eq(technologies.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Technology not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Technology deleted successfully." });
  } catch (error) {
    console.error("DELETE technology error:", error);
    return NextResponse.json({ error: "Failed to delete technology." }, { status: 500 });
  }
}
