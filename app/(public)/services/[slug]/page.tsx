import Link from "next/link";
import { services } from "@/lib/services";
import { notFound } from "next/navigation";

export const metadata = {
  title: "บริการของเรา | PPD Builder",
};

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedServices = services.filter((s) => s.id !== service.id);

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Header with background */}
      <div className="relative bg-linear-to-br from-orange-600 to-orange-700 dark:from-gray-800 dark:to-gray-900 text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <i
            className={`fa-solid ${service.icon} text-9xl absolute -top-20 -right-20 text-white`}
          ></i>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-orange-200 hover:text-white transition mb-6"
          >
            <i className="fa-solid fa-arrow-left"></i>
            บริการทั้งหมด
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            {service.title}
          </h1>
          <p className="text-lg text-orange-100 max-w-2xl">
            {service.description}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Overview */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ข้อมูลบริการ
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                {service.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {service.details.map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start gap-4 p-4 bg-white dark:bg-gray-900 rounded-lg"
                  >
                    <div className={`${service.bgColor}  p-3 shrink-0`}>
                      <i className="fa-solid fa-check text-white text-lg"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery or Process */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                ขั้นตอนการทำงาน
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="text-center">
                    <div
                      className={`${service.bgColor} rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
                    >
                      {step}
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      {step === 1 && "ปรึกษาและวิเคราะห์"}
                      {step === 2 && "วางแผนและออกแบบ"}
                      {step === 3 && "ปฏิบัติและตรวจสอบ"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {step === 1 &&
                        "ทำความเข้าใจความต้องการของลูกค้า และวิเคราะห์สภาพแวดล้อมโครงการ"}
                      {step === 2 && "วางแผนรายละเอียด ออกแบบและเตรียมงบประมาณ"}
                      {step === 3 &&
                        "ปฏิบัติตามแผนที่วางไว้ และตรวจสอบคุณภาพอย่างสม่ำเสมอ"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-orange-600 dark:bg-gray-800 rounded-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">
                สนใจบริการนี้หรือต้องการปรึกษา?
              </h2>
              <p className="text-orange-100 dark:text-gray-300 mb-6">
                ติดต่อเราวันนี้เพื่อได้รับคำปรึกษาฟรีจากทีมงานมืออาชีพ
              </p>
              <Link
                href="/#contact"
                className="inline-block bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition"
              >
                ติดต่อเรา
              </Link>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Service Icon */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-8 text-center">
              <div
                className={`${service.bgColor} rounded-2xl p-12 inline-block shadow-lg`}
              >
                <i
                  className={`fa-solid ${service.icon} text-6xl text-white`}
                ></i>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                ข้อเท็จจริง
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ประเภทบริการ
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {service.title}
                  </p>
                </div>
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ความเชี่ยวชาญ
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    มากกว่า 10 ปี
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    โครงการสำเร็จ
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    150+ โครงการ
                  </p>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {relatedServices.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  บริการอื่นๆ
                </h3>
                <div className="space-y-4">
                  {relatedServices.map((relService) => (
                    <Link
                      key={relService.id}
                      href={`/services/${relService.slug}`}
                      className="block p-4 rounded-lg bg-white dark:bg-gray-900 hover:shadow-lg transition border-l-4 border-orange-600"
                    >
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 transition">
                        {relService.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {relService.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
