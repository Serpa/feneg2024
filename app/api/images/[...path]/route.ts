export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server"
import * as Minio from "minio"

const s3Client = new Minio.Client({
  endPoint: process.env.END_POINT_MINIO as string,
  accessKey: process.env.ACCESS_KEY_MINIO as string,
  secretKey: process.env.SECRET_KEY_MINIO as string,
})

const ALLOWED_BUCKETS = ["small-images", "news", "files"]

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const pathSegments = params.path
    if (!pathSegments || pathSegments.length < 2) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 })
    }

    const bucketName = pathSegments[0]
    const fileName = pathSegments.slice(1).join("/")

    if (!ALLOWED_BUCKETS.includes(bucketName)) {
      return NextResponse.json({ error: "Bucket not allowed" }, { status: 403 })
    }

    const presignedUrl = await s3Client.presignedGetObject(
      bucketName,
      fileName,
      60 * 60
    )

    const response = NextResponse.redirect(presignedUrl, { status: 302 })
    response.headers.set("Cache-Control", "public, max-age=3600")
    return response
  } catch (error) {
    console.error("Error in image proxy:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
