"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { ArticleWithCategory } from "@/types/article";
import { ArticleCategory } from "@/types/article-category";
import {
  getArticlesAction,
  createArticleAction,
  updateArticleAction,
  deleteArticleAction,
} from "@/actions/articles.actions";
import { getCategoriesAction } from "@/actions/article-categories.actions";

const TiptapEditor = dynamic(
  () => import("@/app/admin/components/TiptapEditor"),
  {
    ssr: false,
  },
);

export default function ArticlesPage() {
  const [articles, setArticles] = useState<ArticleWithCategory[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArticle, setEditingArticle] =
    useState<ArticleWithCategory | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category_id: "",
    status: "draft" as "draft" | "published",
    featured_image: null as File | null,
    existing_image_url: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [articlesResult, categoriesResult] = await Promise.all([
      getArticlesAction(),
      getCategoriesAction(),
    ]);

    if (articlesResult.data) {
      setArticles(articlesResult.data);
    }

    if (categoriesResult.data) {
      setCategories(categoriesResult.data);
    }

    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug:
        prev.slug === "" || prev.slug === generateSlug(prev.title)
          ? generateSlug(title)
          : prev.slug,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, featured_image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category_id: "",
      status: "draft",
      featured_image: null,
      existing_image_url: "",
    });
    setImagePreview("");
    setShowModal(true);
  };

  const openEditModal = (article: ArticleWithCategory) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt || "",
      category_id: article.category_id || "",
      status: article.status,
      featured_image: null,
      existing_image_url: article.featured_image_url || "",
    });
    setImagePreview(article.featured_image_url || "");
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("slug", formData.slug);
      data.append("content", formData.content);
      data.append("excerpt", formData.excerpt);
      data.append("category_id", formData.category_id);
      data.append("status", formData.status);

      if (editingArticle) {
        data.append("existing_image_url", formData.existing_image_url);
      }

      if (formData.featured_image) {
        data.append("featured_image", formData.featured_image);
      }

      const result = editingArticle
        ? await updateArticleAction(editingArticle.id, data)
        : await createArticleAction(data);

      if (result.error) {
        alert(result.error);
        return;
      }

      setShowModal(false);
      loadData();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้?")) {
      return;
    }

    const result = await deleteArticleAction(id);

    if (result.error) {
      alert(result.error);
      return;
    }

    loadData();
  };

  const filteredArticles = articles.filter((article) => {
    if (filterStatus !== "all" && article.status !== filterStatus) {
      return false;
    }
    if (filterCategory !== "all" && article.category_id !== filterCategory) {
      return false;
    }
    return true;
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">บทความ</h1>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            บทความใหม่
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
          >
            <option value="all">สถานะทั้งหมด</option>
            <option value="draft">แบบร่าง</option>
            <option value="published">เผยแพร่แล้ว</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30"
          >
            <option value="all">หมวดหมู่ทั้งหมด</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-12">กำลังโหลดบทความ...</div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12 text-white/60">
            ไม่พบบทความ สร้างบทความเพื่อเริ่มต้น
          </div>
        ) : (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10"
              >
                <div className="flex gap-4">
                  {article.featured_image_url && (
                    <img
                      src={article.featured_image_url}
                      alt={article.title}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-1">
                          {article.title}
                        </h3>
                        <p className="text-sm text-white/60">
                          Slug: {article.slug}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          article.status === "published"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {article.status}
                      </span>
                    </div>

                    {article.excerpt && (
                      <p className="text-sm text-white/80 mb-3">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                      {article.category && (
                        <span>หมวดหมู่: {article.category.name}</span>
                      )}
                      {article.published_at && (
                        <span>
                          เผยแพร่:{" "}
                          {new Date(article.published_at).toLocaleDateString(
                            "th-TH",
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(article)}
                        className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                        แก้ไข
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        ลบ
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/10 w-full max-w-4xl my-8">
              <h2 className="text-xl font-bold mb-4">
                {editingArticle ? "แก้ไขบทความ" : "สร้างบทความ"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    หัวข้อ
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
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
                    เนื้อหา
                  </label>
                  <TiptapEditor
                    content={formData.content}
                    onChange={(content) =>
                      setFormData({ ...formData, content })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    บทคัดย่อ (ไม่บังคับ)
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) =>
                      setFormData({ ...formData, excerpt: e.target.value })
                    }
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      หมวดหมู่
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="">ไม่มีหมวดหมู่</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      สถานะ
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "draft" | "published",
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                    >
                      <option value="draft">แบบร่าง</option>
                      <option value="published">เผยแพร่แล้ว</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    รูปภาพหน้าปก
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 rounded-lg backdrop-blur-xl bg-white/5 border border-white/10 focus:outline-none focus:border-white/30 transition-colors"
                  />
                  {imagePreview && (
                    <div className="mt-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submitting
                      ? "กำลังบันทึก..."
                      : editingArticle
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
        </div>
      )}
    </>
  );
}
