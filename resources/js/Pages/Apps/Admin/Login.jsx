import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function Login({ status }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <>
            <Head title="Admin Login" />
            <div className="min-h-screen flex flex-col justify-center items-center bg-white p-4">
                {/* Headline above card */}
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-8 text-center">Welcome, Mate</h1>
                
                <div className="relative w-full max-w-4xl">
                    <div className="w-full flex shadow-lg rounded-2xl overflow-hidden">
                        {/* Left Column - Illustration and Text */}
                        <div className="hidden md:block md:w-1/2 p-6 bg-white rounded-l-2xl">
                            <p className="text-center mb-6 text-gray-800 text-sm font-medium">
                                Kelola produk dengan mudah, monitor pendapatan<br />dengan cermat
                            </p>
                            <img
                                src="/images/img-login-admin.png"
                                className="w-full h-auto"
                                alt="Login Illustration"
                            />
                        </div>

                        {/* Right Column - Login Form */}
                        <div className="w-full md:w-1/2 bg-[#AA51DF] p-6 flex flex-col justify-center rounded-2xl z-10">
                            <div className="mb-6 lg:px-10">
                                <h2 className="text-4xl font-bold text-white mb-6 text-center">Sign In</h2>
                                
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-white mb-1 text-sm">
                                        Username
                                    </label>
                                    <input
                                        id="email"
                                        type="text"
                                        name="email"
                                        value={data.email}
                                        className="w-full p-2 rounded-lg text-gray-700 text-sm"
                                        placeholder="e.g Johan"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                    {errors.email && (
                                        <div className="mt-1 text-xs text-red-200">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-white mb-1 text-sm">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={data.password}
                                            className="w-full p-2 rounded-lg text-gray-700 text-sm"
                                            placeholder="e.g Johan12@*"
                                            autoComplete="current-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <IconEyeOff size={20} strokeWidth={1.5} />
                                            ) : (
                                                <IconEye size={20} strokeWidth={1.5} />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <div className="mt-1 text-xs text-red-200">
                                            {errors.password}
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    onClick={submit}
                                    disabled={processing}
                                    className="w-full py-2 bg-[#DD661D] text-white rounded-lg text-center text-sm font-medium hover:bg-[#BB551A] transition"
                                >
                                    {processing ? 'Loading...' : 'Login'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = page => page; 