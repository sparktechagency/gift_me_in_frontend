"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function EventLayout({ children }) {
  const pathname = usePathname();

  return (
    <div>
      {/* Navigation Bar */}
      <div className="flex justify-start gap-6 bg-white p-4">
        {[
          { name: "Admin", path: "/dashboard/settings/admin" },
          { name: "Password", path: "/dashboard/settings/admin/password" },
        ].map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`relative pb-2 font-medium transition-all duration-300 ${
              pathname === item.path
                ? "text-[#F82BA9] after:absolute after:left-0 after:bottom-0 after:w-full after:h-1 after:bg-gradient-to-r from-[#F82BA9] to-[#FF85E3]"
                : "text-gray-600 hover:text-[#F82BA9]"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Content Area */}
      <div className="">
        {children}
      </div>
    </div>
  );
}
