import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/Context/ThemeSwitcherContext';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function AppLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // destruct darkMode and themeSwitcher from context
    const {darkMode, themeSwitcher } = useTheme();

   // define state sidebarOpen
    const [sidebarOpen, setSidebarOpen] = useState(
        localStorage.getItem('sidebarOpen') === 'true'
    );

    // define react hooks
    useEffect(() => {
        localStorage.setItem('sidebarOpen', sidebarOpen);
    }, [sidebarOpen])

    // define function toggleSidebar
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <main>
            <div className='min-h-screen flex overflow-y-auto'>
                <Sidebar sidebarOpen={sidebarOpen}/>
                <div className='flex-1 flex-col overflow-y-auto h-screen'>
                    <Navbar toggleSidebar={toggleSidebar} themeSwitcher={themeSwitcher} darkMode={darkMode} />
                    <div className='w-full md:py-8 md:px-6 min-h-screen overflow-y-auto md:mb-0 text-white bg-white lg:bg-transparent dark:bg-gray-950 dark:text-gray-100'>
                        <Toaster position='top-right'/>
                        {children}
                    </div>
                </div>
            </div>
        </main>
    )
}
