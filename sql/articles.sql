create table public.articles (
  id uuid not null default extensions.uuid_generate_v4 (),
  title text not null,
  slug text not null,
  content text not null,
  excerpt text null,
  featured_image_url text null,
  category_id uuid null,
  status text not null default 'draft'::text,
  published_at timestamp with time zone null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint articles_pkey primary key (id),
  constraint articles_slug_key unique (slug),
  constraint articles_category_id_fkey foreign key (category_id) references article_categories (id) on delete set null
) tablespace pg_default;

-- Create index for category_id
create index articles_category_id_idx on public.articles using btree (category_id);

-- Create index for status
create index articles_status_idx on public.articles using btree (status);
