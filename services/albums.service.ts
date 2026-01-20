import { supabase, supabaseWithServiceRole } from "@/lib/supabase";
import { Album, CreateAlbumInput, UpdateAlbumInput } from "@/types/album";
import { AlbumImage, CreateAlbumImageInput } from "@/types/album-image";
import { ImageProcessor, ImagePresets } from "@/lib/image-processor";

export class AlbumsService {
  /**
   * Get all albums ordered by created_at
   */
  static async getAlbums(): Promise<Album[]> {
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch albums: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get albums with pagination (offset + limit)
   */
  static async getAlbumsPaginated(
    limit: number = 8,
    offset: number = 0,
  ): Promise<{ data: Album[]; total: number }> {
    // Get total count first
    const { count, error: countError } = await supabase
      .from("albums")
      .select("*", { count: "exact", head: true });

    if (countError) {
      throw new Error(`Failed to fetch album count: ${countError.message}`);
    }

    // Get paginated data
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch albums: ${error.message}`);
    }

    return { data: data || [], total: count || 0 };
  }

  /**
   * Get single album by ID
   */
  static async getAlbumById(id: string): Promise<Album | null> {
    const { data, error } = await supabase
      .from("albums")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch album: ${error.message}`);
    }

    return data;
  }

  /**
   * Create new album
   */
  static async createAlbum(input: CreateAlbumInput): Promise<Album> {
    const { data, error } = await supabaseWithServiceRole
      .from("albums")
      .insert({
        title: input.title,
        description: input.description || null,
        cover_image_url: input.cover_image_url,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create album: ${error.message}`);
    }

    return data;
  }

  /**
   * Update existing album
   */
  static async updateAlbum(
    id: string,
    input: UpdateAlbumInput,
  ): Promise<Album> {
    const { data, error } = await supabaseWithServiceRole
      .from("albums")
      .update(input)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update album: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete album
   */
  static async deleteAlbum(id: string): Promise<void> {
    // First, delete all album images (cascade will handle DB, but we need to clean storage)
    await this.deleteAlbumImages(id);

    // Get the album to retrieve the cover image URL
    const album = await this.getAlbumById(id);

    if (album?.cover_image_url) {
      // Delete cover image from storage
      try {
        await this.deleteImage(album.cover_image_url);
      } catch (error) {
        console.error("Failed to delete cover image:", error);
      }
    }

    // Delete the album record (cascade will delete album_images records)
    const { error } = await supabaseWithServiceRole
      .from("albums")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete album: ${error.message}`);
    }
  }

  /**
   * Upload image to Supabase Storage
   */
  static async uploadImage(file: File): Promise<string> {
    // Optimize image with Sharp (1600px for albums)
    const optimized = await ImageProcessor.resize(file, {
      width: ImagePresets.album.large.width,
      quality: ImagePresets.album.large.quality,
      format: "jpeg",
    });

    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}-${Date.now()}.jpg`;

    const { data, error } = await supabaseWithServiceRole.storage
      .from("images")
      .upload(fileName, optimized.buffer, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseWithServiceRole.storage.from("images").getPublicUrl(data.path);

    return publicUrl;
  }

  /**
   * Delete image from Supabase Storage
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    const filename = imageUrl.split("/").pop();
    if (!filename) return;

    const { error } = await supabaseWithServiceRole.storage
      .from("images")
      .remove([filename]);

    if (error) {
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  }

  /**
   * Get all images for an album
   */
  static async getAlbumImages(albumId: string): Promise<AlbumImage[]> {
    const { data, error } = await supabase
      .from("album_images")
      .select("*")
      .eq("album_id", albumId)
      .order("display_order", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch album images: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Create album image
   */
  static async createAlbumImage(
    input: CreateAlbumImageInput,
  ): Promise<AlbumImage> {
    const { data, error } = await supabaseWithServiceRole
      .from("album_images")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create album image: ${error.message}`);
    }

    return data;
  }

  /**
   * Create multiple album images
   */
  static async createAlbumImages(
    inputs: CreateAlbumImageInput[],
  ): Promise<AlbumImage[]> {
    const { data, error } = await supabaseWithServiceRole
      .from("album_images")
      .insert(inputs)
      .select();

    if (error) {
      throw new Error(`Failed to create album images: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Delete all images for an album (only from database, not storage)
   */
  static async deleteAlbumImagesRecords(albumId: string): Promise<void> {
    const { error } = await supabaseWithServiceRole
      .from("album_images")
      .delete()
      .eq("album_id", albumId);

    if (error) {
      throw new Error(
        `Failed to delete album images records: ${error.message}`,
      );
    }
  }

  /**
   * Delete all images for an album (database + storage)
   */
  static async deleteAlbumImages(albumId: string): Promise<void> {
    // Get all images first
    const images = await this.getAlbumImages(albumId);

    // Delete from storage
    for (const image of images) {
      try {
        await this.deleteImage(image.image_url);
      } catch (error) {
        console.error(`Failed to delete image: ${image.image_url}`, error);
      }
    }

    // Delete from database
    const { error } = await supabaseWithServiceRole
      .from("album_images")
      .delete()
      .eq("album_id", albumId);

    if (error) {
      throw new Error(`Failed to delete album images: ${error.message}`);
    }
  }
}
