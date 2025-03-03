import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        school: '',
        major: '',
        username: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <>
            <Head title="Register" />
            <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
                <div className="w-full max-w-md bg-white p-6 shadow-lg rounded-lg">
                    {/* Header */}
                    <div className="text-center mb-6 mt-2">
                        <h1 className="text-3xl ml-4 text-left font-bold text-gray-800 mb-4">Welcome, Mate</h1>
                        <p className="mt-2 text-gray-600">Sign Up In Account</p>
                        <p className="mt-1 text-sm text-gray-500">create account select to login</p>
                    </div>

                    <form onSubmit={submit} className="space-y-4 px-12">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="school" value="Sekolah" />
                            <TextInput
                                id="school"
                                name="school"
                                value={data.school}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e) => setData('school', e.target.value)}
                                required
                            />
                            <InputError message={errors.school} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="major" value="Jurusan" />
                            <TextInput
                                id="major"
                                name="major"
                                value={data.major}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e) => setData('major', e.target.value)}
                                required
                            />
                            <InputError message={errors.major} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="username" value="Username" />
                            <TextInput
                                id="username"
                                name="username"
                                value={data.username}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                onChange={(e) => setData('username', e.target.value)}
                                required
                            />
                            <InputError message={errors.username} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                            <div className="mt-2 text-xs text-gray-500">
                                Password harus memenuhi kriteria berikut:
                                <ul className="list-disc list-inside mt-1">
                                    <li>Minimal 8 karakter</li>
                                    <li>Mengandung huruf besar dan kecil</li>
                                    <li>Mengandung angka</li>
                                    <li>Mengandung simbol (!@#$%^&*)</li>
                                </ul>
                            </div>
                        </div>

                        {/* Tombol Log in & Register dengan lebar sesuai input */}
                        <div className="mt-6 w-full flex space-x-4">
                            <Link
                                href={route('login')}
                                className="flex-1 text-center rounded-sm py-2 border border-violet-300 bg-white text-violet-600 hover:bg-violet-50 transition"
                            >
                                Log in
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 text-center rounded-sm py-2 bg-gray-500 text-white hover:bg-gray-600 transition"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
