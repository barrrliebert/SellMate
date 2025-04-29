import React, { useState, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { IconEdit, IconTrash, IconFileDescription, IconLink } from '@tabler/icons-react';
import hasAnyPermission from '@/Utils/Permissions';
import Swal from 'sweetalert2';
import toast, { Toaster } from 'react-hot-toast';

// Fungsi untuk memformat tanggal
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const month = months[date.getMonth()];
    return `${day} ${month} ${year}`;
};

export default function Index({ articles, flash }) {
    const [loadingThumbnails, setLoadingThumbnails] = useState({});

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const handleEdit = (slug) => {
        Swal.fire({
            title: 'Edit Artikel',
            text: 'Anda akan mengedit artikel ini',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, edit!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Membuka form edit...');
                router.get(`/apps/articles/${slug}/edit`, {}, {
                    onSuccess: () => {
                        toast.dismiss(loadingToast);
                    },
                    onError: () => {
                        toast.dismiss(loadingToast);
                        toast.error('Gagal membuka form edit!');
                    }
                });
            }
        });
    };

    const handleDelete = (slug) => {
        Swal.fire({
            title: 'Hapus Artikel',
            text: "Artikel yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Menghapus artikel...');
                router.delete(`/apps/articles/${slug}`, {
                    onSuccess: () => {
                        toast.dismiss(loadingToast);
                        toast.success('Artikel berhasil dihapus!');
                    },
                    onError: () => {
                        toast.dismiss(loadingToast);
                        toast.error('Gagal menghapus artikel!');
                    }
                });
            }
        });
    };

    const handleGenerateLink = (article) => {
        const articleUrl = `${window.location.origin}/articles/${article.id}`;
        navigator.clipboard.writeText(articleUrl);
        toast.success('Link artikel berhasil disalin!', {
            icon: '📋',
            duration: 2000
        });
    };

    const truncateText = (text, maxLength) => {
        if (!text) return "";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    return (
        <div className="px-4 sm:px-0">
            <Head title="Katalog Artikel" />
            <Toaster position="top-right" />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 mt-6 sm:mt-0">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Katalog Artikel</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kelola artikel dengan mudah</p>
                </div>
                {hasAnyPermission(['articles-create']) && (
                    <Link
                        href="/apps/articles/create"
                        className="bg-[#AA51DF] text-white px-4 py-2 rounded-full hover:bg-purple-700 transition w-full sm:w-auto text-center sm:text-left"
                    >
                        Tambah Artikel
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {(Array.isArray(articles) ? articles : []).map((article) => (
                    <div key={article.id} className="mx-auto sm:mx-0 w-full max-w-[370px]">
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
                            
                            <Link href={`/apps/articles/${article.slug}`} className="group cursor-pointer">
                                <h3 className="font-semibold text-lg mb-3 text-left text-gray-900 dark:text-white line-clamp-2 group-hover:text-[#AA51DF] transition-colors">
                                    {article.title}
                                </h3>
                                
                                <div className="flex items-center space-x-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-[#D4A8EF] flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">
                                            {article.author ? article.author.charAt(0).toUpperCase() : 'U'}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900 group-hover:text-[#AA51DF] transition-colors">
                                            {article.author}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                            
                            <div className="flex justify-between items-center mt-auto">
                                <span className="text-xs text-gray-700">
                                    Posted {formatDate(article.created_at)}
                                </span>
                                
                                <div className="flex gap-1">
                                    {/* Tombol Generate Link */}
                                    <button
                                        onClick={() => handleGenerateLink(article)}
                                        className="text-indigo-900 p-2 rounded-full hover:bg-indigo-200 transition transform hover:scale-110"
                                    >
                                        <IconLink size={20} />
                                    </button>
                                    
                                    {hasAnyPermission(['articles-delete']) && (
                                        <button
                                            onClick={() => handleDelete(article.slug)}
                                            className="text-red-900 p-2 rounded-full hover:bg-red-200 transition transform hover:scale-110"
                                        >
                                            <img 
                                            src="/images/delete.svg" 
                                            alt="Delete Icon" 
                                            className="w-[26px] h-[26px]"
                                            />
                                        </button>
                                    )}
                                    {hasAnyPermission(['articles-update']) && (
                                        <button
                                            onClick={() => handleEdit(article.slug)}
                                            className="text-gray-700 p-2 rounded-full hover:bg-gray-400 transition transform hover:scale-110"
                                        >
                                            <img 
                                            src="/images/edit.svg" 
                                            alt="Edit Icon" 
                                            className="w-[26px] h-[26px]"
                                            />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

Index.layout = page => <AppLayout children={page} />