"use server";

import { slidesService } from "@/services/slides.service";
import { revalidatePath } from "next/cache";

export async function getSlidesAction() {
  try {
    const slides = await slidesService.getAllSlides();
    return { data: slides, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function createSlideAction(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const linkUrl = formData.get("link_url") as string;
    const displayOrder = parseInt(formData.get("display_order") as string);
    const isActive = formData.get("is_active") === "true";
    const imageFile = formData.get("image") as File;

    if (!imageFile) {
      throw new Error("Image is required");
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

    revalidatePath("/slides");
    return { data: slide, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function updateSlideAction(id: string, formData: FormData) {
  try {
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

    revalidatePath("/slides");
    return { data: slide, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function deleteSlideAction(id: string) {
  try {
    await slidesService.deleteSlide(id);
    revalidatePath("/slides");
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function toggleSlideStatusAction(id: string, isActive: boolean) {
  try {
    const slide = await slidesService.toggleSlideStatus(id, isActive);
    revalidatePath("/slides");
    return { data: slide, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}
