import { supabase, supabaseWithServiceRole } from "@/lib/supabase";
import {
  ArticleCategory,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/article-category";

export class ArticleCategoriesService {
  /**
   * Get all categories
   */
  static async getCategories(): Promise<ArticleCategory[]> {
    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  }

  /**
   * Get category by ID
   */
  static async getCategoryById(id: string): Promise<ArticleCategory | null> {
    const { data, error } = await supabase
      .from("article_categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return null;
      }
      throw new Error(`Failed to fetch category: ${error.message}`);
    }

    return data;
  }

  /**
   * Create category
   */
  static async createCategory(
    input: CreateCategoryInput
  ): Promise<ArticleCategory> {
    const { data, error } = await supabaseWithServiceRole
      .from("article_categories")
      .insert({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }

    return data;
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    input: UpdateCategoryInput
  ): Promise<ArticleCategory> {
    const { data, error } = await supabaseWithServiceRole
      .from("article_categories")
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }

    return data;
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabaseWithServiceRole
      .from("article_categories")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }
}
