import Link from "next/link";
import { services } from "@/lib/services";

export const metadata = {
  title: "บริการของเรา | PPD Builder",
  description: "บริการก่อสร้างและที่ปรึกษาโครงการที่ครบวงจร",
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-orange-700 dark:from-gray-800 dark:to-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-orange-200 hover:text-white transition mb-6"
          >
            <i className="fa-solid fa-arrow-left"></i>
            กลับ
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">บริการของเรา</h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            เรามีบริการก่อสร้างและที่ปรึกษาโครงการที่ครบวงจร
            เพื่อตอบสนองความต้องการของลูกค้าทุกประเภท
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.slug}`}
              className="group bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-48 bg-linear-to-br from-orange-100 to-orange-50 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center overflow-hidden">
                <div
                  className={`${service.bgColor} rounded-full p-8 shadow-lg group-hover:scale-125 transition duration-300`}
                >
                  <i
                    className={`fa-solid ${service.icon} text-4xl text-white`}
                  ></i>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {service.description}
                </p>
                <span className="inline-flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium group-hover:gap-3 transition">
                  ดูรายละเอียด <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
