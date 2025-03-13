import React, { useState, useRef, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconEye, IconShare, IconUser, IconPlayerPlay, IconPlayerPause, 
    IconVolume, IconVolume2, IconVolume3, IconVolumeOff, IconSettings, IconClock, 
    IconBrandWhatsapp, IconBrandFacebook, IconChevronRight, IconClipboardCopy } from '@tabler/icons-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Show({ video }) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showControls, setShowControls] = useState(true);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSettings, setShowSettings] = useState(false);
    const [showShareOptions, setShowShareOptions] = useState(false);
    const controlsTimeoutRef = useRef(null);
    const [isHoveringProgress, setIsHoveringProgress] = useState(false);
    const [hoverPosition, setHoverPosition] = useState(0);
    const progressBarRef = useRef(null);

    // Handle video metadata loaded
    const handleMetadataLoaded = () => {
        setDuration(videoRef.current.duration);
        // Pada saat metadata dimuat, pastikan video siap
        videoRef.current.addEventListener('seeked', () => {
            console.log('Video seeked to:', videoRef.current.currentTime);
        });
    };

    // Handle time update
    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    // Toggle play/pause
    const togglePlay = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Handle seeking - implementasi baru yang lebih kuat
    const handleSeek = (e) => {
        e.stopPropagation(); // Mencegah event bubbling
        
        if (!progressBarRef.current || !videoRef.current) return;
        
        const rect = progressBarRef.current.getBoundingClientRect();
        const clickPosition = e.clientX - rect.left;
        const percentPosition = clickPosition / rect.width;
        
        // Batasi nilai antara 0 dan 1
        const boundedPosition = Math.max(0, Math.min(1, percentPosition));
        
        // Hitung waktu yang tepat berdasarkan persentase
        const seekTime = boundedPosition * duration;
        
        console.log('Seeking to time:', seekTime, 'seconds');
        
        // Metode 1: Menggunakan currentTime secara langsung
        try {
            // Perbarui UI terlebih dahulu untuk feedback langsung
            setCurrentTime(seekTime);
            
            // Ubah waktu video
            videoRef.current.currentTime = seekTime;
            
            // Jika tidak playing, mainkan video
            if (!isPlaying) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                            setIsPlaying(true);
                            console.log('Video started playing after seek');
                        })
                        .catch(error => {
                            console.error('Error playing video:', error);
                        });
                }
            }
        } catch (error) {
            console.error('Error during seek operation:', error);
        }
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        videoRef.current.volume = newVolume;
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    // Toggle mute
    const toggleMute = () => {
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
        if (isMuted) {
            videoRef.current.volume = volume || 0.5;
        }
    };

    // Format time for display (mm:ss)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Handle fullscreen toggle
    const toggleFullscreen = () => {
        const videoContainer = document.querySelector('.video-container');
        
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Update fullscreen state
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Hide controls after inactivity
    useEffect(() => {
        const hideControls = () => {
            if (isPlaying) {
                setShowControls(false);
            }
        };
        
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }
        
        controlsTimeoutRef.current = setTimeout(hideControls, 3000);
        
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, [isPlaying, showControls]);

    // Show controls on mouse move
    const handleMouseMove = () => {
        setShowControls(true);
    };

    // Set playback rate
    const changePlaybackRate = (rate) => {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSettings(false);
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

    // Share options
    const shareOptions = [
        { 
            name: 'Copy Link',
            icon: <IconClipboardCopy size={18} strokeWidth={1.5} />,
            action: () => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link video berhasil disalin!');
                setShowShareOptions(false);
            }
        },
        { 
            name: 'WhatsApp',
            icon: <IconBrandWhatsapp size={18} strokeWidth={1.5} />,
            action: () => {
                window.open(`https://wa.me/?text=${encodeURIComponent(`${video.title} - ${window.location.href}`)}`);
            }
        },
        { 
            name: 'Facebook',
            icon: <IconBrandFacebook size={18} strokeWidth={1.5} />,
            action: () => {
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
            }
        }
    ];

    // Get video thumbnail for display before play
    const getVideoThumbnail = () => {
        if (video.thumbnail) {
            return `/storage/${video.thumbnail}`;
        }
        return null;
    };

    // Get volume icon based on current volume
    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <IconVolumeOff size={20} strokeWidth={1.5} />;
        if (volume < 0.3) return <IconVolume size={20} strokeWidth={1.5} />;
        if (volume < 0.7) return <IconVolume2 size={20} strokeWidth={1.5} />;
        return <IconVolume3 size={20} strokeWidth={1.5} />;
    };

    // Handle mouse position over progress bar
    const handleProgressMouseMove = (e) => {
        if (progressBarRef.current) {
            const rect = progressBarRef.current.getBoundingClientRect();
            const position = (e.clientX - rect.left) / rect.width;
            setHoverPosition(Math.max(0, Math.min(1, position)));
        }
    };

    return (
        <>
            <Head title={video.title} />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-950 pb-12">
                {/* Back button - Mobile */}
                <div className="md:hidden p-4 bg-white dark:bg-gray-900 shadow-sm">
                    <Link 
                        href={route('apps.user.video')} 
                        className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <IconChevronLeft size={20} strokeWidth={1.5} className="mr-1" />
                        <span>Kembali</span>
                    </Link>
                </div>

                {/* Main content */}
                <div className="max-w-5xl mx-auto px-4 pt-4 md:pt-10">
                    {/* Back button - Desktop only */}
                    <div className="hidden md:block mb-4">
                        <Link 
                            href={route('apps.user.video')} 
                            className="inline-flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <IconChevronLeft size={20} strokeWidth={1.5} className="mr-1" />
                            <span>Kembali ke Daftar Video</span>
                        </Link>
                    </div>

                    {/* Video Player */}
                    <div 
                        className="video-container relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-0"
                        onMouseMove={handleMouseMove}
                    >
                        {!isPlaying && currentTime === 0 && getVideoThumbnail() && (
                            <div className="absolute inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                                <img 
                                    src={getVideoThumbnail()} 
                                    alt={video.title} 
                                    className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
                                />
                                <button 
                                    onClick={togglePlay}
                                    className="z-20 bg-purple-600 hover:bg-purple-700 text-white rounded-full w-16 h-16 flex items-center justify-center transition duration-300 transform hover:scale-110"
                                >
                                    <IconPlayerPlay size={28} />
                                </button>
                            </div>
                        )}

                        <video
                            ref={videoRef}
                            className="w-full h-full"
                            src={video.video_file.startsWith('http') ? video.video_file : `/storage/${video.video_file}`}
                            preload="metadata"
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleMetadataLoaded}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onClick={togglePlay}
                            controlsList="nodownload"
                            playsInline
                        >
                            Browser tidak mendukung video.
                        </video>

                        {/* Custom Video Controls */}
                        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent py-2 px-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                            {/* Progress bar */}
                            <div 
                                ref={progressBarRef}
                                className="relative h-4 group cursor-pointer"
                                onMouseEnter={() => setIsHoveringProgress(true)}
                                onMouseLeave={() => setIsHoveringProgress(false)}
                                onMouseMove={handleProgressMouseMove}
                            >
                                {/* Progress bar background */}
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-600 rounded-full my-2"></div>
                                
                                {/* Progress bar fill */}
                                <div 
                                    className="absolute bottom-0 left-0 h-1 bg-purple-600 rounded-full my-2"
                                    style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                                ></div>

                                {/* Clickable area dengan event handler yang terpisah */}
                                <div 
                                    className="absolute inset-0 z-10"
                                    onClick={handleSeek}
                                    style={{ cursor: 'pointer' }}
                                ></div>

                                {/* Hover position indicator */}
                                {isHoveringProgress && (
                                    <>
                                        {/* Hover time tooltip */}
                                        <div 
                                            className="absolute bottom-6 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded transform -translate-x-1/2 pointer-events-none"
                                            style={{ left: `${hoverPosition * 100}%` }}
                                        >
                                            {formatTime(hoverPosition * duration)}
                                        </div>
                                        
                                        {/* Hover position line */}
                                        <div 
                                            className="absolute bottom-0 w-0.5 h-3 bg-white rounded-full my-1 transform -translate-x-1/2 pointer-events-none" 
                                            style={{ left: `${hoverPosition * 100}%` }}
                                        ></div>
                                    </>
                                )}
                                
                                {/* Draggable handle */}
                                <div 
                                    className="absolute bottom-0 w-3 h-3 bg-purple-600 rounded-full transform -translate-x-1/2 translate-y-0 my-1 group-hover:scale-125 transition-transform"
                                    style={{ left: `${(currentTime / duration) * 100}%` }}
                                ></div>
                            </div>
                            
                            {/* Controls row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    {/* Play/Pause */}
                                    <button 
                                        onClick={togglePlay}
                                        className="text-white hover:text-purple-400 transition"
                                    >
                                        {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
                                    </button>
                                    
                                    {/* Volume control */}
                                    <div className="flex items-center group relative">
                                        <button 
                                            onClick={toggleMute}
                                            className="text-white hover:text-purple-400 transition"
                                        >
                                            {getVolumeIcon()}
                                        </button>
                                        <div className="hidden group-hover:block ml-2 w-20">
                                            <input 
                                                type="range" 
                                                min="0" 
                                                max="1" 
                                                step="0.01" 
                                                value={isMuted ? 0 : volume}
                                                onChange={handleVolumeChange}
                                                className="w-full h-1 bg-gray-600 rounded-full accent-purple-600"
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Time */}
                                    <div className="text-white text-xs">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                    {/* Playback speed */}
                                    <div className="relative">
                                        <button 
                                            onClick={() => setShowSettings(!showSettings)}
                                            className="text-white hover:text-purple-400 transition flex items-center"
                                        >
                                            <IconSettings size={18} className="mr-1" />
                                            <span className="text-xs">{playbackRate}x</span>
                                        </button>
                                        
                                        {showSettings && (
                                            <div className="absolute bottom-full right-0 mb-2 bg-black bg-opacity-90 rounded p-2 w-32">
                                                <div className="text-white text-xs mb-1 px-2 py-1">Playback Speed</div>
                                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                                                    <button 
                                                        key={rate}
                                                        onClick={() => changePlaybackRate(rate)}
                                                        className={`block w-full text-left px-2 py-1 text-xs hover:bg-gray-800 ${playbackRate === rate ? 'text-purple-400' : 'text-white'}`}
                                                    >
                                                        {rate}x
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Full screen */}
                                    <button 
                                        onClick={toggleFullscreen}
                                        className="text-white hover:text-purple-400 transition"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Simple title and description */}
                    <div className="dark:bg-gray-900 rounded-b-xl">
                        {/* Video title */}
                        <div className="px-6 py-4 border-b dark:border-gray-800">
                            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                                {video.title}
                            </h1>
                        </div>

                        {/* Simple description */}
                        <div className="p-6">
                            {video.description && (
                                <div className="text-gray-600 dark:text-gray-300">
                                    {video.description}
                                </div>
                            )}
                            
                            {/* Simple share button */}
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    toast.success('Link video berhasil disalin!');
                                }}
                                className="mt-4 flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300"
                            >
                                <IconShare size={18} strokeWidth={1.5} className="mr-2" />
                                <span>Bagikan Video</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 