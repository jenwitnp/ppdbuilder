"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompanyInfoAction } from "@/actions/company-info.actions";
import type { CompanyInfo } from "@/types/company-info";

export function useCompanyInfo() {
  return useQuery<CompanyInfo | null>({
    queryKey: ["company-info"],
    queryFn: async () => {
      const result = await getCompanyInfoAction();
      return result.data ?? null;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
}
