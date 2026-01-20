import { supabase, supabaseWithServiceRole } from "@/lib/supabase";
import { CompanyInfo, UpdateCompanyInfoInput } from "@/types/company-info";
import { ImageProcessor, ImagePresets } from "@/lib/image-processor";

export class CompanyInfoService {
  /**
   * Get company info (there should only be one record)
   */
  static async getCompanyInfo(): Promise<CompanyInfo | null> {
    const { data, error } = await supabase
      .from("company_info")
      .select("*")
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows found
        return null;
      }
      throw new Error(`Failed to fetch company info: ${error.message}`);
    }

    return data;
  }

  /**
   * Create company info (first time setup)
   */
  static async createCompanyInfo(
    input: UpdateCompanyInfoInput
  ): Promise<CompanyInfo> {
    const { data, error } = await supabaseWithServiceRole
      .from("company_info")
      .insert({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create company info: ${error.message}`);
    }

    return data;
  }

  /**
   * Update company info
   */
  static async updateCompanyInfo(
    id: string,
    input: UpdateCompanyInfoInput
  ): Promise<CompanyInfo> {
    const { data, error } = await supabaseWithServiceRole
      .from("company_info")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update company info: ${error.message}`);
    }

    return data;
  }

  /**
   * Upload logo to Supabase Storage
   */
  static async uploadLogo(file: File): Promise<string> {
    // Optimize logo with Sharp (800px, high quality for transparency support)
    // Use PNG for logos to preserve transparency
    const optimized = await ImageProcessor.resize(file, {
      width: ImagePresets.logo.large.width,
      quality: ImagePresets.logo.large.quality,
      format: "png",
    });

    const fileName = `logo-${Date.now()}.png`;

    const { data, error } = await supabaseWithServiceRole.storage
      .from("images")
      .upload(fileName, optimized.buffer, {
        contentType: "image/png",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload logo: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabaseWithServiceRole.storage.from("images").getPublicUrl(data.path);

    return publicUrl;
  }

  /**
   * Delete logo from Supabase Storage
   */
  static async deleteLogo(logoUrl: string): Promise<void> {
    const filename = logoUrl.split("/").pop();
    if (!filename) return;

    const { error } = await supabaseWithServiceRole.storage
      .from("images")
      .remove([filename]);

    if (error) {
      throw new Error(`Failed to delete logo: ${error.message}`);
    }
  }
}
