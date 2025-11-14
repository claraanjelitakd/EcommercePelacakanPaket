import React from "react";
import Sidebar from "../reusable/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

const MappingUserLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen font-[Poppins] bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className="
          ml-[240px]
          flex-1
          p-6
          bg-white
          text-gray-900
        "
      >
        {children}
      </main>
    </div>
  );
};

export default MappingUserLayout;
