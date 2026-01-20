"use client";

import { services } from "@/lib/services";

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 dark:text-orange-400 font-semibold tracking-wide uppercase">
            Our Services
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            บริการที่ครบวงจร
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
            เรามีความเชี่ยวชาญในงานก่อสร้างและงานระบบหลากหลายรูปแบบ
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="relative group bg-orange-500 dark:bg-gray-800 p-8 rounded-2xl hover:shadow-xl transition duration-300 border border-transparent hover:border-orange-500"
            >
              <div
                className={`absolute -top-6 left-8 ${service.bgColor} rounded-xl p-4 shadow-lg group-hover:scale-110 transition duration-300`}
              >
                <i
                  className={`fa-solid ${service.icon} text-2xl text-white`}
                ></i>
              </div>
              <h3 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">
                {service.title}
              </h3>
              <p className="mt-4 text-white dark:text-gray-800">
                {service.description}
              </p>
              <a
                href={`/services/${service.slug}`}
                className="mt-6 inline-block text-orange-200 dark:text-orange-200 font-medium hover:text-orange-800 dark:hover:text-orange-300 transition"
              >
                อ่านเพิ่มเติม &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { services };
