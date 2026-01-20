import { useQuery } from "@tanstack/react-query";
import { getAlbumImagesAction } from "@/actions/albums.actions";
import { AlbumImage } from "@/types/album-image";

export function useAlbumImages(albumId: string) {
  return useQuery({
    queryKey: ["album-images", albumId],
    queryFn: async () => {
      const { data, error } = await getAlbumImagesAction(albumId);
      if (error) {
        throw new Error(error);
      }
      if (!data) {
        throw new Error("No images found");
      }
      // Sort by display order
      return data.sort((a, b) => a.display_order - b.display_order);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    enabled: !!albumId, // Only fetch if albumId is provided
  });
}
