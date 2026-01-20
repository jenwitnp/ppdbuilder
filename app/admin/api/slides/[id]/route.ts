import { NextRequest, NextResponse } from "next/server";
import { slidesService } from "@/services/slides.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const { id } = params;

    const title = formData.get("title") as string;
    const linkUrl = formData.get("link_url") as string;
    const displayOrder = parseInt(formData.get("display_order") as string);
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File | null;
    const existingImageUrl = formData.get("existing_image_url") as string;

    let imageUrl = existingImageUrl;

    // If new image uploaded, upload it and delete old one
    if (imageFile && imageFile.size > 0) {
      imageUrl = await slidesService.uploadImage(imageFile);

      // Delete old image
      if (existingImageUrl) {
        await slidesService.deleteImage(existingImageUrl);
      }
    }

    // Update slide
    const slide = await slidesService.updateSlide(id, {
      title,
      imageUrl,
      linkUrl,
      displayOrder,
      isActive,
    });

    return NextResponse.json({ data: slide });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update slide" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await slidesService.deleteSlide(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete slide" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const slide = await slidesService.toggleSlideStatus(id, body.is_active);
    return NextResponse.json({ data: slide });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update slide status" },
      { status: 500 }
    );
  }
}
