import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, Link, router } from "@inertiajs/react";
import { IconEdit, IconTrash, IconVideo } from "@tabler/icons-react";
import hasAnyPermission from "@/Utils/Permissions";
import Swal from "sweetalert2";

export default function Index({ videos }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [playingVideoId, setPlayingVideoId] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get("/apps/videos", { search: searchQuery });
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

    

    return (
        <>
            <Head title="Videos" />

            <div className="flex bg justify-between items-center">
                <div className="flex items-center mb-3">
                    <IconVideo size={20} strokeWidth={1.5} className="mr-2" />
                    <h1 className="text-xl font-semibold">Video List</h1>
                </div>
                {hasAnyPermission(["videos-create"]) && (
                    <Link
                        href="/apps/videos/create"
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Tambah Video
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                {(Array.isArray(videos) ? videos : []).map((video) => (
                    <div key={video.id} className="relative border p-4 bg-white">
                        <div
                            className="mb-4 rounded-lg overflow-hidden flex items-center justify-center bg-gray-200 dark:bg-gray-800 h-[200px] cursor-pointer"
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
                                    // Jika belum dimainkan, tampilkan tampilan placeholder dengan ikon play
                                    <div className="w-full h-full flex items-center justify-center relative">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <IconVideo
                                                size={48}
                                                className="text-gray-400"
                                            />
                                        </div>
                                    </div>
                                )
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconVideo
                                        size={48}
                                        className="text-gray-400"
                                    />
                                </div>
                            )}
                        </div>

                        <h3 className="font-semibold text-lg mb-2 text-left text-gray-600 dark:text-white ">
                            {video.title}
                        </h3>

                        <span className="block text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {video.source}
                        </span>

                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-grow">
                            {video.description}
                        </p>

                        {video.link && (
                            <a
                                href={video.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 dark:text-indigo-400 text-sm underline"
                            >
                                Tonton Video
                            </a>
                        )}

                        <div className="absolute -bottom-10 right-0 flex gap-2">
                            {hasAnyPermission(["videos-update"]) && (
                                <Link
                                    href={`/apps/videos/${video.id}/edit`}
                                    className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition transform hover:scale-110"
                                >
                                    <IconEdit size={16} />
                                </Link>
                            )}
                            {hasAnyPermission(["videos-delete"]) && (
                                <button
                                    onClick={() => handleDelete(video.id)}
                                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                                >
                                    <IconTrash size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

Index.layout = (page) => <AppLayout children={page} />;
