import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconUser, IconChevronUp, IconShare, IconBrandFacebook, IconBrandTwitter, IconBrandWhatsapp, IconCopy, IconX, IconShare2, IconChevronRight } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Show({ article }) {
    const [expanded, setExpanded] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const contentRef = useRef(null);
    const shareMenuRef = useRef(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);
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

    // Handle touch events for swipe up functionality
    const handleTouchStart = (e) => {
        startY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
        currentY.current = e.touches[0].clientY;
        handleDragMove();
    };

    // Handle mouse events for drag functionality
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startY.current = e.clientY;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        currentY.current = e.clientY;
        handleDragMove();
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    // Common function to handle both touch and mouse drag
    const handleDragMove = () => {
        const diff = startY.current - currentY.current;
        
        // If moving up and not already expanded
        if (diff > 50 && !expanded) {
            setExpanded(true);
        }
        // If moving down and already expanded
        else if (diff < -50 && expanded) {
            setExpanded(false);
        }
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

        // Check if native sharing is supported
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
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Add indicator bar at top of content
    const IndicatorBar = () => (
        <div 
            className="flex flex-col items-center mb-4 cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
        >
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>
    );

    return (
        <>
            <Head title={article.title} />
            <Toaster position="top-right" />

            <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-950">
                <div className="w-full">
                    {/* Back Button - Absolute positioned on top of thumbnail */}
                    <div className="absolute top-4 left-4 z-10">
                        <Link
                            href={route('apps.user.article')}
                            className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        >
                            <IconChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                    </div>

                    {/* Share Button - Absolute positioned on top right of thumbnail */}
                    <div className="absolute top-4 right-4 z-10">
                        <button
                            onClick={handleShare}
                            className="flex items-center justify-center w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all"
                        >
                            <IconShare size={20} strokeWidth={1.5} />
                        </button>
                        
                        {/* Share Menu Popup */}
                        {showShareMenu && (
                            <div 
                                ref={shareMenuRef}
                                className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-20"
                            >
                                <div className="flex justify-between items-center p-2 border-b dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Share to</span>
                                    <button 
                                        onClick={() => setShowShareMenu(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <IconX size={16} />
                                    </button>
                                </div>
                                <div className="p-2">
                                    {availableApps.native && (
                                        <button 
                                            onClick={() => shareToSocial('native')}
                                            className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                        >
                                            <IconShare2 size={18} className="text-gray-600" />
                                            <span className="text-sm">Native Share</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => shareToSocial('facebook')}
                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                    >
                                        <IconBrandFacebook size={18} className="text-blue-600" />
                                        <span className="text-sm">Facebook</span>
                                    </button>
                                    <button 
                                        onClick={() => shareToSocial('twitter')}
                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                    >
                                        <IconBrandTwitter size={18} className="text-blue-400" />
                                        <span className="text-sm">Twitter</span>
                                    </button>
                                    <button 
                                        onClick={() => shareToSocial('whatsapp')}
                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                    >
                                        <IconBrandWhatsapp size={18} className="text-green-500" />
                                        <span className="text-sm">WhatsApp</span>
                                    </button>
                                    <button 
                                        onClick={handleCopyLink}
                                        className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-left"
                                    >
                                        <IconCopy size={18} className="text-gray-500" />
                                        <span className="text-sm">Copy Link</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Container - Full Width with proper aspect ratio */}
                    <div className={`w-full transition-all duration-500 relative bg-gray-200 dark:bg-gray-800 ${expanded ? 'h-[180px]' : 'aspect-video md:h-auto'} overflow-hidden`}>
                        {article.thumbnail ? (
                            <img
                                src={`/storage/${article.thumbnail}`}
                                alt={article.title}
                                className={`w-full h-full object-cover ${expanded ? '' : 'md:max-h-[450px]'}`}
                                loading="eager"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/800x450?text=Tidak+Ada+Gambar";
                                }}
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center aspect-video">
                                <span className="text-gray-400">Tidak Ada Gambar</span>
                            </div>
                        )}
                        
                        {/* Title - Overlay on bottom of thumbnail with gradient */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 mb-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[5]">
                            <h1 className="text-xl md:text-3xl font-bold text-white max-w-5xl mx-auto">
                                {article.title}
                            </h1>
                        </div>
                    </div>

                    {/* Content - Full Width White Background with Swipe Up */}
                    <div 
                        ref={contentRef}
                        className={`flex-1 bg-white dark:bg-gray-900 rounded-t-3xl -mt-6 relative z-10 min-h-screen transition-all duration-500 ${expanded ? 'translate-y-[-85px] md:translate-y-[-80px]' : ''}`}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                    >
                        <div className="max-w-5xl mx-auto px-6 py-6">
                            {/* Swipe indicator */}
                            <IndicatorBar />
                            
                            {/* Author Info */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                    <IconUser size={24} className="text-gray-500" />
                                </div>
                                <div>
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {article.author}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Posted {formatDate(article.published_at)}
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="prose prose-lg dark:prose-invert max-w-none">
                                <div dangerouslySetInnerHTML={{ __html: article.description }} />
                            </div>

                            {/* Related Videos Section */}
                            {article.video_links && article.video_links.length > 0 && (
                                <div className="mt-8 border-t dark:border-gray-800 pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                        Video Terkait
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {article.video_links.map((video, index) => (
                                            <Link 
                                                key={index} 
                                                href={route('apps.user.video.show', video.slug || video.id)}
                                                className="block"
                                            >
                                                <div className="relative aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden mb-2">
                                                    {video.thumbnail ? (
                                                        <img 
                                                            src={video.thumbnail.startsWith('http') 
                                                                ? video.thumbnail 
                                                                : `/storage/${video.thumbnail}`} 
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full">
                                                            <IconShare size={20} className="text-gray-500" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                                        <div className="bg-white/25 backdrop-blur-sm rounded-full p-2">
                                                            <IconChevronRight size={24} className="text-white" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                    {video.title}
                                                </h4>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Share button at the bottom */}
                            <div className="mt-8 pt-4 border-t dark:border-gray-800">
                                <button
                                    onClick={handleShare}
                                    className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                                >
                                    <IconShare size={18} strokeWidth={1.5} />
                                    <span>Bagikan Artikel</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => page; 