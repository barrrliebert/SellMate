import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { IconVideo, IconChevronLeft } from '@tabler/icons-react';
import InputError from '@/Components/InputError';
import Button from '@/Components/Button';
import toast from 'react-hot-toast';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        source: '',
        video_file: null,
    });

    const [previewVideo, setPreviewVideo] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Sedang menyimpan video...');
        post('/apps/videos', {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Video berhasil ditambahkan!');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Gagal menambahkan video. Silakan coba lagi.');
            }
        });
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
            <Head title="Tambah Video" />

            <div className="flex items-center mb-6">
                <Link href="/apps/videos" className="mr-4">
                    <IconChevronLeft 
                        size={26} 
                        strokeWidth={1.5} 
                        className="text-gray-800 dark:text-white hover:text-[#AA51DF] transition-colors"
                    />
                </Link>
                        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Tambah Video</h1>
            </div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-6 p-4 bg-white dark:bg-gray-900 rounded-lg border border-[#D4A8EF]">
                            {/* Informasi video section */}
                            <label className="text-2xl font-semibold text-gray-900">
                                        Informasi Video
                                    </label>
                            
                            {/* Judul Video */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm dark:text-gray-300">
                                    Judul Video <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul video"
                                    className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 
                                    bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Deskripsi */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm dark:text-gray-300">
                                    Deskripsi Video<span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Masukkan deskripsi video"
                                    rows="4"
                                    className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 
                                    bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Sumber/Source */}
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm dark:text-gray-300">
                                    Sumber Channel <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    placeholder="Masukkan sumber video"
                                    className="w-full px-3 py-1.5 border text-sm rounded-md focus:outline-none focus:ring-0 
                                    bg-white text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800"
                                />
                                <InputError message={errors.source} className="mt-2" />
                            </div>
                        </div>

                        {/* File Video section */}
                        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-[#D4A8EF]">
                            <div className="flex flex-col gap-2">
                            <label className="text-2xl font-semibold text-gray-900">
                                        Thumbnail Video
                                    </label>
                                <div className="border-2 border-dashed border-[#D4A8EF] dark:border-gray-800 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept="video/mp4,video/x-m4v,video/*"
                                        className="hidden"
                                        id="video-upload"
                                    />
                                    <label
                                        htmlFor="video-upload"
                                        className="cursor-pointer flex flex-col items-center justify-center min-h-[200px]"
                                    >
                                        {previewVideo ? (
                                            <video controls className="w-full h-auto rounded-lg">
                                                <source src={previewVideo} type="video/mp4" />
                                                Browser tidak mendukung video.
                                            </video>
                                        ) : (
                                            <>
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
                                                <span className="mt-2 text-sm text-gray-900">drag video or search computer</span>
                                            </>
                                        )}
                                    </label>
                                    <InputError message={errors.video_file} className="mt-2" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label={processing ? 'Menyimpan...' : 'Simpan'}
                            disabled={processing}
                            className="bg-[#AA51DF] hover:bg-indigo-700 disabled:opacity-50"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Create.layout = page => <AppLayout children={page} />;