import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { IconFileDescription, IconChevronLeft } from "@tabler/icons-react";
import InputError from "@/Components/InputError";
import Input from "@/Components/Input";
import Button from "@/Components/Button";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Edit({ article }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: "PUT",
        title: article.title,
        description: article.description,
        author: article.author,
        published_at: article.published_at ?? "",
        thumbnail: null,
    });

    const [previewThumbnail, setPreviewThumbnail] = useState(
        article.thumbnail ? `/storage/${article.thumbnail}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/apps/articles/${article.slug}`);
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
            <Head title="Edit Artikel" />

            <div className="flex items-center mb-6">
                <Link href="/apps/articles" className="mr-4">
                    <IconChevronLeft 
                        size={26} 
                        strokeWidth={1.5} 
                        className="text-gray-800 dark:text-white hover:text-[#AA51DF] transition-colors"
                    />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Artikel</h1>
                <IconFileDescription size={20} strokeWidth={1.5} className="ml-2" />
            </div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column */}
                        <div className="border border-[#D4A8EF] rounded-xl p-4 space-y-6">
                            <label className="text-2xl font-semibold text-gray-900">
                                Detail Artikel
                            </label>
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">Judul Artikel <span className="text-red-500">*</span></label>
                                <Input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    placeholder="Masukkan judul artikel"
                                    className="border-[#D4A8EF]"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">Penulis <span className="text-red-500">*</span></label>
                                <Input
                                    type="text"
                                    value={data.author}
                                    onChange={(e) => setData("author", e.target.value)}
                                    placeholder="Masukkan nama penulis"
                                    className="border-[#D4A8EF]"
                                />
                                <InputError message={errors.author} className="mt-2" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">Tanggal Terbit</label>
                                <Input
                                    type="date"
                                    value={data.published_at}
                                    onChange={(e) => setData("published_at", e.target.value)}
                                    className="border-[#D4A8EF]"
                                />
                                <InputError message={errors.published_at} className="mt-2" />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="border border-[#D4A8EF] rounded-xl p-4 space-y-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-2xl font-semibold text-gray-900">
                                    Thumbnail Artikel
                                </label>
                                <div className="border-2 border-dashed border-[#D4A8EF] rounded-lg p-4">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleThumbnailChange}
                                        className="w-full px-3 py-1.5 border border-[#D4A8EF] text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700"
                                    />
                                    <InputError message={errors.thumbnail} className="mt-2" />
                                    {previewThumbnail && (
                                        <div className="mt-4">
                                            <img
                                                src={previewThumbnail}
                                                alt="Preview Thumbnail"
                                                className="w-32 h-32 object-cover rounded-lg border border-[#D4A8EF]"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">Deskripsi Artikel <span className="text-red-500">*</span></label>
                                <div className="border border-[#D4A8EF] rounded-lg p-2">
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
                                        className="text-gray-900"
                                    />
                                </div>
                                <InputError message={errors.description} className="mt-2" />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label={processing ? "Menyimpan..." : "Simpan Perubahan"}
                            disabled={processing}
                            className="bg-[#AA51DF] hover:bg-indigo-700 disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = (page) => <AppLayout children={page} />;