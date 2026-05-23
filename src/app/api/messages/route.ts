import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

// ── GET: Fetch all messages (Admin only) ──
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const list = await db
      .select()
      .from(contactMessages)
      .orderBy(desc(contactMessages.createdAt));
    
    return NextResponse.json({ success: true, messages: list });
  } catch (error) {
    console.error("GET messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages." }, { status: 500 });
  }
}

// ── PUT: Mark a message as read (Admin only) ──
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, isRead } = body;

    if (!id) {
      return NextResponse.json({ error: "Message ID required." }, { status: 400 });
    }

    const [updated] = await db
      .update(contactMessages)
      .set({
        isRead: !!isRead,
      })
      .where(eq(contactMessages.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Message not found." }, { status: 444 });
    }

    return NextResponse.json({ success: true, message: updated });
  } catch (error) {
    console.error("PUT message error:", error);
    return NextResponse.json({ error: "Failed to update message status." }, { status: 500 });
  }
}

// ── DELETE: Remove a message (Admin only) ──
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
      .delete(contactMessages)
      .where(eq(contactMessages.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Message not found." }, { status: 444 });
    }

    return NextResponse.json({ success: true, message: "Message deleted successfully." });
  } catch (error) {
    console.error("DELETE message error:", error);
    return NextResponse.json({ error: "Failed to delete message." }, { status: 500 });
  }
}
