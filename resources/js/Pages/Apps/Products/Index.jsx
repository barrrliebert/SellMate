import React, { useState, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { IconEdit, IconTrash, IconPackage } from "@tabler/icons-react";
import hasAnyPermission from "@/Utils/Permissions";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

// Fungsi utilitas untuk truncate teks
const truncate = (str, maxLength = 100) => {
    if (!str) return "";
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
};

export default function Index({ products, flash }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKategori, setSelectedKategori] = useState("");

    useEffect(() => {
        if (flash && flash.success) {
            // Add delay to flash success message
            setTimeout(() => {
                toast.success(flash.success);
            }, 1000);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/apps/products", {
            search: searchQuery,
            kategori: selectedKategori,
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data produk akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Menghapus produk...');
                
                router.delete(`/apps/products/${id}`, {
                    onSuccess: () => {
                        toast.dismiss(loadingToast);
                        toast.success('Produk berhasil dihapus!');
                    },
                    onError: () => {
                        toast.dismiss(loadingToast);
                        toast.error('Gagal menghapus produk!');
                    }
                });
            }
        });
    };

    return (
        <>
            <Head title="Products" />
            <Toaster position="top-right" />

            {/* Header Katalog Produk */}
            <div className="mx-6 flex flex-col">
                <div className="mb-2">
                    <h1 className="text-3xl font-bold mb-2 text-black">
                        Katalog Produk
                    </h1>
                    <p className="text-sm text-gray-600">
                        Kelola produk unggulan tefa dengan mudah
                    </p>
                </div>
                {hasAnyPermission(["products-create"]) && (
                    <Link
                        href="/apps/products/create"
                        className="bg-purple-300 mb-3 text-white px-4 py-2 rounded-lg hover:bg-purple-400 transition self-end"
                    >
                        Tambah Produk
                    </Link>
                )}
            </div>

            {/* Daftar Produk */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
                {products.data.map((product) => (
                    <div key={product.id} className="w-[270px] h-[377px]">
                        <div className="bg-white border border-purple-300 rounded-2xl p-4 sm:p-4 flex flex-col h-full">
                            
                            {/* Gambar Produk */}
                            <div className="mb-2 rounded-xl overflow-hidden w-full h-48 sm:h-52">
                                {product.foto_produk ? (
                                    <img
                                        src={product.foto_produk}
                                        alt={product.nama_produk}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                        <IconPackage size={40} className="text-gray-400" />
                                    </div>
                                )}
                            </div>

                            {/* Detail Produk */}
                            <h3 className="font-semibold text-lg sm:text-xl mb-2 text-gray-900 line-clamp-1">
                                {product.nama_produk}
                            </h3>

                            <span className="text-xs sm:text-sm text-gray-900 mb-1">
                                {product.kategori}
                            </span>

                            {/* Truncate deskripsi */}
                            <p className="text-black text-xs sm:text-sm mb-3">
                                {truncate(product.deskripsi_produk, 100)}
                            </p>

                            {/* Area harga dan komisi */}
                            <div className="flex justify-between items-center text-sm mt-auto">
                                <div className="font-semibold">
                                    <span className="text-lg sm:text-2xl font-medium text-black">
                                        {product.formatted_harga}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs sm:text-sm text-gray-900 mr-1">
                                        Komisi
                                    </span>
                                    <span className="text-xs sm:text-sm font-medium text-gray-700">
                                        {product.formatted_komisi}
                                    </span>
                                </div>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-2 mt-3">
                                {hasAnyPermission(["products-delete"]) && (
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="text-red-600 p-1.5 rounded-lg hover:text-white hover:bg-red-600 transition transform hover:scale-105"
                                    >
                                        <IconTrash size={20} />
                                    </button>
                                )}
                                {hasAnyPermission(["products-update"]) && (
                                    <Link
                                        href={`/apps/products/${product.id}/edit`}
                                        className="text-gray-900 p-1.5 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105"
                                    >
                                        <IconEdit size={20} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout children={page} />;