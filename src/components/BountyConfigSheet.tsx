"use client"

import type React from "react"

import { useState } from "react"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"

interface BountyConfigSheetProps {
  isOpen: boolean
  onClose: () => void
  onSave: (minutes: number, autoApprove: boolean) => void
}

export function BountyConfigSheet({ isOpen, onClose, onSave }: BountyConfigSheetProps) {
  const [minutes, setMinutes] = useState(5)
  const [autoApprove, setAutoApprove] = useState(false)

  const incrementMinutes = () => setMinutes((prev) => prev + 1)
  const decrementMinutes = () => setMinutes((prev) => Math.max(1, prev - 1))

  const handleSave = () => {
    onSave(minutes, autoApprove)
    onClose()
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value) || 1
    setMinutes(Math.max(1, value))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-xl max-h-[80vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Grab Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold">Set Task Bounty</h2>
            <Button type="button" variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">Set the compensated time for this off-clock task.</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-6 space-y-6">
          {/* Paid Duration Input */}
          <div className="space-y-3">
            <label className="text-base font-medium">Paid Duration</label>
            <div className="flex items-center justify-center gap-4 py-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={decrementMinutes}
                disabled={minutes <= 1}
                className="h-12 w-12 rounded-full bg-transparent"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <div className="text-center min-w-[120px]">
                <Input
                  type="number"
                  value={minutes}
                  onChange={handleMinutesChange}
                  min={1}
                  className="text-5xl font-bold text-gray-900 text-center border-0 p-0 h-auto focus-visible:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <div className="text-sm text-gray-500 mt-1">Minutes</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={incrementMinutes}
                className="h-12 w-12 rounded-full bg-transparent"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Auto-approve Setting */}
          <div className="flex items-start justify-between gap-3 py-3">
            <div className="flex-1">
              <div className="font-medium text-base">Auto-approve payment</div>
              <div className="text-sm text-gray-500 mt-1">Payment is released immediately upon task completion.</div>
            </div>
            <Switch checked={autoApprove} onCheckedChange={setAutoApprove} className="mt-1" />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-white">
          <Button
            type="button"
            onClick={handleSave}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-base font-medium rounded-full"
          >
            Save Bounty
          </Button>
        </div>
      </div>
    </>
  )
}

