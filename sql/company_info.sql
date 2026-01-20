create table public.company_info (
  id uuid not null default extensions.uuid_generate_v4 (),
  company_name text not null,
  logo_url text null,
  phone text null,
  email text null,
  address text null,
  facebook_url text null,
  line_url text null,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  description text null,
  slogan character varying null,
  logo_url_dark text null,
  constraint company_info_pkey primary key (id)
) TABLESPACE pg_default;