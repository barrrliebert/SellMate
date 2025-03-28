import Card from '@/Components/Card';
import Table from '@/Components/Table';
import Widget from '@/Components/Widget';
import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';
import { IconBox, IconWallet, IconUsers, IconUser, IconDownload, IconFilter, IconSearch, IconCalendar, IconX } from '@tabler/icons-react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Menu } from '@headlessui/react';
import { toast } from 'react-hot-toast';
import { DateRange } from 'react-date-range';
import { format, isValid } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export default function Dashboard({ auth }) {
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [searchTopUsers, setSearchTopUsers] = useState('');
    const [searchTransactions, setSearchTransactions] = useState('');
    const [actualSearchTopUsers, setActualSearchTopUsers] = useState('');
    const [actualSearchTransactions, setActualSearchTransactions] = useState('');
    const [topUsers, setTopUsers] = useState({ data: [], total: 0, per_page: 6, current_page: 1 });
    const [transactions, setTransactions] = useState({ data: [], total: 0, per_page: 10, current_page: 1 });
    const [filters, setFilters] = useState({
        topUsers: 'month',
        transactions: 'month'
    });
    const [dates, setDates] = useState({
        topUsers: { startDate: null, endDate: null },
        transactions: { startDate: null, endDate: null }
    });
    const [currentPage, setCurrentPage] = useState({
        topUsers: 1,
        transactions: 1
    });
    const [tempDates, setTempDates] = useState({
        topUsers: { startDate: null, endDate: null },
        transactions: { startDate: null, endDate: null }
    });
    const [totalOmzet, setTotalOmzet] = useState('Rp 0');
    const [exportDateRange, setExportDateRange] = useState([
        {
            startDate: null,
            endDate: null,
            key: 'selection'
        }
    ]);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const datePickerRef = useRef(null);

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
    }, [currentPage, actualSearchTopUsers, actualSearchTransactions]);

    // Watch for actual search term changes instead of input changes
    useEffect(() => {
        fetchData(actualSearchTopUsers, actualSearchTransactions);
    }, [actualSearchTopUsers, actualSearchTransactions]);

    // Add new useEffect to watch filter changes
    useEffect(() => {
        fetchData(actualSearchTopUsers, actualSearchTransactions);
    }, [filters.topUsers, filters.transactions]);

    // Close date picker when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleFilterChange = (table, type) => {
        if (type !== 'custom') {
            setFilters(prev => ({
            ...prev,
                [table]: type
            }));
            // Langsung fetch data untuk filter non-custom
            fetchData(actualSearchTopUsers, actualSearchTransactions, {
                ...filters,
                [table]: type
            }, dates);
        }
    };

    const handleDateChange = (table, dateType, value) => {
        setTempDates(prev => ({
            ...prev,
            [table]: { 
                ...prev[table], 
                [dateType === 'start' ? 'startDate' : 'endDate']: value 
            }
        }));
    };

    const handleCustomFilter = (table) => {
        const customDates = tempDates[table];
        if (customDates.startDate && customDates.endDate) {
            // Update both filters and dates
            setFilters(prev => ({
                ...prev,
                [table]: 'custom'
            }));
            setDates(prev => ({
                ...prev,
                [table]: customDates
            }));
            // Fetch data with new filter and dates
            fetchData(actualSearchTopUsers, actualSearchTransactions, {
                ...filters,
                [table]: 'custom'
            }, {
                ...dates,
                [table]: customDates
            });
        }
    };

    const fetchData = async (topUsersSearch = '', transactionsSearch = '', currentFilters = filters, currentDates = dates) => {
        try {
            setLoading(true);
            const [omzetRes, productsRes, usersRes, topOmzetRes, transactionsRes] = await Promise.all([
                axios.get('/apps/omzets/total'),
                axios.get('/apps/products/total'),
                axios.get('/apps/users/total'),
                axios.get('/apps/omzets/top-omzet', { 
                    params: { 
                        search: topUsersSearch,
                        filter_type: currentFilters.topUsers,
                        start_date: currentDates.topUsers.startDate,
                        end_date: currentDates.topUsers.endDate,
                        page: currentPage.topUsers,
                        per_page: 6
                    } 
                }),
                axios.get('/apps/omzets/transaction-records', { 
                    params: { 
                        search: transactionsSearch,
                        filter_type: currentFilters.transactions,
                        start_date: currentDates.transactions.startDate,
                        end_date: currentDates.transactions.endDate,
                        page: currentPage.transactions,
                        per_page: transactions.per_page
                    } 
                })
            ]);
            
            setTotalOmzet(omzetRes.data?.total_omzet ?? 'Rp 0');
            setTotalProducts(productsRes.data?.total ?? 0);
            setTotalUsers(usersRes.data?.total ?? 0);
            setTopUsers({
                data: topOmzetRes.data?.top_users?.data ?? [],
                total: topOmzetRes.data?.top_users?.total ?? 0,
                per_page: topOmzetRes.data?.top_users?.per_page ?? 6,
                current_page: topOmzetRes.data?.top_users?.current_page ?? 1
            });
            setTransactions({
                data: transactionsRes.data?.omzets?.data ?? [],
                total: transactionsRes.data?.omzets?.total ?? 0,
                per_page: transactionsRes.data?.omzets?.per_page ?? 10,
                current_page: transactionsRes.data?.omzets?.current_page ?? 1
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            setTotalOmzet('Rp 0');
            setTotalProducts(0);
            setTotalUsers(0);
            setTopUsers({ data: [], total: 0, per_page: 6, current_page: 1 });
            setTransactions({ data: [], total: 0, per_page: 10, current_page: 1 });
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async (filter) => {
        try {
            setExportLoading(true);
            let params = { filter };
            
            if (filter === 'custom') {
                if (!exportDateRange[0].startDate || !exportDateRange[0].endDate) {
                    toast.error('Pilih tanggal terlebih dahulu!');
                    return;
                }
                params.start_date = format(exportDateRange[0].startDate, 'yyyy-MM-dd');
                params.end_date = format(exportDateRange[0].endDate, 'yyyy-MM-dd');
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
            toast.success('PDF berhasil di-export!');
        } catch (error) {
            console.error('Error exporting PDF:', error);
            toast.error('Gagal mengexport PDF!');
        } finally {
            setExportLoading(false);
        }
    };

    // Format date range for display
    const formatDateRange = () => {
        if (!exportDateRange[0].startDate || !exportDateRange[0].endDate) {
            return 'Pilih tanggal';
        }
        return `${format(exportDateRange[0].startDate, 'dd/MM/yy')} - ${format(exportDateRange[0].endDate, 'dd/MM/yy')}`;
    };

    const getGrade = (totalOmzet) => {
        const omzetValue = parseInt(totalOmzet.replace(/[^0-9]/g, ''));
        if (omzetValue >= 300000) return { grade: 'A', color: 'bg-green-500' };
        if (omzetValue >= 200000) return { grade: 'B', color: 'bg-blue-500' };
        if (omzetValue >= 100000) return { grade: 'C', color: 'bg-yellow-500' };
        return { grade: 'D', color: 'bg-red-500' };
    };

    const FilterDropdown = ({ table, currentFilter, onFilterChange, onDateChange }) => {
        return (
            <Menu as="div" className="relative text-gray-600">
                <Menu.Button className={`inline-flex items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-950 border-2 border-[#D4A8EF] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 ${currentFilter.type !== 'all' ? 'ring-2 ring-blue-500/30' : ''}`}>
                    <IconFilter size={16} strokeWidth={1.5} />
                </Menu.Button>
                <Menu.Items className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-800 py-1 z-50">
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('all')}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                }`}
                            >
                                Semua
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('today')}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                }`}
                            >
                                Hari Ini
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('week')}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                }`}
                            >
                                Minggu Ini
                            </button>
                        )}
                    </Menu.Item>
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={() => onFilterChange('month')}
                                className={`w-full text-left px-4 py-2 text-sm ${
                                    active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                }`}
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
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                                value={tempDates[table].startDate || ''}
                                onChange={(e) => onDateChange('start', e.target.value)}
                            />
                            <input
                                type="date"
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-200"
                                value={tempDates[table].endDate || ''}
                                onChange={(e) => onDateChange('end', e.target.value)}
                            />
                            <button
                                onClick={() => handleCustomFilter(table)}
                                disabled={!tempDates[table].startDate || !tempDates[table].endDate}
                                className="w-full px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-950 border-2 border-[#D4A8EF] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 disabled:opacity-70"
                >
                    {exportLoading ? 'Mengexport...' : (
                        <>
                            <IconDownload size={16} strokeWidth={1.5} />
                            Export
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
                                value={dates.transactions.startDate}
                                onChange={(e) => setDates({
                                    ...dates,
                                    transactions: { ...dates.transactions, startDate: e.target.value }
                                })}
                            />
                            <input
                                type="date"
                                className="w-full text-sm rounded-lg border dark:bg-gray-800 dark:border-gray-700"
                                value={dates.transactions.endDate}
                                onChange={(e) => setDates({
                                    ...dates,
                                    transactions: { ...dates.transactions, endDate: e.target.value }
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

    const handlePageChange = (table, page) => {
        setCurrentPage(prev => ({
            ...prev,
            [table]: page
        }));
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).replace(/\./g, '/');
        } catch (error) {
            return '-';
        }
    };

    const renderPaginationNumbers = (currentPage, totalPages, onPageChange) => {
        // Don't render pagination if there's only 1 page
        if (totalPages <= 1) return null;
        
        const pages = [];

        // Left Arrow
        pages.push(
            <button
                key="prev"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-5 h-5 flex items-center justify-center text-[10px] text-gray-500 disabled:text-gray-300"
            >
                ←
            </button>
        );

        // First page
        pages.push(
            <button
                key={1}
                onClick={() => onPageChange(1)}
                className={`w-5 h-5 flex items-center justify-center text-[10px] ${
                    currentPage === 1 
                    ? 'text-[#58177F] font-medium' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                1
            </button>
        );

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        // Add ellipsis after first page if needed
        if (startPage > 2) {
            pages.push(<span key="ellipsis1" className="w-3 text-center text-[10px] text-gray-500">...</span>);
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => onPageChange(i)}
                    className={`w-5 h-5 flex items-center justify-center text-[10px] ${
                        currentPage === i 
                        ? 'text-[#58177F] font-medium' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {i}
                </button>
            );
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            pages.push(<span key="ellipsis2" className="w-3 text-center text-[10px] text-gray-500">...</span>);
        }

        // Last page
        if (totalPages > 1) {
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => onPageChange(totalPages)}
                    className={`w-5 h-5 flex items-center justify-center text-[10px] ${
                        currentPage === totalPages 
                        ? 'text-[#58177F] font-medium' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    {totalPages}
                </button>
            );
        }

        // Right Arrow
        pages.push(
            <button
                key="next"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-5 h-5 flex items-center justify-center text-[10px] text-gray-500 disabled:text-gray-300"
            >
                →
            </button>
        );

        return pages;
    };

    const handleSearch = (type) => {
        if (type === 'topUsers') {
            setActualSearchTopUsers(searchTopUsers);
        } else {
            setActualSearchTransactions(searchTransactions);
        }
    };

    const handleKeyPress = (e, type) => {
        if (e.key === 'Enter') {
            handleSearch(type);
        }
    };

    return (
        <>
            <Head title='Dashboard'/>
            
            {/* Headlines */}
            <div className='px-4 lg:px-0 mb-6 mt-6 md:mt-0 flex justify-between items-center'>
                <div>
                    <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-200'>
                    Dashboard
                </h1>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                    Tetap monitoring progress dan update aktivitas pendapatan Tefa
                </p>
                </div>
                <div className="flex items-center gap-3">
                    {/* Date Range Picker */}
                    <div className="relative">
                        <button
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className="flex items-center gap-2 bg-white dark:bg-gray-950 border-2 border-[#D4A8EF] rounded-lg px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200"
                        >
                            <IconCalendar size={16} className="text-gray-500" />
                            <span className="min-w-[140px]">{formatDateRange()}</span>
                            {exportDateRange[0].startDate && exportDateRange[0].endDate && (
                                <IconX
                                    size={16}
                                    className="text-gray-500 hover:text-gray-700 cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setExportDateRange([{
                                            startDate: null,
                                            endDate: null,
                                            key: 'selection'
                                        }]);
                                    }}
                                />
                            )}
                        </button>

                        {/* Date Range Picker Popover */}
                        {isDatePickerOpen && (
                            <div
                                ref={datePickerRef}
                                className="absolute z-50 mt-2"
                            >
                                <DateRange
                                    onChange={item => setExportDateRange([item.selection])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={exportDateRange}
                                    className="border-2 border-[#D4A8EF] rounded-lg shadow-lg"
                                />
                            </div>
                        )}
                    </div>

                    {/* Export Button */}
                    <Menu as="div" className="relative">
                        <Menu.Button 
                            disabled={exportLoading}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-950 border-2 border-[#D4A8EF] rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 disabled:opacity-70"
                        >
                            {exportLoading ? 'Mengexport...' : (
                                <>
                                    Export
                                    <IconDownload size={16} strokeWidth={1.5} />
                                </>
                            )}
                        </Menu.Button>
                        <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border dark:border-gray-800 py-1 z-50">
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
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleExport('custom')}
                                        className={`${
                                            active ? 'bg-gray-100 dark:bg-gray-800' : ''
                                        } w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200`}
                                    >
                                        Export by Date Range
                                    </button>
                                )}
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>

            <div className='grid grid-cols-12 gap-4 px-4 lg:px-0'>
                {/* Left side - Widgets and Top High Omzet */}
                <div className='col-span-12 lg:col-span-7'>
                    {/* Widgets */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
                        <Widget
                            title={'Total Omzet'}
                            icon={<img src="/images/transaksi.svg" width="28" height="28" alt="Transaksi icon" />}
                            total={loading ? 'Loading...' : totalOmzet}
                        />
                <Widget
                            title={'Produk Tefa'}
                            icon={<img src="/images/product-admin.svg" width="28" height="28" alt="Product icon" />}
                            total={loading ? 'Loading...' : `${totalProducts} Produk`}
                />
                <Widget
                            title={'Total User'}
                            icon={<img src="/images/user.svg" width="28" height="28" alt="User icon" />}
                            total={loading ? 'Loading...' : `${totalUsers} User `}
                />
            </div>

                    {/* Top High Omzet */}
                    <Table.Card
                        title={'Top Omzet'}
                        action={
                            <div className="flex items-center gap-2 py-1.5">
                                <div className="w-48 relative">
                                    <input
                                        type="text"
                                        value={searchTopUsers}
                                        onChange={(e) => setSearchTopUsers(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, 'topUsers')}
                                        placeholder="Cari nama/jurusan..."
                                        className="py-2 px-4 pr-11 block w-full rounded-lg text-sm border-2 border-[#D4A8EF] focus:outline-none focus:ring-0 focus:ring-gray-400 text-gray-700 bg-white focus:border-[#D4A8EF] dark:focus:ring-gray-500 dark:focus:border-[#D4A8EF] dark:text-gray-200 dark:bg-gray-950 dark:border-[#D4A8EF]"
                                    />
                                    <button 
                                        onClick={() => handleSearch('topUsers')}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        <IconSearch className="w-5 h-5"/>
                                    </button>
                                </div>
                                <FilterDropdown 
                                    table="topUsers"
                                    currentFilter={dates.topUsers}
                                    onFilterChange={(type) => handleFilterChange('topUsers', type)}
                                    onDateChange={(type, value) => handleDateChange('topUsers', type, value)}
                                />
                            </div>
                        }
                    >
                        <div className="min-h-[373px] overflow-hidden">
                        {loading ? (
                                <div className="h-[373px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Loading...
                            </div>
                        ) : topUsers.data.length > 0 ? (
                                <>
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
                                    {topUsers.data.map((user, i) => {
                                        const { grade, color } = getGrade(user.formatted_omzet);
                                        const rowNumber = ((topUsers.current_page - 1) * topUsers.per_page) + i + 1;
                                        return (
                                            <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                                <Table.Td className="text-center">{rowNumber}</Table.Td>
                                                <Table.Td>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                                                            {user.avatar ? (
                                                                <img 
                                                                    src={user.avatar} 
                                                                    alt={user.name} 
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&color=fff&bold=true`;
                                                                    }}
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
                                    {topUsers.total > topUsers.per_page && (
                                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                                            <div className="flex justify-end items-center space-x-[2px]">
                                                {renderPaginationNumbers(
                                                    topUsers.current_page,
                                                    Math.ceil(topUsers.total / topUsers.per_page),
                                                    (page) => handlePageChange('topUsers', page)
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-[373px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Tidak ada data
                            </div>
                        )}
                        </div>
                    </Table.Card>
                </div>

                {/* Right side - History Transaksi */}
                <div className='col-span-12 lg:col-span-5'>
                    <Table.Card
                        title={'History Transaksi Omzet'}
                        action={
                            <div className="flex items-center gap-2">
                                <div className="w-48 relative">
                                    <input
                                        type="text"
                                        value={searchTransactions}
                                        onChange={(e) => setSearchTransactions(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, 'transactions')}
                                        placeholder="Cari nama/jurusan..."
                                        className="py-2 px-4 pr-11 block w-full rounded-lg text-sm border-2 border-[#D4A8EF] focus:outline-none focus:ring-0 focus:ring-gray-400 text-gray-700 bg-white focus:border-[#D4A8EF] dark:focus:ring-gray-500 dark:focus:border-[#D4A8EF] dark:text-gray-200 dark:bg-gray-950 dark:border-[#D4A8EF]"
                                    />
                                    <button 
                                        onClick={() => handleSearch('transactions')}
                                        className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500 hover:text-gray-700 cursor-pointer"
                                    >
                                        <IconSearch className="w-5 h-5"/>
                                    </button>
                                </div>
                                <FilterDropdown 
                                    table="transactions"
                                    currentFilter={dates.transactions}
                                    onFilterChange={(type) => handleFilterChange('transactions', type)}
                                    onDateChange={(type, value) => handleDateChange('transactions', type, value)}
                                />
                            </div>
                        }
                    >
                        <div className="min-h-[500px] overflow-hidden">
                        {loading ? (
                                <div className="h-[500px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Loading...
                            </div>
                        ) : transactions.data.length > 0 ? (
                                <>
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
                                    {transactions.data.map((transaction, i) => (
                                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                                            <Table.Td>
                                                        {formatDate(transaction.tanggal)}
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
                                    {transactions.total > transactions.per_page && (
                                        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                                            <div className="flex justify-end items-center space-x-[2px]">
                                                {renderPaginationNumbers(
                                                    transactions.current_page,
                                                    Math.ceil(transactions.total / transactions.per_page),
                                                    (page) => handlePageChange('transactions', page)
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="h-[500px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                                Tidak ada transaksi
                    </div>
                        )}
                        </div>
                    </Table.Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = page => <AppLayout children={page}/>
