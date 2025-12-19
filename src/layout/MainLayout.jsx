import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Butuh ini untuk logout
import { LogOut, Menu } from "lucide-react"; // Icon tambahan
import Button from "../reusable/Button";
import Sidebar from "../reusable/Sidebar";

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userString = localStorage.getItem("user");

        if (userString) {
            try {
                const user = JSON.parse(userString);
                setUserData(user);

                // Cek Role
                const roleName = user.role?.name || user.role || "";
                const roleLower = roleName.toString().toLowerCase();

                if (roleLower.includes("admin") || roleLower.includes("owner") || roleLower.includes("manager")) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            } catch (error) {
                console.error("Gagal parsing user data", error);
            }
        }
    }, []);

    const handleLogout = () => {
        if (window.confirm("Apakah anda yakin ingin keluar?")) {
            localStorage.clear(); // Hapus token & user data
            navigate("/login");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">

            {isAdmin && (
                <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
            )}

            <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${isAdmin ? "lg:ml-[240px]" : ""
                }`}>

                <header className="bg-white shadow-sm border-b border-gray-200 p-4 z-20 sticky top-0">
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            {isAdmin && (
                                <Button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    <Menu className="w-6 h-6" />
                                </Button>
                            )}

                            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                                📦 <span className="hidden sm:inline">Sistem Pelacakan</span>
                            </h1>
                        </div>

                        {/* Info User & Logout */}
                        <div className="flex items-center gap-4">
                            {userData && (
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-700">{userData.name || userData.username}</p>
                                    <p className="text-xs text-gray-500 capitalize">
                                        {/* Menampilkan Role/Jabatan */}
                                        {typeof userData.role === 'object' ? userData.role.name : userData.role}
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={handleLogout}
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50 hover:text-red-700 flex items-center gap-2"
                                title="Logout"
                            >
                                <LogOut size={18} />
                                <span className="hidden sm:inline">Keluar</span>
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="p-6 flex-grow overflow-x-auto">
                    {children}
                </main>

                <footer className="text-center text-gray-400 text-sm py-6 border-t bg-white mt-auto">
                    © {new Date().getFullYear()} Sistem Pelacakan Paket
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;