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
            <div className="min-h-screen flex flex-col justify-center items-center bg-white">
                <div className="w-full max-w-md p-6">
                    <div className="text-left mb-6">
                        <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, Mate</h1>
                        <img
                            src="/images/ilustrator-login.png"
                            className="w-full h-auto"
                        />
                    </div>

                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Username
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className={`mt-1 block w-full border rounded-md p-2 ${
                                    errors.email ? 'border-red-500' : 'border-orange-200'
                                }`}
                                placeholder="e.g Johan"
                                autoComplete="username"
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

                        <div className="w-full flex flex-col items-center space-y-3">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-[300px] h-[40px] text-center rounded-md py-2 bg-[#DD661D] text-white hover:bg-[#BB551A] transition mb-6 disabled:opacity-75"
                            >
                                {processing ? 'Loading...' : 'Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
