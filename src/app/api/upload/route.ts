import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

const MAGIC_NUMBERS = {
  jpg: [0xff, 0xd8, 0xff],
  jpeg: [0xff, 0xd8, 0xff],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  gif: [0x47, 0x49, 0x46, 0x38],
  webp: [0x52, 0x49, 0x46, 0x46], // "RIFF"
};

function verifyMagicBytes(buffer: Buffer, extension: string): boolean {
  const ext = extension.toLowerCase();
  const magic = MAGIC_NUMBERS[ext as keyof typeof MAGIC_NUMBERS];
  if (!magic) return false;
  if (buffer.length < magic.length) return false;

  for (let i = 0; i < magic.length; i++) {
    if (buffer[i] !== magic[i]) {
      return false;
    }
  }

  if (ext === "webp") {
    if (buffer.length < 12) return false;
    const webpHeader = buffer.toString("ascii", 8, 12);
    if (webpHeader !== "WEBP") {
      return false;
    }
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // 1. Session Check (Authorization)
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized. Admin session required." }, { status: 401 });
    }

    // 2. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    // 3. File Size Validation
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File size exceeds 5MB limit." }, { status: 400 });
    }

    // 4. File Extension Validation
    const originalName = file.name || "upload.png";
    const ext = path.extname(originalName).toLowerCase().replace(".", "");
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: `File type not allowed. Allowed types: ${ALLOWED_EXTENSIONS.join(", ")}` }, { status: 400 });
    }

    // Convert to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Magic Bytes Verification (MIME-type spoofing protection)
    if (!verifyMagicBytes(buffer, ext)) {
      return NextResponse.json({ error: "Invalid image contents (MIME-type mismatch)." }, { status: 400 });
    }

    // 6. Generate secure new filename (UUID + sanitized extension)
    const secureName = `${crypto.randomUUID()}.${ext}`;

    // Define upload path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write file
    const filePath = path.join(uploadDir, secureName);
    await fs.writeFile(filePath, buffer);

    // Return the public URL
    const fileUrl = `/uploads/${secureName}`;
    
    return NextResponse.json({
      success: true,
      url: fileUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Internal server error during upload." }, { status: 500 });
  }
}
