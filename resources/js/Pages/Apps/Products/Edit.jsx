import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconPackage } from '@tabler/icons-react';
import InputError from '@/Components/InputError';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function Edit({ product }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        nama_produk: product.nama_produk,
        deskripsi_produk: product.deskripsi_produk,
        harga_produk: product.harga_produk,
        komisi_produk: product.komisi_produk,
        kategori: product.kategori,
        foto_produk: null,
    });

    const [previewImage, setPreviewImage] = useState(product.foto_produk);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/apps/products/${product.id}`);
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
            <Head title="Edit Produk" />

            <div className="flex items-center mb-6">
                <IconPackage size={20} strokeWidth={1.5} className="mr-2" />
                <h1 className="text-xl font-semibold">Edit Produk/Jasa</h1>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Nama Produk/Jasa
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.nama_produk}
                                onChange={(e) => setData('nama_produk', e.target.value)}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-700 dark:border-gray-800"
                                placeholder="Masukkan nama produk/jasa"
                            />
                            <InputError message={errors.nama_produk} className="mt-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Kategori
                                <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={data.kategori}
                                onChange={(e) => setData('kategori', e.target.value)}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-700 dark:border-gray-800"
                            >
                                <option value="">Pilih Kategori</option>
                                <option value="produk">Produk</option>
                                <option value="jasa">Jasa</option>
                            </select>
                            <InputError message={errors.kategori} className="mt-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Harga
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.harga_produk}
                                onChange={(e) => setData('harga_produk', e.target.value)}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-700 dark:border-gray-800"
                                placeholder="Masukkan harga"
                                min="0"
                            />
                            <p className="text-xs text-gray-500">
                                Masukkan nominal tanpa titik atau koma. Contoh: untuk Rp 100.000 ketik 100000
                            </p>
                            <InputError message={errors.harga_produk} className="mt-2" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Komisi
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                value={data.komisi_produk}
                                onChange={(e) => setData('komisi_produk', e.target.value)}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-700 dark:border-gray-800"
                                placeholder="Masukkan komisi"
                                min="0"
                                max="100"
                            />
                            <p className="text-xs text-gray-500">
                                Masukkan persentase komisi (0-100)
                            </p>
                            <InputError message={errors.komisi_produk} className="mt-2" />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Deskripsi
                            </label>
                            <textarea
                                value={data.deskripsi_produk}
                                onChange={(e) => setData('deskripsi_produk', e.target.value)}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-700 dark:border-gray-800"
                                placeholder="Masukkan deskripsi produk/jasa"
                                rows="4"
                            />
                            <InputError message={errors.deskripsi_produk} className="mt-2" />
                        </div>

                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Foto Produk
                            </label>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 focus:border-gray-200 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-gray-700 dark:border-gray-800"
                                accept="image/*"
                            />
                            <InputError message={errors.foto_produk} className="mt-2" />
                            {previewImage && (
                                <div className="mt-4">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label={processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = page => <AppLayout children={page} /> 