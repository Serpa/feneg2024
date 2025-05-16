import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { log } from "@/lib/log"

export async function GET() {
  try {
    const images = await prisma.smallImages.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json(images)
  } catch (error) {
    console.error("Error fetching small images:", error)
    return NextResponse.json({ error: "Error fetching small images" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, description, url, category, image_url, image_public_id } = body

    if (!title || !image_url || !image_public_id || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newImage = await prisma.smallImages.create({
      data: {
        title,
        description,
        url,
        category,
        image_url,
        image_public_id,
      },
    })

    await log({
      action: "CREATE_SMALL_IMAGE",
      details: { imageId: newImage.id },
      userId: session.user.id,
    })

    return NextResponse.json(newImage)
  } catch (error) {
    console.error("Error creating small image:", error)
    return NextResponse.json({ error: "Error creating small image" }, { status: 500 })
  }
}
