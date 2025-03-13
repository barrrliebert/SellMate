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
                                className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden"
                            >
                                <div className="p-4 flex items-center space-x-4">
                                    <div className="flex-shrink-0 h-14 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                                        {product.foto_produk ? (
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
                                    
                                    <div className="flex-1">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {product.nama_produk}
                                        </h3>
                                        <div className="flex justify-start items-center text-sm">
                                            <div>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">Harga: {product.formatted_harga}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => handleProductClick(product)}
                                        className="text-md lg:text-lg bg-gray-600 hover:bg-gray-700 text-white px-4 lg:px-8 py-1 rounded-lg transition"
                                    >
                                        Pilih
                                    </button>
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