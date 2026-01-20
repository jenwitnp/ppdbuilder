export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  featured_image_url: string | null;
  category_id: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithCategory extends Article {
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  category_id?: string | null;
  status?: "draft" | "published";
  published_at?: string | null;
}

export interface UpdateArticleInput {
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  featured_image_url?: string | null;
  category_id?: string | null;
  status?: "draft" | "published";
  published_at?: string | null;
}
