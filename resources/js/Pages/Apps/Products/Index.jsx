import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { IconEdit, IconTrash, IconPackage } from '@tabler/icons-react';
import hasAnyPermission from '@/Utils/Permissions';
import Swal from 'sweetalert2';

export default function Index({ products }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedKategori, setSelectedKategori] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/apps/products', {
            search: searchQuery,
            kategori: selectedKategori,
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Data produk akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/apps/products/${id}`);
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data produk berhasil dihapus.',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                });
            }
        });
    };

    return (
        <>
            <Head title="Products" />

            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <IconPackage size={20} strokeWidth={1.5} className="mr-2" />
                    <h1 className="text-xl font-semibold">Produk & Jasa</h1>
                </div>
                {hasAnyPermission(['products-create']) && (
                    <Link
                        href="/apps/products/create"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Tambah Produk/Jasa
                    </Link>
                )}
            </div>

            <div className="rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.data.map((product) => (
                        <div key={product.id} className="relative">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 flex flex-col">
                                <div className="mb-4 rounded-lg overflow-hidden w-full">
                                    {product.foto_produk ? (
                                        <img
                                            src={product.foto_produk}
                                            alt={product.nama_produk}
                                            className="w-full h-auto max-h-48 object-contain aspect-[4/3] bg-white"
                                        />
                                    ) : (
                                        <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-800">
                                            <IconPackage size={48} className="text-gray-400" />
                                        </div>
                                    )}
                                </div>

                                <h3 className="font-semibold text-lg mb-2 text-left text-gray-600 dark:text-white">
                                    {product.nama_produk}
                                </h3>

                                <span className={`px-3 rounded-full text-xs font-semibold w-fit mb-2 ${
                                    product.kategori === 'produk'
                                        ? 'bg-blue-800 text-white dark:bg-blue-900 dark:text-blue-300'
                                        : 'bg-green-800 text-white dark:bg-green-900 dark:text-green-300'
                                }`}>
                                    {product.kategori}
                                </span>

                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                                    {product.deskripsi_produk}
                                </p>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="font-semibold dark:text-white">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Harga:</span><br/>
                                        <span className="font-medium text-gray-600 dark:text-green-400">
                                            {product.formatted_harga}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-600 dark:text-gray-400">Komisi:</span><br/>
                                        <span className="font-medium text-gray-600 dark:text-green-400">
                                            {product.formatted_komisi}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -bottom-10 right-0 flex gap-2">
                                {hasAnyPermission(['products-update']) && (
                                    <Link
                                        href={`/apps/products/${product.id}/edit`}
                                        className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition transform hover:scale-110"
                                    >
                                        <IconEdit size={16} />
                                    </Link>
                                )}
                                {hasAnyPermission(['products-delete']) && (
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                                    >
                                        <IconTrash size={16} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

Index.layout = page => <AppLayout children={page} />;
