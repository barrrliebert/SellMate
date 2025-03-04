import React from 'react'
import { Progress } from "@material-tailwind/react"

export default function WidgetUser({
  title,
  icon,
  className,
  total,
  target,
  color
}) {

  return (
    <div className={`${className} flex items-center border p-2 lg:p-4 rounded-full bg-white dark:bg-gray-950 dark:border-gray-800`}>
      <div className={`p-2 rounded-full ${color}`}>
        {icon}
      </div>
      <div className="ml-4 flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-gray-200 text-sm">
          {title}
        </span>
        <span className="whitespace-nowrap font-semibold text-base font-mono text-gray-900 dark:text-white text-xs">
          {total}
        </span>
      </div>
    </div>
  )
}
