import { getServiceSupabase } from "@/lib/supabase";
import { Slide } from "@/types/slide";
import { ImageProcessor, ImagePresets } from "@/lib/image-processor";

export class SlidesService {
  private supabase = getServiceSupabase();

  async getAllSlides(): Promise<Slide[]> {
    const { data, error } = await this.supabase
      .from("slides")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async getSlideById(id: string): Promise<Slide | null> {
    const { data, error } = await this.supabase
      .from("slides")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async uploadImage(file: File): Promise<string> {
    // Optimize image with Sharp (1920px for slides)
    const optimized = await ImageProcessor.resize(file, {
      width: ImagePresets.slide.large.width,
      quality: ImagePresets.slide.large.quality,
      format: "jpeg",
    });

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.jpg`;
    const filePath = `slides/${fileName}`;

    const { error: uploadError } = await this.supabase.storage
      .from("images")
      .upload(filePath, optimized.buffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: urlData } = this.supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  }

  async deleteImage(imageUrl: string): Promise<void> {
    const imagePath = imageUrl.split("/storage/v1/object/public/images/")[1];
    if (imagePath) {
      const { error } = await this.supabase.storage
        .from("images")
        .remove([imagePath]);

      if (error) {
        console.error("Error deleting image:", error);
      }
    }
  }

  async createSlide(data: {
    title?: string;
    imageUrl: string;
    linkUrl?: string;
    displayOrder: number;
    isActive: boolean;
  }): Promise<Slide> {
    const { data: slide, error } = await this.supabase
      .from("slides")
      .insert({
        title: data.title || null,
        image_url: data.imageUrl,
        link_url: data.linkUrl || null,
        display_order: data.displayOrder,
        is_active: data.isActive,
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return slide;
  }

  async updateSlide(
    id: string,
    data: {
      title?: string;
      imageUrl: string;
      linkUrl?: string;
      displayOrder: number;
      isActive: boolean;
    }
  ): Promise<Slide> {
    const { data: slide, error } = await this.supabase
      .from("slides")
      .update({
        title: data.title || null,
        image_url: data.imageUrl,
        link_url: data.linkUrl || null,
        display_order: data.displayOrder,
        is_active: data.isActive,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return slide;
  }

  async deleteSlide(id: string): Promise<void> {
    // Get slide to find image URL
    const slide = await this.getSlideById(id);

    if (slide?.image_url) {
      await this.deleteImage(slide.image_url);
    }

    const { error } = await this.supabase.from("slides").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async toggleSlideStatus(id: string, isActive: boolean): Promise<Slide> {
    const { data, error } = await this.supabase
      .from("slides")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}

export const slidesService = new SlidesService();
