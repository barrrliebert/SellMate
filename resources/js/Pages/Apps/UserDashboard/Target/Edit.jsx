import React, { useState, useEffect } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { IconCalendar, IconChevronLeft } from '@tabler/icons-react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Edit() {
    const [existingTarget, setExistingTarget] = useState(null);
    const [loading, setLoading] = useState(true);
    const MIN_TARGET = 100000;

    const { data, setData, post, put, processing, errors } = useForm({
        judul_target: '',
        tanggal_target: '',
        min_target: MIN_TARGET,
        max_target: 1000000,
        total_target: MIN_TARGET
    });

    const handleTargetChange = (value) => {
        const numValue = parseInt(value) || MIN_TARGET;
        if (numValue >= data.min_target && numValue <= data.max_target) {
            setData('total_target', numValue);
        }
    };

    const handleCancel = () => {
        router.visit(route('apps.user.target'), {
            preserveState: false,
            preserveScroll: false
        });
    };

    useEffect(() => {
        const fetchTarget = async () => {
            try {
                const response = await axios.get('/apps/targets/current');
                if (response.data.target) {
                    setExistingTarget(response.data.target);
                    setData({
                        judul_target: response.data.target.judul_target,
                        tanggal_target: response.data.target.tanggal_target,
                        min_target: response.data.target.min_target || MIN_TARGET,
                        max_target: response.data.target.max_target || 1000000,
                        total_target: response.data.target.total_target
                    });
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching target:', error);
                setLoading(false);
            }
        };

        fetchTarget();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const loadingToast = toast.loading('Menyimpan target...');

        if (existingTarget) {
            put(`/apps/targets/${existingTarget.id}`, {
                onSuccess: () => {
                    toast.dismiss(loadingToast);
                    toast.success('Target berhasil diperbarui!');
                    window.location.href = route('apps.user.target');
                },
                onError: () => {
                    toast.dismiss(loadingToast);
                    toast.error('Gagal memperbarui target. Silakan coba lagi.');
                }
            });
        } else {
            post('/apps/targets', {
                onSuccess: () => {
                    toast.dismiss(loadingToast);
                    toast.success('Target berhasil dibuat!');
                    window.location.href = route('apps.user.target');
                },
                onError: () => {
                    toast.dismiss(loadingToast);
                    toast.error('Gagal membuat target. Silakan coba lagi.');
                }
            });
        }
    };

    if (loading) {
        return (
            <>
                <Head>
                    <title>{existingTarget ? 'Edit Target' : 'Buat Target'}</title>
                </Head>
                <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </>
        );
    }

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const calculateProgress = () => {
        const range = data.max_target - data.min_target;
        const current = data.total_target - data.min_target;
        return (current / range) * 100;
    };

    return (
        <>
            <Head>
                <title>{existingTarget ? 'Edit Target' : 'Buat Target'}</title>
            </Head>

            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link 
                            href={route('apps.user.target')} 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <IconChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {existingTarget ? 'Edit target omzetmu' : 'Tentukan target omzetmu'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="text"
                            label="Judul Target/Goal"
                            placeholder="e.g Holiday"
                            value={data.judul_target}
                            onChange={e => setData('judul_target', e.target.value)}
                            errors={errors.judul_target}
                        />
                        <Input
                            type="date"
                            label="Timeline Target"
                            placeholder="e.g 30 Nov 25"
                            value={data.tanggal_target}
                            onChange={e => setData('tanggal_target', e.target.value)}
                            errors={errors.tanggal_target}
                            icon={<IconCalendar size={20} />}
                        />
                        
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Target Omzet</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Min</label>
                                    <Input
                                        type="text"
                                        placeholder="e.g Rp 100.000"
                                        value={data.min_target}
                                        onChange={e => {
                                            const value = parseInt(e.target.value.replace(/\D/g, '')) || MIN_TARGET;
                                            setData(prev => ({
                                                ...prev,
                                                min_target: value,
                                                total_target: Math.max(value, prev.total_target)
                                            }));
                                        }}
                                        errors={errors.min_target}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Maks</label>
                                    <Input
                                        type="text"
                                        placeholder="e.g Rp 1.000.000"
                                        value={data.max_target}
                                        onChange={e => {
                                            const value = parseInt(e.target.value.replace(/\D/g, '')) || MIN_TARGET;
                                            setData(prev => ({
                                                ...prev,
                                                max_target: value,
                                                total_target: Math.min(value, prev.total_target)
                                            }));
                                        }}
                                        errors={errors.max_target}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <div className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full inline-block dark:bg-purple-900 dark:text-purple-300">
                                    {formatRupiah(data.total_target)}
                                </div>
                                <div className="relative mt-2">
                                    <div className="h-4 bg-purple-100 dark:bg-purple-900/50 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-purple-500 rounded-full transition-all duration-150"
                                            style={{ width: `${calculateProgress()}%` }}
                                        />
                                    </div>
                                    <div 
                                        className="absolute top-1/2 -translate-y-1/2 w-3 h-8 bg-purple-600 dark:bg-purple-400 rounded-full transition-all duration-150 -translate-x-1/2 cursor-pointer"
                                        style={{ left: `${calculateProgress()}%` }}
                                    />
                                    <input
                                        type="range"
                                        min={data.min_target}
                                        max={data.max_target}
                                        step={1000}
                                        value={data.total_target}
                                        onChange={e => handleTargetChange(e.target.value)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex justify-between mt-1">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatRupiah(data.min_target)}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatRupiah(data.max_target)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-8">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200"
                            >
                                Batalkan
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:hover:bg-gray-600"
                            >
                                {existingTarget ? 'Perbarui' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

// Remove the layout to hide navbar
Edit.layout = page => page 