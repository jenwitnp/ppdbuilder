import { NextRequest, NextResponse } from "next/server";
import { slidesService } from "@/services/slides.service";

export async function GET() {
  try {
    const slides = await slidesService.getAllSlides();
    return NextResponse.json({ data: slides });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const linkUrl = formData.get("link_url") as string;
    const displayOrder = parseInt(formData.get("display_order") as string);
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Upload image
    const imageUrl = await slidesService.uploadImage(imageFile);

    // Create slide
    const slide = await slidesService.createSlide({
      title,
      imageUrl,
      linkUrl,
      displayOrder,
      isActive,
    });

    return NextResponse.json({ data: slide });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create slide" },
      { status: 500 }
    );
  }
}
