"use client"

import { X, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActiveFilter {
  type: 'date' | 'status' | 'tag' | 'creator' | 'assignee'
  label: string
  values: any[]
}

interface ViewTasksSheetProps {
  isVisible: boolean
  onClose: () => void
  onOpenDateSort: () => void
  onOpenStatusFilter: () => void
  onOpenTagFilter: () => void
  onOpenCreatorFilter: () => void
  onOpenAssigneeFilter: () => void
  activeFilters: ActiveFilter[]
  previewCount: number | null
  onClearAll: () => void
  onApplyFilters: () => void
  calculateMatchingTasks: (filters: ActiveFilter[]) => any[]
  allDays: any[]
}

export default function ViewTasksSheet({
  isVisible,
  onClose,
  onOpenDateSort,
  onOpenStatusFilter,
  onOpenTagFilter,
  onOpenCreatorFilter,
  onOpenAssigneeFilter,
  activeFilters,
  previewCount,
  onClearAll,
  onApplyFilters,
  calculateMatchingTasks,
  allDays,
}: ViewTasksSheetProps) {
  if (!isVisible) return null

  const filterItems = [
    { id: 1, label: "Date", type: 'date' as const, onClick: onOpenDateSort },
    { id: 2, label: "Status", type: 'status' as const, onClick: onOpenStatusFilter },
    { id: 3, label: "Tag", type: 'tag' as const, onClick: onOpenTagFilter },
    { id: 4, label: "Creator", type: 'creator' as const, onClick: onOpenCreatorFilter },
    { id: 5, label: "Assignee", type: 'assignee' as const, onClick: onOpenAssigneeFilter },
  ]
  
  const isFilterActive = (type: string) => {
    return activeFilters.some(f => f.type === type)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[75vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex-1 text-center">Filter Tasks</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Filter Options */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-2">
            {filterItems.map((item) => {
              const activeFilter = activeFilters.find(f => f.type === item.type)
              const active = !!activeFilter
              
              // Extract just the value part from the label (after the colon)
              const filterValue = activeFilter?.label.includes(':') 
                ? activeFilter.label.split(':')[1].trim() 
                : activeFilter?.label
              
              // Calculate count for this filter type
              const getFilterTypeCount = () => {
                if (!active) return null
                // Count tasks matching this specific filter combined with others
                const testFilters = activeFilters.filter(f => f.type === item.type)
                if (testFilters.length === 0) return null
                return calculateMatchingTasks(testFilters).length
              }
              
              const filterCount = getFilterTypeCount()
              
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors min-h-[60px]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {active && (
                      <Check className="h-5 w-5 text-green-600 shrink-0" />
                    )}
                    <div className="flex items-baseline gap-2 min-w-0 flex-1">
                      <span className={`text-base shrink-0 ${active ? 'font-semibold text-green-600' : 'text-gray-900'}`}>
                        {item.label}
                      </span>
                      {active && filterValue && (
                        <span className="text-sm text-gray-500 truncate">
                          {filterValue}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {active && filterCount !== null && (
                      <span className="text-sm text-gray-500">({filterCount})</span>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Apply Filter & Clear All Buttons */}
        <div className="p-4 border-t bg-white space-y-2">
          <Button 
            onClick={previewCount === 0 ? onClearAll : onApplyFilters}
            className={`w-full h-12 rounded-full font-semibold ${
              previewCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {previewCount === null 
              ? 'Apply Filters' 
              : previewCount === 0
                ? 'No tasks match - remove filters'
                : `Apply Filters (${previewCount} task${previewCount === 1 ? '' : 's'})`
            }
          </Button>
          {activeFilters.length > 0 && (
            <Button 
              onClick={onClearAll}
              variant="outline"
              className="w-full h-10 rounded-full text-red-600 border-red-600 hover:bg-red-50 font-medium text-sm"
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

