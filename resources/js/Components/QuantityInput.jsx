import React from 'react';
import { IconMinus, IconPlus } from '@tabler/icons-react';

export default function QuantityInput({ 
    value, 
    onChange, 
    min = 1, 
    max, 
    step = 1,
    label,
    errors,
    className
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
            <div className={`flex items-stretch overflow-hidden rounded-lg border border-[#DD661D66] ${className || ''}`}>
                <button
                    type="button"
                    onClick={handleDecrement}
                    disabled={value <= min}
                    className="flex items-center justify-center w-12 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IconMinus size={16} stroke={2} />
                </button>
                <div className="flex-1 flex items-center justify-center text-center border-l border-r border-[#DD661D66] px-2 py-1.5">
                    <span className="text-base font-medium">{value}</span>
                </div>
                <button
                    type="button"
                    onClick={handleIncrement}
                    disabled={max && value >= max}
                    className="flex items-center justify-center w-12 text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <IconPlus size={16} stroke={2} />
                </button>
            </div>
            {errors && (
                <small className="text-xs text-red-500">{errors}</small>
            )}
        </div>
    );
} 