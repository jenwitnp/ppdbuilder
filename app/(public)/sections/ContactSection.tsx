"use client";

import { useState } from "react";
import { useCompanyInfo } from "@/hooks/useCompanyInfo";

export default function ContactSection() {
  const { data: companyInfo } = useCompanyInfo();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "รับเหมาก่อสร้าง",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      await response.json();

      if (response.ok) {
        setSubmitMessage("✅ ส่งข้อความสำเร็จแล้ว เราจะติดต่อคุณในเร็วๆ นี้");
        setFormData({
          name: "",
          phone: "",
          service: "รับเหมาก่อสร้าง",
          message: "",
        });
      } else {
        setSubmitMessage("❌ เกิดข้อผิดพลาด กรุณาลองใหม่");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmitMessage("❌ เกิดข้อผิดพลาด กรุณาลองใหม่");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            ติดต่อเรา
          </h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            สนใจบริการหรือต้องการปรึกษา ติดต่อเราได้ทันที
          </p>
        </div>

        <div className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Contact Info */}
            <div className="p-10 lg:p-14 bg-orange-600 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6">ข้อมูลติดต่อ</h3>
                <div className="space-y-6">
                  {companyInfo?.address && (
                    <div className="flex items-start space-x-4">
                      <i className="fas fa-map-marker-alt text-xl mt-1 text-orange-200"></i>
                      <span>{companyInfo.address}</span>
                    </div>
                  )}
                  {companyInfo?.phone && (
                    <div className="flex items-center space-x-4">
                      <i className="fas fa-phone-alt text-xl text-orange-200"></i>
                      <span>{companyInfo.phone}</span>
                    </div>
                  )}
                  {companyInfo?.email && (
                    <div className="flex items-center space-x-4">
                      <i className="fas fa-envelope text-xl text-orange-200"></i>
                      <span>{companyInfo.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex space-x-4 mt-10 relative z-10">
                {companyInfo?.facebook_url && (
                  <a
                    href={companyInfo.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-700 hover:bg-orange-500 transition"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </a>
                )}
                {companyInfo?.line_url && (
                  <a
                    href={companyInfo.line_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-700 hover:bg-orange-500 transition"
                  >
                    <i className="fab fa-line"></i>
                  </a>
                )}
              </div>

              {/* Decor circles */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-500 rounded-full opacity-50"></div>
              <div className="absolute top-10 -left-10 w-20 h-20 bg-orange-400 rounded-full opacity-30"></div>
            </div>

            {/* Contact Form */}
            <div className="p-10 lg:p-14">
              <form className="space-y-6" onSubmit={handleSubmit}>
                {submitMessage && (
                  <div
                    className={`p-4 rounded-lg text-center font-medium ${
                      submitMessage.includes("✅")
                        ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                        : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ชื่อ - นามสกุล
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:text-white transition"
                    placeholder="กรอกชื่อของคุณ"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:text-white transition"
                    placeholder="08x-xxx-xxxx"
                  />
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    บริการที่สนใจ
                  </label>
                  <select
                    id="service"
                    value={formData.service}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:text-white transition"
                  >
                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      รับเหมาก่อสร้าง
                    </option>
                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      ที่ปรึกษาโครงการ
                    </option>
                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      ออกแบบและรีโนเวท
                    </option>
                    <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                      อื่นๆ
                    </option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    ข้อความ
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-orange-500 focus:border-orange-500 dark:text-white transition"
                    placeholder="รายละเอียดที่คุณต้องการปรึกษา"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "กำลังส่ง..." : "ส่งข้อความ"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
