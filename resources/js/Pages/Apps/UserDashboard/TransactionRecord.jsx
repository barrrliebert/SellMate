import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconPackage } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function TransactionRecord() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/apps/omzets/transaction-records');
                setTransactions(response.data.omzets.slice(0, 3));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="bg-white dark:bg-gray-900 rounded-lg border-[0.5px] border-gray-400 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl lg:text-xl font-bold text-gray-800 dark:text-gray-100">
                    Record Transaksi
                </h2>
                <Link
                    href="/apps/user-dashboard/transactions"
                    className="text-sm text-gray-800 hover:text-gray-900 dark:text-gray-200 dark:hover:text-gray-100 underline"
                >
                    Lihat semua
                </Link>
            </div>
            
            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading...
                </div>
            ) : transactions.length > 0 ? (
                <div className="space-y-2">
                    {transactions.map((transaction, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 rounded-md p-5 flex items-center hover:shadow-md transition-shadow">
                            <div className=" h-10 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0 mr-5">
                                {transaction.product.foto_produk ? (
                                    <img 
                                        src={transaction.product.foto_produk} 
                                        alt={transaction.product.nama_produk}
                                        className="w-[43px] h-[43px] object-cover"
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
                                        {transaction.product.nama_produk}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        {transaction.formatted_omzet}
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                                    {new Date(transaction.tanggal).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short'
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Belum ada transaksi
                </div>
            )}
        </section>
    );
} 