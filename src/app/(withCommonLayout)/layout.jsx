"use client";
import React from "react";
import "./globals.css";
import Header from "../../components/Header";
import { usePathname, useRouter } from "next/navigation";
import {
  Calendar,
  ShoppingCart,
  Box,
  CreditCard,
  Settings,
  LogOut,
  LayoutDashboard,
  UserCheck,
  ChartBarStacked,
  CircleDollarSign,
  Gift,
  Tickets,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AuthGuard from "../../components/ui/auth/AuthGuard";

const menuItems = [
  { name: "Overview", icon: LayoutDashboard, link: "/" },
  { name: "Events", icon: Calendar, link: "/events/upcoming_events" },
  { name: "Users", icon: Calendar, link: "/users" },
  { name: "Shop Orders", icon: ShoppingCart, link: "/shop-orders" },
  { name: "Order", icon: ShoppingCart, link: "/order" },
  { name: "gift-sent", icon: Gift, link: "/giftSent" },
  { name: "Product", icon: Box, link: "/product" },
  { name: "Category", icon: ChartBarStacked, link: "/category" },
  { name: "Event Category", icon: Tickets, link: "/event-category" },
  { name: "Package", icon: CreditCard, link: "/package" },
  { name: "Edit Budget", icon: CircleDollarSign, link: "/edit-budget" },
  { name: "Subscribers", icon: UserCheck, link: "/subscribers" },
  { name: "Settings", icon: Settings, link: "/settings/admin/password" },
];

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authenticationToken") ||
      sessionStorage.removeItem("authenticationToken");
    localStorage.removeItem("role") || sessionStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <AuthGuard>
      <div>
        <Header />
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
                  const isActive =
                    (link.startsWith("/settings") &&
                      pathname.startsWith("/settings")) ||
                    (link.startsWith("/events") &&
                      pathname.startsWith("/events")) ||
                    (link.startsWith("/product") &&
                      pathname.startsWith("/product")) ||
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
                    onClick={() => handleLogout()}
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
      </div>
    </AuthGuard>
  );
}
