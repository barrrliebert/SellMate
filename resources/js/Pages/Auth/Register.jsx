import { useEffect } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
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
            <div className="min-h-screen flex flex-col bg-white px-4">
                <div className="w-full max-w-md mx-auto pt-8">
                    <h1 className="text-2xl font-bold text-black text-center mb-1">Daftar Akun</h1>
                    <p className="text-xl text-black text-center mb-6">membuat akun untuk masuk</p>

                    <form onSubmit={submit} className="space-y-6">
                        {/* Informasi Umum Section */}
                        <div className="bg-white rounded-3xl border border-gray-400 p-4 shadow-md">
                            <h2 className="text-xl font-bold text-black mb-2">Informasi Umum</h2>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Nama Lengkap
                                    </label>
                                    <TextInput
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white"
                                        autoComplete="name"
                                        isFocused={true}
                                        placeholder="e.g Johan"
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Jurusan
                                    </label>
                                    <TextInput
                                        id="major"
                                        name="major"
                                        value={data.major}
                                        className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white"
                                        placeholder="e.g Desain Komunikasi Visual"
                                        onChange={(e) => setData('major', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.major} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Nama Sekolah
                                    </label>
                                    <TextInput
                                        id="school"
                                        name="school"
                                        value={data.school}
                                        className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white"
                                        placeholder="e.g SMK 1 Jakarta"
                                        onChange={(e) => setData('school', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.school} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Akun Section */}
                        <div className="bg-white rounded-3xl border border-gray-400 p-4 shadow-md">
                            <h2 className="text-xl font-bold text-black mb-2">Akun</h2>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Email
                                    </label>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white"
                                        placeholder="e.g johan123@gmail.com"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Username
                                    </label>
                                    <TextInput
                                        id="username"
                                        name="username"
                                        value={data.username}
                                        className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white"
                                        placeholder="e.g johan15"
                                        onChange={(e) => setData('username', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.username} className="mt-2" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-black mb-1">
                                        Password
                                    </label>
                                    <TextInput
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full border border-orange-200 rounded-xl p-3 text-sm bg-white"
                                        placeholder="e.g johan12@*"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-2" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full flex flex-col items-center space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-[300px] h-[40px] text-center rounded-md py-2 bg-[#DD661D] text-white hover:bg-[#BB551A] transition"
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
