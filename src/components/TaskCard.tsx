"use client"

import { ChevronRight } from "lucide-react"

interface TaskCardProps {
  title: string
  startDate: string  // e.g. "Dec 16 9:55 AM"
  dueDate: string    // e.g. "Dec 16 10:55 AM"
  status: string     // "todo", "done", etc.
  onClick?: () => void
}

export function TaskCard({ title, startDate, dueDate, status, onClick }: TaskCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
    >
      {/* Left: Simple Status Indicator (Optional - simplistic dot just to anchor the row) */}
      <div className={`w-3 h-3 rounded-full shrink-0 ${status === 'done' ? 'bg-green-500' : 'border border-gray-300'}`} />

      {/* Middle: 2-Line Content */}
      <div className="flex-1 min-w-0">
        {/* Line 1: Task Title */}
        <h3 className="font-medium text-[16px] text-gray-900 truncate leading-tight">
          {title}
        </h3>

        {/* Line 2: Start and Due dates */}
        <div className="flex items-center text-[13px] text-gray-500 mt-1 leading-tight">
          <span className="truncate">
            Start: {startDate} • Due: {dueDate}
          </span>
        </div>
      </div>

      {/* Right: Chevron */}
      <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
    </div>
  )
}
