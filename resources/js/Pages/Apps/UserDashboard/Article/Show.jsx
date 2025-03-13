import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconUser, IconChevronUp } from '@tabler/icons-react';

export default function Show({ article }) {
    const [expanded, setExpanded] = useState(false);
    const contentRef = useRef(null);
    const startY = useRef(0);
    const currentY = useRef(0);
    const isDragging = useRef(false);

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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Show.layout = page => page; 