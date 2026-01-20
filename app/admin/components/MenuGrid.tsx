"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Icons from "lucide-react";
import { MenuItem } from "@/types/menu";
import SubMenuModal from "./SubMenuModal";

interface MenuGridProps {
  items: MenuItem[];
}

export default function MenuGrid({ items }: MenuGridProps) {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const handleCardClick = (item: MenuItem) => {
    if (item.hasSubmenu) {
      setSelectedItem(item);
    } else if (item.path) {
      router.push(item.path);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
        {items.map((item) => {
          const IconComponent = Icons[
            item.icon as keyof typeof Icons
          ] as React.FC<React.SVGProps<SVGSVGElement>>;

          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group relative flex flex-col items-center justify-center p-4 rounded-xl glass-panel shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border-white/20 dark:border-gray-700/30 hover:-translate-y-1 hover:border-primary/50 dark:hover:border-primary/50"
            >
              <div
                className={`w-10 h-10 md:w-12 md:h-12 ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}
              >
                {IconComponent && (
                  <IconComponent className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </div>
              <h3 className="font-medium text-sm md:text-base text-gray-800 dark:text-gray-100 text-center leading-tight">
                {item.title}
              </h3>
              {item.hasSubmenu && (
                <div className="absolute top-2 right-2">
                  <span className="flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedItem && (
        <SubMenuModal item={selectedItem} onClose={closeModal} />
      )}
    </>
  );
}
