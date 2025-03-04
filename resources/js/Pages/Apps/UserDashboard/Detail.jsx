import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconPackage, IconUser, IconChevronLeft } from '@tabler/icons-react';
import axios from 'axios';

export default function Detail({ type }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const endpoints = {
        transactions: '/apps/omzets/transaction-records',
        commissions: '/apps/omzets/commission-records',
        topOmzet: '/apps/omzets/top-omzet'
    };

    const titles = {
        transactions: 'Record Transaksi',
        commissions: 'Record Komisi',
        topOmzet: 'High Omzet'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(endpoints[type]);
                setData(type === 'topOmzet' ? response.data.top_users : 
                       type === 'transactions' ? response.data.omzets : 
                       response.data.commissions);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [type]);

    const groupDataByWeek = (items) => {
        const today = new Date();
        const groupedData = {};
        
        items.forEach(item => {
            const itemDate = new Date(item.tanggal);
            const diffTime = Math.abs(today - itemDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weekNumber = Math.ceil(diffDays / 7);
            
            if (!groupedData[weekNumber]) {
                groupedData[weekNumber] = [];
            }
            groupedData[weekNumber].push(item);
        });

        return groupedData;
    };

    const getGrade = (totalOmzet) => {
        const omzetValue = parseInt(totalOmzet.replace(/[^0-9]/g, ''));
        if (omzetValue >= 300000) return { grade: 'A', color: 'bg-green-500' };
        if (omzetValue >= 200000) return { grade: 'B', color: 'bg-blue-500' };
        if (omzetValue >= 100000) return { grade: 'C', color: 'bg-yellow-500' };
        return { grade: 'D', color: 'bg-red-500' };
    };

    const renderItem = (item, index) => {
        if (type === 'topOmzet') {
            const { grade, color } = getGrade(item.formatted_omzet);
            return (
                <div key={index} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center gap-3 w-[40%]">
                        <div className="w-12 h-12 flex-shrink-0 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            {item.avatar ? (
                                <img 
                                    src={item.avatar} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconUser size={24} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="group">
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:line-clamp-none">
                                    {item.name}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 group-hover:line-clamp-none">
                                    {item.major}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-[30%] text-center">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color} text-white`}>
                            {grade}
                        </span>
                    </div>
                    <div className="w-[30%] text-right">
                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            {item.formatted_omzet}
                        </span>
                    </div>
                </div>
            );
        } else if (type === 'transactions') {
            return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 mr-5">
                        {item.product.foto_produk ? (
                            <img 
                                src={item.product.foto_produk} 
                                alt={item.product.nama_produk}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <IconPackage size={24} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                {item.product.nama_produk}
                            </span>
                            <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                {item.formatted_omzet}
                            </span>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                            {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short'
                            })}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 mr-5">
                        {item.foto_produk ? (
                            <img 
                                src={item.foto_produk} 
                                alt={item.product}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <IconPackage size={24} className="text-gray-400" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                            <span className="text-md font-medium text-gray-700 dark:text-gray-200">
                                {item.product}
                            </span>
                            <span className="text-md font-semibold text-gray-900 dark:text-gray-100">
                                {item.komisi}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Omzet: {item.omzet}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading...
                </div>
            );
        }

        if (data.length === 0) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Tidak ada data
                </div>
            );
        }

        if (type === 'topOmzet') {
            return (
                <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
                    <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="col-span-5">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Nama
                            </span>
                        </div>
                        <div className="col-span-3 text-center">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Nilai
                            </span>
                        </div>
                        <div className="col-span-4 text-right">
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Total Omzet
                            </span>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {data.map((item, index) => renderItem(item, index))}
                    </div>
                </div>
            );
        }

        const groupedData = groupDataByWeek(data);
        return Object.entries(groupedData).map(([week, items]) => (
            <div key={week} className="mb-8">
                <div className="bg-gray-100 dark:bg-gray-800 -mx-6 px-6 py-2">
                    <h3 className="px-2 text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Minggu {week}
                    </h3>
                </div>

                <div className="space-y-4 mt-4">
                    {items.map((item, index) => renderItem(item, index))}
                </div>
            </div>
        ));
    };

    return (
        <>
            <Head title={titles[type]} />
            
            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link
                            href={route('apps.user.dashboard')}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <IconChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {titles[type]}
                        </h2>
                    </div>
                    
                    {renderContent()}
                </div>
            </div>
        </>
    );
}

// Remove the layout to hide navbar
Detail.layout = page => page 