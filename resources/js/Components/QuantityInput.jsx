import React from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';

export default function QuantityInput({ 
    value, 
    onChange, 
    min = 1, 
    max, 
    step = 1,
    label,
    errors 
}) {
    const handleIncrement = () => {
        const newValue = value + step;
        if (!max || newValue <= max) {
            onChange(newValue);
        }
    };

    const handleDecrement = () => {
        const newValue = value - step;
        if (newValue >= min) {
            onChange(newValue);
        }
    };

    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value) || min;
        if (newValue >= min && (!max || newValue <= max)) {
            onChange(newValue);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-gray-600 dark:text-gray-400 text-sm">{label}</label>
            )}
            <div className="flex items-center">
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="p-2 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IconMinus size={16} />
                </button>
                <input
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    min={min}
                    max={max}
                    className="w-20 px-3 py-1.5 text-center border-y border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-0 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300"
                />
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={max && value >= max}
                    className="p-2 rounded-r-lg border border-l-0 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IconPlus size={16} />
                </button>
            </div>
            {errors && (
                <small className="text-xs text-red-500">{errors}</small>
            )}
        </div>
    );
} 