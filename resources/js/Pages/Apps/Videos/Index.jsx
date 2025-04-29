import React, { useState, useRef, useEffect } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { IconEdit, IconTrash, IconVideo, IconPlayerPlay, IconLink } from "@tabler/icons-react";
import hasAnyPermission from "@/Utils/Permissions";
import Swal from "sweetalert2";
import toast, { Toaster } from "react-hot-toast";

export default function Index({ videos, flash }) {
    const [playingVideoId, setPlayingVideoId] = useState(null);
    const [thumbnails, setThumbnails] = useState({});
    const [durations, setDurations] = useState({});
    const [loadingThumbnails, setLoadingThumbnails] = useState({});
    const videoRefs = useRef({});

    useEffect(() => {
        if (flash && flash.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    // Format duration to mm:ss
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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
                videoElement.src = video.video_file;
                videoElement.preload = 'metadata';
                videoElement.onloadedmetadata = () => handleVideoLoad(videoElement, video.id);
            }
        });
    }, [videos]);

    const handleEdit = (id) => {
        Swal.fire({
            title: 'Edit Video',
            text: 'Anda akan mengedit video ini',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, edit!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Membuka form edit...');
                router.get(`/apps/videos/${id}/edit`, {}, {
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

    const handleDelete = (id) => {
        Swal.fire({
            title: "Apakah anda yakin?",
            text: "Data video akan dihapus permanen!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, hapus!",
            cancelButtonText: "Batal",
        }).then((result) => {
            if (result.isConfirmed) {
                const loadingToast = toast.loading('Menghapus video...');
                
                router.delete(`/apps/videos/${id}`, {
                    onSuccess: () => {
                        toast.dismiss(loadingToast);
                        toast.success('Video berhasil dihapus!');
                    },
                    onError: () => {
                        toast.dismiss(loadingToast);
                        toast.error('Gagal menghapus video!');
                    }
                });
            }
        });
    };

    const handleTogglePlay = (id) => {
        if (playingVideoId === id) {
            const video = videoRefs.current[id];
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        } else {
            // Stop previous video if any
            if (playingVideoId && videoRefs.current[playingVideoId]) {
                videoRefs.current[playingVideoId].pause();
            }
            setPlayingVideoId(id);
        }
    };

    const handleGenerateLink = (video) => {
        const videoUrl = `${window.location.origin}/videos/${video.id}`;
        navigator.clipboard.writeText(videoUrl);
        toast.success('Link video berhasil disalin!', {
            icon: '📋',
            duration: 2000
        });
    };

    return (
        <div className="px-4 sm:px-0">
            <Head title="Katalog Video" />
            <Toaster position="top-right" />

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 mt-6 sm:mt-0">
                <div className="mb-4 sm:mb-0">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Katalog Video</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kelola video dengan mudah</p>
                </div>
                {hasAnyPermission(["videos-create"]) && (
                    <Link
                        href="/apps/videos/create"
                        className="bg-[#AA51DF] text-white px-4 py-2 rounded-full hover:bg-purple-700 transition w-full sm:w-auto text-center sm:text-left"
                    >
                        Tambah Video
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {(Array.isArray(videos) ? videos : []).map((video) => (
                    <div key={video.id} className="mx-auto sm:mx-0 w-full max-w-[370px]">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 flex flex-col border border-[#D4A8EF] dark:border-gray-900 shadow-sm">
                            <div 
                                className="relative mb-4 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 h-[200px] cursor-pointer"
                                onClick={() => handleTogglePlay(video.id)}
                            >
                                {playingVideoId === video.id ? (
                                    <video
                                        ref={el => videoRefs.current[video.id] = el}
                                        src={video.video_file}
                                        className="w-full h-full object-cover"
                                        controls
                                        autoPlay
                                    />
                                ) : (
                                    <>
                                        {loadingThumbnails[video.id] ? (
                                            <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
                                        ) : thumbnails[video.id] ? (
                                            <img
                                                src={thumbnails[video.id]}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <IconPlayerPlay size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                        
                                        {/* Play button overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity">
                                            <IconPlayerPlay size={48} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                                        </div>
                                        
                                        {/* Duration badge */}
                                        {durations[video.id] && (
                                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                                {durations[video.id]}
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <h3 className="font-semibold text-lg mb-2 text-left text-gray-900 dark:text-white">
                                {video.title}
                            </h3>

                            <span className="block text-sm text-gray-800 dark:text-gray-400">
                                {video.source}
                            </span>

                            {/* Tombol Aksi */}
                            <div className="flex gap-2 justify-end mt-auto pt-4">
                                {/* Tombol Generate Link */}
                                <button
                                    onClick={() => handleGenerateLink(video)}
                                    className="text-indigo-900 p-2 rounded-full hover:bg-indigo-200 transition transform hover:scale-110"
                                >
                                    <IconLink size={20} />
                                </button>

                                {/* Tombol Delete */}
                                {hasAnyPermission(["videos-delete"]) && (
                                    <button
                                        onClick={() => handleDelete(video.id)}
                                        className="text-red-900 p-2 rounded-full hover:bg-red-200 transition transform hover:scale-110"
                                    >
                                        <img 
                                            src="/images/delete.svg" 
                                            alt="Delete Icon" 
                                            className="w-[26px] h-[26px]"
                                        />
                                    </button>
                                )}

                                {/* Tombol Edit */}
                                {hasAnyPermission(["videos-update"]) && (
                                    <button
                                        onClick={() => handleEdit(video.id)}
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
                ))}
            </div>
        </div>
    );
}

Index.layout = page => <AppLayout children={page} />;