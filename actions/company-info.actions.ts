"use server";

import { revalidatePath } from "next/cache";
import { CompanyInfoService } from "@/services/company-info.service";
import { CompanyInfo } from "@/types/company-info";

type ActionResult<T = any> = {
  data?: T;
  error?: string;
};

/**
 * Get company info
 */
export async function getCompanyInfoAction(): Promise<
  ActionResult<CompanyInfo | null>
> {
  try {
    const companyInfo = await CompanyInfoService.getCompanyInfo();
    return { data: companyInfo };
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Save company info (create or update)
 */
export async function saveCompanyInfoAction(
  formData: FormData
): Promise<ActionResult<CompanyInfo>> {
  try {
    const companyName = formData.get("company_name") as string;
    const slogan = formData.get("slogan") as string;
    const description = formData.get("description") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const address = formData.get("address") as string;
    const facebookUrl = formData.get("facebook_url") as string;
    const lineUrl = formData.get("line_url") as string;
    const existingLogoUrl = formData.get("existing_logo_url") as string;
    const existingLogoDarkUrl = formData.get(
      "existing_logo_dark_url"
    ) as string;
    const logoFile = formData.get("logo") as File | null;
    const logoDarkFile = formData.get("logo_dark") as File | null;

    let logoUrl = existingLogoUrl;
    let logoDarkUrl = existingLogoDarkUrl;

    // Upload new light logo if provided
    if (logoFile && logoFile.size > 0) {
      logoUrl = await CompanyInfoService.uploadLogo(logoFile);

      // Delete old logo if exists
      if (existingLogoUrl) {
        try {
          await CompanyInfoService.deleteLogo(existingLogoUrl);
        } catch (error) {
          console.error("Failed to delete old logo:", error);
        }
      }
    }

    // Upload new dark logo if provided
    if (logoDarkFile && logoDarkFile.size > 0) {
      logoDarkUrl = await CompanyInfoService.uploadLogo(logoDarkFile);

      // Delete old dark logo if exists
      if (existingLogoDarkUrl) {
        try {
          await CompanyInfoService.deleteLogo(existingLogoDarkUrl);
        } catch (error) {
          console.error("Failed to delete old dark logo:", error);
        }
      }
    }

    const input = {
      company_name: companyName,
      slogan: slogan || null,
      description: description || null,
      phone: phone || null,
      email: email || null,
      address: address || null,
      facebook_url: facebookUrl || null,
      line_url: lineUrl || null,
      logo_url: logoUrl || null,
      logo_url_dark: logoDarkUrl || null,
    };

    // Check if company info exists
    const existing = await CompanyInfoService.getCompanyInfo();

    let companyInfo: CompanyInfo;
    if (existing) {
      companyInfo = await CompanyInfoService.updateCompanyInfo(
        existing.id,
        input
      );
    } else {
      companyInfo = await CompanyInfoService.createCompanyInfo(input);
    }

    revalidatePath("/settings");
    return { data: companyInfo };
  } catch (error: any) {
    return { error: error.message };
  }
}
