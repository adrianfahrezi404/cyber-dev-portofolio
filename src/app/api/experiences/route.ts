import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { experiences } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── GET: Fetch all experiences (Public) ──
export async function GET() {
  try {
    const list = await db
      .select()
      .from(experiences)
      .orderBy(desc(experiences.startDate));
    return NextResponse.json({ success: true, experiences: list });
  } catch (error) {
    console.error("GET experiences error:", error);
    return NextResponse.json({ error: "Failed to fetch experiences." }, { status: 500 });
  }
}

// ── POST: Add experience (Admin only) ──
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { title, companyOrEvent, description, type, startDate, endDate } = body;

    if (!title || !companyOrEvent || !type || !startDate) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const [inserted] = await db
      .insert(experiences)
      .values({
        title,
        companyOrEvent,
        description: description || null,
        type,
        startDate: new Date(startDate).toISOString().split("T")[0],
        endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : null,
      })
      .returning();

    revalidatePath("/");
    return NextResponse.json({ success: true, experience: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST experience error:", error);
    return NextResponse.json({ error: "Failed to save experience." }, { status: 500 });
  }
}

// ── PUT: Update experience (Admin only) ──
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, companyOrEvent, description, type, startDate, endDate } = body;

    if (!id || !title || !companyOrEvent || !type || !startDate) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const [updated] = await db
      .update(experiences)
      .set({
        title,
        companyOrEvent,
        description: description || null,
        type,
        startDate: new Date(startDate).toISOString().split("T")[0],
        endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : null,
      })
      .where(eq(experiences.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Experience not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, experience: updated });
  } catch (error) {
    console.error("PUT experience error:", error);
    return NextResponse.json({ error: "Failed to update experience." }, { status: 500 });
  }
}

// ── DELETE: Remove experience (Admin only) ──
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
      .delete(experiences)
      .where(eq(experiences.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Experience not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Experience deleted successfully." });
  } catch (error) {
    console.error("DELETE experience error:", error);
    return NextResponse.json({ error: "Failed to delete experience." }, { status: 500 });
  }
}
