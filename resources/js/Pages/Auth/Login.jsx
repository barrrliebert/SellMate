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
                <div className="w-full max-w-md p-6 lg:shadow-lg rounded-lg">
                    <div className="text-center mb-6 mt-2">
                        <h1 className="text-3xl ml-4 text-left font-bold text-gray-800 mb-4">Welcome, Mate</h1>
                        <img
                            src="https://skala.or.id/wp-content/uploads/2024/01/dummy-post-square-1-1.jpg"
                            alt="Welcome"
                            className="mx-auto w-3/4"
                        />
                    </div>
                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600">
                            {status}
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-4 px-12">
                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="password" value="Password" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="block">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-600">Remember me</span>
                            </label>
                        </div>
                        <div className="mt-6 w-full flex space-x-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 text-center rounded-sm py-2 bg-gray-500 text-white hover:bg-gray-600 transition"
                            >
                                Log in
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
