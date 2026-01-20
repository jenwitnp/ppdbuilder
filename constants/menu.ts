import { MenuItem } from "@/types/menu";

export const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "ตั้งค่า",
    icon: "Settings",
    color: "bg-gray-500",
    path: "/admin/settings",
  },
  {
    id: 2,
    title: "สไลน์",
    icon: "Presentation",
    color: "bg-indigo-500",
    path: "/admin/slides",
  },
  {
    id: 3,
    title: "รูปภาพ",
    icon: "Image",
    color: "bg-pink-500",
    path: "/admin/images",
  },
  {
    id: 4,
    title: "บทความ",
    icon: "FileText",
    color: "bg-orange-500",
    hasSubmenu: true,
    submenu: [
      {
        title: "บทความ",
        icon: "FileText",
        color: "bg-orange-500",
        path: "/admin/articles",
      },
      {
        title: "หมวดหมู่",
        icon: "FolderOpen",
        color: "bg-amber-500",
        path: "/admin/articles/categories",
      },
    ],
  },
  {
    id: 5,
    title: "สินค้า",
    icon: "ShoppingBag",
    color: "bg-green-500",
    hasSubmenu: true,
    submenu: [
      {
        title: "หมวดหมู่",
        icon: "Tags",
        color: "bg-teal-500",
        path: "/products/categories",
      },
      {
        title: "เพิ่มสินค้า",
        icon: "PlusCircle",
        color: "bg-blue-500",
        path: "/products/add",
      },
      {
        title: "จัดการสินค้า",
        icon: "Box",
        color: "bg-purple-500",
        path: "/products/manage",
      },
    ],
  },
];
