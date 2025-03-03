import React from 'react'
import { useTheme } from '@/Context/ThemeSwitcherContext'
import { Progress } from "@material-tailwind/react";

export default function WidgetUser({
    title,
    icon,
    className,
    total,
    target,
    color
}) {
    // Hitung persentase jika ada target
    const percentage = target ? Math.round((total / target) * 100) : null;

    return (
        <div className={`${className} border p-2 lg:p-4 rounded-full bg-white dark:bg-gray-950 dark:border-gray-800`}>
            <div className=" items-center gap-4">
                <div className="flex items-center gap-3 pr-14 lg:pr-0">
                    <div className={`p-2 rounded-full ${color}`}>
                        {icon}
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
                            {title}
                        </div>
                        {!target && (
                            <div className="whitespace-nowrap font-semibold text-base font-mono text-gray-900 dark:text-white text-xs">
                                {total}
                            </div>
                        )}
                        {target && (
                            <div className="mt-2 w-full min-w-[100px] relative">
                                <Progress
                                    value={percentage}
                                    size="lg"
                                    color="indigo"
                                    className="dark:bg-gray-800"
                                />
                                <span className="absolute inset-0 text-sm flex items-center justify-center text-white font-medium">
                                    {percentage}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
