"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Star, GripVertical } from "lucide-react";

interface MultiImageUploadProps {
  onImagesSelect: (files: File[]) => void;
  previews: string[];
  onRemove: (index: number) => void;
  onReorder: (startIndex: number, endIndex: number) => void;
  maxFiles?: number;
}

export default function MultiImageUpload({
  onImagesSelect,
  previews,
  onRemove,
  onReorder,
  maxFiles = 10,
}: MultiImageUploadProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        const isValidType = file.type.startsWith("image/");
        const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

        if (!isValidType) {
          alert(`${file.name} ไม่ใช่ไฟล์รูปภาพ`);
          return false;
        }
        if (!isValidSize) {
          alert(`${file.name} มีขนาดใหญ่เกิน 5MB`);
          return false;
        }
        return true;
      });

      if (previews.length + validFiles.length > maxFiles) {
        alert(`สามารถอัปโหลดได้สูงสุด ${maxFiles} รูป`);
        return;
      }

      onImagesSelect(validFiles);
    },
    [onImagesSelect, previews.length, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
    multiple: true,
    disabled: previews.length >= maxFiles,
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    onReorder(draggedIndex, index);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      {previews.length < maxFiles && (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-gray-300 dark:border-gray-600 hover:border-primary"
          }`}
        >
          <input {...getInputProps()} />
          <Upload
            className={`mx-auto mb-4 ${
              isDragActive ? "text-primary" : "text-gray-400"
            }`}
            size={48}
          />
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {isDragActive
              ? "วางไฟล์ที่นี่..."
              : "ลากไฟล์มาที่นี่ หรือคลิกเพื่อเลือก"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500">
            รองรับ JPG, PNG, GIF, WebP (สูงสุด 5MB ต่อรูป, {maxFiles} รูป)
          </p>
        </div>
      )}

      {/* Preview Grid */}
      {previews.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              รูปภาพที่เลือก ({previews.length}/{maxFiles})
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              รูปแรกจะเป็นรูปปก
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden cursor-move ${
                  draggedIndex === index ? "opacity-50" : ""
                }`}
              >
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* First Image Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                    <Star className="w-3 h-3 fill-white" />
                    รูปปก
                  </div>
                )}

                {/* Drag Handle */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/50 backdrop-blur-sm text-white p-1.5 rounded cursor-move">
                    <GripVertical className="w-4 h-4" />
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute bottom-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow-lg transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Image Number */}
                <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
