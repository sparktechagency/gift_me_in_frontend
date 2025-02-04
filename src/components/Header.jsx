"use client";

import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full select-none shadow-md bg-white h-[100px] flex items-center">
      <section className="container mx-auto flex items-center justify-between md:px-6 flex-wrap">
        {/* Logo */}
        <div>
          <Image src={"/icons/logo.png"} width={131} height={53} alt="website logo" />
        </div>

        {/* Notification & Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Notification Icon */}
          <div className="relative cursor-pointer bg-[#FDCFEB21] p-[10px] rounded-md">
            <Image src={"/icons/bell.png"} width={24} height={24} alt="notification icon" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Image
              className="rounded-lg w-12 h-12 sm:w-14 sm:h-14"
              src={"/images/userProfile.png"}
              width={60}
              height={60}
              alt="profile"
            />
            <div className="text-sm">
              <p className="font-medium text-[#151D48] text-base">Musfiq</p>
              <p className="text-[#737791] text-sm font-normal">Admin</p>
            </div>
            <Image src={"/icons/arrow.png"} width={16} height={16} alt="Arrow icon" />
          </div>
        </div>
      </section>
    </header>
  );
}
