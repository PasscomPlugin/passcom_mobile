"use client"

import { useState, useEffect } from "react"
import { X, ChevronRight, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"

export type Recurrence = {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
  interval?: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  endDate?: string | null;
}

type FrequencyType = "daily" | "weekly" | "monthly" | "yearly"
type ViewMode = "preset" | "custom"

interface RecurrenceSheetProps {
  isOpen: boolean
  onClose: () => void
  value: Recurrence | null
  onChange: (value: Recurrence | null) => void
}

export function RecurrenceSheet({ isOpen, onClose, value, onChange }: RecurrenceSheetProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("preset")
  const [selectedPreset, setSelectedPreset] = useState<string>("none")
  const [frequency, setFrequency] = useState<FrequencyType>("weekly")
  const [interval, setInterval] = useState(1)
  const [selectedDays, setSelectedDays] = useState<number[]>([new Date().getDay()])
  const [endsNever, setEndsNever] = useState(true)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [isEndDateOpen, setIsEndDateOpen] = useState(false)

  // Initialize state from value prop
  useEffect(() => {
    if (value) {
      setSelectedPreset(value.type)
      setFrequency(value.type === 'custom' ? 'weekly' : value.type)
      setInterval(value.interval || 1)
      setSelectedDays(value.daysOfWeek || [new Date().getDay()])
      setEndsNever(!value.endDate)
      setEndDate(value.endDate ? new Date(value.endDate) : undefined)
    } else {
      setSelectedPreset("none")
    }
  }, [value, isOpen])

  if (!isOpen) return null

  // Get current date info for dynamic labels
  const now = new Date()
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const currentDayName = dayNames[now.getDay()]
  const currentDayNumber = now.getDate()
  const currentMonth = monthNames[now.getMonth()]
  const dayAbbreviations = ["S", "M", "T", "W", "T", "F", "S"]

  function getOrdinalSuffix(day: number): string {
    if (day > 3 && day < 21) return "th"
    switch (day % 10) {
      case 1: return "st"
      case 2: return "nd"
      case 3: return "rd"
      default: return "th"
    }
  }

  const presetOptions = [
    { id: "none", label: "Does not repeat" },
    { id: "daily", label: "Daily" },
    { id: "weekly", label: `Weekly (every ${currentDayName})` },
    { id: "monthly", label: `Monthly (on the ${currentDayNumber}${getOrdinalSuffix(currentDayNumber)})` },
    { id: "yearly", label: `Yearly (on ${currentMonth} ${currentDayNumber})` },
    { id: "custom", label: "Custom..." },
  ]

  const handlePresetSelect = (optionId: string) => {
    if (optionId === "custom") {
      setViewMode("custom")
      return
    }
    
    if (optionId === "none") {
      onChange(null)
      onClose()
      return
    }

    // Create recurrence object for preset
    const recurrence: Recurrence = {
      type: optionId as 'daily' | 'weekly' | 'monthly' | 'yearly',
      interval: 1,
      daysOfWeek: optionId === 'weekly' ? [now.getDay()] : undefined,
    }
    
    onChange(recurrence)
    onClose()
  }

  const handleCustomSave = () => {
    const recurrence: Recurrence = {
      type: 'custom',
      interval,
      daysOfWeek: frequency === 'weekly' ? selectedDays : undefined,
      endDate: endsNever ? null : (endDate ? endDate.toISOString() : null),
    }
    
    onChange(recurrence)
    onClose()
  }

  const toggleDay = (dayIndex: number) => {
    if (selectedDays.includes(dayIndex)) {
      setSelectedDays(selectedDays.filter((d) => d !== dayIndex))
    } else {
      setSelectedDays([...selectedDays, dayIndex])
    }
  }

  const getIntervalUnit = () => {
    const units: Record<FrequencyType, string> = {
      daily: interval === 1 ? "day" : "days",
      weekly: interval === 1 ? "week" : "weeks",
      monthly: interval === 1 ? "month" : "months",
      yearly: interval === 1 ? "year" : "years",
    }
    return units[frequency]
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      
      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 w-full bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 z-50">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">Repeat task</h2>
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          {viewMode === "preset" ? (
            // Preset List View
            <div className="py-2">
              {presetOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handlePresetSelect(option.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-base">{option.label}</span>
                  {option.id === "custom" ? (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  ) : (
                    selectedPreset === option.id && (
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )
                  )}
                </button>
              ))}
            </div>
          ) : (
            // Custom Configuration View
            <div className="px-6 py-4 space-y-6">
              {/* Frequency Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Frequency</label>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                  {(["daily", "weekly", "monthly", "yearly"] as FrequencyType[]).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        frequency === freq ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      {freq.charAt(0).toUpperCase() + freq.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interval Stepper */}
              <div className="flex items-center justify-between py-3 border-b">
                <span className="text-base">Repeat every</span>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-transparent"
                    onClick={() => setInterval(Math.max(1, interval - 1))}
                    disabled={interval <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-medium min-w-[60px] text-center">
                    {interval} {getIntervalUnit()}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-transparent"
                    onClick={() => setInterval(interval + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Days of Week (only for Weekly) */}
              {frequency === "weekly" && (
                <div className="py-3 border-b">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Repeat on</label>
                  <div className="flex justify-between gap-2">
                    {dayAbbreviations.map((day, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`h-12 w-12 rounded-full font-medium text-sm transition-colors ${
                          selectedDays.includes(index)
                            ? "bg-blue-500 text-white"
                            : "border-2 border-gray-300 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ends Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Ends</label>
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setEndsNever(true)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-base">Never</span>
                    {endsNever && (
                      <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                  <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        onClick={() => {
                          setEndsNever(false)
                          setIsEndDateOpen(true)
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-base">On</span>
                        <div className="flex items-center gap-2">
                          {!endsNever && endDate && (
                            <span className="text-sm text-blue-500">
                              {format(endDate, "MMMM d, yyyy")}
                            </span>
                          )}
                          {!endsNever && !endDate && (
                            <span className="text-sm text-blue-500">Select date</span>
                          )}
                          {!endsNever && (
                            <div className="h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                          {endsNever && <ChevronRight className="h-5 w-5 text-gray-400" />}
                        </div>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          if (date) {
                            setEndDate(date)
                            setEndsNever(false)
                            setIsEndDateOpen(false)
                          }
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        initialFocus
                        className="[--cell-size:3rem]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - only show in custom view */}
        {viewMode === "custom" && (
          <div className="border-t px-6 py-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-11 rounded-full bg-transparent"
              onClick={() => setViewMode("preset")}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-11 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
              onClick={handleCustomSave}
            >
              Save
            </Button>
          </div>
        )}
      </div>
    </>
  )
}

