import React, { useState, useRef, useEffect } from 'react'
import { Menu, Transition  } from '@headlessui/react'
import { Link, usePage } from '@inertiajs/react'
import ProfileEditModal from '@/Components/ProfileEditModal';
import { IconLogout, IconUserCog, IconAlignLeft, IconCategory2, IconBrandZoom, IconBook, IconSun, IconMoon, IconLayout2, IconPackage, IconVideo, IconArticle } from '@tabler/icons-react'
import { useForm } from '@inertiajs/react'
import MenuLink from '@/Utils/Menu'
import LinkItem from './LinkItem'
import LinkItemDropdown from './LinkItemDropdown'
import SpeedDial from './SpeedDial'

export default function AuthDropdown({auth, isMobile, toggleSidebar, isUserAccess, themeSwitcher, darkMode}) {
    // define usefrom
    const { post } = useForm();
    // define url from usepage
    const { url } = usePage();

    // define state isToggle
    const [isToggle, setIsToggle] = useState(false);
    // define state isOpen
    const [isOpen, setIsOpen] = useState(false);
    // define ref dropdown
    const dropdownRef = useRef(null);

    // define method handleClickOutside
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsToggle(false);
        }
    };

    // get menu from utils
    const menuNavigation = MenuLink();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setIsToggle(false); // Close the dropdown when opening modal
    };

    // define useEffect
    useEffect(() => {
        // add event listener
        window.addEventListener("mousedown", handleClickOutside);

        // remove event listener
        return () => {
            window.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // define function logout
    const logout = async (e) => {
        e.preventDefault();

        post(route('logout'));
    }

    // Check if user has users-access role
    const userAccess = auth.user.roles.some(role => role.name === 'users-access');

    return (
        <>
            <div ref={dropdownRef} className="flex items-center justify-between w-full md:px-5">
                {/* SellMate text for medium screens and above */}
                <div className="hidden md:block">
                    <h1 className="text-2xl font-bold text-white">SellMate</h1>
                </div>
                
                {/* Speed Dial for small screens only - reusing the SpeedDial component */}
                <div className="md:hidden">
                    <SpeedDial isUserAccess={userAccess} />
                </div>
                
                <Menu className='relative z-10' as="div">
                    <Menu.Button className={`flex items-center group bg-white rounded-full py-1 px-2 ${isUserAccess ? 'bg-white' : ''}`}>
                        <div className="flex flex-col text-left mr-4 ml-2">
                            <span className={`text-xs ${isUserAccess ? 'text-gray-900' : ''}`}>{auth.user.name}</span>
                            <span className={`text-xs ${isUserAccess ? 'text-gray-900' : ''}`}>{auth.user.email}</span>
                        </div>
                        <div className="bg-white rounded-full">
                            <img
                                src={auth.user.avatar}
                                alt={auth.user.name}
                                className="w-7 h-7 rounded-full"
                            />
                        </div>
                    </Menu.Button>
                    <Transition
                        enter="transition duration-100 ease-out"
                        enterFrom="transform scale-95 opacity-0"
                        enterTo="transform scale-100 opacity-100"
                        leave="transition duration-75 ease-out"
                        leaveFrom="transform scale-100 opacity-100"
                        leaveTo="transform scale-95 opacity-0"
                    >
                        <Menu.Items className='absolute rounded-lg w-48 border mt-2 py-2 right-0 z-[100] bg-white dark:bg-gray-950 dark:border-gray-900'>
                            <div className='flex flex-col gap-1.5 divide-y divide-gray-100 dark:divide-gray-900'>
                                <Menu.Item>
                                    <button onClick={toggleModal} className='px-3 py-1.5 text-sm flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'>
                                        <IconUserCog strokeWidth={'1.5'} size={'20'}/> Profile
                                    </button>
                                </Menu.Item>
                                <Menu.Item>
                                    <button onClick={logout} className='px-3 py-1.5 text-sm flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'>
                                        <IconLogout strokeWidth={'1.5'} size={'20'}/>
                                        Logout
                                    </button>
                                </Menu.Item>
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </div>

            {/* Profile Edit Modal */}
            <ProfileEditModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={auth.user}
            />
        </>
    )
}
