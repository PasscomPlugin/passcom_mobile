"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DateRange {
  start: Date
  end: Date
}

interface DateRangeModalProps {
  isVisible: boolean
  onClose: () => void
  onApply: (range: DateRange | null) => void
  initialRange?: DateRange | null
}

export default function DateRangeModal({
  isVisible,
  onClose,
  onApply,
  initialRange,
}: DateRangeModalProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(initialRange?.start)
  const [endDate, setEndDate] = useState<Date | undefined>(initialRange?.end)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Reset dates when modal opens with new initial range
  useEffect(() => {
    if (isVisible) {
      setStartDate(initialRange?.start)
      setEndDate(initialRange?.end)
      setCurrentMonth(initialRange?.start || new Date())
    }
  }, [isVisible, initialRange])

  if (!isVisible) return null

  const handleDateClick = (clickedDate: Date) => {
    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate)
      setEndDate(undefined)
    } else if (startDate && !endDate) {
      if (clickedDate < startDate) {
        setEndDate(startDate)
        setStartDate(clickedDate)
      } else {
        setEndDate(clickedDate)
      }
    }
  }

  const isDateInRange = (day: Date) => {
    if (!startDate || !endDate) return false
    return day > startDate && day < endDate
  }

  const isStartDate = (day: Date) => {
    if (!startDate) return false
    return day.toDateString() === startDate.toDateString()
  }

  const isEndDate = (day: Date) => {
    if (!endDate) return false
    return day.toDateString() === endDate.toDateString()
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const handleApplyRange = () => {
    if (startDate && endDate) {
      onApply({ start: startDate, end: endDate })
      onClose()
    }
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-[80] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-[90] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex-1 text-center">Select Date Range</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Active Range Display */}
        <div className="px-6 py-4 border-b shrink-0">
          <div className="flex items-center justify-center gap-3">
            <div className="flex-1 text-center py-2 px-4 bg-gray-50 rounded-lg">
              <span className={startDate ? "font-bold text-gray-900" : "text-gray-400"}>
                {startDate ? formatDate(startDate) : "Start"}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className="flex-1 text-center py-2 px-4 bg-gray-50 rounded-lg">
              <span className={endDate ? "font-bold text-gray-900" : "text-gray-400"}>
                {endDate ? formatDate(endDate) : "End"}
              </span>
            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-4">
            {/* Month Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="font-semibold text-base">{monthName}</h3>
              <button
                onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Day headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const currentDate = new Date(year, month, day)
                const isStart = isStartDate(currentDate)
                const isEnd = isEndDate(currentDate)
                const inRange = isDateInRange(currentDate)

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(currentDate)}
                    className={`aspect-square flex items-center justify-center text-sm relative ${
                      isStart || isEnd
                        ? "bg-blue-500 text-white font-bold rounded-full z-10"
                        : inRange
                          ? "bg-blue-100 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100 rounded-full"
                    }`}
                  >
                    {inRange && !isStart && !isEnd && <div className="absolute inset-0 bg-blue-100 -z-10" />}
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t shrink-0">
          <Button
            onClick={handleApplyRange}
            disabled={!startDate || !endDate}
            className="w-full h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
          >
            Apply Range
          </Button>
        </div>
      </div>
    </>
  )
}

