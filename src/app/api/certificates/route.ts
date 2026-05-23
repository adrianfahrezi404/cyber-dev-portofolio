import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { certificates } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── GET: Fetch all certificates (Public/Client) ──
export async function GET() {
  try {
    const list = await db
      .select()
      .from(certificates)
      .orderBy(desc(certificates.issueDate));
    return NextResponse.json({ success: true, certificates: list });
  } catch (error) {
    console.error("GET certificates error:", error);
    return NextResponse.json({ error: "Failed to fetch certificates." }, { status: 500 });
  }
}

// ── POST: Add a new certificate (Admin only) ──
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { title, issuer, issueDate, credentialUrl, imageUrl, category } = body;

    if (!title || !issuer || !issueDate) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const [inserted] = await db
      .insert(certificates)
      .values({
        title,
        issuer,
        issueDate: new Date(issueDate).toISOString().split("T")[0],
        credentialUrl: credentialUrl || null,
        imageUrl: imageUrl || null,
        category: category || null,
      })
      .returning();

    revalidatePath("/");
    return NextResponse.json({ success: true, certificate: inserted }, { status: 201 });
  } catch (error) {
    console.error("POST certificate error:", error);
    return NextResponse.json({ error: "Failed to save certificate." }, { status: 500 });
  }
}

// ── PUT: Update an existing certificate (Admin only) ──
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, issuer, issueDate, credentialUrl, imageUrl, category } = body;

    if (!id || !title || !issuer || !issueDate) {
      return NextResponse.json({ error: "Required fields missing." }, { status: 400 });
    }

    const [updated] = await db
      .update(certificates)
      .set({
        title,
        issuer,
        issueDate: new Date(issueDate).toISOString().split("T")[0],
        credentialUrl: credentialUrl || null,
        imageUrl: imageUrl || null,
        category: category || null,
      })
      .where(eq(certificates.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, certificate: updated });
  } catch (error) {
    console.error("PUT certificate error:", error);
    return NextResponse.json({ error: "Failed to update certificate." }, { status: 500 });
  }
}

// ── DELETE: Remove a certificate (Admin only) ──
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
      .delete(certificates)
      .where(eq(certificates.id, id))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Certificate not found." }, { status: 444 });
    }

    revalidatePath("/");
    return NextResponse.json({ success: true, message: "Certificate deleted successfully." });
  } catch (error) {
    console.error("DELETE certificate error:", error);
    return NextResponse.json({ error: "Failed to delete certificate." }, { status: 500 });
  }
}
