import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react';
import { IconAlignLeft, IconMoon, IconSun } from '@tabler/icons-react'
import AuthDropdown from '@/Components/AuthDropdown';
import Menu from '@/Utils/Menu';
import Notification from '@/Components/Notification';

export default function Navbar({ toggleSidebar, themeSwitcher, darkMode }) {
    // Destruct auth dari props
    const { auth } = usePage().props;

    // Ambil menu dari utils
    const menuNavigation = Menu();

    // Buat array baru dari menu navigasi
    const links = menuNavigation.flatMap((item) => item.details);
    const sublinks = links.flatMap((item) => item.subdetails || []);

    // Cari hanya satu link aktif
    const activeLink = links.find(link => link.active);
    const activeSubLink = sublinks.find(sublink => sublink.active);

    // Debugging: Cek menu yang aktif
    console.log("Active Link:", activeLink);
    console.log("Active SubLink:", activeSubLink);

    // State untuk cek mode mobile
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Fungsi untuk cek ukuran layar
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // Tambahkan event listener
        window.addEventListener('resize', handleResize);

        // Jalankan saat pertama kali
        handleResize();

        // Hapus event listener saat komponen di-unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`flex justify-between items-center min-w-full sticky top-0 z-20 h-16 md:border-b md:bg-white dark:md:border-gray-900 dark:md:bg-gray-950 ${auth.user.roles.some(role => role.name === 'users-access') ? 'bg-gradient-to-r from-[#EDA375] to-[#D4A8EF]' : 'bg-white dark:bg-gray-950'} md:bg-none px-4 md:px-6`}>
            <div className='flex items-center gap-4'>
                {!isMobile && (
                    <button className='text-gray-700 dark:text-gray-400' onClick={toggleSidebar}>
                        <IconAlignLeft size={18} strokeWidth={1.5}/>
                    </button>
                )}
                {!isMobile && (
                    <div className='flex flex-row items-center gap-1 md:border-l-2 md:border-double md:px-4 dark:border-gray-900'>
                        {activeSubLink ? (
                            <span className='font-semibold text-sm md:text-base text-gray-700 dark:text-gray-400'>{activeSubLink.title}</span>
                        ) : activeLink ? (
                            <span className='font-semibold text-sm md:text-base text-gray-700 dark:text-gray-400'>{activeLink.title}</span>
                        ) : null}
                    </div>
                )}
            </div>
            <div className='flex items-center gap-4'>
                {!isMobile && (
                    <div className='flex flex-row items-center gap-1 border-r-2 border-double px-4 dark:border-gray-900'>
                        <div className='flex flex-row gap-2'>
                            <button className='p-2 rounded-md text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900' onClick={themeSwitcher}>
                               {darkMode ? <IconSun strokeWidth={1.5} size={18}/> : <IconMoon strokeWidth={1.5} size={18}/> }
                            </button>
                            <Notification/>
                        </div>
                    </div>
                )}
                <AuthDropdown auth={auth} isMobile={isMobile} toggleSidebar={toggleSidebar}/>
            </div>
        </div>
    )
}
