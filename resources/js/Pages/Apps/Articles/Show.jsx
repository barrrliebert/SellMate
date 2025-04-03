import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { IconChevronLeft, IconUser, IconShare, IconBrandFacebook, IconBrandTwitter, IconBrandWhatsapp, IconCopy, IconX, IconShare2, IconEdit, IconTrash, IconCalendar, IconEye } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';
import AppLayout from '@/Layouts/AppLayout';
import Swal from 'sweetalert2';

export default function Show({ article }) {
    const [showShareMenu, setShowShareMenu] = useState(false);
    const shareMenuRef = useRef(null);
    const [availableApps, setAvailableApps] = useState({
        facebook: true,
        twitter: true,
        whatsapp: true,
        native: false
    });

    // Format date to readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    // Handle Edit Article
    const handleEdit = () => {
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
                router.get(route('apps.articles.edit', article.slug), {}, {
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

    // Handle Delete Article
    const handleDelete = () => {
        Swal.fire({
            title: 'Hapus Artikel',
            text: "Article yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Menghapus artikel...');
                router.delete(route('apps.articles.destroy', article.slug), {
                    onSuccess: () => {
                        toast.dismiss(loadingToast);
                        toast.success('Artikel berhasil dihapus!');
                        router.visit(route('apps.articles.index'));
                    },
                    onError: () => {
                        toast.dismiss(loadingToast);
                        toast.error('Terjadi kesalahan saat menghapus artikel.');
                    }
                });
            }
        });
    };

    // Sharing functionality
    const handleShare = () => {
        detectAvailableApps();
        setShowShareMenu(true);
    };

    const handleCopyLink = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        toast.success('Link artikel berhasil disalin!');
        setShowShareMenu(false);
    };

    const shareToSocial = (platform) => {
        const url = window.location.href;
        const title = article?.title || 'Article';
        let shareUrl = '';

        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ': ' + url)}`;
                break;
            default:
                break;
        }

        if (navigator.share && platform === 'native') {
            navigator.share({
                title: title,
                text: article?.description?.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
                url: url,
            }).catch(err => {
                console.error('Error sharing:', err);
            });
        } else if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
        
        setShowShareMenu(false);
    };

    // Detect available apps
    const detectAvailableApps = () => {
        const hasShareApi = !!navigator.share;
        setAvailableApps({
            facebook: true,
            twitter: true,
            whatsapp: true,
            native: hasShareApi
        });
    };

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <Head title={article.title} />
            <Toaster position="top-right" />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <Link
                            href={route('apps.articles.index')}
                            className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            <IconChevronLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Preview Artikel
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Kelola dan preview artikel sebelum dipublikasikan
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEdit}
                            className="flex items-center gap-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors"
                        >
                            <IconEdit size={20} />
                            Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg hover:bg-[#B91C1C] transition-colors"
                        >
                            <IconTrash size={20} />
                            Hapus
                        </button>
                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 px-4 py-2 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-colors"
                        >
                            <IconShare size={20} />
                            Bagikan
                        </button>
                    </div>
                </div>

                {/* Article Info Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-6 p-6 border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left side - Thumbnail */}
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700">
                            {article.thumbnail ? (
                                <img
                                    src={`/storage/${article.thumbnail}`}
                                    alt={article.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-gray-400">Tidak Ada Gambar</span>
                                </div>
                            )}
                        </div>

                        {/* Right side - Article Details */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    {article.title}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                        <IconUser size={20} className="text-[#7C3AED] dark:text-[#A78BFA]" />
                                        <span>{article.author}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                        <IconCalendar size={20} className="text-[#7C3AED] dark:text-[#A78BFA]" />
                                        <span>{formatDate(article.published_at)}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-700 dark:text-gray-200">
                                        <IconEye size={20} className="text-[#7C3AED] dark:text-[#A78BFA]" />
                                        <span>{article.views || 0} views</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-200">
                        <div dangerouslySetInnerHTML={{ __html: article.description }} />
                    </div>
                </div>

                {/* Share Menu Popup */}
                {showShareMenu && (
                    <div 
                        ref={shareMenuRef}
                        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 border border-gray-100 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
                            <span className="text-lg font-medium text-gray-900 dark:text-white">Bagikan Artikel</span>
                            <button 
                                onClick={() => setShowShareMenu(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <IconX size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-2">
                            {availableApps.native && (
                                <button 
                                    onClick={() => shareToSocial('native')}
                                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                                >
                                    <IconShare2 size={20} className="text-[#7C3AED] dark:text-[#A78BFA]" />
                                    <span>Native Share</span>
                                </button>
                            )}
                            <button 
                                onClick={() => shareToSocial('facebook')}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                            >
                                <IconBrandFacebook size={20} className="text-[#1877F2]" />
                                <span>Facebook</span>
                            </button>
                            <button 
                                onClick={() => shareToSocial('twitter')}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                            >
                                <IconBrandTwitter size={20} className="text-[#1DA1F2]" />
                                <span>Twitter</span>
                            </button>
                            <button 
                                onClick={() => shareToSocial('whatsapp')}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                            >
                                <IconBrandWhatsapp size={20} className="text-[#25D366]" />
                                <span>WhatsApp</span>
                            </button>
                            <button 
                                onClick={handleCopyLink}
                                className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-700 dark:text-gray-200"
                            >
                                <IconCopy size={20} className="text-[#7C3AED] dark:text-[#A78BFA]" />
                                <span>Copy Link</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

Show.layout = page => <AppLayout children={page} />; 
