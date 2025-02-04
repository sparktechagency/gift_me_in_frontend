"use client";
import React from "react";
import { usePathname } from "next/navigation";
import {
  Calendar,
  ShoppingCart,
  Box,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
  UserCheck,
  ChartBarStacked
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, link: "/dashboard" },
  { name: "Events", icon: Calendar, link: "/dashboard/events/upcoming_events" },
  { name: "Order", icon: ShoppingCart, link: "/dashboard/order" },
  { name: "Product", icon: Box, link: "/dashboard/product" },
  { name: "category", icon: ChartBarStacked, link: "/dashboard/category" },
  { name: "Subscribers", icon: UserCheck, link: "/dashboard/subscribers" },
  { name: "Transactions", icon: CreditCard, link: "/dashboard/transactions" },
  { name: "Settings", icon: Settings, link: "/dashboard/settings/admin" },
];

const Layout = ({ children }) => {
  const pathname = usePathname();

  return (
    <section className="flex p-12 items-start gap-5">
      {/* Sidebar */}
      <aside className="w-[300px] h-screen p-5 bg-white shadow-md flex flex-col">
        {/* Dashboard Header */}
        <div className="flex items-center justify-start">
          <div className="flex items-start border border-[#F82BA9] w-full rounded-lg px-4 py-3 gap-2">
            <div className="p-1">
              <Image
                src={"/icons/dashboard_logo.png"}
                width={24}
                height={23}
                alt="dashboard logo"
              />
            </div>
            <h1 className="text-pink-500 font-bold text-xl">Dashboard</h1>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="mt-6 flex-1">
          <ul className="space-y-1">
            {menuItems.map(({ name, icon: Icon, link }, index) => {
              // Check if the link is related to the Settings or Events route
              const isActive = 
                (link.startsWith("/dashboard/settings") && pathname.startsWith("/dashboard/settings")) ||
                (link.startsWith("/dashboard/events") && pathname.startsWith("/dashboard/events")) ||
                (link.startsWith("/dashboard/product") && pathname.startsWith("/dashboard/product")) ||
                
                pathname === link;

              return (
                <li key={index}>
                  <Link
                    href={link}
                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                      isActive
                        ? "bg-pink-500 text-white rounded-lg"
                        : "text-gray-700 hover:bg-gray-100 rounded-lg"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "text-white" : "text-pink-500"}
                    />
                    {name}
                  </Link>
                </li>
              );
            })}

            {/* Logout Button */}
            <li>
              <button
                onClick={() => console.log("Logout function here")}
                className="flex items-center w-full gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut size={20} className="text-pink-500" />
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <div className="w-full">{children}</div>
    </section>
  );
};

export default Layout;
