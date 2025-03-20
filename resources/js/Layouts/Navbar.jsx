import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react';
import { IconMoon, IconSun } from '@tabler/icons-react'
import AuthDropdown from '@/Components/AuthDropdown';
import Menu from '@/Utils/Menu';

export default function Navbar({ themeSwitcher, darkMode }) {
    // destruct auth from props
    const { auth } = usePage().props;

    // get menu from utils
    const menuNavigation = Menu();

    // recreate array from menu navigations
    const links = menuNavigation.flatMap((item) => item.details);
    const filter_sublinks = links.filter((item) => item.hasOwnProperty('subdetails'));
    const sublinks = filter_sublinks.flatMap((item) => item.subdetails);

    // define is user access
    const isUserAccess = auth.user.roles.some(role => role.name === 'users-access');

    // define state isMobile
    const [isMobile, setIsMobile] = useState(false);

    // define useEffect
    useEffect(() => {
        // define handle resize window
        const handleResize = () => {
          setIsMobile(window.innerWidth <= 768);
        };

        // define event listener
        window.addEventListener('resize', handleResize);

        // call handle resize window
        handleResize();

        // remove event listener
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    })

    return (
        <div className={`flex justify-between items-center w-full sticky top-0 z-20 h-16 md:rounded-b-3xl ${isUserAccess ? 'bg-gradient-to-r from-[#EDA375] to-[#D4A8EF]' : 'bg-[#BF7CE7]'} px-4 md:px-6`}>
            <AuthDropdown 
                auth={auth} 
                isMobile={isMobile} 
                isUserAccess={isUserAccess} 
                themeSwitcher={themeSwitcher}
                darkMode={darkMode}
            />
        </div>
    )
}
