import React, { useState } from "react";
import Button from "../reusable/Button";
import Sidebar from "../reusable/Sidebar";

const MainLayout = ({ children }) => {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50 ">

            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col lg:ml-[240px] min-w-0">

                <header className="bg-white shadow-md p-4 z-10">
                    <div className="flex items-center justify-between">

                        <Button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded text-gray-700 hover:bg-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>

                        <h1 className="text-3xl font-bold text-purple-700 hidden sm:block">
                            📦 Sistem Pelacakan Barang
                        </h1>
                    </div>
                </header>

                <main className="p-6 flex-grow overflow-x-auto">
                    {children}
                </main>

                <footer className="text-center text-gray-500 text-sm py-4 border-t bg-white">
                    © {new Date().getFullYear()} Sistem Pelacakan Paket
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;