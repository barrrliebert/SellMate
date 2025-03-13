import { usePage } from '@inertiajs/react';
import { IconCirclePlus, IconLayout2, IconTable, IconUserBolt, IconUserShield, IconUsers, IconBox, IconPackage, IconSquareRoundedPlusFilled, IconTarget, IconArticle, IconVideo } from '@tabler/icons-react';
import hasAnyPermission from './Permissions';
import React from 'react'

export default function Menu() {
    // define use page
    const { url, props } = usePage();
    const { auth } = props;

    // Check if user has users-access role
    const isUserAccess = auth.user.roles.some(role => role.name === 'users-access');

    // define menu navigations
    const menuNavigation = [
        {
            title: 'Overview',
            permissions: true, // Always show for all users
            details: [
                {
                    title: 'Dashboard',
                    href: isUserAccess ? '/apps/user-dashboard' : '/apps/dashboard',
                    active: isUserAccess 
                        ? url === '/apps/user-dashboard'
                        : url === '/apps/dashboard',
                    icon: <IconLayout2 size={20} strokeWidth={1.5}/>,
                    permissions: true, // Always show for all users
                }
            ]
        },
        // Menu section - only show for users-access role
        ...(isUserAccess ? [{
            title: 'Menu',
            permissions: true,
            details: [
                {
                    title: 'Tambah Omzet',
                    href: '/apps/user-dashboard/omzet',
                    active: url === '/apps/user-dashboard/omzet',
                    icon: <IconSquareRoundedPlusFilled size={20} strokeWidth={1.5}/>,
                    permissions: true,
                },
                {
                    title: 'Target',
                    href: '/apps/user-dashboard/target',
                    active: url.startsWith('/apps/user-dashboard/target'),
                    icon: <IconTarget size={20} strokeWidth={1.5}/>,
                    permissions: true,
                },
                {
                    title: 'Video',
                    href: '/apps/user-dashboard/video',
                    active: url.startsWith('/apps/user-dashboard/video'),
                    icon: <IconVideo size={20} strokeWidth={1.5}/>,
                    permissions: true,
                },
                {
                    title: 'Artikel',
                    href: '/apps/user-dashboard/article',
                    active: url.startsWith('/apps/user-dashboard/article'),
                    icon: <IconArticle size={20} strokeWidth={1.5}/>,
                    permissions: true,
                }
            ]
        }] : []),
        // Only show User Management for non users-access role
        ...(!isUserAccess ? [{
            title: 'User Management',
            permissions: hasAnyPermission(['permissions-access']) || hasAnyPermission(['roles-access']) || hasAnyPermission(['users-access']),
            details: [
                {
                    title: 'Hak Akses',
                    href: '/apps/permissions',
                    active: url.startsWith('/apps/permissions') ? true : false,
                    icon: <IconUserBolt size={20} strokeWidth={1.5}/>,
                    permissions: hasAnyPermission(['permissions-access']),
                },
                {
                    title: 'Akses Group',
                    href: '/apps/roles',
                    active: url.startsWith('/apps/roles') ? true : false,
                    icon: <IconUserShield size={20} strokeWidth={1.5}/>,
                    permissions: hasAnyPermission(['roles-access']),
                },
                {
                    title: 'Pengguna',
                    icon: <IconUsers size={20} strokeWidth={1.5}/>,
                    permissions: hasAnyPermission(['users-access']),
                    subdetails: [
                        {
                            title: 'Data Pengguna',
                            href: '/apps/users',
                            icon: <IconTable size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/users' ? true : false,
                            permissions: hasAnyPermission(['users-data']),
                        },
                        {
                            title: 'Tambah Data Pengguna',
                            href: '/apps/users/create',
                            icon: <IconCirclePlus size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/users/create' ? true : false,
                            permissions: hasAnyPermission(['users-create']),
                        },
                    ]
                }
            ]
        },
        {
            title: 'Product Management',
            permissions: hasAnyPermission(['products-access']),
            details: [
                {
                    title: 'Produk & Jasa',
                    icon: <IconBox size={20} strokeWidth={1.5}/>,
                    permissions: hasAnyPermission(['products-access']),
                    subdetails: [
                        {
                            title: 'Data Produk & Jasa',
                            href: '/apps/products',
                            icon: <IconPackage size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/products' ? true : false,
                            permissions: hasAnyPermission(['products-data']),
                        },
                        {
                            title: 'Tambah Produk/Jasa',
                            href: '/apps/products/create',
                            icon: <IconCirclePlus size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/products/create' ? true : false,
                            permissions: hasAnyPermission(['products-create']),
                        },
                    ]
                }
            ]
        }, {
            title: 'Video Management',
            permissions: hasAnyPermission(['videos-access']),
            details: [
                {
                    title: 'Video',
                    icon: <IconVideo size={20} strokeWidth={1.5}/>,
                    permissions: hasAnyPermission(['videos-access']),
                    subdetails: [
                        {
                            title: 'Data Video',
                            href: '/apps/videos',
                            icon: <IconVideo size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/videos' ? true : false,
                            permissions: hasAnyPermission(['videos-data']),
                        },
                        {
                            title: 'Tambah Video',
                            href: '/apps/videos/create',
                            icon: <IconCirclePlus size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/videos/create' ? true : false,
                            permissions: hasAnyPermission(['videos-create']),
                        },
                    ]
                }
            ]
        }, {
            title: 'Article Management',
            permissions: hasAnyPermission(['articles-access']),
            details: [
                {
                    title: 'Article',
                    icon: <IconArticle size={20} strokeWidth={1.5}/>,
                    permissions: hasAnyPermission(['articles-access']),
                    subdetails: [
                        {
                            title: 'Data Article',
                            href: '/apps/articles',
                            icon: <IconArticle size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/articles' ? true : false,
                            permissions: hasAnyPermission(['articles-data']),
                        },
                        {
                            title: 'Tambah Article',
                            href: '/apps/articles/create',
                            icon: <IconCirclePlus size={20} strokeWidth={1.5}/>,
                            active: url === '/apps/articles/create' ? true : false,
                            permissions: hasAnyPermission(['articles-create']),
                        },
                    ]
                }
            ]
        }] : [])
    ];

    return menuNavigation;
}
