import React, { useState, useEffect } from 'react';
import { IconReceipt, IconCoin } from '@tabler/icons-react';
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
                    axios.get('/apps/omzets/user-weekly-average'),
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
        <section className=" dark:md:bg-gray-900 md:rounded-lg md:shadow-md md:p-6 bg-gradient-to-r from-[#EDA375] to-[#D4A8EF] rounded-b-[35px] shadow-lg">
            <div className="px-5 pb-4 pt-3 md:p-0">
                <h2 className="text-2xl font-bold text-white  md:dark:text-gray-100 mb-1">
                    Rata-rata Omzet
                </h2>
                <div className="text-4xl font-bold text-white  md:dark:text-gray-100 mb-3">
                    {averageOmzet}
                </div>
                <div className="text-sm text-white/80  md:dark:text-gray-400 mb-3">
                    Total {totalProducts} produk terjual minggu ini
                </div>
                <div className="flex justify-between gap-3">
                    <WidgetUser
                        title={'Transaksi'}
                        color={'text-gray-700 dark:md:bg-gray-800 dark:md:text-gray-200'}
                        icon={<IconReceipt size={'28'} strokeWidth={'1.5'} />}
                        total={totalOmzet}
                        className="w-full"
                    />
                    <WidgetUser
                        title={'Komisi'}
                        color={'text-gray-700 dark:md:bg-gray-800 dark:md:text-gray-200'}
                        icon={<IconCoin size={'28'} strokeWidth={'1.5'} />}
                        total={totalKomisi}
                        className="w-full"
                    />
                </div>
            </div>
        </section>
    );
} 