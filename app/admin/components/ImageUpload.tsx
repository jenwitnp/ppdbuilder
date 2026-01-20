"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string;
  onRemove?: () => void;
}

export default function ImageUpload({
  onImageSelect,
  preview,
  onRemove,
}: ImageUploadProps) {
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("");

      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError("ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 5MB)");
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          setError("ประเภทไฟล์ไม่ถูกต้อง (รองรับเฉพาะ JPG, PNG, GIF, WebP)");
        } else {
          setError("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onImageSelect(acceptedFiles[0]);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  if (preview) {
    return (
      <div className="relative">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[0.98]"
            : "border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-gray-50 dark:hover:bg-slate-800/50"
        }`}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-4">
          <div
            className={`p-4 rounded-full ${
              isDragActive
                ? "bg-primary text-white"
                : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
            } transition-colors`}
          >
            {isDragActive ? (
              <Upload className="w-8 h-8 animate-bounce" />
            ) : (
              <ImageIcon className="w-8 h-8" />
            )}
          </div>

          <div>
            <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
              {isDragActive ? "วางไฟล์ที่นี่..." : "ลากและวางรูปภาพที่นี่"}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              หรือคลิกเพื่อเลือกไฟล์
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
              รองรับ JPG, PNG, GIF, WebP (สูงสุด 5MB)
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
