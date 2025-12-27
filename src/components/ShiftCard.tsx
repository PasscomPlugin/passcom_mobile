"use client"

import { Clock, User } from "lucide-react"
import { Shift, calculateShiftHours } from "@/data/dummyShifts"
import { Badge } from "@/components/ui/badge"

interface ShiftCardProps {
  shift: Shift
  onClick?: () => void
}

export function ShiftCard({ shift, onClick }: ShiftCardProps) {
  const hours = calculateShiftHours(shift)
  
  // Status badge styling
  const statusStyles = {
    'scheduled': 'bg-blue-100 text-blue-800 border-0',
    'clocked-in': 'bg-green-100 text-green-800 border-0',
    'completed': 'bg-gray-100 text-gray-600 border-0',
    'no-show': 'bg-red-100 text-red-800 border-0',
  }
  
  const statusLabels = {
    'scheduled': 'Scheduled',
    'clocked-in': 'Clocked In',
    'completed': 'Completed',
    'no-show': 'No Show',
  }
  
  const isCompleted = shift.status === 'completed'
  
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 border transition-all active:scale-[0.99] cursor-pointer ${
        isCompleted
          ? 'bg-gray-50 border-gray-200 opacity-75'
          : 'bg-white border-gray-200 shadow-sm hover:border-blue-200'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Time and Status Badge */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              {shift.startTime} - {shift.endTime}
            </span>
            <Badge variant="secondary" className={`h-5 px-1.5 text-[10px] font-bold ${statusStyles[shift.status]}`}>
              {statusLabels[shift.status]}
            </Badge>
          </div>
          
          {/* Job Title */}
          <h3 className={`font-semibold truncate mb-1 ${
            isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {shift.job}
          </h3>
          
          {/* Hours */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>{hours.toFixed(1)} hours</span>
          </div>
        </div>
        
        {/* Avatar / Assignee */}
        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-xs font-bold border-2 border-white shadow-sm shrink-0">
          {shift.assignedUserName.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
      
      {/* Notes (if any) */}
      {shift.notes && (
        <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
          {shift.notes}
        </div>
      )}
    </div>
  )
}

