import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import ProfileEditModal from '@/Components/ProfileEditModal';
import WidgetUser from '@/Components/WidgetUser';
import { IconReceipt, IconCoin, IconTarget, IconSquareRoundedPlusFilled } from '@tabler/icons-react';

export default function Index({ user }) {
    const [showEditModal, setShowEditModal] = useState(false);

    return (
        <>
            <Head>
                <title>Dashboard Siswa</title>
                <style>{`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none !important;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none !important;
                        scrollbar-width: none !important;
                    }
                `}</style>
            </Head>
            <AppLayout>
                <div className="lg:py-8 relative">
                    <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-6 space-y-6">
                        {/* Section Rata-rata Omzet dengan widget */}
                        <section className="bg-white dark:bg-gray-800 rounded-md">
                            <div className="px-2 md:px-6 lg:py-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    Rata-rata Omzet
                                </h2>
                                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                    Rp 0
                                </div>
                                <div className="flex space-x-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:overflow-visible">
                                    <WidgetUser
                                        title={'Transaksi'}
                                        color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                                        icon={<IconReceipt size={'20'} strokeWidth={'1.5'} />}
                                        total={<><sup>Rp</sup> 1.000K</>}
                                    />
                                    <WidgetUser
                                        title={'Komisi'}
                                        color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                                        icon={<IconCoin size={'20'} strokeWidth={'1.5'} />}
                                        total={<><sup>Rp</sup> 1.000K</>}
                                    />
                                    <WidgetUser
                                        title={'Target'}
                                        color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                                        icon={<IconTarget size={'20'} strokeWidth={'1.5'} />}
                                        total={4}
                                        target={10}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Section Record Komisi */}
                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Record Transaksi
                            </h2>
                            <a href="#" className="text-indigo-600 hover:text-indigo-400 transition-colors text-sm">
                            Lihat Semua
                            </a>
                        </div>
                        {/* Card transaksi */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Cookies
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                28 Feb
                            </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Cookies
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                28 Feb
                            </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Cookies
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                28 Feb
                            </div>
                            </div>
                        </div>
                        </section>

                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Record Komisi
                            </h2>
                            <a href="#" className="text-indigo-600 hover:text-indigo-400 transition-colors text-sm">
                            Lihat Semua
                            </a>
                        </div>
                        {/* Card Komisi */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Cookies
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                28 Feb
                            </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Skincare
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                28 Feb
                            </div>
                            </div>
                        </div>
                        </section>

                        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-100">
                            Top Omzet Bulan Ini
                            </h2>
                            <a href="#" className="text-indigo-600 hover:text-indigo-400 transition-colors text-sm">
                            Lihat Semua
                            </a>
                        </div>
                        {/* Card Komisi */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Angelica
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Pemasaran
                            </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow mb-2">
                            {/* Placeholder untuk gambar (pict Cookies) */}
                            <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex-shrink-0 mr-5">
                            {/* <img src="url" alt="Cookies" className="w-full h-full object-cover" /> */}
                            </div>
                            <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                Ahmad
                                </span>
                                <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                Rp.xxxxx
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                DKV
                            </div>
                            </div>
                        </div>
                        </section>
                    </div>

                    {/* Floating Action Button - only visible on mobile */}
                    <button 
                        className="md:hidden fixed bottom-6 right-6 bg-slate-200 shadow hover:bg-slate-600 text-gray-700 hover:text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110"
                    >
                        <IconSquareRoundedPlusFilled size={34} />
                    </button>

                    <ProfileEditModal
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        user={user}
                    />
                </div>
            </AppLayout>
        </>
    );
}
