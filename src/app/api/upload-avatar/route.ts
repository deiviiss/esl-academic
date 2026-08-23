import { NextRequest, NextResponse } from "next/server";
import { uploadProtectedResource, getProtectedSignedUrl } from "@/lib/cloudinary.server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File;

  if (!file) {
    return NextResponse.json({ ok: false, message: "No file provided" }, { status: 400 });
  }

  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const MAX_SIZE_MB = 10; // 10 MB

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ ok: false, message: "Invalid file type" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return NextResponse.json({ ok: false, message: "File too large" }, { status: 400 });
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString("base64");

    const uploadResult = await uploadProtectedResource(
      `data:${file.type};base64,${base64}`,
      {
        folder: "esl-academy/user-avatars",
        resourceType: "image",
        transformation: [
          { width: 500, height: 500, crop: "limit" },
          { quality: "auto", fetch_format: "auto" },
        ],
      }
    );

    const signedUrl = getProtectedSignedUrl(uploadResult.public_id);

    return NextResponse.json({ ok: true, url: signedUrl });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return NextResponse.json({ ok: false, message: "Upload error" }, { status: 500 });
  }
}
