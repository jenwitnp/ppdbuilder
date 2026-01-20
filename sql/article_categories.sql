create table public.article_categories (
  id uuid not null default extensions.uuid_generate_v4 (),
  name text not null,
  slug text not null,
  description text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint article_categories_pkey primary key (id),
  constraint article_categories_slug_key unique (slug)
) tablespace pg_default;
