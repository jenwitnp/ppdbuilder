import MenuGrid from "@/app/admin/components/MenuGrid";
import { menuItems } from "@/constants/menu";

export default function AdminDashboard() {
  return (
    <>
      {/* Header Section */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Admin 👋</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Here&apos;s what&apos;s happening today.
        </p>
      </header>

      {/* Menu Grid */}
      <MenuGrid items={menuItems} />
    </>
  );
}
