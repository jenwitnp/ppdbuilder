export interface AlbumImage {
  id: string;
  album_id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export interface CreateAlbumImageInput {
  album_id: string;
  image_url: string;
  caption?: string;
  display_order: number;
}
