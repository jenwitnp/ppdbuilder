import { Album } from "@/types/album";
import SmartImage from "@/app/(public)/components/SmartImage";

export default function MasonryLayout({ albums }: { albums: Album[] }) {
  return (
    <div
      className="grid gap-6"
      style={{
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gridAutoRows: "auto",
      }}
    >
      {albums.map((album, index) => (
        <div
          key={album.id}
          className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          style={{
            gridRowEnd: index % 3 === 0 ? "span 2" : "span 1",
          }}
        >
          <SmartImage
            src={album.cover_image_url || "/placeholder.jpg"}
            alt={album.title}
            width={400}
            height={500}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <h3 className="text-xl font-bold text-white mb-2">{album.title}</h3>
            <p className="text-gray-200 text-sm mb-4 line-clamp-2">
              {album.description || "ไม่มีคำอธิบาย"}
            </p>
            <button className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition">
              View Gallery
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
