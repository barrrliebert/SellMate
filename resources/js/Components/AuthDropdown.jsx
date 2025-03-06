import React, { useState, useRef, useEffect } from 'react'
import { Menu, Transition  } from '@headlessui/react'
import { Link, usePage } from '@inertiajs/react'
import ProfileEditModal from '@/Components/ProfileEditModal';
import { IconLogout, IconUserCog, IconAlignLeft, IconCategory2, IconBrandZoom, IconBook } from '@tabler/icons-react'
import { useForm } from '@inertiajs/react'
import MenuLink from '@/Utils/Menu'
import LinkItem from './LinkItem'
import LinkItemDropdown from './LinkItemDropdown'

export default function AuthDropdown({auth, isMobile, toggleSidebar}) {
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
    const isUserAccess = auth.user.roles.some(role => role.name === 'users-access');
    const [isSpeedDialOpen, setIsSpeedDialOpen] = useState(false);

    return (
        <>
            {isMobile === false ? (
                <Menu className='relative z-10' as="div">
                    <Menu.Button className='flex items-center rounded-full'>
                        <img src={auth.user.avatar} alt={auth.user.name} className='w-10 h-10 rounded-full'/>
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
            ) : (
                <div ref={dropdownRef} className="flex items-center gap-4">
                    <Menu className='relative z-10' as="div">
                        <Menu.Button className="flex items-center group bg-gray-200 rounded-full py-1 px-2">
                            <div className="flex flex-col text-left mr-4 ml-2">
                                <span className="text-xs">{auth.user.name}</span>
                                <span className="text-xs">{auth.user.email}</span>
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

                    {isUserAccess ? (
                        // Speed Dial for users-access
                        <div className="fixed left-8 top-6 z-50">
                            <div className="relative">
                                {/* Container with background */}
                                <div className={`absolute -inset-3 bg-purple-500 rounded-full transition-all duration-300 ${isSpeedDialOpen ? 'h-[160px]' : 'h-[44px]'}`}></div>
                                
                                {/* Speed Dial Options */}
                                <div className={`absolute top-full left-0 w-full transition-all duration-200 ${isSpeedDialOpen ? 'opacity-100 translate-y-0 pt-2 pb-2' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                                    <div className="space-y-3 flex flex-col items-center">
                                        <Link href="/apps/video" className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                            <IconBrandZoom size={20} strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium">Video</span>
                                        </Link>
                                        <Link href="/apps/artikel" className="flex flex-col items-center gap-1 text-white hover:scale-110 transition-transform">
                                            <IconBook size={20} strokeWidth={1.5} />
                                            <span className="text-[10px] font-medium">Artikel</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Main Button - now relative to stay on top */}
                                <button
                                    onClick={() => setIsSpeedDialOpen(!isSpeedDialOpen)}
                                    className={`relative text-white transition-all duration-200 hover:scale-110 ${isSpeedDialOpen ? 'rotate-45' : ''}`}
                                >
                                    <IconCategory2 size={20} strokeWidth={1.5} />
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Original button for other roles
                        <button 
                            className='absolute left-5 text-gray-700 dark:text-gray-400 bg-gray-200 dark:bg-slate-700 rounded-full p-2' 
                            onClick={() => setIsToggle(!isToggle)}
                        >
                            <IconAlignLeft size={18} strokeWidth={1.5}/>
                        </button>
                    )}

                    {/* Sidebar for non-user roles */}
                    {!isUserAccess && (
                        <div className={`${isToggle ?'translate-x-0 opacity-100' : '-translate-x-full'} fixed top-0 left-0 z-50 w-[165px] h-full transition-all duration-300 transform border-r bg-white dark:bg-gray-950 dark:border-gray-900`}>
                            <div className="flex justify-center items-center px-6 py-2 h-16">
                                <div className="text-lg font-bold text-center leading-loose tracking-wider text-gray-900 dark:text-gray-200 mr-2">
                                    SellMate
                                </div>
                                <button className='flex text-gray-700 dark:text-gray-400' onClick={() => setIsToggle(!isToggle)}
                                >
                                    <IconAlignLeft size={18} strokeWidth={1.5}/>
                                </button>
                            </div>
                            <div className="w-full flex flex-col overflow-y-auto">
                                {menuNavigation.map((item, index) => (
                                    <div key={index}>
                                        <div className="text-gray-500 text-xs py-3 px-4 font-bold uppercase">
                                            {item.title}
                                        </div>
                                        {item.details.map((detail, indexDetail) => (
                                            detail.hasOwnProperty('subdetails') ?
                                            <LinkItemDropdown
                                                key={indexDetail}
                                                title={detail.title}
                                                icon={detail.icon}
                                                data={detail.subdetails}
                                                access={detail.permissions}
                                                sidebarOpen={true}
                                                onClick={() => setIsToggle(!isToggle)}
                                            />
                                            :
                                            <LinkItem
                                                key={indexDetail}
                                                title={detail.title}
                                                icon={detail.icon}
                                                href={detail.href}
                                                access={detail.permissions}
                                                sidebarOpen={true}
                                                onClick={() => setIsToggle(!isToggle)}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Profile Edit Modal */}
            <ProfileEditModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={auth.user}
            />
        </>
    )
}
