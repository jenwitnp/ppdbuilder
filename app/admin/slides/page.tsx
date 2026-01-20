"use client";

import { useState, useEffect } from "react";
import { Plus, Save, X, Loader2, Eye, EyeOff, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import ImageUpload from "@/app/admin/components/ImageUpload";
import {
  getSlidesAction,
  createSlideAction,
  updateSlideAction,
  deleteSlideAction,
  toggleSlideStatusAction,
} from "@/actions/slides.actions";

interface SlideFormData {
  title: string;
  link_url: string;
  display_order: number;
  is_active: boolean;
  image?: File;
}

export default function SlidesPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SlideFormData>({
    defaultValues: {
      title: "",
      link_url: "",
      display_order: 0,
      is_active: true,
    },
  });

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides = async () => {
    setIsLoading(true);
    try {
      const result = await getSlidesAction();

      if (result.error) {
        throw new Error(result.error);
      }

      setSlides(result.data || []);
    } catch (error) {
      console.error("Error loading slides:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    reset({
      title: "",
      link_url: "",
      display_order: slides.length,
      is_active: true,
    });
    setSelectedImage(null);
    setImagePreview("");
    setEditingSlide(null);
    setIsModalOpen(true);
  };

  const openEditModal = (slide: any) => {
    setEditingSlide(slide);
    reset({
      title: slide.title || "",
      link_url: slide.link_url || "",
      display_order: slide.display_order,
      is_active: slide.is_active,
    });
    setImagePreview(slide.image_url);
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview("");
  };

  const onSubmit = async (data: SlideFormData) => {
    setIsSaving(true);

    try {
      const formData = new FormData();

      if (selectedImage) {
        formData.append("image", selectedImage);
      } else if (!editingSlide) {
        alert("กรุณาเลือกรูปภาพ");
        setIsSaving(false);
        return;
      }

      if (editingSlide && imagePreview) {
        formData.append("existing_image_url", editingSlide.image_url);
      }

      formData.append("title", data.title);
      formData.append("link_url", data.link_url);
      formData.append("display_order", data.display_order.toString());
      formData.append("is_active", data.is_active.toString());

      const result = editingSlide
        ? await updateSlideAction(editingSlide.id, formData)
        : await createSlideAction(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setIsModalOpen(false);
      reset();
      setSelectedImage(null);
      setImagePreview("");
      loadSlides();
    } catch (error: any) {
      console.error("Error saving slide:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบสไลด์นี้ใช่หรือไม่?")) return;

    try {
      const result = await deleteSlideAction(id);

      if (result.error) {
        throw new Error(result.error);
      }

      loadSlides();
    } catch (error: any) {
      console.error("Error deleting slide:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const result = await toggleSlideStatusAction(id, !currentStatus);

      if (result.error) {
        throw new Error(result.error);
      }

      loadSlides();
    } catch (error: any) {
      console.error("Error updating status:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการสไลด์</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            อัปโหลดและจัดการสไลด์แสดงหน้าหลัก
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
        >
          <Plus className="w-5 h-5" />
          เพิ่มสไลด์ใหม่
        </button>
      </div>

      {/* Slides List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            ยังไม่มีสไลด์
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            เริ่มต้นสร้างสไลด์แรกของคุณ
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            เพิ่มสไลด์
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div
              key={slide.id}
              className="glass-panel rounded-xl overflow-hidden group"
            >
              <div className="relative aspect-video bg-gray-100 dark:bg-slate-700">
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => toggleActive(slide.id, slide.is_active)}
                    className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    {slide.is_active ? (
                      <Eye className="w-4 h-4 text-green-500" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {slide.title || "ไม่มีชื่อ"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  ลำดับที่: {slide.display_order}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id)}
                    className="px-3 py-2 text-sm bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isSaving && setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {editingSlide ? "แก้ไขสไลด์" : "เพิ่มสไลด์ใหม่"}
              </h2>
              <button
                onClick={() => !isSaving && setIsModalOpen(false)}
                disabled={isSaving}
                className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  รูปภาพสไลด์ *
                </label>
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  preview={imagePreview}
                  onRemove={handleRemoveImage}
                />
                {!imagePreview && !selectedImage && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    กรุณาเลือกรูปภาพ
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อสไลด์
                </label>
                <input
                  type="text"
                  {...register("title")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ชื่อหรือคำอธิบายสไลด์"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ลิงก์
                </label>
                <input
                  type="text"
                  {...register("link_url")}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com"
                />
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ลำดับการแสดง
                  </label>
                  <input
                    type="number"
                    {...register("display_order", { valueAsNumber: true })}
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    สถานะ
                  </label>
                  <label className="flex items-center gap-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("is_active")}
                      className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                    />
                    <span className="text-gray-900 dark:text-gray-100">
                      แสดงบนเว็บไซต์
                    </span>
                  </label>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !imagePreview}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      กำลังบันทึก...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      บันทึก
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
