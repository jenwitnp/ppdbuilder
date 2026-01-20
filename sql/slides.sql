create table public.slides (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text null,
  image_url text not null,
  link_url text null,
  display_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint slides_pkey primary key (id)
) TABLESPACE pg_default;