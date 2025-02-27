import React from 'react'
import { useTheme } from '@/Context/ThemeSwitcherContext'

export default function WidgetUser({
    title,
    icon,
    subtitle,
    className,
    total,
    color,
    target = 100, // default target jika tidak di-set
}) {
    const isTarget = title === 'Target'
    const progressPercentage =
        isTarget && typeof total === 'number' && typeof target === 'number'
            ? Math.min(Math.round((total / target) * 100), 100)
            : 0

    if (isTarget) {
        return (
            <div className={`${className} border p-4 rounded-full bg-white dark:bg-gray-950 dark:border-gray-800`}>
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${color}`}>
                        {icon}
                    </div>
                    <div className="flex-1 flex flex-col">
                        <div className="font-semibold text-gray-900 dark:text-gray-200">{title}</div>
                        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
                        {/* Progress bar di bawah teks target, berada dalam kolom yang sama dengan teks */}
                        <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-2 relative">
                            <div className="w-[150px] sm:w-full bg-gray-200 rounded-full h-2 relative">
                            <div
                                className="bg-purple-600 h-2 rounded-full"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-900 dark:text-white">
                                {progressPercentage}%
                            </div>
                        </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`${className} border p-4 rounded-full bg-white dark:bg-gray-950 dark:border-gray-800`}>
            <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${color}`}>
                        {icon}
                    </div>
                    <div className="flex flex-col">
                        <div className="font-semibold text-gray-900 dark:text-gray-200">{title}</div>
                        {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
                    </div>
                </div>
                <div className="font-semibold text-base font-mono p-2 text-gray-900 dark:text-white">
                    {total}
                </div>
            </div>
        </div>
    )
}
