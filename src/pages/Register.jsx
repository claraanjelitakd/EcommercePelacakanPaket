import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// ✅ FIXED: Tambahkan ShieldAlert ke dalam import
import { UserPlus, User, Mail, Lock, Eye, EyeOff, CheckCircle, ShieldAlert } from "lucide-react";
import api from '../api/api';
import Button from '../reusable/Button';

export default function RegisterPage() {
    const [userName, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const allowedDomains = [
        "gmail.com", "yahoo.com", "yahoo.co.id", "outlook.com", "hotmail.com"
    ];

    const validateEmailDomain = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) return false;
        const domain = email.split("@")[1];
        return allowedDomains.includes(domain);
    };

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        setError('');

        if (password !== confirmPassword) {
            setError('Password dan Konfirmasi Password tidak cocok.');
            return;
        }

        setLoading(true);

        try {
            // Kirim data ke Backend
            await api.post('/auth/register', {
                userName,
                fullName,
                email,
                password,
            });

            navigate('/login?status=registered');

        } catch (err) {
            const errMsg = err.response?.data?.message || 'Registrasi gagal. Coba lagi.';
            setError(errMsg);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header Card */}
                <div className="p-8 pb-4 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                        <UserPlus size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Buat Akun</h2>
                    <p className="text-gray-500 mt-2">Daftar untuk memulai manajemen logistik</p>
                </div>

                <form onSubmit={handleRegister} className="p-8 pt-2 space-y-5">

                    {/* Alert Error  */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg text-center flex items-center justify-center gap-2">
                            <ShieldAlert size={16} /> {error}
                        </div>
                    )}

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="userName"
                                type="text"
                                required
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Pilih username unik"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)} // Auto capitalize optional
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Contoh: Budi Santoso"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                placeholder="anda@email.com"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setEmail(value);
                                    if (!validateEmailDomain(value) && value) {
                                        setEmailError("Gunakan email umum (Gmail, Yahoo, dll)");
                                    } else {
                                        setEmailError("");
                                    }
                                }}
                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${emailError
                                        ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                                        : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
                                    }`}
                            />
                        </div>
                        {emailError && (
                            <p className="text-xs text-red-600 mt-1 ml-1">{emailError}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                                placeholder="Minimal 6 karakter"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password</label>
                        <div className="relative">
                            <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 outline-none transition-all ${confirmPassword && password !== confirmPassword
                                        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
                                        : "border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    }`}
                                placeholder="Ulangi password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="text-xs text-red-600 mt-1 ml-1">Password tidak cocok</p>
                        )}
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 text-lg font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all"
                            disabled={loading || emailError !== '' || (confirmPassword && password !== confirmPassword)}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mendaftar...
                                </span>
                            ) : 'Daftar Sekarang'}
                        </Button>
                    </div>

                    <p className="text-center text-gray-600 text-sm mt-4">
                        Sudah punya akun?{' '}
                        <Link to="/login" className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-all">
                            Login di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}