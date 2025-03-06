import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconUser } from '@tabler/icons-react';
import { Link } from '@inertiajs/react';

export default function TopRevenue() {
    const [topUsers, setTopUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const getGrade = (totalOmzet) => {
        const omzetValue = parseInt(totalOmzet.replace(/[^0-9]/g, ''));
        if (omzetValue >= 300000) return { grade: 'A', color: 'bg-green-500' };
        if (omzetValue >= 200000) return { grade: 'B', color: 'bg-blue-500' };
        if (omzetValue >= 100000) return { grade: 'C', color: 'bg-yellow-500' };
        return { grade: 'D', color: 'bg-red-500' };
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/apps/omzets/top-omzet');
                setTopUsers(response.data.top_users.slice(0, 3));
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
                    Top Omzet Bulan Ini
                </h2>
                <Link
                    href="/apps/user-dashboard/top-omzet"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    Lihat semua
                </Link>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Loading...
                </div>
            ) : topUsers.length > 0 ? (
                <div className="space-y-2">
                    {topUsers.map((user, index) => {
                        const { grade, color } = getGrade(user.formatted_omzet);
                        return (
                            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm p-5 flex items-center hover:shadow-md transition-shadow">
                                <div className="relative">
                                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${color} text-white text-xs font-bold px-2 py-0.5 rounded-full`}>
                                        {grade}
                                    </div>
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0 mr-5">
                                        {user.avatar ? (
                                            <img 
                                                src={user.avatar} 
                                                alt={user.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <IconUser size={24} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center">
                                        <div className="min-w-0 max-w-[60%]">
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 block truncate group hover:text-clip hover:whitespace-normal hover:overflow-visible">
                                                {user.name}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate block">
                                                {user.major}
                                            </span>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 pl-2">
                                            {user.formatted_omzet}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                    Belum ada data omzet
                </div>
            )}
        </section>
    );
} 