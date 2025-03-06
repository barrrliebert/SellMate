import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconChevronLeft, IconTarget, IconEdit, IconTrash } from '@tabler/icons-react';
import axios from 'axios';

export default function Index() {
    const [target, setTarget] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const response = await axios.get('/apps/targets/current');
                setTarget(response.data.target);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching target:', error);
                setLoading(false);
            }
        };

        fetchTarget();
    }, []);

    if (loading) {
        return (
            <>
                <Head>
                    <title>Target Penjualan</title>
                </Head>
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <p className="text-gray-500">Loading...</p>
                </div>
            </>
        );
    }

    if (!target) {
        return (
            <>
                <Head>
                    <title>Target Penjualan</title>
                </Head>
                <div className="min-h-screen bg-white p-4">
                    <div className="flex items-center mb-6">
                        <Link href={route('apps.user.dashboard')}>
                            <IconChevronLeft className="text-gray-600" size={24} />
                        </Link>
                    </div>
                    <div className="text-center py-8">
                        <IconTarget size={48} className="text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Belum ada target yang dibuat</p>
                        <Link
                            href={route('apps.user.target.edit')}
                            className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Buat Target
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Target Penjualan</title>
            </Head>

            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link 
                            href={route('apps.user.dashboard')} 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <IconChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Target Penjualan
                        </h1>
                    </div>

                    {/* Rest of the component content */}
                    {loading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            Loading...
                        </div>
                    ) : !target ? (
                        <div className="text-center py-8">
                            <IconTarget size={48} className="text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Belum ada target yang dibuat</p>
                            <Link
                                href={route('apps.user.target.edit')}
                                className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Buat Target
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                            {/* Existing target content */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-gray-700 dark:text-gray-200 font-medium">
                                        {target.progress_percentage >= 100 ? 'Target tercapai!' : 'Satu langkah untuk capai'}
                                    </h2>
                                    <h3 className="text-gray-700 dark:text-gray-300">
                                        targetmu, Mate
                                    </h3>
                                </div>
                                <div>
                                    <IconTarget size={24} className="text-gray-600 dark:text-gray-400" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Omzet
                                    </span>
                                </div>
                                <div className="flex justify-between mb-3">
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {target.formatted_current_omzet}
                                    </span>
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {target.formatted_total_target}
                                    </span>
                                </div>

                                <div className="relative">
                                    <div className="w-full h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full relative transition-all duration-500 ${
                                                target.progress_percentage >= 100 ? 'bg-green-500' : 'bg-purple-400'
                                            }`}
                                            style={{ width: `${target.progress_percentage}%` }}
                                        >
                                            <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                                                {target.progress_percentage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end mt-8 space-x-2">
                                <button className="p-2">
                                    <IconTrash size={30} className="text-gray-600 dark:text-gray-400" />
                                </button>
                                <div className="w-px h-6 bg-gray-600 dark:bg-gray-400 self-center"></div>
                                <Link href={route('apps.user.target.edit')} className="p-2">
                                    <IconEdit size={30} className="text-gray-600 dark:text-gray-400" />
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

// Remove the layout to hide navbar
Index.layout = page => page 