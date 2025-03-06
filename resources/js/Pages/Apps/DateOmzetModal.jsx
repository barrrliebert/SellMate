import React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function OmzetModal({ show, startDate, endDate, onStartDateChange, onEndDateChange, onCancel, onConfirm, onExportToday }) {
    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                <h3 className="text-xl font-bold mb-4 text-center text-gray-700">Pilih Interval Tanggal</h3>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-1 font-medium text-sm">Start Date:</label>
                    <DatePicker 
                        selected={startDate} 
                        onChange={onStartDateChange} 
                        dateFormat="yyyy-MM-dd" 
                        className="w-full text-gray-900 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-1 font-medium text-sm text-gray-700">End Date:</label>
                    <DatePicker 
                        selected={endDate} 
                        onChange={onEndDateChange} 
                        dateFormat="yyyy-MM-dd" 
                        className="w-full text-gray-900 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div className="flex justify-between mb-3">
                    <button 
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={onExportToday}
                    >
                        Export Hari Ini
                    </button>
                    <div className="flex gap-2">
                        <button 
                            className="px-4 py-2 text-sm font-medium text-white bg-gray-500 rounded hover:bg-gray-600"
                            onClick={onCancel}
                        >
                            Batal
                        </button>
                        <button 
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={onConfirm}
                        >
                            Konfirmasi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OmzetModal;