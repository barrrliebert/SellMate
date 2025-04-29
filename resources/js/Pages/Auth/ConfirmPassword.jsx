import { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'));
    };

    return (
        <>
            <Head title="Confirm Password" />
            <div className="min-h-screen bg-white">
                <div className="flex flex-col lg:flex-row min-h-screen">
                    {/* Image Section - Left on large screens */}
                    <div className="hidden lg:flex w-1/2 items-center justify-center p-6">
                        <div className="w-full max-w-md">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Confirm Password Illustration"
                            />
                        </div>
                    </div>

                    {/* Form Section */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 lg:pr-12 lg:pl-0">
                        <div className="text-left mb-2 lg:mb-6 mt-4 lg:mt-0">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Confirm Password</h1>
                            <p className="text-gray-600 mb-6">
                                This is a secure area. Please confirm your password before continuing.
                            </p>
                        </div>

                        {/* Mobile Image */}
                        <div className="lg:hidden mb-6">
                            <img
                                src="/images/ilustrator-login.png"
                                className="w-full h-auto"
                                alt="Confirm Password Illustration"
                            />
                        </div>

                        <form onSubmit={submit} className="space-y-4 max-w-md mx-auto lg:mx-0 w-full">
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
                                    placeholder="Enter your password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                {errors.password && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {errors.password}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col space-y-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full h-[40px] text-center rounded-md py-2 bg-[#DD661D] text-white hover:bg-[#BB551A] transition disabled:opacity-75"
                                >
                                    {processing ? 'Confirming...' : 'Confirm Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
