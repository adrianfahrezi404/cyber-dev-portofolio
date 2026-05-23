import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contactMessages } from "@/lib/db/schema";
import { contactSchema } from "@/lib/validators";
import { contactRateLimit } from "@/lib/rate-limit";
import { desc } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = contactRateLimit(ip);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Terlalu banyak permintaan. Coba lagi nanti.",
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.resetAt.toString(),
            "Retry-After": Math.ceil(
              (rateLimitResult.resetAt - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Parse and validate
    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      return NextResponse.json(
        {
          success: false,
          error: "Validasi gagal.",
          errors,
        },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // Save to database
    await db.insert(contactMessages).values({
      name,
      email,
      message,
    });

    // Send email notification (optional, non-blocking)
    sendEmailNotification(name, email, message).catch(console.error);

    return NextResponse.json(
      {
        success: true,
        message: "Pesan berhasil dikirim!",
        comment: {
          name,
          message,
          createdAt: new Date().toISOString(),
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan internal.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await db
      .select({
        id: contactMessages.id,
        name: contactMessages.name,
        message: contactMessages.message,
        isPinned: contactMessages.isPinned,
        createdAt: contactMessages.createdAt,
      })
      .from(contactMessages)
      .orderBy(desc(contactMessages.isPinned), desc(contactMessages.createdAt))
      .limit(5);

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data komentar." },
      { status: 500 }
    );
  }
}

async function sendEmailNotification(
  name: string,
  email: string,
  message: string
) {
  // Only send if SMTP is configured
  if (!process.env.SMTP_HOST || !process.env.SMTP_PASS || process.env.SMTP_PASS === "change-this-app-password") {
    console.log("SMTP not configured, skipping email notification");
    return;
  }

  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"CYBER.DEV Portfolio" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `[CYBER.DEV] Pesan baru dari ${name}`,
      html: `
        <div style="font-family: monospace; background: #0a0e1a; color: #f1f5f9; padding: 20px; border-radius: 8px;">
          <h2 style="color: #00f0ff;">📬 Pesan Baru dari Portfolio</h2>
          <p><strong>Nama:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #a855f7;">${email}</a></p>
          <p><strong>Pesan:</strong></p>
          <div style="background: #111827; padding: 15px; border-radius: 8px; border-left: 3px solid #00f0ff;">
            ${message.replace(/\n/g, "<br>")}
          </div>
          <p style="color: #64748b; margin-top: 20px; font-size: 12px;">
            Dikirim dari CYBER.DEV Portfolio Contact Form
          </p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
