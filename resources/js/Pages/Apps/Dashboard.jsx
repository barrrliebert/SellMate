import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Widget from '@/Components/Widget';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { IconBox, IconWallet, IconUsers, IconUser, IconDownload, IconFilter, IconSearch } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu } from '@headlessui/react';

export default function Dashboard({ auth }) {
    const [totalOmzet, setTotalOmzet] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [topUsers, setTopUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [exportLoading, setExportLoading] = useState(false);
    const [searchTopUsers, setSearchTopUsers] = useState('');
    const [searchTransactions, setSearchTransactions] = useState('');
    const [dateFilter, setDateFilter] = useState({
        topUsers: {
            type: 'all',  // all, today, week, month, custom
            startDate: '',
            endDate: ''
        },
        transactions: {
            type: 'all',
            startDate: '',
            endDate: ''
        },
        export: {
            startDate: '',
            endDate: ''
        }
    });

    // Filter options for export
    const filterOptions = [
        { label: 'Hari Ini', value: 'today' },
        { label: 'Minggu Ini', value: 'week' },
        { label: '3 Bulan', value: '3months' },
        { label: '6 Bulan', value: '6months' },
        { label: '12 Bulan', value: '12months' },
    ];

    useEffect(() => {
        fetchData();
    }, []);

    // Watch for search changes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData(searchTopUsers, searchTransactions);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTopUsers, searchTransactions]);

    // Add new useEffect to watch filter changes
    useEffect(() => {
        fetchData(searchTopUsers, searchTransactions);
    }, [dateFilter.topUsers.type, dateFilter.transactions.type]);

    const handleFilterChange = (table, type) => {
        setDateFilter(prev => ({
            ...prev,
            [table]: { 
                ...prev[table], 
                type,
                // Reset dates when changing filter type
                startDate: type === 'custom' ? prev[table].startDate : '',
                endDate: type === 'custom' ? prev[table].endDate : ''
            }
        }));
    };

    const handleDateChange = (table, dateType, value) => {
        setDateFilter(prev => ({
            ...prev,
            [table]: { 
                ...prev[table], 
                [dateType === 'start' ? 'startDate' : 'endDate']: value 
            }
        }));
    };

    const fetchData = async (topUsersSearch = '', transactionsSearch = '') => {
        try {
            setLoading(true);
            const [omzetRes, productsRes, usersRes, topOmzetRes, transactionsRes] = await Promise.all([
                axios.get('/apps/omzets/total'),
                axios.get('/apps/products/total'),
                axios.get('/apps/users/total'),
                axios.get('/apps/omzets/top-omzet', { 
                    params: { 
                        search: topUsersSearch,
                        filter_type: dateFilter.topUsers.type,
                        start_date: dateFilter.topUsers.startDate,
                        end_date: dateFilter.topUsers.endDate
                    } 
                }),
                axios.get('/apps/omzets/transaction-records', { 
                    params: { 
                        search: transactionsSearch,
                        filter_type: dateFilter.transactions.type,
                        start_date: dateFilter.transactions.startDate,
                        end_date: dateFilter.transactions.endDate
                    } 
                })
            ]);
            
            setTotalOmzet(omzetRes.data.total_omzet);
            setTotalProducts(productsRes.data.total);
            setTotalUsers(usersRes.data.total);
            setTopUsers(topOmzetRes.data.top_users);
            setTransactions(transactionsRes.data.omzets);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleExport = async (filter) => {
        try {
            setExportLoading(true);
            let params = { filter };
            
            if (filter === 'custom') {
                params.start_date = dateFilter.export.startDate;
                params.end_date = dateFilter.export.endDate;
            }

            const response = await axios.get('/apps/omzets/export-pdf', {
                params,
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `transaksi-${filter}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error exporting PDF:', error);
        } finally {
            setExportLoading(false);
        }
    };

    const getGrade = (totalOmzet) => {
        const omzetValue = parseInt(totalOmzet.replace(/[^0-9]/g, ''));
        if (omzetValue >= 300000) return { grade: 'A', color: 'bg-green-500' };
        if (omzetValue >= 200000) return { grade: 'B', color: 'bg-blue-500' };
        if (omzetValue >= 100000) return { grade: 'C', color: 'bg-yellow-500' };
        return { grade: 'D', color: 'bg-red-500' };
    };

    const FilterDropdown = ({ table, currentFilter, onFilterChange, onDateChange }) => {
        const handleCustomFilter = () => {
            if (currentFilter.startDate && currentFilter.endDate) {
                onFilterChange('custom');
            }
        };

        return (
            <Menu as="div" className="relative text-gray-600">
                <Menu.Button className={`inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${currentFilter.type !== 'all' ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30 dark:ring-blue-500/70' : ''}`}>
                    <IconFilter size={16} strokeWidth={1.5} />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-800 py-1 z-50">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('all')}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                                    ${currentFilter.type === 'all' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                Semua
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('today')}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                                    ${currentFilter.type === 'today' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                Hari Ini
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('week')}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                                    ${currentFilter.type === 'week' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                Minggu Ini
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('month')}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors duration-150
                                    ${currentFilter.type === 'month' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}
                                    ${active ? 'bg-gray-100 dark:bg-gray-800' : ''}`}
                            >
                                Bulan Ini
                            </button>
                        )}
                    </Menu.Item>
                    <div className="px-4 py-2 border-t dark:border-gray-800">
                        <p className="text-sm mb-2 text-gray-700 dark:text-gray-200">Pilih Tanggal:</p>
                        <div className="space-y-2">
                            <input
                                type="date"
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/70 focus:border-transparent"
                                value={currentFilter.startDate}
                                onChange={(e) => onDateChange('start', e.target.value)}
                            />
                            <input
                                type="date"
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500/70 focus:border-transparent"
                                value={currentFilter.endDate}
                                onChange={(e) => onDateChange('end', e.target.value)}
                            />
                            <button
                                onClick={handleCustomFilter}
                                disabled={!currentFilter.startDate || !currentFilter.endDate}
                                className={`w-full px-3 py-1.5 text-sm rounded-lg transition-all duration-200
                                    ${currentFilter.type === 'custom' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}
                                    hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                                    ${currentFilter.type === 'custom' ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900' : ''}`}
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </Menu.Items>
            </Menu>
        );
    };

    const ExportDropdown = () => {
        return (
            <Menu as="div" className="relative">
                <Menu.Button 
                    disabled={exportLoading}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                    {exportLoading ? 'Mengexport...' : (
                        <>
                            <IconDownload size={16} strokeWidth={1.5} />
                        </>
                    )}
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-800 py-1 z-50">
                    {filterOptions.map((option) => (
                        <Menu.Item key={option.value}>
                            {({ active }) => (
                                <button
                                    onClick={() => handleExport(option.value)}
                                    className={`${
                                        active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                    } w-full text-left px-4 py-2 text-sm`}
                                >
                                    {option.label}
                                </button>
                            )}
                        </Menu.Item>
                    ))}
                    <div className="px-4 py-2 border-t dark:border-gray-800">
                        <p className="text-sm mb-2">Pilih Tanggal Export:</p>
                        <div className="space-y-2">
                            <input
                                type="date"
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                value={dateFilter.export.startDate}
                                onChange={(e) => setDateFilter({
                                    ...dateFilter,
                                    export: { ...dateFilter.export, startDate: e.target.value }
                                })}
                            />
                            <input
                                type="date"
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                value={dateFilter.export.endDate}
                                onChange={(e) => setDateFilter({
                                    ...dateFilter,
                                    export: { ...dateFilter.export, endDate: e.target.value }
                                })}
                            />
                            <button
                                onClick={() => handleExport('custom')}
                                className="w-full px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Export Custom
                            </button>
                        </div>
                    </div>
                </Menu.Items>
            </Menu>
        );
    };

    return (
        <>
            <Head title='Dashboard'/>
            
            {/* Headlines */}
            <div className='px-4 lg:px-0 mb-6'>
                <h1 className='text-2xl font-bold text-gray-800 dark:text-gray-200'>
                    Dashboard
                </h1>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    Tetap monitoring progress dan update aktivitas pendapatan Tefa
                </p>
            </div>

            <div className='grid grid-cols-12 gap-4 px-4 lg:px-0'>
                {/* Left side - Widgets and Top High Omzet */}
                <div className='col-span-12 lg:col-span-7'>
                    {/* Widgets */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <Widget
                            title={'Total Omzet'}
                            color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                            icon={<IconWallet size={'20'} strokeWidth={'1.5'}/>}
                            total={loading ? 'Loading...' : totalOmzet}
                        />
                <Widget
                    title={'Produk'}
                    color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                    icon={<IconBox size={'20'} strokeWidth={'1.5'}/>}
                            total={loading ? 'Loading...' : totalProducts}
                />
                <Widget
                            title={'Pengguna'}
                    color={'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'}
                    icon={<IconUsers size={'20'} strokeWidth={'1.5'}/>}
                            total={loading ? 'Loading...' : totalUsers}
                />
            </div>

                    {/* Top High Omzet */}
                    <Table.Card
                        title={'Top High Omzet'}
                        action={
                            <div className="flex items-center gap-2">
                                <div className="w-64 relative">
                                    <input
                                        type="text"
                                        value={searchTopUsers}
                                        onChange={(e) => setSearchTopUsers(e.target.value)}
                                        placeholder="Cari berdasarkan nama..."
                                        className="py-2 px-4 pr-11 block w-full rounded-lg text-sm border focus:outline-none focus:ring-0 focus:ring-gray-400 text-gray-700 bg-white border-gray-200 focus:border-gray-200 dark:focus:ring-gray-500 dark:focus:border-gray-800 dark:text-gray-200 dark:bg-gray-950 dark:border-gray-900"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-4">
                                        <IconSearch className="text-gray-500 w-5 h-5"/>
                                    </div>
                                </div>
                                <FilterDropdown 
                                    table="topUsers"
                                    currentFilter={dateFilter.topUsers}
                                    onFilterChange={(type) => handleFilterChange('topUsers', type)}
                                    onDateChange={(type, value) => handleDateChange('topUsers', type, value)}
                                />
                            </div>
                        }
                    >
                        {loading ? (
                            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                                Loading...
                            </div>
                        ) : topUsers.length > 0 ? (
                        <Table>
                            <Table.Thead>
                                <tr>
                                        <Table.Th className="w-10">No</Table.Th>
                                        <Table.Th>Nama</Table.Th>
                                        <Table.Th>Jurusan</Table.Th>
                                        <Table.Th className="text-right">Total Omzet</Table.Th>
                                        <Table.Th className="text-center">Nilai</Table.Th>
                                </tr>
                            </Table.Thead>
                            <Table.Tbody>
                                    {topUsers.map((user, i) => {
                                        const { grade, color } = getGrade(user.formatted_omzet);
                                        return (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                <Table.Td className="text-center">{i + 1}</Table.Td>
                                                <Table.Td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                                            {user.avatar ? (
                                                                <img 
                                                                    src={user.avatar} 
                                                                    alt={user.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center">
                                                                    <IconUser size={16} className="text-gray-400" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                            {user.name}
                                                        </span>
                                                    </div>
                                        </Table.Td>
                                        <Table.Td>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {user.major || 'Belum diisi'}
                                                    </span>
                                                </Table.Td>
                                                <Table.Td className="text-right">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {user.formatted_omzet}
                                                    </span>
                                        </Table.Td>
                                                <Table.Td className="text-center">
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${color} text-white`}>
                                                        {grade}
                                                    </span>
                                        </Table.Td>
                                    </tr>
                                        );
                                    })}
                            </Table.Tbody>
                        </Table>
                        ) : (
                            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                                Tidak ada data
                            </div>
                        )}
                    </Table.Card>
                </div>

                {/* Right side - History Transaksi */}
                <div className='col-span-12 lg:col-span-5'>
                    <Table.Card
                        title={'History Transaksi'}
                        action={
                            <div className="flex items-center gap-2">
                                <div className="w-64 relative">
                                    <input
                                        type="text"
                                        value={searchTransactions}
                                        onChange={(e) => setSearchTransactions(e.target.value)}
                                        placeholder="Cari berdasarkan nama..."
                                        className="py-2 px-4 pr-11 block w-full rounded-lg text-sm border focus:outline-none focus:ring-0 focus:ring-gray-400 text-gray-700 bg-white border-gray-200 focus:border-gray-200 dark:focus:ring-gray-500 dark:focus:border-gray-800 dark:text-gray-200 dark:bg-gray-950 dark:border-gray-900"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none pr-4">
                                        <IconSearch className="text-gray-500 w-5 h-5"/>
                                    </div>
                                </div>
                                <FilterDropdown 
                                    table="transactions"
                                    currentFilter={dateFilter.transactions}
                                    onFilterChange={(type) => handleFilterChange('transactions', type)}
                                    onDateChange={(type, value) => handleDateChange('transactions', type, value)}
                                />
                                <Menu as="div" className="relative">
                                    <Menu.Button 
                                        disabled={exportLoading}
                                        className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 disabled:opacity-70"
                                    >
                                        {exportLoading ? 'Mengexport...' : (
                                            <>
                                                <IconDownload size={16} strokeWidth={1.5} />
                                            </>
                                        )}
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-800 py-1 z-50">
                                        {filterOptions.map((option) => (
                                            <Menu.Item key={option.value}>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => handleExport(option.value)}
                                                        className={`${
                                                            active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                                        } w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                                                    >
                                                        {option.label}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ))}
                                        <div className="px-4 py-2 border-t dark:border-gray-800">
                                            <p className="text-sm mb-2 text-gray-700 dark:text-gray-200">Pilih Tanggal Export:</p>
                                            <div className="space-y-2">
                                                <input
                                                    type="date"
                                                    className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                                                    value={dateFilter.export.startDate}
                                                    onChange={(e) => setDateFilter({
                                                        ...dateFilter,
                                                        export: { ...dateFilter.export, startDate: e.target.value }
                                                    })}
                                                />
                                                <input
                                                    type="date"
                                                    className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                                                    value={dateFilter.export.endDate}
                                                    onChange={(e) => setDateFilter({
                                                        ...dateFilter,
                                                        export: { ...dateFilter.export, endDate: e.target.value }
                                                    })}
                                                />
                                                <button
                                                    onClick={() => handleExport('custom')}
                                                    className="w-full px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                >
                                                    Export Custom
                                                </button>
                        </div>
                    </div>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        }
                    >
                        {loading ? (
                            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                                Loading...
                            </div>
                        ) : transactions.length > 0 ? (
                            <Table>
                                <Table.Thead>
                                    <tr>
                                        <Table.Th>Tanggal</Table.Th>
                                        <Table.Th>Nama</Table.Th>
                                        <Table.Th>Jurusan</Table.Th>
                                        <Table.Th className="text-right">Omzet</Table.Th>
                                    </tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {transactions.map((transaction, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <Table.Td>
                                                {new Date(transaction.tanggal).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: '2-digit'
                                                }).replace(/\./g, '/')}
                                            </Table.Td>
                                            <Table.Td>
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {transaction.user.name}
                                                </span>
                                            </Table.Td>
                                            <Table.Td>
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    {transaction.user.major || 'Belum diisi'}
                                                </span>
                                            </Table.Td>
                                            <Table.Td className="text-right">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {transaction.formatted_omzet}
                                                </span>
                                            </Table.Td>
                                        </tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        ) : (
                            <div className="text-center p-4 text-gray-500 dark:text-gray-400">
                                Tidak ada transaksi
                    </div>
                        )}
                    </Table.Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = page => <AppLayout children={page}/>
