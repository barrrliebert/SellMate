import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconSearch, IconBook, IconShare } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Index({ articles }) {
    const handleShare = (articleId, articleSlug) => {
        const url = route('apps.user.article.show', articleSlug || articleId);
        navigator.clipboard.writeText(url);
        toast.success('Link artikel berhasil disalin!');
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    return (
        <>
            <Head title="Articles" />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="p-4">
                    {/* Header with back button, title and search */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <Link 
                                href={route('apps.user.dashboard')} 
                                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                <IconChevronLeft size={24} strokeWidth={1.5} />
                            </Link>
                            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Artikel
                            </h1>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                            <IconSearch size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Article Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {articles.map((article) => (
                            <div key={article.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                                <div className="flex">
                                    {/* Thumbnail */}
                                    <div className="w-1/3">
                                        {article.thumbnail ? (
                                            <img
                                                src={`/storage/${article.thumbnail}`}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <IconBook size={24} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="w-2/3 p-4">
                                        <Link href={route('apps.user.article.show', article.slug || article.id)}>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                {article.title}
                                            </h3>
                                        </Link>
                                        <div className="flex justify-between gap-2 mt-4">
                                            <Link
                                                href={route('apps.user.article.show', article.slug || article.id)}
                                                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                                            >
                                                Baca Selengkapnya
                                            </Link>
                                            <button
                                                onClick={() => handleShare(article.id, article.slug)}
                                                className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium flex items-center gap-1"
                                            >
                                                <IconShare size={24} strokeWidth={1.5} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

Index.layout = page => page 