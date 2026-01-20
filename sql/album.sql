create table public.albums (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  description text null,
  cover_image_url text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint albums_pkey primary key (id)
) TABLESPACE pg_default;