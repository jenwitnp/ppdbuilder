"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { ArticleCategory } from "@/types/article-category";
import {
  getCategoriesAction,
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from "@/actions/article-categories.actions";

export default function ArticleCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ArticleCategory | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const result = await getCategoriesAction();
    if (result.data) {
      setCategories(result.data);
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug:
        prev.slug === "" || prev.slug === generateSlug(prev.name)
          ? generateSlug(name)
          : prev.slug,
    }));
  };

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: "", slug: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (category: ArticleCategory) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("slug", formData.slug);
      data.append("description", formData.description);

      if (editingCategory) {
        const result = await updateCategoryAction(editingCategory.id, data);

        if (result.error) {
          alert(result.error);
          return;
        }
      } else {
        const result = await createCategoryAction(data);

        if (result.error) {
          alert(result.error);
          return;
        }
      }

      setShowModal(false);
      loadCategories();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้? บทความจะไม่ถูกลบ แต่จะไม่มีหมวดหมู่"
      )
    ) {
      return;
    }

    const result = await deleteCategoryAction(id);

    if (result.error) {
      alert(result.error);
      return;
    }

    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">หมวดหมู่บทความ</h1>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/articles")}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
          >
            <FileText className="h-4 w-4" />
            บทความ
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            เพิ่มหมวดหมู่
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">กำลังโหลดหมวดหมู่...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          ยังไม่มีหมวดหมู่ สร้างหมวดหมู่เพื่อเริ่มต้น
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className="text-sm text-white/60 mb-1">
                Slug: {category.slug}
              </p>
              {category.description && (
                <p className="text-sm text-white/80 mb-4">
                  {category.description}
                </p>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEditModal(category)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  ลบ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingCategory ? "แก้ไขหมวดหมู่" : "สร้างหมวดหมู่"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  ชื่อหมวดหมู่
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  คำอธิบาย (ไม่บังคับ)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting
                    ? "กำลังบันทึก..."
                    : editingCategory
                    ? "อัปเดต"
                    : "สร้าง"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
