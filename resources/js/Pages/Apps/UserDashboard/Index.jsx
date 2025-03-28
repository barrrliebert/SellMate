import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import ProfileEditModal from '@/Components/ProfileEditModal';
import { IconPlus, IconTarget, IconCoin } from '@tabler/icons-react';
import AverageRevenue from './AverageRevenue';
import TransactionRecord from './TransactionRecord';
import CommissionRecord from './CommissionRecord';
import TopRevenue from './TopRevenue';
import TargetProgress from './TargetProgress';

export default function Index({ user }) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

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
            <div className="lg:py-6 relative">
                <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-6 space-y-6">
                    <AverageRevenue />
                    <div className="mx-auto px-4 lg:px-0 space-y-6">
                        <TargetProgress />
                        <TopRevenue />
                        <TransactionRecord />
                        <CommissionRecord />
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
                                <img 
                                src="/images/target-button.svg" 
                                alt="Target Icon" 
                                className="w-8 h-8" 
                            />
                            </Link>
                            <Link
                                href="/apps/user-dashboard/omzet"
                                className="flex items-center gap-2 bg-purple-700 text-white p-2.5 rounded-full shadow-lg hover:bg-purple-800 transition-colors"
                            >
                                <img 
                                src="/images/add-omzet.svg" 
                                alt="Omzet Icon" 
                                className="w-8 h-8" 
                            />
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

                <ProfileEditModal
                    show={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    user={user}
                />
            </div>
        </>
    );
}

Index.layout = page => <AppLayout children={page}/>
