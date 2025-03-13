import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm } from "@inertiajs/react";
import { IconFileDescription } from "@tabler/icons-react";
import InputError from "@/Components/InputError";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css"; // Tambahkan jika ingin mode minimalis

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
        post("/apps/articles");
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
                <IconFileDescription size={20} strokeWidth={1.5} className="mr-2" />
                <h1 className="text-xl font-semibold">Tambah Artikel</h1>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Judul Artikel */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
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
                            <label className="text-gray-600 text-sm dark:text-gray-300">
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

                        {/* Deskripsi (Quill) */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Deskripsi <span className="text-red-500">*</span>
                            </label>
                            <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-2">
                                <ReactQuill
                                    value={data.description}
                                    onChange={(content) => setData("description", content)}
                                    theme="snow" // Bisa diganti ke "bubble" untuk tampilan minimalis
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

                        {/* Tanggal Publikasi */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Tanggal Publikasi
                            </label>
                            <Input
                                type="date"
                                value={data.published_at}
                                onChange={(e) => setData("published_at", e.target.value)}
                            />
                            <InputError message={errors.published_at} className="mt-2" />
                        </div>

                        {/* Thumbnail */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Thumbnail Artikel
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                            {previewThumbnail && (
                                <div className="mt-4">
                                    <img
                                        src={previewThumbnail}
                                        alt="Preview Thumbnail"
                                        className="w-32 h-32 object-cover rounded-lg"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label={processing ? "Menyimpan..." : "Simpan"}
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = (page) => <AppLayout children={page} />;
