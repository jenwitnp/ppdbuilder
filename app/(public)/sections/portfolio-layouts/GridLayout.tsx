import { Album } from "@/types/album";
import SmartImage from "@/app/(public)/components/SmartImage";

export default function GridLayout({ albums }: { albums: Album[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {albums.map((album) => (
        <div
          key={album.id}
          className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
        >
          <div className="relative overflow-hidden h-64">
            <SmartImage
              src={album.cover_image_url || "/placeholder.jpg"}
              alt={album.title}
              width={400}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <button className="px-6 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition">
                View Project
              </button>
            </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {album.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
              {album.description || "ไม่มีคำอธิบาย"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
