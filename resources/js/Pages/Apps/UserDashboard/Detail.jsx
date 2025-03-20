import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { IconPackage, IconUser, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import axios from 'axios';

export default function Detail({ type }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('date'); // 'date' or '1month', '3month', '6month', '12month'
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [sliderView, setSliderView] = useState('weekly'); // 'weekly' or 'monthly'
    const [showCalendar, setShowCalendar] = useState(false);
    const [isSliding, setIsSliding] = useState(false);
    const [touchStartX, setTouchStartX] = useState(0);
    const [touchEndX, setTouchEndX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Define clickOutside ref
    const calendarRef = useRef(null);
    const sliderRef = useRef(null);

    const endpoints = {
        transactions: '/apps/omzets/transaction-records',
        commissions: '/apps/omzets/commission-records',
        topOmzet: '/apps/omzets/top-omzet'
    };

    const titles = {
        transactions: 'Histori Transaksi',
        commissions: 'Histori Komisi',
        topOmzet: 'Rating Top Omzet'
    };

    useEffect(() => {
        fetchData();
    }, [type, viewMode, selectedDate]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                setShowCalendar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const fetchData = async () => {
        try {
            const params = {};
            
            // Add different parameters based on view mode and type
            if (type !== 'topOmzet') {  // Only add filter params for transactions and commissions
                if (viewMode === 'week') {
                    // Get data for the whole week
                    params.filter_type = 'week';
                } else if (viewMode === 'date') {
                    // Get data from selected date to today
                    params.filter_type = 'custom';
                    params.start_date = selectedDate.toISOString().split('T')[0];
                    params.end_date = new Date().toISOString().split('T')[0];
                } else if (viewMode.includes('month')) {
                    // Get data for X months back
                    params.filter_type = 'custom';
                    const monthsBack = parseInt(viewMode);
                    const startDate = new Date();
                    startDate.setMonth(startDate.getMonth() - monthsBack);
                    params.start_date = startDate.toISOString().split('T')[0];
                    params.end_date = new Date().toISOString().split('T')[0];
                }
            }
            
            const response = await axios.get(endpoints[type], { params });
            
            setData(type === 'topOmzet' ? response.data.top_users : 
                   type === 'transactions' ? response.data.omzets : 
                   response.data.commissions);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const groupDataByWeek = (items) => {
        const today = new Date();
        const groupedData = {};
        
        items.forEach(item => {
            const itemDate = new Date(item.tanggal);
            const diffTime = Math.abs(today - itemDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            const weekNumber = Math.ceil(diffDays / 7);
            
            if (!groupedData[weekNumber]) {
                groupedData[weekNumber] = [];
            }
            groupedData[weekNumber].push(item);
        });

        return groupedData;
    };

    const groupDataByDay = (items) => {
        const groupedData = {};
        
        items.forEach(item => {
            const itemDate = new Date(item.tanggal);
            
            // Format tanggal dengan format custom "24 Feb 25"
            const day = itemDate.getDate().toString().padStart(2, '0');
            const month = itemDate.toLocaleDateString('id-ID', { month: 'short' });
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
            const year = itemDate.getFullYear().toString().slice(-2);
            const dateKey = `${day} ${capitalizedMonth} ${year}`;
            
            // Store the full date for sorting and formatting
            if (!groupedData[dateKey]) {
                groupedData[dateKey] = {
                    items: [],
                    fullDate: itemDate
                };
            }
            groupedData[dateKey].items.push(item);
        });

        // Sort the keys by date (newest first)
        const sortedKeys = Object.keys(groupedData).sort((a, b) => {
            const dateA = groupedData[a].fullDate;
            const dateB = groupedData[b].fullDate;
            return dateB - dateA;
        });

        const sortedData = {};
        sortedKeys.forEach(key => {
            sortedData[key] = groupedData[key].items;
        });

        return {
            sortedData,
            sortedKeys
        };
    };

    const getGrade = (totalOmzet) => {
        const omzetValue = parseInt(totalOmzet.replace(/[^0-9]/g, ''));
        if (omzetValue >= 300000) return { grade: 'A', color: 'bg-green-500' };
        if (omzetValue >= 200000) return { grade: 'B', color: 'bg-blue-500' };
        if (omzetValue >= 100000) return { grade: 'C', color: 'bg-yellow-500' };
        return { grade: 'D', color: 'bg-red-500' };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleDateString('id-ID', { month: 'short' });
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        const year = date.getFullYear().toString().slice(-2);
        return `${day} ${capitalizedMonth} ${year}`;
    };

    const renderItem = (item, index) => {
        if (type === 'topOmzet') {
            const { grade, color } = getGrade(item.formatted_omzet);
            return (
                <div key={index} className="bg-white border border-[#58177F] rounded-xl grid grid-cols-3 items-center mb-2 mx-auto w-full py-2">
                    <div className="flex items-center justify-center gap-3 px-2 group relative">
                        <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded-full overflow-hidden">
                            {item.avatar ? (
                                <img 
                                    src={item.avatar} 
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconUser size={20} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-medium text-gray-900 truncate group-hover:text-clip group-hover:overflow-visible group-hover:whitespace-normal">
                                {item.name}
                            </span>
                            <span className="text-xs text-gray-500 truncate group-hover:text-clip group-hover:overflow-visible group-hover:whitespace-normal">
                                {item.major}
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="text-sm font-medium">
                            {grade}
                        </span>
                    </div>
                    <div className="text-center">
                        <span className="text-sm font-medium">
                            {item.formatted_omzet}
                        </span>
                    </div>
                </div>
            );
        } else if (type === 'transactions') {
            return (
                <div key={index} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product.foto_produk ? (
                                <img 
                                    src={item.product.foto_produk} 
                                    alt={item.product.nama_produk}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconPackage size={20} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        <span className="text-md font-medium text-gray-900">
                            {item.product.nama_produk}
                        </span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-semibold text-gray-900">
                            {item.formatted_omzet}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDate(item.tanggal)}
                        </span>
                    </div>
                </div>
            );
        } else {
            return (
                <div key={index} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                            {item.foto_produk ? (
                                <img 
                                    src={item.foto_produk} 
                                    alt={item.product}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <IconPackage size={20} className="text-gray-400" />
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-md font-medium text-gray-900">
                                {item.product}
                            </span>
                            <span className="text-xs text-gray-500">
                                {formatDate(item.tanggal)}
                            </span>
                        </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                        {item.komisi}
                    </span>
                </div>
            );
        }
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                    Loading...
                </div>
            );
        }

        if (data.length === 0) {
            return (
                <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                    Tidak ada data
                </div>
            );
        }

        if (type === 'topOmzet') {
            return (
                <div className="px-4">
                    <div className="grid grid-cols-3 items-center px-4 py-3">
                        <div className="text-center">
                            <span className="text-sm font-medium text-gray-900">
                                Nama
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-medium text-gray-900">
                                Nilai
                            </span>
                        </div>
                        <div className="text-center">
                            <span className="text-sm font-medium text-gray-900">
                                Total Omzet
                            </span>
                        </div>
                    </div>
                    <div>
                        {data.map((item, index) => renderItem(item, index))}
                    </div>
                </div>
            );
        }

        if (type === 'transactions' || type === 'commissions') {
            if (viewMode.includes('month')) {
                // For monthly view, group by day
                const { sortedData, sortedKeys } = groupDataByDay(data);
                return sortedKeys.map(date => (
                    <div key={date} className="mb-4">
                        <div className="bg-[#F9E0D1] py-2 px-4">
                            <h3 className="text-sm font-medium text-gray-900">
                                {date}
                            </h3>
                        </div>
                        <div className="bg-white divide-y divide-gray-100">
                            {sortedData[date].map((item, index) => renderItem(item, index))}
                        </div>
                    </div>
                ));
            } else {
                // For date view (from selected date to today), group by week
                const groupedData = groupDataByWeek(data);
                return Object.entries(groupedData).map(([week, items]) => (
                    <div key={week} className="mb-4">
                        <div className="bg-[#F9E0D1] py-2 px-4">
                            <h3 className="text-sm font-medium text-gray-900">
                                Minggu {week}
                            </h3>
                        </div>
                        <div className="bg-white divide-y divide-gray-100">
                            {items.map((item, index) => renderItem(item, index))}
                        </div>
                    </div>
                ));
            }
        }

        return null;
    };

    // Date navigation components
    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setShowCalendar(false);
        setSliderDate(date);
    };

    const handleSlideChange = (slide) => {
        setIsSliding(slide);
        // Reset tambahan
        setShowCalendar(false);
        
        // Atur mode tampilan sesuai slide
        if (!slide) { // Slide pertama (tanggal ke today)
            if (viewMode.includes('month')) {
                setViewMode('date');
            }
        } else { // Slide kedua (bulanan)
            if (!viewMode.includes('month')) {
                setViewMode('1month');
            }
        }
    };

    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEndX(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStartX || !touchEndX) return;
        
        const diff = touchStartX - touchEndX;
        const swipeThreshold = 50; // Minimum swipe distance in pixels
        
        if (diff > swipeThreshold) {
            // Swipe left
            handleSlideChange(true);
        } else if (diff < -swipeThreshold) {
            // Swipe right
            handleSlideChange(false);
        }
        
        // Reset touch positions
        setTouchStartX(0);
        setTouchEndX(0);
    };

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setTouchStartX(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            setTouchEndX(e.clientX);
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            if (touchStartX && touchEndX) {
                const diff = touchStartX - touchEndX;
                const swipeThreshold = 50; // Minimum swipe distance in pixels
                
                if (diff > swipeThreshold) {
                    // Swipe left
                    handleSlideChange(true);
                } else if (diff < -swipeThreshold) {
                    // Swipe right
                    handleSlideChange(false);
                }
            }
            
            // Reset
            setIsDragging(false);
            setTouchStartX(0);
            setTouchEndX(0);
        }
    };

    // Add mouse leave handler to prevent stuck dragging state
    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            setTouchStartX(0);
            setTouchEndX(0);
        }
    };

    // Add useEffect to handle global mouse up
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                setIsDragging(false);
                setTouchStartX(0);
                setTouchEndX(0);
            }
        };

        window.addEventListener('mouseup', handleGlobalMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleGlobalMouseUp);
        };
    }, [isDragging]);

    const renderDateNavigation = () => {
        if (sliderView === 'weekly') {
            return (
                <div className="fixed bottom-0 left-0 right-0">
                    <div className="w-full relative">
                        {/* Background Container */}
                        <div 
                            className="absolute inset-x-0 bottom-0 h-[80px] -z-10 w-full" 
                            style={{ backgroundColor: '#F9E0D1' }}
                        />

                        {/* Sliding Container */}
                        <div 
                            ref={sliderRef}
                            className="overflow-hidden pt-6"
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseLeave}
                            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                        >
                            <div 
                                className={`flex transition-transform duration-300 gap-2 ${
                                    isSliding ? 'transform translate-x-[-100%]' : ''
                                }`}
                            >
                                {/* First Slide - Date/Today */}
                                <div className="w-full flex-shrink-0">
                                    <div className="bg-white rounded-full flex items-center h-[30px] relative border border-[#EDA375] max-w-[382px] mx-auto overflow-hidden">
                                        <button 
                                            onClick={() => {
                                                setShowCalendar(true);
                                                setViewMode('date');
                                            }}
                                            className="flex-1 h-full flex items-center justify-center text-sm text-gray-800"
                                        >
                                            {formatDate(selectedDate)}
                                        </button>
                                        <div className="h-full w-[30px] bg-[#F3BA9B]"></div>
                                        <button 
                                            onClick={() => {
                                                setSelectedDate(new Date());
                                                setShowCalendar(false);
                                                setViewMode('date');
                                            }}
                                            className="flex-1 h-full flex items-center justify-center text-sm text-gray-800"
                                        >
                                            Today
                                        </button>
                                    </div>
                                </div>

                                {/* Monthly View - Second Slide */}
                                <div className="w-full flex-shrink-0 pr-4">
                                    <div className="flex items-center h-[30px] relative rounded-full overflow-hidden border border-[#EDA375] max-w-[382px] mx-auto">
                                        <button 
                                            onClick={() => setViewMode('1month')}
                                            className={`flex-1 h-full px-2 text-sm text-black text-center ${
                                                viewMode === '1month' ? 'bg-[#F3BA9B]' : 'bg-white'
                                            }`}
                                        >
                                            1 bulan
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('3month')}
                                            className={`flex-1 h-full px-2 text-sm text-black text-center ${
                                                viewMode === '3month' ? 'bg-[#F3BA9B]' : 'bg-white'
                                            }`}
                                        >
                                            3 bulan
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('6month')}
                                            className={`flex-1 h-full px-2 text-sm text-black text-center ${
                                                viewMode === '6month' ? 'bg-[#F3BA9B]' : 'bg-white'
                                            }`}
                                        >
                                            6 bulan
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('12month')}
                                            className={`flex-1 h-full px-2 text-sm text-black text-center ${
                                                viewMode === '12month' ? 'bg-[#F3BA9B]' : 'bg-white'
                                            }`}
                                        >
                                            1 tahun
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Dot Navigation */}
                            <div className="flex justify-center gap-1 mt-3 pb-3">
                                <button
                                    onClick={() => handleSlideChange(false)}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        !isSliding ? 'bg-[#EDA375]' : 'bg-[#D9D9D9]'
                                    }`}
                                />
                                <button
                                    onClick={() => handleSlideChange(true)}
                                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                                        isSliding ? 'bg-[#EDA375]' : 'bg-[#D9D9D9]'
                                    }`}
                                />
                            </div>
                        </div>

                        {showCalendar && (
                            <div ref={calendarRef} className="absolute bottom-full left-6 mb-2 bg-white rounded-lg shadow-lg p-2">
                                <input 
                                    type="date" 
                                    value={selectedDate.toISOString().split('T')[0]}
                                    onChange={(e) => {
                                        const newDate = new Date(e.target.value);
                                        setSelectedDate(newDate);
                                        setViewMode('date');
                                        setShowCalendar(false);
                                    }}
                                    max={new Date().toISOString().split('T')[0]} // Can't select future dates
                                    className="p-2 border rounded-lg"
                                />
                            </div>
                        )}
                    </div>
                </div>
            );
        } else {
            return (
                <div className="fixed bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-center gap-2">
                        {['1 bulan', '3 bulan', '6 bulan', '1 tahun'].map((period) => (
                            <button 
                                key={period}
                                onClick={() => {
                                    const months = period === '1 bulan' ? 1 : 
                                                 period === '3 bulan' ? 3 :
                                                 period === '6 bulan' ? 6 : 12;
                                    setViewMode(`${months}month`);
                                }}
                                className={`px-4 py-1.5 text-sm rounded-full ${
                                    viewMode === `${period.split(' ')[0]}month` 
                                        ? 'bg-orange-200 text-orange-800' 
                                        : 'bg-orange-50 text-orange-800'
                                }`}
                            >
                                {period}
                            </button>
                        ))}
                    </div>
                </div>
            );
        }
    };

    return (
        <>
            <Head title={titles[type]} />
            
            <div className="min-h-screen bg-white">
                {/* Header */}
                <div className="flex items-center p-4 bg-white border-b">
                    <Link href="/apps/user-dashboard" className="text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </Link>
                    <h2 className="text-2xl font-medium text-black ml-2">
                        {titles[type]}
                    </h2>
                </div>

                {/* Content */}
                <div className="pb-24">
                    {renderContent()}
                </div>

                {/* Footer Navigation - Only show for transactions and commissions */}
                {(type === 'transactions' || type === 'commissions') && renderDateNavigation()}
            </div>
        </>
    );
}

// Remove the layout to hide navbar
Detail.layout = page => page 