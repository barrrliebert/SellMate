import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconPackage, IconChevronLeft } from '@tabler/icons-react';
import OmzetModal from './OmzetModal';
import { Toaster } from 'react-hot-toast';

export default function Index({ products }) {
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    return (
        <>
            <Head title="Produk Unggulan" />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link 
                            href={route('apps.user.dashboard')} 
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <IconChevronLeft size={24} strokeWidth={1.5} />
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        Produk Unggulan Tefa
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {products?.map((product) => (
                            <div 
                                key={product.id} 
                                className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-[#DD661D80]"
                            >
                                <div className="p-4 flex space-x-4">
                                    <div className="flex-shrink-0 w-[111px] h-[111px] bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden border border-[#DD661D80]">
                                        {product.foto_produk ? (
                                            <img
                                                src={product.foto_produk}
                                                alt={product.nama_produk}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <IconPackage size={48} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-black dark:text-white font-[Verdana]">
                                            {product.nama_produk}
                                        </h3>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs text-black dark:text-gray-400 font-[Verdana]">
                                                {product.formatted_harga}
                                            </span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                Produk
                                            </span>
                                            <button 
                                                onClick={() => handleProductClick(product)}
                                                className="w-[68px] h-[28px] flex items-center justify-center bg-[#AA51DF] hover:bg-[#9543c5] text-white rounded-lg transition mt-3 text-xs font-[Verdana] font-light"
                                            >
                                                Tambah
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <OmzetModal 
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        product={selectedProduct}
                    />
                </div>
            </div>
        </>
    );
}

// Remove the layout to hide navbar
Index.layout = page => page 