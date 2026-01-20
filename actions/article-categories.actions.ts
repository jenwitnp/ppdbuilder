"use server";

import { revalidatePath } from "next/cache";
import { ArticleCategoriesService } from "@/services/article-categories.service";
import { ArticleCategory } from "@/types/article-category";

type ActionResult<T = any> = {
  data?: T;
  error?: string;
};

/**
 * Get all categories
 */
export async function getCategoriesAction(): Promise<
  ActionResult<ArticleCategory[]>
> {
  try {
    const categories = await ArticleCategoriesService.getCategories();
    return { data: categories };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Create category
 */
export async function createCategoryAction(
  formData: FormData
): Promise<ActionResult<ArticleCategory>> {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    const category = await ArticleCategoriesService.createCategory({
      name,
      slug,
      description: description || null,
    });

    revalidatePath("/articles");
    return { data: category };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update category
 */
export async function updateCategoryAction(
  id: string,
  formData: FormData
): Promise<ActionResult<ArticleCategory>> {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    const category = await ArticleCategoriesService.updateCategory(id, {
      name,
      slug,
      description: description || null,
    });

    revalidatePath("/articles");
    return { data: category };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete category
 */
export async function deleteCategoryAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await ArticleCategoriesService.deleteCategory(id);
    revalidatePath("/articles");
    return { data: undefined };
  } catch (error: any) {
    return { error: error.message };
  }
}
