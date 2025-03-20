import React, { useState } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Link } from '@inertiajs/react'
import { IconBell } from '@tabler/icons-react'

export default function Notification({ isUserAccess = false }) {
    // define state
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Omzet Berhasil Ditambahkan",
            date: "Hari ini",
            read: false,
        },
        {
            id: 2,
            title: "Target Berhasil Diedit",
            date: "Hari ini",
            read: true,
        },
        {
            id: 3,
            title: "Target Berhasil Ditambahkan",
            date: "Hari ini",
            read: true,
        },
    ]);

    // define function markAsRead
    const markAsRead = (id) => {
        const updatedNotifications = [...notifications];
        const index = updatedNotifications.findIndex((notification) => notification.id === id);
        if (index !== -1) {
            updatedNotifications[index].read = true;
            setNotifications(updatedNotifications);
        }
    };

    // define function markAllAsRead
    const markAllAsRead = () => {
        const updatedNotifications = notifications.map((notification) => {
            return { ...notification, read: true };
        });
        setNotifications(updatedNotifications);
    };

    return (
        <Menu className='relative z-10' as="div">
            <Menu.Button className={`p-2 rounded-md relative ${isUserAccess ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'}`}>
                <IconBell size={20} strokeWidth={1.5}/>
                {notifications.some((notification) => !notification.read) && (
                    <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
                )}
            </Menu.Button>
            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className='absolute rounded-lg w-72 border mt-2 py-2 right-0 z-[100] bg-white dark:bg-gray-950 dark:border-gray-900'>
                    <div className='flex flex-col'>
                        <div className='flex items-center justify-between p-4 border-b dark:border-gray-900'>
                            <span className='font-medium text-gray-900 dark:text-white'>Notifikasi</span>
                            <button
                                onClick={markAllAsRead}
                                className='text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                            >
                                Tandai Sudah Dibaca
                            </button>
                        </div>
                        <div className='flex flex-col gap-1 max-h-72 overflow-y-auto'>
                            {notifications.map((notification) => (
                                <Menu.Item key={notification.id}>
                                    {({ active }) => (
                                        <Link
                                            href="#"
                                            onClick={() => markAsRead(notification.id)}
                                            className={`px-3 py-2 text-sm flex flex-col gap-0.5 border-b dark:border-gray-900 ${
                                                active ? 'bg-gray-100 dark:bg-gray-900' : ''
                                            } ${
                                                !notification.read ? 'bg-blue-50 dark:bg-indigo-900/20' : ''
                                            }`}
                                        >
                                            <span className={`${!notification.read ? 'font-medium text-gray-900 dark:text-gray-50' : 'font-normal text-gray-700 dark:text-gray-400'}`}>
                                                {notification.title}
                                            </span>
                                            <span className='text-xs text-gray-500 dark:text-gray-500'>{notification.date}</span>
                                        </Link>
                                    )}
                                </Menu.Item>
                            ))}
                        </div>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
