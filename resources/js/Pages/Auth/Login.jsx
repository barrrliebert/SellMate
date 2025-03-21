import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
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
            <Head title="Log in" />
            <div className="min-h-screen bg-white">
                {/* Main Content Section */}
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Image Section - Left on large screens */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center p-6">
                        <div className="w-full max-w-md">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Login Illustration"
                            />
                        </div>
                    </div>

                    {/* Form Section - Right on large screens, Full on small screens */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:pr-12 lg:pl-0">
                        {/* Text Content */}
                        <div className="text-left mb-2 lg:mb-6 mt-4 lg:mt-0">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Welcome, Mate</h1>
                        </div>

                        {/* Mobile Image - Only shown on small screens */}
                        <div className="lg:hidden">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Login Illustration"
                            />
                        </div>

                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4 max-w-md mx-auto lg:mx-0 w-full">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input
                                    id="email"
                                    type="text"
                                    name="email"
                                    value={data.email}
                                    className={`mt-1 block w-full border rounded-md p-2 ${
                                        errors.email ? 'border-red-500' : 'border-orange-200'
                                    }`}
                                    placeholder="e.g Johan"
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                {errors.email && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.email}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className={`mt-1 block w-full border rounded-md p-2 ${
                                        errors.password ? 'border-red-500' : 'border-orange-200'
                                    }`}
                                    placeholder="e.g Johan12@*"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="w-full flex flex-col items-center lg:items-start space-y-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-[40px] text-center rounded-md py-2 bg-[#DD661D] text-white hover:bg-[#BB551A] transition mb-6 disabled:opacity-75"
                                >
                                    {processing ? 'Loading...' : 'Login'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
