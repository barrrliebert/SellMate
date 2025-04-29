import React from 'react';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth }) {
    const handleStart = () => {
        if (auth?.user) {
            // Debug role
            console.log('User roles:', auth.user.roles);
            
            // Cek apakah user memiliki role 'users-access'
            const hasUserAccess = auth.user.roles.some(role => role.name === 'users-access');
            
            if (hasUserAccess) {
                router.get(route('apps.user.dashboard'));
            } else {
                router.get(route('apps.dashboard'));
            }
        } else {
            router.get(route('admin.login'));
        }
    };

    return (
        <>
            <Head title="SellMate" />

            <div className="min-h-screen relative bg-white">
                {/* Left Content */}
                <div className="min-h-screen flex items-center relative z-10">
                    <div className="container mx-auto px-6 lg:px-12">
                        <div className="lg:w-1/2">
                            <div className="lg:-mt-40">
                                <h1 className="text-4xl font-bold text-gray-900 mb-10 lg:text-5xl">
                                    Sellmate
                                </h1>
                                <h2 className="text-3xl font-bold text-gray-900 leading-tight mb-8 lg:text-4xl">
                                    Produk terdata,<br />
                                    pendapatan tefa tertata<br />
                                    bersama SellMate
                                </h2>
                                <button
                                    onClick={handleStart}
                                    className="inline-block bg-[#DD661D] text-white px-8 text-center w-1/2 py-3 rounded-lg text-lg font-medium hover:bg-[#BB551A] transition-colors"
                                >
                                    Mulai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Image - Hidden on mobile, Full height on desktop */}
                <div className="hidden lg:block absolute top-0 right-0 w-1/2 h-full">
                    <img 
                        src="/images/onboard-admin.png" 
                        alt="Dashboard Illustration" 
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </>
    );
}

Index.layout = page => page; 