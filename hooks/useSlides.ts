import { useQuery } from "@tanstack/react-query";
import { getSlidesAction } from "@/actions/slides.actions";
import { Slide } from "@/types/slide";

export function useSlides() {
  return useQuery({
    queryKey: ["slides"],
    queryFn: async () => {
      const { data, error } = await getSlidesAction();
      if (error) {
        throw new Error(error);
      }
      if (!data) {
        throw new Error("No slides found");
      }
      // Filter active slides and sort by display order
      return data
        .filter((slide) => slide.is_active)
        .sort((a, b) => a.display_order - b.display_order);
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}
