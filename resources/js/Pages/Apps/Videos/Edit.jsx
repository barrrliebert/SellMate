import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { IconVideo, IconChevronLeft } from '@tabler/icons-react';
import InputError from '@/Components/InputError';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import toast from 'react-hot-toast';

export default function Edit({ video }) {
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        title: video.title,
        description: video.description,
        source: video.source,
        video_file: null
    });

    const [previewVideo, setPreviewVideo] = useState(video.video_file ? `/storage/${video.video_file}` : null);

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Sedang memperbarui video...');
        post(`/apps/videos/${video.id}`, {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Video berhasil diperbarui!');
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Gagal memperbarui video. Silakan coba lagi.');
            }
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('video_file', file);
        if (file && file.type.startsWith('video/')) {
            if (previewVideo && previewVideo.startsWith('blob:')) {
                URL.revokeObjectURL(previewVideo);
            }
            const url = URL.createObjectURL(file);
            // Set previewVideo dengan memaksa re-render
            setPreviewVideo(url);
        }
    };

    return (
        <>
            <Head title="Edit Video" />

            <div className="flex items-center mb-6">
                <Link href="/apps/videos" className="mr-4">
                    <IconChevronLeft 
                        size={26} 
                        strokeWidth={1.5} 
                        className="text-gray-800 dark:text-white hover:text-[#AA51DF] transition-colors"
                    />
                </Link>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Edit Video</h1>
            </div>

            <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left Column - Information */}
                        <div className="border border-[#D4A8EF] rounded-xl p-4 space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                Detail Video
                            </h2>
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">
                                    Judul Video
                                </label>
                                <Input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g videografi"
                                    className="border-[#D4A8EF] focus:border-[#D4A8EF] focus:ring-[#D4A8EF]"
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">
                                    Deskripsi Video
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="e.g Johan"
                                    rows="4"
                                    className="w-full px-3 py-1.5 border border-[#D4A8EF] text-sm rounded-md focus:outline-none focus:ring-[#D4A8EF] focus:border-[#D4A8EF] bg-white text-gray-700"
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-gray-900 text-sm">
                                    Sumber Channel
                                </label>
                                <Input
                                    type="text"
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    placeholder="e.g videografi"
                                    className="border-[#D4A8EF] focus:border-[#D4A8EF] focus:ring-[#D4A8EF]"
                                />
                                <InputError message={errors.source} className="mt-2" />
                            </div>
                        </div>

                        {/* Right Column - Video */}
                        <div className="border border-[#D4A8EF] rounded-xl p-4 space-y-6">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                File Video
                            </h2>
                            <div className="border-2 border-dashed border-[#D4A8EF] rounded-lg p-4">
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="video/*"
                                    className="w-full px-3 py-1.5 text-sm rounded-md focus:outline-none focus:ring-0 bg-white text-gray-700"
                                />
                                <InputError message={errors.video_file} className="mt-2" />
                                {previewVideo && (
                                    <div className="mt-4">
                                        <video controls className="w-full h-auto rounded-lg border border-[#D4A8EF]">
                                            <source src={previewVideo} type="video/mp4" />
                                            Browser tidak mendukung video.
                                        </video>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            type="submit"
                            label="Simpan Perubahan"
                            disabled={processing}
                            className="bg-[#AA51DF] hover:bg-opacity-90 disabled:opacity-50 px-8"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}

Edit.layout = page => <AppLayout children={page} />;