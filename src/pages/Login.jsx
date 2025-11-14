import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import api from '../api/api';
import Button from '../reusable/Button';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

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
            const res = await api.post('/auth/login', { email, password });

            const token = res.data.token;
            localStorage.setItem('token', token);

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            navigate('/dashboard');

        } catch (err) {
            const errMsg = err.response?.data?.message || 'Login gagal. Coba lagi.';
            setError(errMsg);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800">
                    Login Sistem
                </h2>

                {successMsg && (
                    <p className="text-sm text-center text-green-600">{successMsg}</p>
                )}
                {error && (
                    <p className="text-sm text-center text-red-600">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-gray-700 w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            placeholder="anda@email.com"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-gray-700 w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-center text-red-600">{error}</p>
                    )}

                    <div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full py-3"
                            disabled={loading}
                        >
                            {loading ? 'Memproses...' : 'Login'}
                        </Button>
                    </div>
                    <p className="text-sm text-center text-gray-600">
                        Belum punya akun?{' '}
                        <Link to="/register" className="font-medium text-purple-600 hover:text-purple-500">
                            Daftar di sini
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}