export interface CompanyInfo {
  id: string;
  company_name: string;
  logo_url: string | null;
  logo_url_dark: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  facebook_url: string | null;
  line_url: string | null;
  instagram_url: string | null;
  description: string | null;
  slogan: string | null;
  created_at: string;
  updated_at: string;
}

export interface UpdateCompanyInfoInput {
  company_name: string;
  logo_url?: string | null;
  logo_url_dark?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  facebook_url?: string | null;
  line_url?: string | null;
  instagram_url?: string | null;
  description?: string | null;
  slogan?: string | null;
}
