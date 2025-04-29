import { useEffect, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <>
            <Head title="Reset Password" />
            <div className="min-h-screen bg-white">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Image Section - Left on large screens */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center p-6">
                        <div className="w-full max-w-md">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Reset Password Illustration"
                            />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:pr-12 lg:pl-0">
                        <div className="text-left mb-2 lg:mb-6 mt-4 lg:mt-0">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Create New Password</h1>
                            <p className="text-gray-600 mb-6">
                                Please create a new secure password for your account.
                            </p>
                        </div>

                        {/* Mobile Image */}
                        <div className="lg:hidden mb-6">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Reset Password Illustration"
                            />
                        </div>

                        <form onSubmit={submit} className="space-y-4 max-w-md mx-auto lg:mx-0 w-full">
                <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                                    className={`mt-1 block w-full border rounded-md p-2 ${
                                        errors.email ? 'border-red-500' : 'border-orange-200'
                                    }`}
                                    placeholder="your@email.com"
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
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                        id="password"
                                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={data.password}
                                        className={`mt-1 block w-full border rounded-md p-2 ${
                                            errors.password ? 'border-red-500' : 'border-orange-200'
                                        }`}
                                        placeholder="Enter your new password"
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
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </div>
                                )}
                </div>

                            <div>
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                        name="password_confirmation"
                        value={data.password_confirmation}
                                        className={`mt-1 block w-full border rounded-md p-2 ${
                                            errors.password_confirmation ? 'border-red-500' : 'border-orange-200'
                                        }`}
                                        placeholder="Confirm your new password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? (
                                            <IconEyeOff size={20} strokeWidth={1.5} />
                                        ) : (
                                            <IconEye size={20} strokeWidth={1.5} />
                                        )}
                                    </button>
                                </div>
                                {errors.password_confirmation && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.password_confirmation}
                                    </div>
                                )}
                </div>

                            <div className="flex flex-col space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-[40px] text-center rounded-md py-2 bg-[#DD661D] text-white hover:bg-[#BB551A] transition disabled:opacity-75"
                                >
                                    {processing ? 'Resetting...' : 'Reset Password'}
                                </button>

                                <a 
                                    href={route('login')} 
                                    className="text-center text-sm text-[#DD661D] hover:text-[#BB551A] transition"
                                >
                                    Back to Login
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
