export interface Slide {
  id: string;
  title: string | null;
  image_url: string;
  link_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface SlideFormData {
  title?: string;
  link_url?: string;
  display_order: number;
  is_active: boolean;
  image?: File;
}
