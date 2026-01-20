"use server";

import { revalidatePath } from "next/cache";
import { AlbumsService } from "@/services/albums.service";
import { supabaseWithServiceRole } from "@/lib/supabase";
import { Album } from "@/types/album";
import { AlbumImage } from "@/types/album-image";

type ActionResult<T = any> = {
  data?: T;
  error?: string;
};

/**
 * Get all albums
 */
export async function getAlbumsAction(): Promise<ActionResult<Album[]>> {
  try {
    const albums = await AlbumsService.getAlbums();
    return { data: albums };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get albums with pagination
 */
export async function getAlbumsPaginatedAction(
  limit: number = 8,
  offset: number = 0,
): Promise<ActionResult<{ data: Album[]; total: number }>> {
  try {
    const result = await AlbumsService.getAlbumsPaginated(limit, offset);
    return { data: result };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get album by ID
 */
export async function getAlbumByIdAction(
  id: string,
): Promise<ActionResult<Album>> {
  try {
    const album = await AlbumsService.getAlbumById(id);
    if (!album) {
      return { error: "Album not found" };
    }
    return { data: album };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Create new album with image upload
 */
export async function createAlbumAction(
  formData: FormData,
): Promise<ActionResult<Album>> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    // Get all images from FormData
    const allImages = formData.getAll("images") as File[];
    const coverImage = formData.get("image") as File; // First image as cover

    if (!coverImage) {
      return { error: "Cover image is required" };
    }

    // Upload ALL images to Supabase storage
    const uploadedImageUrls: string[] = [];

    for (let i = 0; i < allImages.length; i++) {
      const image = allImages[i];
      const imageUrl = await AlbumsService.uploadImage(image);
      uploadedImageUrls.push(imageUrl);
    }

    // First uploaded image is the cover
    const coverImageUrl = uploadedImageUrls[0];

    // Create album with cover image
    const album = await AlbumsService.createAlbum({
      title,
      description,
      cover_image_url: coverImageUrl,
    });

    // Save all images to album_images table
    const albumImagesData = uploadedImageUrls.map((url, index) => ({
      album_id: album.id,
      image_url: url,
      display_order: index,
      caption: undefined,
    }));

    await AlbumsService.createAlbumImages(albumImagesData);

    revalidatePath("/images");
    return { data: album };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update album
 */
export async function updateAlbumAction(
  id: string,
  formData: FormData,
): Promise<ActionResult<Album>> {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const existingImageUrl = formData.get("existing_image_url") as string;
    const reorderedImagesJson = formData.get("reordered_images") as string;

    // Get all new images
    const allImages = formData.getAll("images") as File[];

    let imageUrl = existingImageUrl;

    // Filter out empty/invalid files
    const validImages = allImages.filter(
      (img) => img && img.size > 0 && img.name,
    );

    // If new images are provided, upload all of them
    if (validImages.length > 0) {
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < validImages.length; i++) {
        const image = validImages[i];
        const uploadedUrl = await AlbumsService.uploadImage(image);
        uploadedImageUrls.push(uploadedUrl);
      }

      // First uploaded image becomes new cover
      imageUrl = uploadedImageUrls[0];

      // Delete old album images from database and storage
      await AlbumsService.deleteAlbumImages(id);

      // Save all new images to album_images table
      const albumImagesData = uploadedImageUrls.map((url, index) => ({
        album_id: id,
        image_url: url,
        display_order: index,
        caption: undefined,
      }));

      await AlbumsService.createAlbumImages(albumImagesData);
    } else if (reorderedImagesJson) {
      // Only reordering existing images, no new uploads
      const reorderedImages = JSON.parse(reorderedImagesJson) as string[];

      // Update cover image to first in new order
      imageUrl = reorderedImages[0];

      // Delete existing album_images records only (keep files in storage)
      const { error } = await supabaseWithServiceRole
        .from("album_images")
        .delete()
        .eq("album_id", id);

      if (error) {
        throw new Error(
          `Failed to delete album_images records: ${error.message}`,
        );
      }

      // Re-create album_images with new order
      const albumImagesData = reorderedImages.map((url, index) => ({
        album_id: id,
        image_url: url,
        display_order: index,
        caption: undefined,
      }));

      await AlbumsService.createAlbumImages(albumImagesData);
    }

    if (!imageUrl) {
      throw new Error("No image URL available for album update");
    }

    // Update album
    const album = await AlbumsService.updateAlbum(id, {
      title,
      description,
      cover_image_url: imageUrl,
    });

    revalidatePath("/images");
    return { data: album };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete album
 */
export async function deleteAlbumAction(
  id: string,
): Promise<ActionResult<void>> {
  try {
    // This will cascade delete album_images and delete all images from storage
    await AlbumsService.deleteAlbum(id);
    revalidatePath("/images");
    return { data: undefined };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get album images
 */
export async function getAlbumImagesAction(albumId: string) {
  try {
    const images = await AlbumsService.getAlbumImages(albumId);
    return { data: images };
  } catch (error: any) {
    return { error: error.message };
  }
}
