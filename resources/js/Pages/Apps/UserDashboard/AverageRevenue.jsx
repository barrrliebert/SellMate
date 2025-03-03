import React, { useState, useEffect } from 'react';
import { IconReceipt, IconCoin, IconTarget } from '@tabler/icons-react';
import WidgetUser from '@/Components/WidgetUser';
import axios from 'axios';

export default function AverageRevenue() {
    const [totalOmzet, setTotalOmzet] = useState('Rp 0');
    const [totalKomisi, setTotalKomisi] = useState('Rp 0');
    const [averageOmzet, setAverageOmzet] = useState('Rp 0');
    const [totalProducts, setTotalProducts] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [omzetRes, komisiRes, weeklyRes] = await Promise.all([
                    axios.get('/apps/omzets/user-total'),
                    axios.get('/apps/omzets/user-commission'),
                    axios.get('/apps/omzets/user-weekly-average')
                ]);
                
                setTotalOmzet(omzetRes.data.total_omzet);
                setTotalKomisi(komisiRes.data.total_komisi);
                setAverageOmzet(weeklyRes.data.average_omzet);
                setTotalProducts(weeklyRes.data.total_products);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <section className="bg-white dark:bg-gray-800 rounded-md">
            <div className="px-2 md:px-6 lg:py-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Rata-rata Omzet Minggu Ini
                </h2>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                    {averageOmzet}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Total {totalProducts} produk terjual minggu ini
                </div>
                <div className="flex space-x-2 overflow-x-auto no-scrollbar md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-1 md:overflow-visible">
                    <WidgetUser
                        title={'Transaksi'}
                        color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                        icon={<IconReceipt size={'28'} strokeWidth={'1.5'} />}
                        total={totalOmzet}
                    />
                    <WidgetUser
                        title={'Komisi'}
                        color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                        icon={<IconCoin size={'28'} strokeWidth={'1.5'} />}
                        total={totalKomisi}
                    />
                    <WidgetUser
                        title={'Target'}
                        color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                        icon={<IconTarget size={'28'} strokeWidth={'1.5'} />}
                        total={4}
                        target={10}
                    />
                </div>
            </div>
        </section>
    );
} 