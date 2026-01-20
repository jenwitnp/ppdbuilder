import { NextRequest, NextResponse } from "next/server";
import { AlbumsService } from "@/services/albums.service";

/**
 * GET /api/albums - Get all albums
 */
export async function GET() {
  try {
    const albums = await AlbumsService.getAlbums();
    return NextResponse.json({ data: albums });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/albums - Create new album
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Upload image
    const imageUrl = await AlbumsService.uploadImage(image);

    // Create album
    const album = await AlbumsService.createAlbum({
      title,
      description,
      cover_image_url: imageUrl,
    });

    return NextResponse.json({ data: album }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
