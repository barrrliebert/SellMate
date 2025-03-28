import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { IconFileDescription, IconChevronLeft } from "@tabler/icons-react";
import InputError from "@/Components/InputError";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css"; // Tambahkan jika ingin mode minimalis
import toast from "react-hot-toast";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        author: "",
        description: "",
        published_at: "",
        thumbnail: null,
    });

    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Sedang menyimpan artikel...');
        post('/apps/articles', {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Artikel berhasil ditambahkan!');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Gagal menambahkan artikel. Silakan coba lagi.');
            }
        });
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setData("thumbnail", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <>
            <Head title="Tambah Artikel" />

            <div className="flex items-center mb-6">
                <Link href="/apps/articles" className="mr-4">
                    <IconChevronLeft 
                        size={26} 
                        strokeWidth={1.5} 
                        className="text-gray-800 dark:text-white hover:text-[#AA51DF] transition-colors"
                    />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tambah Artikel</h1>
                <IconFileDescription size={20} strokeWidth={1.5} className="ml-2" />
            </div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Left Column - Informasi video */}
                        <div className="border border-[#D4A8EF] dark:border-[#D4A8EF] rounded-xl p-4">
                            <div className="space-y-6">
                            <label className="text-2xl font-semibold text-gray-900">
                                        Informasi Artikel
                        </label>
                                {/* Judul Artikel */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">
                                        Judul Artikel <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        placeholder="Masukkan judul artikel"
                                    />
                                    <InputError message={errors.title} className="mt-2" />
                                </div>

                                {/* Penulis */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">
                                        Penulis <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.author}
                                        onChange={(e) => setData("author", e.target.value)}
                                        placeholder="Masukkan nama penulis"
                                    />
                                    <InputError message={errors.author} className="mt-2" />
                                </div>

                                {/* Tanggal Publikasi */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">
                                        Tanggal Terbit
                                    </label>
                                    <Input
                                        type="date"
                                        value={data.published_at}
                                        onChange={(e) => setData("published_at", e.target.value)}
                                    />
                                    <InputError message={errors.published_at} className="mt-2" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Thumbnail & Deskripsi */}
                        <div className="border border-[#D4A8EF] dark:border-[#D4A8EF] rounded-xl p-4">
                            <div className="space-y-6">
                                {/* Thumbnail */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-2xl font-semibold text-gray-900">
                                        Thumbnail Artikel
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleThumbnailChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                        />
                                        <div className="border-2 border-dashed border-[#D4A8EF] dark:border-[#D4A8EF] rounded-xl p-6 text-center">
                                            {previewThumbnail ? (
                                                <img
                                                    src={previewThumbnail}
                                                    alt="Preview Thumbnail"
                                                    className="w-32 h-32 object-cover rounded-lg mx-auto"
                                                />
                                            ) : (
                                                <div className="space-y-2">
                                                    <svg 
                                                        className="mx-auto h-20 w-20 text-gray-900" 
                                                        stroke="currentColor" 
                                                        fill="none" 
                                                        viewBox="0 0 48 48" 
                                                        aria-hidden="true"
                                                    >
                                                        <path 
                                                            strokeLinecap="round" 
                                                            strokeLinejoin="round" 
                                                            strokeWidth={2} 
                                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                                        />
                                                    </svg>
                                                    <div className="text-sm text-gray-900 dark:text-gray-400">
                                                        <span>drag image or search computer</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <InputError message={errors.thumbnail} className="mt-2" />
                                    </div>
                                </div>

                                {/* Deskripsi */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">
                                        Deskripsi Artikel <span className="text-red-500">*</span>
                                    </label>
                                    <div className="bg-white dark:bg-gray-800 border border-[#D4A8EF] dark:border-[#D4A8EF] rounded-md p-2">
                                        <ReactQuill
                                            value={data.description}
                                            onChange={(content) => setData("description", content)}
                                            theme="snow"
                                            modules={{
                                                toolbar: [
                                                    [{ header: [1, 2, false] }],
                                                    ["bold", "italic", "underline"],
                                                    [{ list: "ordered" }, { list: "bullet" }],
                                                    ["link", "image"],
                                                    [{ align: [] }],
                                                    [{ color: [] }, { background: [] }],
                                                ],
                                            }}
                                            className="text-gray-900 dark:text-gray-100"
                                        />
                                    </div>
                                    <InputError message={errors.description} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label={processing ? "Menyimpan..." : "Simpan"}
                            disabled={processing}
                            className="bg-[#AA51DF] hover:bg-indigo-700 disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <AppLayout children={page} />;