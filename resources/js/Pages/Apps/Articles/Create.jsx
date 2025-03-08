import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconFileDescription } from '@tabler/icons-react';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        thumbnail: null,
        author: '',
        synopsis: '',
        link_article: '',
        file_article: null,
    });

    const [previewThumbnail, setPreviewThumbnail] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/apps/articles');
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setData('thumbnail', file);

        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewThumbnail(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('file_article', file);
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Judul Artikel */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Judul Artikel <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Masukkan judul artikel"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Penulis */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Penulis <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.author}
                                onChange={(e) => setData('author', e.target.value)}
                                placeholder="Masukkan nama penulis"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.author} className="mt-2" />
                        </div>

                        {/* Deskripsi */}
                        <div className="md:col-span-2 flex flex-col gap-2">
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
                        <div className="md:col-span-2 flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Sinopsis <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.synopsis}
                                onChange={(e) => setData('synopsis', e.target.value)}
                                placeholder="Masukkan sinopsis artikel"
                                rows="3"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.synopsis} className="mt-2" />
                        </div>

                        {/* Link Artikel */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Link Artikel <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.link_article}
                                onChange={(e) => setData('link_article', e.target.value)}
                                placeholder="Masukkan URL artikel"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.link_article} className="mt-2" />
                        </div>

                        {/* Thumbnail */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Thumbnail Artikel
                            </label>
                            <input
                                type="file"
                                onChange={handleThumbnailChange}
                                accept="image/*"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.thumbnail} className="mt-2" />
                            {previewThumbnail && (
                                <img src={previewThumbnail} alt="Thumbnail Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
                            )}
                        </div>

                        {/* File Artikel */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                File Artikel (PDF/DOCX)
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.file_article} className="mt-2" />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end bg=">
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50" label={processing ? 'Menyimpan...' : 'Simpan'} disabled={processing} />
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = page => <AppLayout children={page} />
