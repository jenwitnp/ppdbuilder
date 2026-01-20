"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Save,
  X,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
import MultiImageUpload from "@/app/admin/components/MultiImageUpload";
import {
  getAlbumsAction,
  createAlbumAction,
  updateAlbumAction,
  deleteAlbumAction,
  getAlbumImagesAction,
} from "@/actions/albums.actions";

interface AlbumFormData {
  title: string;
  description: string;
}

export default function ImagesPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AlbumFormData>({
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    setIsLoading(true);
    try {
      const result = await getAlbumsAction();

      if (result.error) {
        throw new Error(result.error);
      }

      setAlbums(result.data || []);
    } catch (error) {
      console.error("Error loading albums:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    reset({
      title: "",
      description: "",
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setEditingAlbum(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (album: any) => {
    setEditingAlbum(album);
    reset({
      title: album.title || "",
      description: album.description || "",
    });

    // Load all album images from database
    try {
      const result = await getAlbumImagesAction(album.id);
      if (result.data && result.data.length > 0) {
        // Show all images in order
        const imageUrls = result.data
          .sort((a, b) => a.display_order - b.display_order)
          .map((img) => img.image_url);
        setImagePreviews(imageUrls);
      } else {
        // Fallback to cover image if no album_images found
        setImagePreviews(album.cover_image_url ? [album.cover_image_url] : []);
      }
    } catch (error) {
      console.error("Error loading album images:", error);
      // Fallback to cover image
      setImagePreviews(album.cover_image_url ? [album.cover_image_url] : []);
    }

    setSelectedImages([]);
    setIsModalOpen(true);
  };

  const handleImagesSelect = (files: File[]) => {
    const newImages = [...selectedImages, ...files];
    setSelectedImages(newImages);

    // Generate previews for new files
    const newPreviews = [...imagePreviews];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleReorderImages = (startIndex: number, endIndex: number) => {
    // Only reorder selectedImages if they contain valid File objects
    if (selectedImages.length > 0 && selectedImages[0] instanceof File) {
      setSelectedImages((prev) => {
        const result = Array.from(prev);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      });
    }

    // Always reorder previews (works for both URLs and data URLs)
    setImagePreviews((prev) => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const onSubmit = async (data: AlbumFormData) => {
    setIsSaving(true);

    try {
      // Validate: must have at least one image for new albums
      if (!editingAlbum && selectedImages.length === 0) {
        alert("กรุณาเลือกรูปภาพอย่างน้อย 1 รูป");
        setIsSaving(false);
        return;
      }

      console.log("[FRONTEND DEBUG]");
      console.log("Editing album:", editingAlbum?.id);
      console.log("Selected images count:", selectedImages.length);
      console.log("Selected images:", selectedImages);
      console.log("Image previews count:", imagePreviews.length);
      console.log("Image previews:", imagePreviews);

      const formData = new FormData();

      // Check if we have actual File objects (not just length)
      const hasValidFiles =
        selectedImages.length > 0 &&
        selectedImages.every((img) => img instanceof File && img.size > 0);
      console.log("Has valid files:", hasValidFiles);

      // For new albums or when new images are uploaded
      if (hasValidFiles) {
        console.log("Adding new images to FormData...");
        // Add all images
        selectedImages.forEach((image, index) => {
          formData.append(`images`, image);
          console.log(`Added image ${index}:`, image.name);
          // Mark first image as cover
          if (index === 0) {
            formData.append("image", image); // First image is the cover
          }
        });
      } else if (editingAlbum && imagePreviews.length > 0) {
        // Editing without new images - only reordering existing images
        console.log("Reordering existing images...");
        console.log("First image (cover):", imagePreviews[0]);
        console.log("All images JSON:", JSON.stringify(imagePreviews));
        // Send existing image URLs with their new order
        formData.append("existing_image_url", imagePreviews[0]); // First image becomes new cover
        formData.append("reordered_images", JSON.stringify(imagePreviews)); // All images in new order
      }

      formData.append("title", data.title);
      formData.append("description", data.description);

      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }

      const result = editingAlbum
        ? await updateAlbumAction(editingAlbum.id, formData)
        : await createAlbumAction(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      setIsModalOpen(false);
      reset();
      setSelectedImages([]);
      setImagePreviews([]);
      loadAlbums();
    } catch (error: any) {
      console.error("Error saving album:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบอัลบั้มนี้ใช่หรือไม่?")) return;

    try {
      const result = await deleteAlbumAction(id);

      if (result.error) {
        throw new Error(result.error);
      }

      loadAlbums();
    } catch (error: any) {
      console.error("Error deleting album:", error);
      alert(`เกิดข้อผิดพลาด: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">จัดการอัลบั้มรูปภาพ</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            สร้างและจัดการอัลบั้มรูปภาพ
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-medium shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
        >
          <Plus className="w-5 h-5" />
          สร้างอัลบั้มใหม่
        </button>
      </div>

      {/* Albums Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : albums.length === 0 ? (
        <div className="text-center py-20 glass-panel rounded-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full mb-4">
            <ImageIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            ยังไม่มีอัลบั้ม
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            เริ่มต้นสร้างอัลบั้มแรกของคุณ
          </p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            สร้างอัลบั้ม
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <div
              key={album.id}
              className="glass-panel rounded-xl overflow-hidden group"
            >
              <div className="relative aspect-video bg-gray-100 dark:bg-slate-700">
                {album.cover_image_url ? (
                  <img
                    src={album.cover_image_url}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {album.title || "ไม่มีชื่อ"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                  {album.description || "ไม่มีคำอธิบาย"}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(album)}
                    className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(album.id)}
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
                {editingAlbum ? "แก้ไขอัลบั้ม" : "สร้างอัลบั้มใหม่"}
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
              {/* Multiple Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  รูปภาพอัลบั้ม *
                </label>
                <MultiImageUpload
                  onImagesSelect={handleImagesSelect}
                  previews={imagePreviews}
                  onRemove={handleRemoveImage}
                  onReorder={handleReorderImages}
                  maxFiles={10}
                />
                {imagePreviews.length === 0 && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    กรุณาเลือกรูปภาพอย่างน้อย 1 รูป (รูปแรกจะเป็นรูปปก)
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  ชื่อหัวข้อ *
                </label>
                <input
                  type="text"
                  {...register("title", { required: true })}
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="ชื่อหัวข้อ"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    กรุณากรอกชื่อหัวข้อ
                  </p>
                )}
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
                  placeholder="คำอธิบายอัลบั้ม..."
                />
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
                  disabled={isSaving || imagePreviews.length === 0}
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
