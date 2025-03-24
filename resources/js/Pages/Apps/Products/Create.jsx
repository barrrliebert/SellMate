import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, router } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import { IconPhoto } from '@tabler/icons-react';
import toast from 'react-hot-toast';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nama_produk: "",
        deskripsi_produk: "",
        harga_produk: "",
        komisi_produk: "",
        kategori: "",
        foto_produk: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Sedang menyimpan data produk...');
        post('/apps/products', {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Produk berhasil ditambahkan!');
                router.visit('/apps/products');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Gagal menambahkan produk. Silakan coba lagi.');
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData('foto_produk', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Head title="Tambah Produk" />
            <div className="max-w-2xl mx-auto mt-2">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                    Tambah Produk Unggulan Tefa
                </h1>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-2xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Informasi Produk/Jasa */}
                        <div className="border border-purple-300 rounded-md p-4">
                            <h2 className="text-xl font-bold text-gray-900 font-verdana">
                                Informasi Produk/Jasa
                            </h2>
                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-gray-900 font-verdana text-sm dark:text-gray-300">
                                    Nama Produk/Jasa <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.nama_produk}
                                    onChange={(e) => setData("nama_produk", e.target.value)}
                                    className="w-full p-3 border text-xs rounded-md focus:outline-none focus:ring-0 bg-white text-gray-900 focus:border-gray-400 border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    placeholder="e.g videografi"
                                />
                                <InputError message={errors.nama_produk} className="mt-2" />
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-gray-900 text-sm font-verdana dark:text-gray-300">
                                    Kategori <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.kategori}
                                    onChange={(e) => setData("kategori", e.target.value)}
                                    className="w-full p-3 border text-xs rounded-md focus:outline-none focus:ring-0 bg-white text-gray-900 focus:border-gray-400 border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option value="produk">Produk</option>
                                    <option value="jasa">Jasa</option>
                                </select>
                                <InputError message={errors.kategori} className="mt-2" />
                            </div>
                            <div className="flex flex-col gap-2 mt-4">
                                <label className="text-gray-900 text-sm dark:text-gray-300 font-verdana">
                                    Deskripsi
                                </label>
                                <textarea
                                    value={data.deskripsi_produk}
                                    onChange={(e) => setData("deskripsi_produk", e.target.value)}
                                    className="w-full p-3 border text-xs rounded-md focus:outline-none focus:ring-0 bg-white text-gray-900 focus:border-gray-400 border-gray-700 dark:bg-gray-900 dark:text-gray-300 resize-none overflow-y-auto h-32"
                                    placeholder="Masukkan deskripsi produk/jasa"
                                />
                                <InputError message={errors.deskripsi_produk} className="mt-2" />
                            </div>
                        </div>

                        {/* Kolom Foto Produk/Jasa */}
                        <div className="border border-purple-500 rounded-md p-4 self-start">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Foto Produk/Jasa</h2>
                            <div className="relative w-full h-72 border-2 border-dashed border-purple-300 rounded-lg flex flex-col items-center justify-center hover:border-purple-500 transition-colors duration-300 cursor-pointer">
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="absolute w-full h-full opacity-0 z-10 cursor-pointer"
                                />
                                {previewImage ? (
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="absolute top-0 left-0 w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity duration-300"
                                    />
                                ) : (
                                    <>
                                        <IconPhoto size={48} className="text-gray-900" />
                                        <p className="text-sm text-gray-900">Upload foto produk/jasa</p>
                                    </>
                                )}
                            </div>
                            <InputError message={errors.foto_produk} className="mt-2" />
                        </div>
                    </div>

                    {/* Detail Harga/Komisi */}
                    <div className="border border-purple-300 rounded-md p-4 mt-5">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 font-verdana">
                            Detail Harga/Komisi
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm font-verdana dark:text-gray-300">
                                    Harga <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.harga_produk}
                                    onChange={(e) => setData("harga_produk", e.target.value)}
                                    className="w-full p-3 border text-xs rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-400 border-gray-600 dark:bg-gray-900 dark:text-gray-300"
                                    placeholder="Masukkan harga"
                                    min="0"
                                />
                                <InputError message={errors.harga_produk} className="mt-2" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm font-verdana dark:text-gray-300">
                                    Komisi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={data.komisi_produk}
                                    onChange={(e) => setData("komisi_produk", e.target.value)}
                                    className="w-full p-3 border text-xs rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-400 border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                                    placeholder="Masukkan komisi"
                                    min="0"
                                    max="100"
                                />
                                <InputError message={errors.komisi_produk} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label={processing ? "Menyimpan..." : "Simpan"}
                            disabled={processing}
                            className="bg-purple-500 text-white disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <AppLayout children={page} />;