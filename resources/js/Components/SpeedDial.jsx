import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { IconCategory2, IconBrandZoom, IconBook, IconLayout2, IconPackage, IconVideo, IconArticle } from '@tabler/icons-react';

export default function SpeedDial({ isUserAccess, className = '', isOpenByDefault = false, isMediumScreen = false }) {
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(isOpenByDefault);
    
    // Check if user has users-access role
    const userAccess = isUserAccess || false;
    
    // Set speedDial to open by default on component mount if isOpenByDefault is true
    useEffect(() => {
        if (isOpenByDefault) {
            setIsSpeedDialOpen(true);
        }
    }, [isOpenByDefault]);

    // Choose background color based on screen size
    const bgColor = isMediumScreen ? 'bg-[#BF7CE7]' : 'bg-purple-500';

    return (
        <div className={`relative ${className}`}>
            <div className="relative ml-2.5 mt-2">
                {/* Container with background */}
                <div className={`absolute -inset-3 ${bgColor} rounded-full transition-all duration-300 ${isSpeedDialOpen ? userAccess ? 'h-[160px]' : 'h-[240px]' : 'h-[44px]'}`}></div>
                
                {/* Speed Dial Options */}
                <div className={`absolute top-full left-0 w-full transition-all duration-200 ${isSpeedDialOpen ? 'opacity-100 translate-y-0 pt-2 pb-2' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    <div className="space-y-2 flex flex-col items-center">
                        {userAccess ? (
                            // User access menu items
                            <>
                                <Link href={route('apps.user.video')} className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                    <IconBrandZoom size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Video</span>
                                </Link>
                                <Link href={route('apps.user.article')} className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                    <IconBook size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Artikel</span>
                                </Link>
                            </>
                        ) : (
                            // Admin menu items
                            <>
                                <Link href="/apps/dashboard" className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                    <IconLayout2 size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Home</span>
                                </Link>
                                <Link href="/apps/products" className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                    <IconPackage size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Products</span>
                                </Link>
                                <Link href="/apps/videos" className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                    <IconVideo size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Videos</span>
                                </Link>
                                <Link href="/apps/articles" className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                    <IconArticle size={20} strokeWidth={1.5} />
                                    <span className="text-[10px] font-medium">Articles</span>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Main Button */}
                <button
                    onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
                    className={`relative text-white transition-all duration-200 hover:scale-110 ${isSpeedDialOpen ? 'rotate-45' : ''}`}
                >
                    <IconCategory2 size={20} strokeWidth={1.5} />
                </button>
            </div>
        </div>
    );
} 