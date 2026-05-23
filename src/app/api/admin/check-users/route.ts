import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
  try {
    const [result] = await db.select({ value: count() }).from(users);
    return NextResponse.json({ success: true, count: result?.value ?? 0 });
  } catch (error) {
    console.error("Failed to check admin users count:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
