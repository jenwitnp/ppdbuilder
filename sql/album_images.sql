create table public.album_images (
  id uuid not null default extensions.uuid_generate_v4 (),
  album_id uuid not null,
  image_url text not null,
  caption text null,
  display_order integer null default 0,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint album_images_pkey primary key (id),
  constraint album_images_album_id_fkey foreign KEY (album_id) references albums (id) on delete CASCADE
) TABLESPACE pg_default;