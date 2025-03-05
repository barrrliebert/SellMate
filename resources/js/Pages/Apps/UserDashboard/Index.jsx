import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import ProfileEditModal from '@/Components/ProfileEditModal';
import { IconSquareRoundedPlusFilled } from '@tabler/icons-react';
import AverageRevenue from './AverageRevenue';
import TransactionRecord from './TransactionRecord';
import CommissionRecord from './CommissionRecord';
import TopRevenue from './TopRevenue';

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
            <div className="lg:py-6 relative">
                <div className="max-w-7xl mx-auto px-0 md:px-4 lg:px-6 space-y-6">
                    <AverageRevenue />
                    <TransactionRecord />
                    <CommissionRecord />
                    <TopRevenue />
                </div>

                {/* Floating Action Button - only visible on mobile */}
                <Link
                    href="/apps/user-dashboard/omzet"
                    className="md:hidden fixed bottom-6 right-6 bg-gray-300 shadow hover:bg-gray-800 text-gray-700 hover:text-white rounded-full p-3 transition-all duration-200 hover:scale-110"
                >
                    <IconSquareRoundedPlusFilled size={28} />
                </Link>

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
