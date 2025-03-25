import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { IconEdit, IconTrash, IconFileDescription } from '@tabler/icons-react';
import hasAnyPermission from '@/Utils/Permissions';
import Swal from 'sweetalert2';

export default function Index({ articles }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah anda yakin?',
            text: 'Data artikel akan dihapus permanen!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {-
                router.delete(`/apps/articles/${id}`);
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data artikel berhasil dihapus.',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false,
                });
            }
        });
    };

    return (
        <>
            <Head title="Katalog Artikel" />

            <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Katalog Artikel</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kelola artikel dengan mudah</p>
                </div>
                {hasAnyPermission(['articles-create']) && (
                    <Link
                        href="/apps/articles/create"
                        className="bg-[#AA51DF] text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
                    >
                        Tambah Artikel
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(articles) ? articles : []).map((article) => (
                    <div key={article.id} className="relative">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex flex-col border border-[#D4A8EF] dark:border-gray-900 shadow-sm">
                            <div className="mb-4 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 h-[200px]">
                                {article.thumbnail ? (
                                    <img
                                        src={article.thumbnail.startsWith('http') 
                                            ? article.thumbnail 
                                            : `/storage/${article.thumbnail}`
                                        }
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <IconFileDescription size={48} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                            
                            <h3 className="font-semibold text-lg mb-2 text-left text-gray-900 dark:text-white">
                                {article.title}
                            </h3>
                            
                            <span className="block text-sm text-gray-800 dark:text-gray-400 mb-2">
                                {article.author}
                            </span>
                            
                            <div className="flex justify-between items-center">
                                <Link
                                    href={`/apps/articles/${article.id}`}
                                    className="text-indigo-600 dark:text-indigo-400 text-sm underline"
                                >
                                    Baca Selengkapnya
                                </Link>
                                
                                <div className="flex gap-1">
                                    {hasAnyPermission(['articles-delete']) && (
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="text-red-900 p-2 rounded-full hover:bg-red-200 transition transform hover:scale-110"
                                        >
                                            <IconTrash size={20} />
                                        </button>
                                    )}
                                    {hasAnyPermission(['articles-update']) && (
                                        <Link
                                            href={`/apps/articles/${article.id}/edit`}
                                            className="text-gray-700 p-2 rounded-full hover:bg-gray-400 transition transform hover:scale-110"
                                        >
                                            <IconEdit size={20} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

Index.layout = page => <AppLayout children={page} />