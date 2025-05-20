// src/pages/root/RootLayout.jsx
import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
// import Navbar from "../../components/Navbar";

const Navbar = React.lazy(()=>import("../../components/Navbar"))
export default function RootLayout() {
  return (
    <>
     
      <Navbar />

      <div className="p-6 md:px-12">
        <Suspense fallback={<div className="py-10 text-center">Loading page…</div>}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
