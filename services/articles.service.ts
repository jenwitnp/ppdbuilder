import { supabase, supabaseWithServiceRole } from "@/lib/supabase";
import {
  Article,
  ArticleWithCategory,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/types/article";
import { ImageProcessor, ImagePresets } from "@/lib/image-processor";

export class ArticlesService {
  /**
   * Get all articles with category info
   */
  static async getArticles(): Promise<ArticleWithCategory[]> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:article_categories(id, name, slug)
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch articles: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get article by ID
   */
  static async getArticleById(id: string): Promise<ArticleWithCategory | null> {
    const { data, error } = await supabase
      .from("articles")
      .select(
        `
        *,
        category:article_categories(id, name, slug)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch article: ${error.message}`);
    }

    return data;
  }

  /**
   * Create article
   */
  static async createArticle(input: CreateArticleInput): Promise<Article> {
    const { data, error } = await supabaseWithServiceRole
      .from("articles")
      .insert({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create article: ${error.message}`);
    }

    return data;
  }

  /**
   * Update article
   */
  static async updateArticle(
    id: string,
    input: UpdateArticleInput
  ): Promise<Article> {
    const { data, error } = await supabaseWithServiceRole
      .from("articles")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update article: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete article
   */
  static async deleteArticle(id: string): Promise<void> {
    // Get article to delete featured image
    const article = await this.getArticleById(id);

    if (article?.featured_image_url) {
      try {
        await this.deleteImage(article.featured_image_url);
      } catch (error) {
        console.error("Failed to delete featured image:", error);
      }
    }

    const { error } = await supabaseWithServiceRole
      .from("articles")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete article: ${error.message}`);
    }
  }

  /**
   * Upload image to Supabase Storage
   */
  static async uploadImage(file: File): Promise<string> {
    // Optimize image with Sharp (1200px for article featured, 1000px for content)
    const isContentImage = file.name.includes("content-");
    const preset = isContentImage
      ? ImagePresets.articleContent.large
      : ImagePresets.article.large;

    const optimized = await ImageProcessor.resize(file, {
      width: preset.width,
      quality: preset.quality,
      format: "jpeg",
    });

    const fileName = `article-${Math.random()
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
}
