import React, { useState, useEffect } from 'react';
import { IconCalendar, IconPackage } from '@tabler/icons-react';
import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import Input from '@/Components/Input';
import Button from '@/Components/Button';
import toast from 'react-hot-toast';
import QuantityInput from '@/Components/QuantityInput';

export default function OmzetModal({ isOpen, onClose, product }) {
    const [isAnimating, setIsAnimating] = useState(false);
    const [totalOmzet, setTotalOmzet] = useState(0);
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: '',
        jumlah_omzet: 1,
        tanggal: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            setData({
                product_id: product?.id,
                jumlah_omzet: 1,
                tanggal: new Date().toISOString().split('T')[0]
            });
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
                router.visit('/apps/user-dashboard');
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
                <div className="bg-white rounded-t-xl p-6 w-full h-[680px] mx-auto">
                    {/* Title and Illustration */}
                    <div className="text-left">
                        <h2 className="text-xl font-medium">Simpan dan catat omzetmu</h2>
                        <img 
                            src="/images/popup-add.png" 
                            alt="popup-add" 
                            className="w-[223px] h-[223px] mx-auto mb-1"
                        />
                    </div>

                    {/* Form Container with Border */}
                    <div className="border-2 border-[#DD661D66] rounded-lg p-4 mb-4">
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
                            <div className="w-3/4 lg:w-4/5 space-y-2">
                                <Input
                                    type="text"
                                    label={<span className="text-black">Nama Produk/Jasa</span>}
                                    value={product?.nama_produk}
                                    readOnly
                                    className="!border !border-[#DD661D66]"
                                />
                                <div className="space-y-1">
                                    <QuantityInput
                                        label={<span className="text-black">Jumlah produk terjual</span>}
                                        value={parseInt(data.jumlah_omzet) || 1}
                                        onChange={value => setData('jumlah_omzet', value)}
                                        min={1}
                                        errors={errors.jumlah_omzet}
                                        className="h-10 w-full shadow-sm"
                                    />
                                    {data.jumlah_omzet > 0 && (
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-black">Total Omzet</label>
                                            <div className="border border-[#DD661D66] rounded-lg px-3 py-2 bg-white">
                                                <span className="text-sm text-black">
                                                    {formatRupiah(totalOmzet)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Input
                                    type="date"
                                    label={<span className="text-black">Tanggal</span>}
                                    value={data.tanggal}
                                    onChange={e => setData('tanggal', e.target.value)}
                                    errors={errors.tanggal}
                                    icon={<IconCalendar size={20} />}
                                    className="!border !border-[#DD661D66]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Buttons outside border */}
                    <form onSubmit={handleSubmit}>
                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                label="Batal"
                                variant="gray"
                                className="w-[118px] h-[40px] flex items-center justify-center [&>span]:!block border border-[#AA51DF]"
                                onClick={onClose}
                            />
                            <Button
                                type="submit"
                                label="Simpan"
                                className="w-[118px] h-[40px] bg-[#AA51DF] hover:bg-indigo-700 flex items-center justify-center [&>span]:!block"
                                disabled={processing}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 