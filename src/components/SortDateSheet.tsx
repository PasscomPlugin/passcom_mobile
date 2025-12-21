"use client"

import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface SortDateSheetProps {
  isVisible: boolean
  onClose: () => void
  onBack: () => void
  activeSortOption: string
  onSelectSortOption: (option: string) => void
  onOpenRangeFilter: () => void
}

export default function SortDateSheet({
  isVisible,
  onClose,
  onBack,
  activeSortOption,
  onSelectSortOption,
  onOpenRangeFilter,
}: SortDateSheetProps) {
  if (!isVisible) return null

  const dateSortOptions = [
    { id: "due-earliest", label: "Due Date: Earliest first" },
    { id: "due-latest", label: "Due Date: Latest first" },
    { id: "created-newest", label: "Creation Date: Newest first" },
    { id: "created-oldest", label: "Creation Date: Oldest first" },
  ]

  const handleSortSelect = (optionId: string) => {
    onSelectSortOption(optionId)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[60] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-[70] bg-white rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[70vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button
            onClick={onBack}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-bold text-gray-900 flex-1 text-center">Sort by Date</h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Sort Order Section */}
        <div className="py-2">
          {dateSortOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSortSelect(option.id)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors min-h-[56px]"
            >
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  activeSortOption === option.id ? "border-blue-500" : "border-gray-300"
                }`}
              >
                {activeSortOption === option.id && <div className="h-3 w-3 rounded-full bg-blue-500" />}
              </div>
              <span
                className={`text-base ${activeSortOption === option.id ? "font-semibold text-gray-900" : "text-gray-700"}`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>

        {/* Divider */}
        <div className="h-2 bg-gray-100" />

        {/* Advanced Filter Section */}
        <div className="py-2 bg-gray-50/50">
          <div className="px-6 py-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Filter</h3>
          </div>
          <button
            onClick={onOpenRangeFilter}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-100 transition-colors min-h-[56px] bg-white"
          >
            <span className="text-base text-gray-900">Filter by specific date range</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">None</span>
              <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
            </div>
          </button>
        </div>
      </div>
    </>
  )
}

