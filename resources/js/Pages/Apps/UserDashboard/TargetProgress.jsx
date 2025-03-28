import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

export default function TargetProgress() {
    const [targetProgress, setTargetProgress] = useState(0);
    const [currentOmzet, setCurrentOmzet] = useState('');
    const [targetOmzet, setTargetOmzet] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/apps/targets/current');
                if (response.data.target) {
                    setTargetProgress(response.data.target.progress_percentage);
                    setCurrentOmzet(response.data.target.formatted_current_omzet);
                    setTargetOmzet(response.data.target.formatted_total_target);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Link href={route('apps.user.target')}>
            <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-md p-5">
                <div className="flex gap-4">
                    <div className="p-2 rounded-full bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200 h-fit">
                        <img 
                            src="/images/target.svg" 
                            alt="Target Icon" 
                            className="w-[50px] h-[50px]"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="text-sm text-gray-800 dark:text-gray-400">
                                    Target Omzet
                                </div>
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                {targetProgress}%
                            </div>
                        </div>

                        <div className="relative">
                            <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full relative transition-all duration-500 ${
                                        targetProgress >= 100 ? 'bg-green-500' : 'bg-purple-400'
                                    }`}
                                    style={{ width: `${targetProgress}%` }}
                                >
                                </div>
                            </div>
                        </div> 
                        <div className="flex justify-between text-xs mt-3">
                            <span className="text-gray-700 dark:text-gray-300">
                                {currentOmzet}
                            </span>
                            <span className="text-gray-700 dark:text-gray-300">
                                {targetOmzet}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
} 