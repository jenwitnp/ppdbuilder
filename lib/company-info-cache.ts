import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CompanyInfoService } from "@/services/company-info.service";
import { CompanyInfo } from "@/types/company-info";

/**
 * ISR + Request Memoization: Fetch company info with automatic caching
 * - Request Memoization: prevents duplicate requests in same render
 * - ISR: revalidates every 3600 seconds (1 hour)
 */
export const getCompanyInfoCached = cache(
  unstable_cache(
    async () => {
      try {
        const companyInfo = await CompanyInfoService.getCompanyInfo();
        return companyInfo;
      } catch (error) {
        console.error("Failed to fetch company info:", error);
        return null;
      }
    },
    ["company-info"], // cache key
    {
      revalidate: 3600, // ISR: revalidate every 1 hour
      tags: ["company-info"], // for on-demand revalidation
    },
  ),
);

/**
 * Type helper for company info
 */
export type CachedCompanyInfo = CompanyInfo | null;
