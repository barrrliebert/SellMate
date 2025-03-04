import React, { useState, useEffect } from 'react';
import { IconCalendar, IconPackage } from '@tabler/icons-react';
import { useForm } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import toast from 'react-hot-toast';
import QuantityInput from '@/Components/QuantityInput';

export default function OmzetModal({ isOpen, onClose, product }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [totalOmzet, setTotalOmzet] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        jumlah_omzet: '',
        tanggal: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setData('product_id', product?.id);
        } else {
            setIsAnimating(false);
            reset();
        }
    }, [isOpen, product]);

    useEffect(() => {
        if (data.jumlah_omzet && product?.harga_produk) {
            const total = data.jumlah_omzet * product.harga_produk;
            setTotalOmzet(total);
        } else {
            setTotalOmzet(0);
        }
    }, [data.jumlah_omzet, product]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Show loading toast
        const loadingToast = toast.loading('Sedang menyimpan data...');
        
        post('/apps/omzets', {
            onSuccess: () => {
                toast.dismiss(loadingToast);
                toast.success('Data omzet berhasil disimpan!');
                onClose();
                reset();
            },
            onError: () => {
                toast.dismiss(loadingToast);
                toast.error('Gagal menyimpan data. Silakan coba lagi.');
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay */}
            <div 
                className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
                    isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Sliding Content */}
            <div className={`fixed bottom-0 inset-x-0 transform transition-transform duration-300 ease-in-out ${
                isAnimating ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className="bg-white dark:bg-gray-800 rounded-t-xl p-6 w-full max-w-5xl mx-auto">
                    <div className="flex items-center gap-6">
                        {/* Product Image */}
                        <div className="w-1/4 lg:w-1/5 flex items-center justify-center">
                            <div className="w-full aspect-square rounded-lg overflow-hidden">
                                {product?.foto_produk ? (
                                    <img
                                        src={product.foto_produk}
                                        alt={product.nama_produk}
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <IconPackage size={48} className="text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="w-3/4 lg:w-4/5 space-y-4">
                            <Input
                                type="text"
                                label="Nama Produk/Jasa"
                                value={product?.nama_produk}
                                readOnly
                            />
                            <div className="space-y-1">
                                <QuantityInput
                                    label="Jumlah produk terjual"
                                    value={parseInt(data.jumlah_omzet) || 1}
                                    onChange={value => setData('jumlah_omzet', value)}
                                    min={1}
                                    errors={errors.jumlah_omzet}
                                />
                                {data.jumlah_omzet > 0 && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Omzet: {formatRupiah(totalOmzet)}
                                    </div>
                                )}
                            </div>
                            <Input
                                type="date"
                                label="Tanggal"
                                value={data.tanggal}
                                onChange={e => setData('tanggal', e.target.value)}
                                errors={errors.tanggal}
                                icon={<IconCalendar size={20} />}
                            />

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    label="Batal"
                                    variant="gray"
                                    className="flex-1 [&>span]:!block"
                                    onClick={onClose}
                                />
                                <Button
                                    type="submit"
                                    label="Simpan"
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 [&>span]:!block"
                                    disabled={processing}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
} 