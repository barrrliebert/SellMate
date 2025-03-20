import { useTheme } from '@/Context/ThemeSwitcherContext'
import React from 'react'

export default function Widget({title, icon, className, total, color}) {
    return (
        <div className={`${className} flex flex-col items-left text-left border-2 border-[#D4A8EF] p-4 lg:p-4 rounded-xl bg-white dark:bg-gray-950 dark:border-[#D4A8EF]`}>
            <div className="flex items-center justify-left gap-2 mb-3">
                <div className={`p-2 rounded-full ${color}`}>
                    {icon}
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                    {title}
                </span>
            </div>
            <span className="whitespace-nowrap font-semibold text-lg font-mono text-gray-900 dark:text-white">
                {total}
            </span>
        </div>
    )
}
