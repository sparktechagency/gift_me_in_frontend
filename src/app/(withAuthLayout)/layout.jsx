import React from "react";
import "./globals.css";
import { Poppins } from "next/font/google";
import bgImage from "../../../public/images/category.jpg";

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const layout = ({ children }) => {
  return (
    <div
      className="w-full flex items-center justify-center relative"
      style={{
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundImage: `url(${bgImage.src})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",

          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          opacity: 0.9,
        }}
      ></div>

      <div
        style={{
          background: "#ff9eb1",
          padding: 30,
          borderRadius: 10,
          width: 570,
          position: "relative",
          zIndex: 2,
        }}
        className={` ${poppins.className} flex items-center justify-center shadow-xl`}
      >
        {children}
      </div>
    </div>
  );
};

export default layout;
