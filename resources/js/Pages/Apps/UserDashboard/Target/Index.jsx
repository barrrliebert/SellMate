import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconArrowLeft, IconTarget, IconEdit, IconTrash, IconPlus, IconCoin } from '@tabler/icons-react';
import axios from 'axios';

export default function Index() {
    const [target, setTarget] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

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
                            <IconArrowLeft className="text-black" size={24} />
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
                    <Link 
                        href={route('apps.user.dashboard')} 
                        className="text-black hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 inline-block mb-4"
                    >
                        <IconArrowLeft size={24} strokeWidth={1.5} />
                    </Link>
                    <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-8">
                        Satu langkah untuk capai targetmu, Mate
                    </h1>

                    {/* Rest of the component content */}
                    {loading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            Loading...
                        </div>
                    ) : !target ? (
                        <div className="text-center py-8">
                            <img 
                                src="/images/target.svg" 
                                alt="Target Icon" 
                                className="w-12 h-12 mx-auto mb-4" 
                            />
                            <p className="text-gray-500">Belum ada target yang dibuat</p>
                            <Link
                                href={route('apps.user.target.edit')}
                                className="inline-block mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Buat Target
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#58177F1A] dark:bg-gray-800 rounded-lg p-4">
                                {/* Existing target content */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-black text-xl font-['Verdana']">
                                            {target.progress_percentage >= 100 ? 'Target tercapai!' : target.judul_target}
                                        </h2>
                                        <h3 className="text-gray-900 dark:text-gray-300">
                                            {new Date(target.tanggal_target).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                        </h3>
                                    </div>
                                    <div>
                                        <img 
                                            src="/images/target.svg" 
                                            alt="Target Icon" 
                                            className="w-20 h-20 text-gray-800 dark:text-gray-400" 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-2">
                                        <span className="text-md text-black font-['Verdana']">
                                            Target Omzet
                                        </span>
                                        <div className="mt-1">
                                            <span className="text-2xl font-semibold text-gray-900 dark:text-gray-300">
                                                {target.formatted_total_target}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="relative mb-3">
                                        <div className="w-full h-8 bg-[#58177F40] rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full relative transition-all duration-500 ${
                                                    target.progress_percentage >= 100 ? 'bg-green-500' : 'bg-[#58177F80]'
                                                }`}
                                                style={{ width: `${target.progress_percentage}%` }}
                                            >
                                                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white">
                                                    {target.progress_percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between">
                                        <span className="text-gray-900 dark:text-gray-300">
                                            {target.formatted_current_omzet}
                                        </span>
                                        <span className="text-gray-900 dark:text-gray-300">
                                            {target.formatted_total_target}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Action Buttons - moved outside container */}
                            <div className="flex justify-end mt-2 space-x-2">
                                <button className="p-2">
                                    <img 
                                        src="/images/delete.svg" 
                                        alt="Delete Icon" 
                                        className="w-[30px] h-[30px]"
                                    />
                                </button>
                                <div className="w-px h-6 bg-gray-600 dark:bg-gray-400 self-center"></div>
                                <Link href={route('apps.user.target.edit')} className="p-2">
                                    <img 
                                        src="/images/edit.svg" 
                                        alt="Edit Icon" 
                                        className="w-[30px] h-[30px]"
                                    />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Speed Dial - only visible on mobile */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="relative">
                    {/* Speed Dial Options */}
                    <div className={`absolute bottom-full right-0 mb-4 space-y-2 transition-all duration-200 ${isSpeedDialOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <Link
                            href="/apps/user-dashboard/target/edit"
                            className="flex items-center gap-2 bg-purple-700 text-white p-2.5 rounded-full shadow-lg hover:bg-purple-800 transition-colors"
                        >
                            <IconTarget size={32} />
                        </Link>
                        <Link
                            href="/apps/user-dashboard/omzet"
                            className="flex items-center gap-2 bg-purple-700 text-white p-2.5 rounded-full shadow-lg hover:bg-purple-800 transition-colors"
                        >
                            <IconCoin size={32} />
                        </Link>
                    </div>

                    {/* Main Button */}
                    <button
                        onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
                        className={`bg-purple-500 shadow hover:bg-purple-800 text-white hover:text-white rounded-full p-3 transition-all duration-200 hover:scale-110 ${isSpeedDialOpen ? 'bg-purple-800 text-white rotate-45' : ''}`}
                    >
                        <IconPlus size={28} />
                    </button>
                </div>
            </div>
        </>
    );
}

// Remove the layout to hide navbar
Index.layout = page => page 