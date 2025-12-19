import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, LogIn, LayoutDashboard } from "lucide-react"; 
import api from '../api/api';
import Button from '../reusable/Button';

export default function LoginPage() {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        if (searchParams.get('status') === 'registered') {
            setSuccessMsg('Registrasi berhasil! Silakan login.');
        }
    }, [searchParams]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/auth/login', { userName, password });

            const { token, user, role, application, branch } = res.data;

            localStorage.setItem('token', token);

            const userData = {
                ...user,
                role: role,
                application: application,
                branch: branch 
            };

            localStorage.setItem('user', JSON.stringify(userData));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            navigate('/dashboard');

        } catch (err) {
            const errMsg = err.response?.data?.message || 'Login gagal. Periksa username dan password.';
            setError(errMsg);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 p-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">

                {/* Header Card */}
                <div className="p-8 pb-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                        <LayoutDashboard size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500 mt-2">Masuk untuk mengelola logistik Anda</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="p-8 pt-0 space-y-5">

                    {/* Alert Sukses */}
                    {successMsg && (
                        <div className="p-3 bg-green-100 border border-green-200 text-green-700 text-sm rounded-lg text-center">
                            {successMsg}
                        </div>
                    )}

                    {/* Alert Error */}
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-200 text-red-700 text-sm rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            autocomplete="username"
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username Anda"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                autocomplete="current-password"
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                                tabIndex="-1"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3 text-lg font-semibold shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <LogIn size={20} /> Masuk
                                </span>
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-bold text-purple-600 hover:text-purple-800 hover:underline transition-all">
                            Daftar Sekarang
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}