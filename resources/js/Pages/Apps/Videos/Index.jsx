import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { IconEdit, IconTrash, IconVideo, IconLink } from "@tabler/icons-react";
import hasAnyPermission from "@/Utils/Permissions";
import Swal from "sweetalert2";

export default function Index({ videos }) {
    const [playingVideoId, setPlayingVideoId] = useState(null);

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
                router.delete(`/apps/videos/${id}`);
                Swal.fire({
                    title: "Berhasil!",
                    text: "Data video berhasil dihapus.",
                    icon: "success",
                    timer: 1000,
                    showConfirmButton: false,
                });
            }
        });
    };

    const handleTogglePlay = (id) => {
        setPlayingVideoId((prev) => (prev === id ? null : id));
    };

    const handleGenerateLink = (video) => {
        const videoUrl = `${window.location.origin}/videos/${video.id}`;
        navigator.clipboard.writeText(videoUrl);
        Swal.fire({
            title: "Link Disalin!",
            text: "Link video telah disalin ke clipboard.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
        });
    };

    return (
        <div className="lg:p-0 p-4">
            <Head title="Videos" />

            <div className="flex justify-between items-center mb-10">
            <div className="flex flex-col">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Katalog Video</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Kelola video dengan mudah</p>
                </div>
                {hasAnyPermission(["videos-create"]) && (
                    <Link
                        href="/apps/videos/create"
                        className="bg-[#AA51DF] text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
                    >
                        Tambah Video
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(videos) ? videos : []).map((video) => (
                    <div key={video.id} className="relative border border-[#D4A8EF] p-4 bg-white rounded-2xl shadow-md">
                        <div
                            className="mb-4 rounded-2xl overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 h-[200px] cursor-pointer"
                            onClick={() => handleTogglePlay(video.id)}
                        >
                            {video.video_file ? (
                                playingVideoId === video.id ? (
                                    <video
                                        controls
                                        autoPlay
                                        muted
                                        className="w-full h-full object-cover"
                                    >
                                        <source
                                            src={ video.video_file.startsWith('http')
                                                ? video.video_file
                                                : `/storage/${video.video_file}`}
                                            type="video/mp4"
                                        />
                                        Browser tidak mendukung video.
                                    </video>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <IconVideo size={48} className="text-gray-400" />
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconVideo size={48} className="text-gray-400" />
                                </div>
                            )}
                        </div>

                        <h3 className="font-semibold text-lg mb-2 text-left text-gray-900 dark:text-white">
                            {video.title}
                        </h3>

                        <span className="block text-sm text-gray-800 dark:text-gray-400">
                            {video.source}
                        </span>

                        {/* Tombol Aksi */}
                        <div className="flex gap-2 justify-end mt-4">
                            {/* Tombol Generate Link */}
                            <button
                                onClick={() => handleGenerateLink(video)}
                                className="text-indigo-900 p-2 rounded-full hover:bg-indigo-200 transition transform hover:scale-110"
                            >
                                <IconLink size={20} />
                            </button>

                            {/* Tombol Edit */}
                            {hasAnyPermission(["videos-update"]) && (
                                <Link
                                    href={`/apps/videos/${video.id}/edit`}
                                    className="text-gray-700 p-2 rounded-full hover:bg-gray-400 transition transform hover:scale-110"
                                >
                                    <IconEdit size={20} />
                                </Link>
                            )}

                            {/* Tombol Hapus */}
                            {hasAnyPermission(["videos-delete"]) && (
                                <button
                                    onClick={() => handleDelete(video.id)}
                                    className="text-red-900 p-2 rounded-full hover:bg-red-200 transition transform hover:scale-110"
                                >
                                    <IconTrash size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

Index.layout = (page) => <AppLayout children={page} />;