"use client";

import { Badge, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useGetUserProfileQuery } from "../redux/apiSlice/authSlice";
import { imageUrl } from "../redux/api/baseApi";
import { FaRegBell } from "react-icons/fa";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { io } from "socket.io-client";

const Header = () => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { data: profileData, isLoading } = useGetUserProfileQuery();

  const token = Cookies.get("accessToken");
  // console.log(token);

  if (token) {
    const decodedToken = jwtDecode(token);
    const id = decodedToken?._id || decodedToken?.authId;

    useEffect(() => {
      try {
        const socket = io("http://10.0.70.188:5000", {
          query: { token: token },
        });

        socket.on(
          "get-notification::683d93aaa683d8710cf75f13",
          (notification) => {
            setNotificationCount((prevCount) => prevCount + 1);
          }
        );

        return () => {
          socket.disconnect();
        };
      } catch (error) {
        console.log(error);
      }
    }, [id]);
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const profile = profileData?.data;

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
            <Link href="/notifications" className="h-fit mt-[10px]">
              <Badge count={notificationCount}>
                <FaRegBell color="#4E4E4E" size={24} />
              </Badge>
            </Link>
          </div>

          {/* Profile */}
          {profile?.role === "ADMIN" || profile?.role === "SUPER_ADMIN" ? (
            <div className="flex items-center border-2 pe-5 rounded-full gap-2 sm:gap-3">
              <Image
                className="rounded-lg w-12 h-12 sm:w-14 sm:h-14"
                src={"https://www.shutterstock.com/image-vector/user-icon-vector-600nw-393536320.jpg"}
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
