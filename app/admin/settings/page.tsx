"use client";

import { useState, useEffect } from "react";
import {
  Save,
  Loader2,
  Building2,
  Upload,
  X,
  Phone,
  Mail,
  MapPin,
  Facebook,
  MessageCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import {
  getCompanyInfoAction,
  saveCompanyInfoAction,
} from "@/actions/company-info.actions";

interface CompanyFormData {
  company_name: string;
  slogan: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  facebook_url: string;
  line_url: string;
}

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>("");
  const [logoDarkFile, setLogoDarkFile] = useState<File | null>(null);
  const [logoDarkPreview, setLogoDarkPreview] = useState<string>("");
  const [existingLogoDarkUrl, setExistingLogoDarkUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>();

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    setIsLoading(true);
    try {
      const result = await getCompanyInfoAction();

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.data) {
        reset({
          company_name: result.data.company_name || "",
          slogan: result.data.slogan || "",
          description: result.data.description || "",
          phone: result.data.phone || "",
          email: result.data.email || "",
          address: result.data.address || "",
          facebook_url: result.data.facebook_url || "",
          line_url: result.data.line_url || "",
        });

        if (result.data.logo_url) {
          setExistingLogoUrl(result.data.logo_url);
          setLogoPreview(result.data.logo_url);
        }

        if (result.data.logo_url_dark) {
          setExistingLogoDarkUrl(result.data.logo_url_dark);
          setLogoDarkPreview(result.data.logo_url_dark);
        }
      }
    } catch (error) {
      console.error("Error loading company info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview("");
    setExistingLogoUrl("");
  };

  const handleLogoDarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoDarkFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoDarkPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogoDark = () => {
    setLogoDarkFile(null);
    setLogoDarkPreview("");
    setExistingLogoDarkUrl("");
  };

  const onSubmit = async (data: CompanyFormData) => {
    setIsSaving(true);

    try {
      const formData = new FormData();
      formData.append("company_name", data.company_name);
      formData.append("slogan", data.slogan);
      formData.append("description", data.description);
      formData.append("phone", data.phone);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("facebook_url", data.facebook_url);
      formData.append("line_url", data.line_url);

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      if (logoDarkFile) {
        formData.append("logo_dark", logoDarkFile);
      }

      if (existingLogoUrl) {
        formData.append("existing_logo_url", existingLogoUrl);
      }

      if (existingLogoDarkUrl) {
        formData.append("existing_logo_dark_url", existingLogoDarkUrl);
      }

      const result = await saveCompanyInfoAction(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      alert("บันทึกข้อมูลสำเร็จ");
      loadCompanyInfo();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error saving company info:", error);
      alert(`เกิดข้อผิดพลาด: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">ตั้งค่าข้อมูลบริษัท</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          จัดการข้อมูลบริษัทและโลโก้
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Upload */}
        <div className="glass-panel rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            โลโก้บริษัท
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Light Logo */}
            <div>
              <h3 className="text-sm text-center font-medium text-gray-700 dark:text-gray-300 mb-3">
                โลโก้ (Light Mode)
              </h3>
              <div className="space-y-4">
                {/* Preview */}
                {logoPreview ? (
                  <div className="relative group w-40 mx-auto">
                    <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white flex items-center justify-center">
                      <Image
                        src={logoPreview}
                        alt="Company Logo"
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-40 mx-auto rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Upload Button */}
                <div className="text-center">
                  <label className="inline-block">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                      <Upload className="w-5 h-5" />
                      <span>อัปโหลด Light Mode</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    JPG, PNG, GIF (ไม่เกิน 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Dark Logo */}
            <div>
              <h3 className="text-sm text-center font-medium text-gray-700 dark:text-gray-300 mb-3">
                โลโก้ (Dark Mode)
              </h3>
              <div className="space-y-4">
                {/* Preview */}
                {logoDarkPreview ? (
                  <div className="relative group w-40 mx-auto">
                    <div className="w-40 h-40 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-slate-800 flex items-center justify-center">
                      <Image
                        src={logoDarkPreview}
                        alt="Company Logo Dark"
                        width={160}
                        height={160}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogoDark}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-40 h-40 mx-auto rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-slate-800 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-gray-400" />
                  </div>
                )}

                {/* Upload Button */}
                <div className="text-center">
                  <label className="inline-block">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors cursor-pointer">
                      <Upload className="w-5 h-5" />
                      <span>อัปโหลด Dark Mode</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoDarkChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    JPG, PNG, GIF (ไม่เกิน 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลพื้นฐาน</h2>

          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              ชื่อบริษัท *
            </label>
            <input
              type="text"
              {...register("company_name", { required: true })}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="บริษัท ABC จำกัด"
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                กรุณากรอกชื่อบริษัท
              </p>
            )}
          </div>

          {/* Slogan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              สโลแกน
            </label>
            <input
              type="text"
              {...register("slogan")}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="สโลแกนบริษัท"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              คำอธิบาย
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="รายละเอียดเกี่ยวกับบริษัท..."
            />
          </div>
        </div>

        {/* Contact Information */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">ข้อมูลติดต่อ</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                เบอร์โทรศัพท์
              </label>
              <input
                type="tel"
                {...register("phone")}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="02-123-4567"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                อีเมล
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="info@company.com"
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              ที่อยู่
            </label>
            <textarea
              {...register("address")}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="123 ถนน... แขวง... เขต... กรุงเทพฯ 10100"
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="glass-panel rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold mb-4">โซเชียลมีเดีย</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Facebook className="w-4 h-4 inline mr-1" />
                Facebook URL
              </label>
              <input
                type="url"
                {...register("facebook_url")}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            {/* Line */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MessageCircle className="w-4 h-4 inline mr-1" />
                Line URL
              </label>
              <input
                type="url"
                {...register("line_url")}
                className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="https://line.me/ti/p/yourline"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                กำลังบันทึก...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                บันทึกข้อมูล
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
