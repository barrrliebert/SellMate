import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/Context/ThemeSwitcherContext';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import SpeedDial from '@/Components/SpeedDial';

export default function AppLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // destruct darkMode and themeSwitcher from context
    const {darkMode, themeSwitcher } = useTheme();
    
    // Get user info from usePage
    const { auth } = usePage().props;

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
    
    // Check if user has users-access role
    const isUserAccess = auth.user.roles.some(role => role.name === 'users-access');

    return (
        <main>
            <div className='min-h-screen flex overflow-y-auto'>
                <div className='flex-1 flex-col overflow-y-auto h-screen'>
                    <Navbar toggleSidebar={toggleSidebar} themeSwitcher={themeSwitcher} darkMode={darkMode} />
                    <div className='w-full md:py-8 md:px-6 min-h-screen overflow-y-auto md:mb-0 text-white bg-white dark:bg-gray-950 dark:text-gray-100'>
                        <Toaster position='top-right'/>
                        
                        {/* Main content area with speed dial on medium screens and above */}
                        <div className="flex flex-col md:flex-row relative">
                            {/* SpeedDial visible only on medium screens and above - fixed position */}
                            <div className="hidden md:block fixed left-10 top-24 z-50">
                                <SpeedDial 
                                    isUserAccess={isUserAccess} 
                                    isOpenByDefault={true}
                                    isMediumScreen={true}
                                />
                            </div>
                            
                            {/* Main content */}
                            <div className="flex-1 md:ml-20">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
