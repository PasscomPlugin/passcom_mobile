"use client"

import { useState } from "react"
import { ArrowLeft, Paperclip, Check, Camera, Image as ImageIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChecklistItem {
  id: string
  text: string
  isChecked: boolean
}

interface Task {
  id?: string
  title: string
  description?: string
  startTime?: string
  dueTime?: string
  assigneeId?: string
  tags?: string[]
  status?: string
  priority?: string
  creatorId?: string
  completed?: boolean
  requirePhoto?: boolean
  attachments?: string[]
  location?: string
  checklist?: ChecklistItem[]
}

interface TaskDetailsProps {
  isVisible: boolean
  onClose: () => void
  onComplete: (taskId: string | number) => void
  task: Task
}

export function TaskDetails({ isVisible, onClose, onComplete, task }: TaskDetailsProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist || [])
  const [attachments, setAttachments] = useState<string[]>(task.attachments || [])

  const handleChecklistToggle = (itemId: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      )
    )
  }

  const handleAddPhoto = () => {
    // Simulate adding a photo
    const newPhoto = `https://placehold.co/600x400/png?text=Photo+${attachments.length + 1}`
    setAttachments(prev => [...prev, newPhoto])
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const handleComplete = () => {
    if (task.id) {
      onComplete(task.id)
    }
    onClose()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-2 flex items-center gap-2 z-10 h-14">
        <button
          type="button"
          onClick={onClose}
          className="h-12 w-12 -ml-2 rounded-full flex items-center justify-center hover:bg-blue-50 text-blue-600 transition-colors focus:outline-none"
        >
          <ArrowLeft className="h-[30px] w-[30px]" strokeWidth={2.5} />
        </button>
        <h1 className="text-xl font-bold text-gray-900 flex-1">Task Details</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
          </div>

          {/* Description */}
          {task.description && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Description
              </label>
              <p className="text-base text-gray-600">{task.description}</p>
            </div>
          )}

          {/* Time */}
          {(task.startTime || task.dueTime) && (
            <div className="grid grid-cols-2 gap-4">
              {task.startTime && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Start Time
                  </label>
                  <p className="text-base text-gray-600">
                    {new Date(task.startTime).toLocaleString()}
                  </p>
                </div>
              )}
              {task.dueTime && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Due Time
                  </label>
                  <p className="text-base text-gray-600">
                    {new Date(task.dueTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {task.location && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Location
              </label>
              <p className="text-base text-gray-600">{task.location}</p>
            </div>
          )}

          {/* Checklist (Interactive) */}
          {checklist.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-3 block">
                Checklist
              </label>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleChecklistToggle(item.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        item.isChecked
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {item.isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </div>
                    <span
                      className={`flex-1 text-base ${
                        item.isChecked ? "text-gray-400 line-through" : "text-gray-900"
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attachments & Add Photo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                Photos & Comments
              </label>
              <button
                type="button"
                onClick={handleAddPhoto}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Camera className="h-4 w-4" />
                Add Photo
              </button>
            </div>

            {attachments.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {attachments.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAttachment(index)}
                      className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
                <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No photos yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Complete Button */}
      <div className="sticky bottom-0 bg-white border-t px-6 py-4">
        <button
          type="button"
          onClick={handleComplete}
          disabled={task.status === 'done'}
          className={`w-full h-14 rounded-full font-semibold text-base shadow-lg flex items-center justify-center gap-2 transition-all ${
            task.status === 'done'
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <Check className="h-5 w-5" />
          {task.status === 'done' ? 'Task Completed' : 'Complete Task'}
        </button>
      </div>
    </div>
  )
}

