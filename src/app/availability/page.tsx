"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { WeeklyAvailability, SlotStatus } from '@/types/availability'
import { createEmptySchedule, SLOT_STATUS, DAYS_OF_WEEK } from '@/types/availability'

const CELL_HEIGHT = 22
const CELL_WIDTH = 44
const TIME_LABEL_WIDTH = 70

// Business hours (slot indices: 2 slots per hour, 0 = midnight)
const WEEKDAY_START = 16 // 8 AM
const WEEKDAY_END = 36   // 6 PM
const WEEKEND_START = 20 // 10 AM  
const WEEKEND_END = 44   // 10 PM

type WizardStep = 'preferred' | 'available'

// Helper: Convert slot index to time string
function slotIndexToTime(index: number): string {
  const hour = Math.floor(index / 2)
  const minute = (index % 2) * 30
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
}

// Helper: Check if slot is within business hours for a given day
function isBusinessHours(dayIndex: number, slotIndex: number): boolean {
  const isWeekend = dayIndex >= 5 // Saturday (5) and Sunday (6)
  
  if (isWeekend) {
    return slotIndex >= WEEKEND_START && slotIndex <= WEEKEND_END
  } else {
    return slotIndex >= WEEKDAY_START && slotIndex <= WEEKDAY_END
  }
}

// Helper: Get background color for slot status
function getSlotColor(status: number, dayIndex: number, slotIndex: number): string {
  // If outside business hours, show grey (closed)
  if (!isBusinessHours(dayIndex, slotIndex)) {
    return '#eeeeee' // Grey for closed
  }
  
  // Within business hours
  switch (status) {
    case SLOT_STATUS.PREFERRED:
      return '#d4edda' // Light green
    case SLOT_STATUS.AVAILABLE:
      return '#d1ecf1' // Light blue
    default:
      return '#ffffff' // White (open, not selected)
  }
}

function AvailabilityContent() {
  const router = useRouter()
  const [availability, setAvailability] = useState<WeeklyAvailability>(createEmptySchedule())
  const [step, setStep] = useState<WizardStep>('preferred')
  const [isPainting, setIsPainting] = useState(false)
  const [paintMode, setPaintMode] = useState<'paint' | 'erase'>('paint')
  const scrollViewRef = useRef<HTMLDivElement>(null)
  const paintedCellsRef = useRef<Set<string>>(new Set())
  const autoScrollIntervalRef = useRef<any>(null)

  // Update a specific slot
  const updateSlot = (dayIndex: number, slotIndex: number, newStatus: SlotStatus) => {
    const newAvailability = [...availability]
    newAvailability[dayIndex].slots[slotIndex].status = newStatus
    setAvailability(newAvailability)
  }

  // Handle cell interaction (click or drag)
  const handleCellInteraction = (dayIndex: number, slotIndex: number, isInitial: boolean = false) => {
    // Can't interact with closed hours
    if (!isBusinessHours(dayIndex, slotIndex)) {
      return
    }
    
    const currentStatus = availability[dayIndex].slots[slotIndex].status
    
    // Step 2 constraint: can't modify preferred (green) cells
    if (step === 'available' && currentStatus === SLOT_STATUS.PREFERRED) {
      return
    }

    // Check if already painted in this drag
    const cellKey = `${dayIndex}-${slotIndex}`
    if (paintedCellsRef.current.has(cellKey) && !isInitial) {
      return // Skip if already painted in this drag
    }

    // On initial press, determine paint mode based on current cell status
    if (isInitial) {
      const stepStatus = step === 'preferred' ? SLOT_STATUS.PREFERRED : SLOT_STATUS.AVAILABLE
      setPaintMode(currentStatus === stepStatus ? 'erase' : 'paint')
      paintedCellsRef.current.clear()
    }

    // Apply paint mode
    const stepStatus = step === 'preferred' ? SLOT_STATUS.PREFERRED : SLOT_STATUS.AVAILABLE
    const newStatus = paintMode === 'erase' ? SLOT_STATUS.UNAVAILABLE : stepStatus
    
    if (currentStatus !== newStatus) {
      updateSlot(dayIndex, slotIndex, newStatus)
      paintedCellsRef.current.add(cellKey)
    }
  }

  // Start auto-scroll when near edges
  const startAutoScroll = (direction: 'up' | 'down') => {
    if (autoScrollIntervalRef.current) return

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollViewRef.current) {
        const currentScrollY = scrollViewRef.current.scrollTop
        const newScrollY = direction === 'up' 
          ? Math.max(0, currentScrollY - 10) 
          : currentScrollY + 10
        scrollViewRef.current.scrollTop = newScrollY
      }
    }, 16) // ~60fps
  }

  // Stop auto-scroll
  const stopAutoScroll = () => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
  }

  // Handle mouse/touch move over grid
  const handlePointerMove = (event: MouseEvent | TouchEvent) => {
    if (!isPainting) return

    const target = event.target as HTMLElement
    const dayIndex = target.getAttribute('data-day')
    const slotIndex = target.getAttribute('data-slot')

    if (dayIndex !== null && slotIndex !== null) {
      handleCellInteraction(parseInt(dayIndex), parseInt(slotIndex))
    }

    // Check for auto-scroll
    const clientY = 'clientY' in event ? event.clientY : event.touches?.[0]?.clientY
    if (clientY) {
      const windowHeight = window.innerHeight
      const topEdgeZone = 200 // px from top (larger to account for headers)
      const bottomEdgeZone = 100 // px from bottom

      if (clientY < topEdgeZone) {
        startAutoScroll('up')
      } else if (clientY > windowHeight - bottomEdgeZone) {
        startAutoScroll('down')
      } else {
        stopAutoScroll()
      }
    }
  }

  // Handle paint end
  const handlePaintEnd = () => {
    setIsPainting(false)
    stopAutoScroll()
    paintedCellsRef.current.clear()
  }

  // Calculate totals
  const preferredCount = availability.reduce(
    (sum, day) => sum + day.slots.filter(s => s.status === SLOT_STATUS.PREFERRED).length,
    0
  )
  const availableCount = availability.reduce(
    (sum, day) => sum + day.slots.filter(s => s.status === SLOT_STATUS.AVAILABLE).length,
    0
  )
  const preferredHours = (preferredCount * 0.5).toFixed(1)
  const availableHours = (availableCount * 0.5).toFixed(1)
  const totalHours = ((preferredCount + availableCount) * 0.5).toFixed(1)

  // Handle save
  const handleSave = () => {
    console.log('=== AVAILABILITY SAVED ===')
    console.log(`Preferred Hours: ${preferredHours}`)
    console.log(`Available Hours: ${availableHours}`)
    console.log(`Total Hours: ${totalHours}`)
    console.log('Full availability data:', availability)
    
    // TODO: Send to backend API
    // For now, show alert
    alert(`✅ Availability Saved!\n\nPreferred: ${preferredHours} hrs\nAvailable: ${availableHours} hrs\nTotal: ${totalHours} hrs`)
    
    // Navigate back to schedule page
    router.push('/schedule')
  }

  // Add global mouse/touch listeners
  useEffect(() => {
    const handleGlobalMouseUp = () => handlePaintEnd()
    const handleGlobalTouchEnd = () => handlePaintEnd()
    const handleGlobalMouseMove = (e: MouseEvent) => handlePointerMove(e)
    const handleGlobalTouchMove = (e: TouchEvent) => handlePointerMove(e)

    // Always listen for mouse/touch up
    document.addEventListener('mouseup', handleGlobalMouseUp)
    document.addEventListener('touchend', handleGlobalTouchEnd)

    // Listen for move events only when painting
    if (isPainting) {
      document.addEventListener('mousemove', handleGlobalMouseMove)
      document.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    }

    return () => {
      document.removeEventListener('mouseup', handleGlobalMouseUp)
      document.removeEventListener('touchend', handleGlobalTouchEnd)
      document.removeEventListener('mousemove', handleGlobalMouseMove)
      document.removeEventListener('touchmove', handleGlobalTouchMove)
      stopAutoScroll()
    }
  }, [isPainting])

  // Render slots from 7 AM to 10 PM to cover all business hours
  const startSlot = 14 // 7 AM (covers weekday 8 AM start)
  const endSlot = 44   // 10 PM (covers weekend 10 PM end)
  const visibleSlots = Array.from({ length: endSlot - startSlot + 1 }, (_, i) => i + startSlot)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6 text-blue-500" />
        </Button>
        <h1 className="text-lg font-semibold">My Availability</h1>
        <div className="w-10" />
      </div>

      {/* Instructions Bar */}
      <div className="px-5 py-4 flex items-center justify-between bg-gray-50">
        <p className="text-sm font-bold text-gray-900 flex-1">
          {step === 'preferred' 
            ? 'Tap the hours you prefer to work' 
            : 'Add other hours you can work'}
        </p>
        <div className="flex gap-2">
          {step === 'preferred' ? (
            <Button 
              className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold min-w-[80px]"
              onClick={() => setStep('available')}
            >
              Next
            </Button>
          ) : (
            <>
              <Button 
                variant="outline"
                className="px-5 py-2.5 rounded-full bg-gray-500 hover:bg-gray-600 text-white font-bold min-w-[80px] border-0"
                onClick={() => setStep('preferred')}
              >
                Back
              </Button>
              <Button 
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold min-w-[80px]"
                onClick={handleSave}
              >
                Save
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 py-3 bg-gray-50">
        <p className="text-sm font-semibold text-gray-700 text-center">
          {step === 'preferred' 
            ? `Preferred: ${preferredHours} hrs`
            : `Preferred: ${preferredHours} hrs  •  Available: ${availableHours} hrs  •  Total: ${totalHours} hrs`}
        </p>
      </div>

      {/* Day Headers */}
      <div className="flex bg-gray-100 border-b border-gray-300">
        <div style={{ width: TIME_LABEL_WIDTH }} />
        {DAYS_OF_WEEK.map((day) => (
          <div 
            key={day} 
            className="flex-1 h-10 flex items-center justify-center border-r border-gray-300"
          >
            <span className="text-xs font-bold text-gray-900">{day}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div 
        ref={scrollViewRef}
        className="flex-1 overflow-auto"
      >
        {visibleSlots.map((slotIndex) => (
          <div key={slotIndex} className="flex">
            {/* Time Label */}
            <div 
              className="relative flex items-start" 
              style={{ width: TIME_LABEL_WIDTH, height: CELL_HEIGHT }}
            >
              {slotIndex % 2 === 0 && (
                <span className="absolute top-[-6px] right-2 text-[11px] text-gray-500">
                  {slotIndexToTime(slotIndex)}
                </span>
              )}
            </div>

            {/* Day Cells */}
            {DAYS_OF_WEEK.map((day, dayIndex) => {
              const slot = availability[dayIndex].slots[slotIndex]
              const isClosed = !isBusinessHours(dayIndex, slotIndex)
              const isLocked = step === 'available' && slot.status === SLOT_STATUS.PREFERRED
              const isDisabled = isClosed || isLocked
              
              return (
                <div
                  key={`${dayIndex}-${slotIndex}`}
                  className="flex-1 border-[0.5px] border-gray-300 flex items-center justify-center cursor-pointer select-none"
                  style={{ 
                    height: CELL_HEIGHT,
                    backgroundColor: getSlotColor(slot.status, dayIndex, slotIndex),
                    opacity: isLocked ? 0.6 : isClosed ? 0.5 : 1
                  }}
                  data-day={dayIndex}
                  data-slot={slotIndex}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    if (!isDisabled) {
                      setIsPainting(true)
                      handleCellInteraction(dayIndex, slotIndex, true)
                    }
                  }}
                  onMouseEnter={() => {
                    if (isPainting && !isDisabled) {
                      handleCellInteraction(dayIndex, slotIndex)
                    }
                  }}
                  onTouchStart={(e) => {
                    e.preventDefault()
                    if (!isDisabled) {
                      setIsPainting(true)
                      handleCellInteraction(dayIndex, slotIndex, true)
                    }
                  }}
                >
                  {isLocked && <span className="text-xs">🔒</span>}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d4edda' }} />
          <span>Preferred</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: '#d1ecf1' }} />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <span>Closed</span>
        </div>
      </div>
    </div>
  )
}

export default function AvailabilityPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AvailabilityContent />
    </Suspense>
  )
}

