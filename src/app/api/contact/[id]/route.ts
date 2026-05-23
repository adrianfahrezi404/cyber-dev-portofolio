import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is authenticated (admin only)
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { isPinned } = body;
    const { id } = await params;

    if (typeof isPinned !== "boolean") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    await db
      .update(contactMessages)
      .set({ isPinned })
      .where(eq(contactMessages.id, parseInt(id, 10)));

    return NextResponse.json({ success: true, message: "Comment pinned status updated" });
  } catch (error) {
    console.error("Failed to pin comment:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
