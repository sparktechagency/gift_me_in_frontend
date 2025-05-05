"use client"; // This makes it a client component

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../src/assets/logo.png";

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authenticationToken =
      localStorage.getItem("authenticationToken") ||
      sessionStorage.getItem("authenticationToken");

    const userRole =
      localStorage.getItem("role") || sessionStorage.getItem("role");

    if (userRole !== "Admin" || userRole !== "SUPER_ADMIN") {
      return router.push("/login");
    }

    if (!authenticationToken) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <Image src={logo} alt="" />;
  }

  return isAuthenticated ? <>{children}</> : null;
}
