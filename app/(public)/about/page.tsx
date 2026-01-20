import Link from "next/link";

export const metadata = {
  title: "เกี่ยวกับเรา | PPD Builder",
  description: "รู้จักเพิ่มเติมเกี่ยวกับ PPD Builder และทีมงานมืออาชีพ",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-orange-600 to-orange-700 dark:from-gray-800 dark:to-gray-900 text-white py-20">
        <div className="absolute inset-0 opacity-10">
          <i className="fa-solid fa-building text-9xl absolute -top-10 -right-10 text-white"></i>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl sm:text-6xl font-bold mb-6">เกี่ยวกับเรา</h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            PPD Builder คือบริษัทก่อสร้างที่มีความเชี่ยวชาญและประสบการณ์กว่า 10
            ปี ในการสร้างสรรค์โครงการคุณภาพ
          </p>
        </div>
      </div>

      {/* Company Overview */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                ความมุ่งมั่นในคุณภาพ
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                PPD Builder ก่อตั้งขึ้นด้วยวิสัยทัศน์ที่ชัดเจน คือ
                การสร้างสรรค์โครงการก่อสร้างที่มีคุณภาพสูง ปลอดภัย
                และเป็นไปตามมาตรฐานสากล
                เราเชื่อว่าคุณภาพเป็นสิ่งที่ไม่ควรประนีประนอม
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                ด้วยทีมงานที่ประกอบไปด้วยวิศวกร ผู้จัดการโครงการ
                และช่างฝีมือมืออาชีพ
                เรามั่นใจว่าสามารถส่งมอบงานที่เกินความคาดหวังของลูกค้าได้
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    150+
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    โครงการสำเร็จ
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                    10+
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    ปีประสบการณ์
                  </p>
                </div>
              </div>
            </div>

            {/* Image Placeholder */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl h-96 flex items-center justify-center">
              <div className="text-center">
                <i className="fa-solid fa-image text-6xl text-orange-300 dark:text-orange-600 mb-4 block"></i>
                <p className="text-gray-600 dark:text-gray-400">
                  รูปภาพสำนักงาน
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              พันธกิจ วิสัยทัศน์ และค่านิยม
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border-l-4 border-blue-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-600 rounded-full p-3">
                  <i className="fa-solid fa-bullseye text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  พันธกิจ
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                ส่งมอบโครงการก่อสร้างที่มีคุณภาพสูง ปลอดภัย
                และเป็นไปตามกำหนดเวลา โดยใช้วัสดุที่ดีที่สุดและทีมงานมืออาชีพ
              </p>
            </div>

            {/* Vision */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border-l-4 border-purple-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 rounded-full p-3">
                  <i className="fa-solid fa-eye text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  วิสัยทัศน์
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                เป็นบริษัทก่อสร้างชั้นนำที่เป็นที่เชื่อถือและยกย่องในความเชี่ยวชาญ
                และการบริหารจัดการโครงการที่ยอดเยี่ยม
              </p>
            </div>

            {/* Values */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border-l-4 border-green-600">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-600 rounded-full p-3">
                  <i className="fa-solid fa-heart text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ค่านิยม
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                ความซื่อสัตย์ ความปลอดภัย ความเป็นมืออาชีพ ความรับผิดชอบต่อชุมชน
                และการแสวงหาการปรับปรุงอย่างต่อเนื่อง
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
            คุณค่าหลัก
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "fa-shield-alt",
                title: "ความปลอดภัย",
                description: "ความปลอดภัยของพนักงานและลูกค้าเป็นสิ่งแรก",
              },
              {
                icon: "fa-star",
                title: "คุณภาพ",
                description: "การส่งมอบงานที่มีคุณภาพเหนือมาตรฐานเสมอ",
              },
              {
                icon: "fa-handshake",
                title: "ความเชื่อถือได้",
                description: "เป็นพันธมิตรที่นักลูกค้าสามารถพึ่งพาได้",
              },
              {
                icon: "fa-lightbulb",
                title: "นวัตกรรม",
                description: "ค้นหาและนำเทคนิคใหม่มาใช้ในงาน",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center hover:shadow-lg transition"
              >
                <div className="bg-orange-100 dark:bg-orange-900/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <i
                    className={`fa-solid ${value.icon} text-2xl text-orange-600 dark:text-orange-400`}
                  ></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white text-center mb-16">
            ทีมงานของเรา
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "วิศวกรโยธา",
                count: "12+",
                description: "วิศวกรผู้มีประสบการณ์ในการออกแบบและควบคุมโครงการ",
              },
              {
                title: "ผู้จัดการโครงการ",
                count: "8+",
                description: "ผู้เชี่ยวชาญในการบริหารจัดการโครงการและงบประมาณ",
              },
              {
                title: "ช่างผู้ควบคุม",
                count: "20+",
                description: "ช่างฝีมือมืออาชีพในสาขาต่างๆ",
              },
              {
                title: "พนักงานสนับสนุน",
                count: "15+",
                description: "ทีมสนับสนุนที่ทำให้ทุกสิ่งดำเนินไปด้วยราบรื่น",
              },
            ].map((team, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 text-center"
              >
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                  {team.count}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {team.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {team.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            สนใจร่วมงานกับเรา?
          </h2>
          <p className="text-xl text-orange-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            ติดต่อเราวันนี้เพื่อปรึกษาเกี่ยวกับโครงการของคุณหรือสนใจเป็นส่วนหนึ่งของทีมงาน
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="inline-block bg-white dark:bg-gray-700 text-orange-600 dark:text-orange-400 px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition"
            >
              ติดต่อเรา
            </Link>
            <Link
              href="/services"
              className="inline-block bg-orange-700 hover:bg-orange-800 dark:bg-gray-600 dark:hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition"
            >
              ดูบริการของเรา
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
