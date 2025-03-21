import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { IconEdit, IconTrash, IconPackage } from "@tabler/icons-react";
import hasAnyPermission from "@/Utils/Permissions";
import Swal from "sweetalert2";

export default function Index({ products }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedKategori, setSelectedKategori] = useState("");

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
                router.delete(`/apps/products/${id}`);
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data produk berhasil dihapus.",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                });
            }
        });
    };

    return (
        <>
            <Head title="Products" />

   {/* Header Katalog Produk */}
   <div className="mx-6 flex flex-col">
    {/* Bagian Judul */}
    <div className="mb-2">
        <h1 className="text-5xl font-bold mb-2 text-black">
            Katalog Produk
        </h1>
        <p className="text-lg text-gray-600">
            Kelola produk unggulan tefa dengan mudah
        </p>
    </div>

    {/* Tombol Tambah Produk */}
    {hasAnyPermission(["products-create"]) && (
        <Link
            href="/apps/products/create"
            className="bg-purple-300 text-white text-lg px-7 py-3 rounded-full hover:bg-purple-400 transition self-end"
        >
            Tambah Produk
        </Link>
    )}
</div>

            {/* Daftar Produk */}
            <div className="rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.data.map((product) => (
                        <div key={product.id} className="relative">
                            <div className="bg-white border border-purple-300 rounded-2xl p-4 flex flex-col">
                                
                                {/* Gambar Produk */}
                                <div className="mb-4 rounded-xl overflow-hidden w-full h-56">
                                    {product.foto_produk ? (
                                        <img
                                            src={product.foto_produk}
                                            alt={product.nama_produk}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-56 flex items-center justify-center bg-gray-200">
                                            <IconPackage
                                                size={48}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Detail Produk */}
                                <h3 className="font-semibold text-xl mb-1 text-gray-900">
                                    {product.nama_produk}
                                </h3>

                                <span className="text-sm text-gray-700 mb-2">
                                    {product.kategori}
                                </span>

                                <p className="text-black text-sm mb-4">
                                    {product.deskripsi_produk}
                                </p>

                                <div className="flex justify-between items-center text-sm">
                                    <div className="font-semibold">
                                        <span className="text-2xl font-medium text-black">
                                            {product.formatted_harga}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-sm text-gray-900 mr-1">
                                            Komisi
                                        </span>
                                        <span className="text-sm font-medium text-gray-700">
                                            {product.formatted_komisi}
                                        </span>
                                    </div>
                                </div>

                                {/* Tombol Aksi (Edit & Delete) */}
                                <div className="flex justify-end gap-2 mt-4">
                                    {hasAnyPermission(["products-delete"]) && (
                                        <button
                                            onClick={() =>
                                                handleDelete(product.id)
                                            }
                                            className="text-red-600 p-2 rounded-lg hover:text-white hover:bg-red-600 transition transform hover:scale-105"
                                        >
                                            <IconTrash size={23} />
                                        </button>
                                    )}
                                    {hasAnyPermission(["products-update"]) && (
                                        <Link
                                            href={`/apps/products/${product.id}/edit`}
                                            className="text-gray-900 p-2 rounded-lg hover:bg-yellow-600 transition transform hover:scale-105"
                                        >
                                            <IconEdit size={23} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout children={page} />;
