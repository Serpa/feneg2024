import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { log } from "@/lib/log"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const image = await prisma.smallImages.findUnique({
      where: { id },
    })

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    return NextResponse.json(image)
  } catch (error) {
    console.error("Error fetching small image:", error)
    return NextResponse.json({ error: "Error fetching small image" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { title, description, url, category, image_url, image_public_id } = body

    if (!title || !image_url || !image_public_id || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedImage = await prisma.smallImages.update({
      where: { id },
      data: {
        title,
        description,
        url,
        category,
        image_url,
        image_public_id,
        updatedAt: new Date(),
      },
    })

    await log({
      action: "UPDATE_SMALL_IMAGE",
      details: { imageId: id },
      userId: session.user.id,
    })

    return NextResponse.json(updatedImage)
  } catch (error) {
    console.error("Error updating small image:", error)
    return NextResponse.json({ error: "Error updating small image" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const id = Number.parseInt(params.id)

    await prisma.smallImages.delete({
      where: { id },
    })

    await log({
      action: "DELETE_SMALL_IMAGE",
      details: { imageId: id },
      userId: session.user.id,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting small image:", error)
    return NextResponse.json({ error: "Error deleting small image" }, { status: 500 })
  }
}
