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
        router.visit(route('apps.user.dashboard'), {
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
                // Format tanggal untuk input date
                const formattedDate = response.data.target.tanggal_target ? 
                    new Date(response.data.target.tanggal_target).toISOString().split('T')[0] : '';
                
                setData({
                    judul_target: response.data.target.judul_target,
                    tanggal_target: formattedDate,
                    min_target: response.data.target.min_target || MIN_TARGET,
                    max_target: response.data.target.max_target || 1000000,
                    total_target: response.data.target.total_target || MIN_TARGET
                });
            } else {
                setData(prev => ({
                    ...prev,
                    total_target: MIN_TARGET
                }));
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
                    router.visit(route('apps.user.dashboard'));
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
                    router.visit(route('apps.user.dashboard'));
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
        return Math.max(0, Math.min(100, (current / range) * 100));
    };

    return (
        <>
            <Head>
                <title>{existingTarget ? 'Edit Target' : 'Buat Target'}</title>
            </Head>

            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            {existingTarget ? 'Sesuaikan target omzetmu' : 'Tentukan target omzetmu'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            type="text"
                            label={<span className="text-black text-base font-medium">Judul Target/Goal</span>}
                            placeholder="e.g Holiday"
                            value={data.judul_target}
                            onChange={e => setData('judul_target', e.target.value)}
                            errors={errors.judul_target}
                            className="border border-[#58177F] w-full h-[42px]"
                        />
                        <Input
                            type="date"
                            label={<span className="text-black text-base font-medium">Timeline Target</span>}
                            placeholder="e.g 30 Nov 25"
                            value={data.tanggal_target}
                            onChange={e => setData('tanggal_target', e.target.value)}
                            errors={errors.tanggal_target}
                            icon={<IconCalendar size={26} />}
                            className="border border-[#58177F] w-full h-[42px]"
                        />
                        
                        <div className="space-y-2">
                            <label className="block text-md font-medium text-black">Target Omzet</label>
                            <div className="flex justify-between gap-4">
                                <div className="w-full max-w-[48%]">
                                    <label className="block text-sm text-black mb-1">Min</label>
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
                                        className="border border-[#58177F] w-full h-[40px]"
                                    />
                                </div>
                                <div className="w-full max-w-[48%]">
                                    <label className="block text-sm text-black mb-1">Maks</label>
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
                                        className="border border-[#58177F] w-full h-[40px]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-30">
                            <div className="relative">
                                <div 
                                    className="bg-[#D4A8EF] text-white text-sm px-3 py-1 rounded-full inline-block dark:bg-purple-900 dark:text-purple-300 absolute z-10 transform -translate-x-1/2"
                                    style={{ 
                                        left: `${calculateProgress()}%`,
                                        top: '-34px'
                                    }}
                                >
                                    {formatRupiah(data.total_target)}
                                </div>
                                    <div className="h-[34px] bg-purple-100 dark:bg-purple-900/50 rounded-full overflow-hidden">
                                        <div 
                                        className="h-full bg-[#AA51DF] rounded-lg transition-all duration-150"
                                        style={{ width: `${calculateProgress()}%` }}
                                    />
                                </div>
                                <div 
                                    className="absolute top-1/2 -translate-y-1/2 w-[17px] h-[43px] bg-[#AA51DF] dark:bg-[#AA51DF] rounded-full transition-all duration-150 -translate-x-1/2 cursor-pointer"
                                    style={{ 
                                        left: `${calculateProgress()}%`,
                                        top: '50%'
                                    }}
                                />
                                <input
                                    type="range"
                                    min={data.min_target}
                                    max={data.max_target}
                                    step={1000}
                                    value={data.total_target}
                                    onChange={e => handleTargetChange(e.target.value)}
                                    className="absolute inset-0 w-full h-[34px] opacity-0 cursor-pointer"
                                />
                            </div>
                            <div className="flex justify-between mt-6">
                                <span className="text-sm text-gray-700 dark:text-gray-400">{formatRupiah(data.min_target)}</span>
                                <span className="text-sm text-gray-700 dark:text-gray-400">{formatRupiah(data.max_target)}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 mt-8">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-8 h-[40px] bg-white border border-[#AA51DF] text-black rounded-md transition-colors duration-200 hover:bg-gray-50 dark:bg-white dark:hover:bg-gray-50 dark:text-black"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 h-[40px] bg-[#AA51DF] hover:bg-[#9539D2] text-white rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#AA51DF] dark:hover:bg-[#9539D2]"
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