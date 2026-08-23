import { NextRequest, NextResponse } from "next/server"
import { signUploadParams } from "@/lib/cloudinary.server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { paramsToSign } = body

    if (!paramsToSign) {
      return NextResponse.json({ message: "No params to sign" }, { status: 400 })
    }

    const signature = signUploadParams(paramsToSign)

    return NextResponse.json({ signature })
  } catch (error) {
    console.error("Error signing Cloudinary params:", error)
    return NextResponse.json({ message: "Signing failed" }, { status: 500 })
  }
}
