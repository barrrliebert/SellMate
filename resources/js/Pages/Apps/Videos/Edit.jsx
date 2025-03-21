import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { IconVideo } from '@tabler/icons-react';
import InputError from '@/Components/InputError';
import Input from '@/Components/Input';
import Button from '@/Components/Button';

export default function Edit({ video }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: video.title,
        description: video.description,
        source: video.source,
        video_file: null,
    });

    const [previewVideo, setPreviewVideo] = useState(video.video_file);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/apps/videos/${video.id}`);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('video_file', file);
        if (file && file.type.startsWith('video/')) {
            const url = URL.createObjectURL(file);
            setPreviewVideo(url);
        }
    };

    return (
        <>
            <Head title="Edit Video" />

            <div className="flex items-center mb-6">
                <IconVideo size={20} strokeWidth={1.5} className="mr-2" />
                <h1 className="text-xl font-semibold">Edit Video</h1>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        {/* Judul Video */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Judul Video <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Masukkan judul video"
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        {/* Sumber/Source */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Sumber <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="text"
                                value={data.source}
                                onChange={(e) => setData('source', e.target.value)}
                                placeholder="Masukkan sumber video"
                            />
                            <InputError message={errors.source} className="mt-2" />
                        </div>

                        {/* Deskripsi */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                Deskripsi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Masukkan deskripsi video"
                                rows="4"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        {/* File Video */}
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-600 text-sm dark:text-gray-300">
                                File Video (Upload video baru jika ingin mengganti)
                            </label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="video/*"
                                className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                            />
                            <InputError message={errors.video_file} className="mt-2" />
                            {previewVideo && (
                                <div className="mt-4">
                                    <video controls className="w-64 h-auto rounded-lg">
                                        <source src={previewVideo} type="video/mp4" />
                                        Browser tidak mendukung video.
                                    </video>
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
