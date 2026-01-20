"use client";

import { useQuery } from "@tanstack/react-query";
import { getAlbumsPaginatedAction } from "@/actions/albums.actions";
import type { Album } from "@/types/album";

export function useAlbumsPaginated(limit: number = 8, page: number = 1) {
  const offset = (page - 1) * limit;

  return useQuery<{ data: Album[]; total: number }>({
    queryKey: ["albums-paginated", limit, page],
    queryFn: async () => {
      const result = await getAlbumsPaginatedAction(limit, offset);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data!;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
