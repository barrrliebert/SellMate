import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconSearch, IconVideo, IconPlayerPlay, IconEye, IconShare, IconUser } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Index({ videos }) {
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [thumbnails, setThumbnails] = useState({});
    const [durations, setDurations] = useState({});
    const [loadingThumbnails, setLoadingThumbnails] = useState({});
    const videoRefs = useRef({});

    const handleTogglePlay = (id) => {
        setPlayingVideoId((prev) => (prev === id ? null : id));
    };

    const handleShare = (videoId, videoSlug) => {
        const url = route('apps.user.video.show', videoSlug || videoId);
        navigator.clipboard.writeText(url);
        toast.success('Link video berhasil disalin!');
    };

    // Format duration to mm:ss
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Format view count
    const formatViewCount = (count) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M views`;
        } else if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K views`;
        }
        return `${count} views`;
    };

    // Generate thumbnail for a video
    const generateThumbnail = async (videoElement, id) => {
        setLoadingThumbnails(prev => ({ ...prev, [id]: true }));
        
        try {
            // Set video to a specific time (1 second) to avoid black frame
            videoElement.currentTime = 1;
            
            // Wait for the time update to complete
            await new Promise((resolve) => {
                videoElement.addEventListener('seeked', resolve, { once: true });
            });

            // Create high quality thumbnail
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            
            // Store the thumbnail
            setThumbnails(prev => ({
                ...prev,
                [id]: canvas.toDataURL('image/jpeg', 1.0)
            }));
        } catch (error) {
            console.error('Error generating thumbnail:', error);
        } finally {
            setLoadingThumbnails(prev => ({ ...prev, [id]: false }));
        }
    };

    // Load video metadata and create thumbnail
    const handleVideoLoad = async (video, id) => {
        // Get video duration
        const duration = video.duration;
        setDurations(prev => ({
            ...prev,
            [id]: formatDuration(duration)
        }));

        // Generate thumbnail
        await generateThumbnail(video, id);
    };

    // Initialize thumbnails when component mounts
    useEffect(() => {
        videos?.forEach((video) => {
            if (!thumbnails[video.id] && !loadingThumbnails[video.id]) {
                const videoElement = document.createElement('video');
                videoElement.src = video.video_file.startsWith('http')
                    ? video.video_file
                    : `/storage/${video.video_file}`;
                videoElement.preload = 'metadata';
                videoElement.onloadedmetadata = () => handleVideoLoad(videoElement, video.id);
            }
        });
    }, [videos]);

    return (
        <>
            <Head title="Videos" />
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
                                Videos
                            </h1>
                        </div>
                        <button className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                            <IconSearch size={24} strokeWidth={1.5} />
                        </button>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videos.map((video) => (
                            <div key={video.id} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
                                <Link href={route('apps.user.video.show', video.slug || video.id)}>
                                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-900">
                                        {loadingThumbnails[video.id] ? (
                                            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                                        ) : thumbnails[video.id] ? (
                                            <img
                                                src={thumbnails[video.id]}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                                                <IconPlayerPlay size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity">
                                            <IconPlayerPlay size={48} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                                        </div>
                                        
                                        {/* Duration badge */}
                                        {durations[video.id] && (
                                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                {durations[video.id]}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-2 mt-2">
                                    <div className="flex gap-3">
                                        {/* Profile Icon */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                                                <IconUser size={20} className="text-gray-500" />
                                            </div>
                                        </div>
                                        
                                        {/* Title and Description */}
                                        <div className="flex-1">
                                            <Link href={route('apps.user.video.show', video.slug || video.id)}>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                    {video.title}
                                                </h3>
                                            </Link>
                                            
                                            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                                                {video.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Views and Share - Full Width Row at Bottom */}
                                    <div className="flex items-center justify-between w-full text-xs border-t dark:border-gray-700 pt-2 px-1">
                                        <div className="flex items-center text-gray-500 dark:text-gray-400">
                                            <IconEye size={14} strokeWidth={1.5} className="mr-1" />
                                            <span>{formatViewCount(video.views || 0)}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare(video.id, video.slug);
                                            }}
                                            className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                                        >
                                            <IconShare size={14} strokeWidth={1.5} className="mr-1" />
                                            <span>Share</span>
                                        </button>
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