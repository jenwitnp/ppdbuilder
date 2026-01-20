import { useQuery } from "@tanstack/react-query";
import { getAlbumsAction } from "@/actions/albums.actions";
import { Album } from "@/types/album";

export function useAlbums(limit?: number) {
  return useQuery({
    queryKey: ["albums", limit],
    queryFn: async () => {
      const { data, error } = await getAlbumsAction();
      if (error) {
        throw new Error(error);
      }
      if (!data) {
        throw new Error("No albums found");
      }
      // Apply limit if provided
      if (limit && limit > 0) {
        return data.slice(0, limit);
      }
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
