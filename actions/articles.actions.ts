"use server";

import { revalidatePath } from "next/cache";
import { ArticlesService } from "@/services/articles.service";
import { Article, ArticleWithCategory } from "@/types/article";

type ActionResult<T = any> = {
  data?: T;
  error?: string;
};

/**
 * Get all articles
 */
export async function getArticlesAction(): Promise<
  ActionResult<ArticleWithCategory[]>
> {
  try {
    const articles = await ArticlesService.getArticles();
    return { data: articles };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Get article by ID
 */
export async function getArticleByIdAction(
  id: string
): Promise<ActionResult<ArticleWithCategory | null>> {
  try {
    const article = await ArticlesService.getArticleById(id);
    return { data: article };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Create article
 */
export async function createArticleAction(
  formData: FormData
): Promise<ActionResult<Article>> {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const categoryId = formData.get("category_id") as string;
    const status = formData.get("status") as "draft" | "published";
    const featuredImage = formData.get("featured_image") as File | null;

    let featuredImageUrl: string | null = null;

    if (featuredImage && featuredImage.size > 0) {
      featuredImageUrl = await ArticlesService.uploadImage(featuredImage);
    }

    const article = await ArticlesService.createArticle({
      title,
      slug,
      content,
      excerpt: excerpt || null,
      featured_image_url: featuredImageUrl,
      category_id: categoryId || null,
      status: status || "draft",
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    revalidatePath("/articles");
    return { data: article };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Update article
 */
export async function updateArticleAction(
  id: string,
  formData: FormData
): Promise<ActionResult<Article>> {
  try {
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const content = formData.get("content") as string;
    const excerpt = formData.get("excerpt") as string;
    const categoryId = formData.get("category_id") as string;
    const status = formData.get("status") as "draft" | "published";
    const existingImageUrl = formData.get("existing_image_url") as string;
    const featuredImage = formData.get("featured_image") as File | null;

    let featuredImageUrl = existingImageUrl;

    if (featuredImage && featuredImage.size > 0) {
      featuredImageUrl = await ArticlesService.uploadImage(featuredImage);

      // Delete old image
      if (existingImageUrl) {
        try {
          await ArticlesService.deleteImage(existingImageUrl);
        } catch (error) {
          console.error("Failed to delete old image:", error);
        }
      }
    }

    const article = await ArticlesService.updateArticle(id, {
      title,
      slug,
      content,
      excerpt: excerpt || null,
      featured_image_url: featuredImageUrl || null,
      category_id: categoryId || null,
      status: status || "draft",
      published_at: status === "published" ? new Date().toISOString() : null,
    });

    revalidatePath("/articles");
    return { data: article };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Delete article
 */
export async function deleteArticleAction(
  id: string
): Promise<ActionResult<void>> {
  try {
    await ArticlesService.deleteArticle(id);
    revalidatePath("/articles");
    return { data: undefined };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Upload content image (for editor)
 */
export async function uploadContentImageAction(
  formData: FormData
): Promise<ActionResult<string>> {
  try {
    const image = formData.get("image") as File;

    if (!image || image.size === 0) {
      return { error: "No image provided" };
    }

    const imageUrl = await ArticlesService.uploadImage(image);
    return { data: imageUrl };
  } catch (error: any) {
    return { error: error.message };
  }
}
