export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string | null;
}
