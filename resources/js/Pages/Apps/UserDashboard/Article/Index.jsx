import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconSearch, IconBook, IconShare, IconBrandFacebook, IconBrandTwitter, IconBrandWhatsapp, IconCopy, IconX, IconShare2, IconEye } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Index({ articles }) {
    const [shareMenuOpen, setShareMenuOpen] = useState(null);
    const shareMenuRef = useRef(null);
    const [availableApps, setAvailableApps] = useState({
        facebook: true,
        twitter: true,
        whatsapp: true,
        native: false
    });

    const handleShare = (articleId, articleSlug) => {
        detectAvailableApps();
        setShareMenuOpen(articleId);
    };

    const handleCopyLink = (articleId, articleSlug) => {
        const url = route('apps.user.article.show', articleSlug || articleId);
        navigator.clipboard.writeText(url);
        toast.success('Link artikel berhasil disalin!');
        setShareMenuOpen(null);
    };

    const shareToSocial = (platform, articleId, articleSlug) => {
        const article = articles.find(a => a.id === articleId);
        const url = route('apps.user.article.show', articleSlug || articleId);
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

        // Check if native sharing is supported
        if (navigator.share && platform === 'native') {
            navigator.share({
                title: title,
                text: article?.description?.substring(0, 100) || '',
                url: url,
            }).catch(err => {
                console.error('Error sharing:', err);
            });
            setShareMenuOpen(null);
        } else if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            setShareMenuOpen(null);
        }
    };

    // Attempt to detect available apps
    const detectAvailableApps = () => {
        // Check if Web Share API is available (mobile devices)
        const hasShareApi = !!navigator.share;

        // Can attempt to detect Facebook app via user agent
        const isFacebookAvailable = /FBAN|FBAV/.test(navigator.userAgent);
        
        // Check for Twitter app
        const isTwitterAvailable = /Twitter/i.test(navigator.userAgent);
        
        // Check for WhatsApp
        const isWhatsAppAvailable = /WhatsApp/i.test(navigator.userAgent);

        setAvailableApps({
            facebook: true, // Always keep fallback to browser
            twitter: true,  // Always keep fallback to browser
            whatsapp: true, // Always keep fallback to browser
            native: hasShareApi
        });
    };

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
                setShareMenuOpen(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
                                        <div className="flex justify-between items-center gap-2 mt-4">
                                            <Link
                                                href={route('apps.user.article.show', article.slug || article.id)}
                                                className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                                            >
                                                Baca Selengkapnya
                                            </Link>
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleShare(article.id, article.slug);
                                                    }}
                                                    className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                                >
                                                    <IconShare size={14} strokeWidth={1.5} />
                                                </button>
                                                
                                                {/* Share Menu Popup */}
                                                {shareMenuOpen === article.id && (
                                                    <div 
                                                        ref={shareMenuRef}
                                                        className="fixed inset-0 z-50 flex items-center justify-center"
                                                        onClick={() => setShareMenuOpen(null)}
                                                    >
                                                        <div 
                                                            className="absolute right-4 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden"
                                                            onClick={e => e.stopPropagation()}
                                                        >
                                                            <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share to</span>
                                                                <button 
                                                                    onClick={() => setShareMenuOpen(null)}
                                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                                >
                                                                    <IconX size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="p-2">
                                                                {availableApps.native && (
                                                                    <button 
                                                                        onClick={() => shareToSocial('native', article.id, article.slug)}
                                                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                                                    >
                                                                        <IconShare2 size={18} className="text-gray-600" />
                                                                        <span className="text-sm">Native Share</span>
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    onClick={() => shareToSocial('facebook', article.id, article.slug)}
                                                                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                                                >
                                                                    <IconBrandFacebook size={18} className="text-blue-600" />
                                                                    <span className="text-sm">Facebook</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => shareToSocial('twitter', article.id, article.slug)}
                                                                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                                                >
                                                                    <IconBrandTwitter size={18} className="text-blue-400" />
                                                                    <span className="text-sm">Twitter</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => shareToSocial('whatsapp', article.id, article.slug)}
                                                                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                                                >
                                                                    <IconBrandWhatsapp size={18} className="text-green-500" />
                                                                    <span className="text-sm">WhatsApp</span>
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleCopyLink(article.id, article.slug)}
                                                                    className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                                                >
                                                                    <IconCopy size={18} className="text-gray-500" />
                                                                    <span className="text-sm">Copy Link</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
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