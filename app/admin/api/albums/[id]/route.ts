import { NextRequest, NextResponse } from "next/server";
import { AlbumsService } from "@/services/albums.service";

/**
 * GET /api/albums/[id] - Get album by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const album = await AlbumsService.getAlbumById(params.id);

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    return NextResponse.json({ data: album });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * PUT /api/albums/[id] - Update album
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File | null;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const existingImageUrl = formData.get("existing_image_url") as string;

    let imageUrl = existingImageUrl;

    // Upload new image if provided
    if (image) {
      imageUrl = await AlbumsService.uploadImage(image);

      // Delete old image
      if (existingImageUrl) {
        try {
          await AlbumsService.deleteImage(existingImageUrl);
        } catch (error) {
          console.error("Failed to delete old image:", error);
        }
      }
    }

    // Update album
    const album = await AlbumsService.updateAlbum(params.id, {
      title,
      description,
      cover_image_url: imageUrl,
    });

    return NextResponse.json({ data: album });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * DELETE /api/albums/[id] - Delete album
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await AlbumsService.deleteAlbum(params.id);
    return NextResponse.json({ message: "Album deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
