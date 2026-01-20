export interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
}

export interface CreateAlbumInput {
  title: string;
  description?: string;
  cover_image_url: string;
}

export interface UpdateAlbumInput {
  title?: string;
  description?: string;
  cover_image_url?: string;
}
