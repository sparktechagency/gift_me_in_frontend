"use client";

import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useGetUserProfileQuery } from "../redux/apiSlice/authSlice";
import { imageUrl } from "../redux/api/baseApi";

const Header = () => {
  const { data: profileData, isLoading } = useGetUserProfileQuery();

  // const isLoading = false;
  // const profileData = [];

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const profile = profileData?.data;
  //console.log(profile);

  return (
    <header className="w-full select-none shadow-md bg-white h-[100px] flex items-center">
      <section className="container mx-auto flex items-center justify-between md:px-6 flex-wrap">
        {/* Logo */}
        <div>
          <Link href={"/"}>
            <Image
              src={"/icons/logo.png"}
              width={131}
              height={53}
              alt="website logo"
            />
          </Link>
        </div>

        {/* Notification & Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Notification Icon */}
          <div className="relative cursor-pointer bg-[#FDCFEB21] p-[10px] rounded-md">
            <Image
              src={"/icons/bell.png"}
              width={24}
              height={24}
              alt="notification icon"
            />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>

          {/* Profile */}
          {profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN" ? (
            <div className="flex items-center border-2 pe-5 rounded-full gap-2 sm:gap-3">
              <Image
                className="rounded-lg w-12 h-12 sm:w-14 sm:h-14"
                src={
                  profile?.image?.startsWith("http")
                    ? profile?.image
                    : `${imageUrl}/${profile?.image}`
                }
                width={60}
                height={60}
                alt="profile"
              />
              <div className="text-sm">
                <p className="font-medium text-[#151D48] text-base">
                  {profile?.name}
                </p>
                <p className="text-[#737791] text-sm font-normal">
                  {profile?.role}
                </p>
              </div>
            </div>
          ) : (
            <Link href={"/login"}>
              <Button>LogIn</Button>
            </Link>
          )}
        </div>
      </section>
    </header>
  );
};

export default Header;
