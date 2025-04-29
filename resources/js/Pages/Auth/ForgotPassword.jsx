import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Forgot Password" />
            <div className="min-h-screen bg-white">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Image Section - Left on large screens */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center p-6">
                        <div className="w-full max-w-md">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Forgot Password Illustration"
                            />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:pr-12 lg:pl-0">
                        <div className="text-left mb-2 lg:mb-6 mt-4 lg:mt-0">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Reset Password</h1>
                            <p className="text-gray-600 mb-6">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Mobile Image */}
                        <div className="lg:hidden mb-6">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Forgot Password Illustration"
                            />
            </div>

                        {status && (
                            <div className="mb-4 p-4 rounded-lg bg-green-50 text-green-600">
                                {status}
                            </div>
                        )}

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

                            <div className="flex flex-col space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-[40px] text-center rounded-md py-2 bg-[#DD661D] text-white hover:bg-[#BB551A] transition disabled:opacity-75"
                                >
                                    {processing ? 'Sending...' : 'Send Reset Link'}
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
