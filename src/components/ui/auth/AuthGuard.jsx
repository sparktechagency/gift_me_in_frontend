"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/icons/logo.png";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticationToken =
      localStorage.getItem("authenticationToken") ||
      sessionStorage.getItem("authenticationToken");

    if (!authenticationToken) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <Image src={logo} className="w-20 h-10" alt="" />;
  }

  return isAuthenticated ? <>{children}</> : null;
}
