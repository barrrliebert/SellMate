import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconPackage } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function CommissionRecord() {
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/apps/omzets/commission-records');
                setCommissions(response.data.commissions.slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-gray-100">
                    Record Komisi
                </h2>
                <Link
                    href="/apps/user-dashboard/commissions"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Lihat semua
                </Link>
            </div>
            
            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading...
                </div>
            ) : commissions.length > 0 ? (
                <div className="space-y-2">
                    {commissions.map((commission, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow">
                            <div className=" h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 mr-5">
                                {commission.foto_produk ? (
                                    <img 
                                        src={commission.foto_produk} 
                                        alt={commission.product}
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
                                        {commission.product}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {commission.komisi}
                                    </span>
                                </div>
                                <div className="flex justify-end items-center">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {new Date(commission.tanggal).toLocaleDateString('id-ID', {
                                            day: 'numeric',
                                            month: 'short'
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Belum ada komisi
                </div>
            )}
        </section>
    );
} 