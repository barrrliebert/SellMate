import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconFileDescription } from '@tabler/icons-react';
import InputError from '@/Components/InputError';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function Edit({ article }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: article.title,
        description: article.description,
        author: article.author,
        synopsis: article.synopsis,
        link_article: article.link_article,
        file_article: null,
        thumbnail: null, // Tambahkan thumbnail
    });

    const [previewFile, setPreviewFile] = useState(article.file_article);
    const [previewThumbnail, setPreviewThumbnail] = useState(
        article.thumbnail ? `/storage/${article.thumbnail}` : null
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/apps/articles/${article.id}`);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('file_article', file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFile(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setData('thumbnail', file);

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
                <IconFileDescription size={20} strokeWidth={1.5} className="mr-2" />
                <h1 className="text-xl font-semibold">Edit Artikel</h1>
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
                                onChange={(e) => setData('title', e.target.value)}
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
                                onChange={(e) => setData('author', e.target.value)}
                                placeholder="Masukkan nama penulis"
                            />
                            <InputError message={errors.author} className="mt-2" />
                        </div>

                        {/* Deskripsi */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Deskripsi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Masukkan deskripsi artikel"
                                rows="4"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* Sinopsis */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Sinopsis <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.synopsis}
                                onChange={(e) => setData('synopsis', e.target.value)}
                                placeholder="Masukkan sinopsis artikel"
                                rows="3"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white border-gray-200 text-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.synopsis} className="mt-2" />
                        </div>

                        {/* Link Artikel */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Link Artikel
                            </label>
                            <Input
                                type="text"
                                value={data.link_article}
                                onChange={(e) => setData('link_article', e.target.value)}
                                placeholder="Masukkan URL artikel"
                            />
                            <InputError message={errors.link_article} className="mt-2" />
                        </div>

                        {/* File Artikel */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                File Artikel (Dokumen / PDF)
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.file_article} className="mt-2" />
                            {previewFile && (
                                <div className="mt-4">
                                    <a href={previewFile} target="_blank" className="text-indigo-600 underline">
                                        Lihat File Artikel
                                    </a>
                                </div>
                            )}
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
                            label={processing ? 'Menyimpan...' : 'Simpan Perubahan'}
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = page => <AppLayout children={page} />;
