"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, MoreVertical, Copy, Edit, Trash2, Clock, AlertCircle, User, Tag, MapPin, CheckCircle, Check, Camera, X, FileText, Image } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DUMMY_USERS } from "@/data/dummyTasks"
import { AVAILABLE_TAGS } from "@/data/tags"
import { MediaCropEditor } from "@/components/MediaCropEditor"

// Helper function to format date
function formatTaskDate(dateString: string | Date): string {
  const date = new Date(dateString)
  const month = date.toLocaleString('en-US', { month: 'short' })
  const day = date.getDate()
  const time = date.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
  return `${month} ${day} ${time}`
}

interface ChecklistItem {
  id: string
  text: string
  isChecked: boolean
}

interface Task {
  id?: string
  title: string
  description?: string
  images?: string[]
  attachments?: string[]
  startTime?: string
  dueTime?: string
  assigneeId?: string
  assignedTo?: {
    name: string
    avatar: string
    color: string
  }
  tags?: string[]
  location?: string
  checklist?: ChecklistItem[]
  requirePhoto?: boolean
  proofPhoto?: string
  isBillable?: boolean
  billableDurationMinutes?: number
  billableRate?: number
  createdBy?: {
    name: string
    avatar: string
    color: string
    date: string
  }
}

interface TaskViewerProps {
  task: Task
  onClose: () => void
  onEdit: (task: Task) => void
  onCopy: (task: Task) => void
  onDelete: (taskId: string) => void
  onComplete: (taskId: string | number) => void
  isClockedIn?: boolean
}

export function TaskViewer({ task, onClose, onEdit, onCopy, onDelete, onComplete, isClockedIn = true }: TaskViewerProps) {
  const [showReminderSheet, setShowReminderSheet] = useState(false)
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist || [])
  const [proofPhoto, setProofPhoto] = useState<string | null>(task.proofPhoto || null)
  const [originalProofPhoto, setOriginalProofPhoto] = useState<string | null>(task.proofPhoto || null) // Preserve original
  const [isProofMenuOpen, setIsProofMenuOpen] = useState(false)
  const [mediaInEditor, setMediaInEditor] = useState<string | null>(null)
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isOvertime, setIsOvertime] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // Prevent hydration mismatch
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Set mounted state after hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Billable timer logic - only runs if billable, off the clock, AND client-side mounted
  useEffect(() => {
    if (isMounted && task.isBillable && !isClockedIn) {
      const interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const newSeconds = prev + 1
          // Check if overtime
          if (task.billableDurationMinutes && newSeconds / 60 > task.billableDurationMinutes) {
            setIsOvertime(true)
          }
          return newSeconds
        })
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [isMounted, task.isBillable, isClockedIn, task.billableDurationMinutes])

  // Format timer display
  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress percentage
  const getProgress = (): number => {
    if (!task.billableDurationMinutes) return 0
    return Math.min(100, (elapsedSeconds / 60 / task.billableDurationMinutes) * 100)
  }

  // Helper to get user details from assigneeId
  const getAssignedUser = () => {
    if (task.assignedTo) return task.assignedTo // Use existing object if available
    if (!task.assigneeId) return null
    const user = DUMMY_USERS.find(u => u.id === task.assigneeId)
    if (!user || user.id === 'unassigned') return null
    return {
      name: user.name,
      avatar: user.initials,
      color: 'bg-orange-400'
    }
  }
  
  const assignedUser = getAssignedUser()

  // Toggle checklist item
  const toggleChecklistItem = (itemId: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
      )
    )
  }

  // Check if all checklist items are complete
  const isChecklistComplete = () => {
    if (!checklist || checklist.length === 0) return true // No checklist = can mark done
    return checklist.every(item => item.isChecked)
  }

  // Handle proof photo upload
  const handleProofPhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const photoUrl = URL.createObjectURL(file)
      setProofPhoto(photoUrl)
      setOriginalProofPhoto(photoUrl) // Store original for re-editing
      setIsProofMenuOpen(false)
      // TODO: In production, upload to server and get permanent URL
    }
  }

  const handleCropComplete = (croppedImageUrl: string) => {
    // Revoke old cropped URL (if different from original)
    if (proofPhoto && proofPhoto !== originalProofPhoto) {
      URL.revokeObjectURL(proofPhoto)
    }
    // Update display URL with new cropped version
    setProofPhoto(croppedImageUrl)
    // Original URL remains unchanged in originalProofPhoto
    setMediaInEditor(null)
  }

  // Check if photo proof requirement is met
  const isPhotoProofComplete = () => {
    if (!task.requirePhoto) return true // No photo required = always ok
    return proofPhoto !== null
  }

  // Check if task can be marked as done
  const canMarkAsDone = () => {
    return isChecklistComplete() && isPhotoProofComplete()
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-white flex flex-col">
        {/* Header */}
        <div className={`sticky top-0 border-b px-4 py-4 flex items-center gap-4 z-10 ${
          task.isBillable && !isClockedIn ? 'bg-emerald-50' : 'bg-white'
        }`}>
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault()
              onClose()
            }}
            className="h-auto p-3 shrink-0 flex items-center justify-center -ml-3"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" strokeWidth={2.5} />
          </button>
          <h1 className="text-lg font-semibold flex-1 text-center">Task details</h1>
          <div className="relative">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsActionsMenuOpen(!isActionsMenuOpen)
              }}
              className="h-auto p-3 shrink-0 flex items-center justify-center -mr-3"
            >
              <MoreVertical className="h-6 w-6 text-gray-600" />
            </button>

            {/* Actions Menu Dropdown */}
            {isActionsMenuOpen && (
              <>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsActionsMenuOpen(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      onCopy(task)
                      setIsActionsMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-left border-b"
                  >
                    <Copy className="h-5 w-5 text-gray-600" />
                    <span className="text-base text-gray-900">Copy Task</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      onEdit(task)
                      setIsActionsMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-left border-b"
                  >
                    <Edit className="h-5 w-5 text-gray-600" />
                    <span className="text-base text-gray-900">Edit Task</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      if (task.id) {
                        onDelete(task.id)
                        setIsActionsMenuOpen(false)
                        onClose()
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-left border-b"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                    <span className="text-base text-red-600">Delete Task</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      setIsActionsMenuOpen(false)
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer text-left"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                    <span className="text-base text-gray-900">Cancel</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Billable Timer Display - Only if billable, off clock, and mounted */}
        {isMounted && task.isBillable && !isClockedIn && (
          <div className={`px-6 py-4 border-b ${isOvertime ? 'bg-red-50' : 'bg-emerald-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-semibold ${isOvertime ? 'text-red-700' : 'text-emerald-700'}`}>
                You are being paid now.
              </span>
              <div className="text-right">
                <div className={`text-lg font-bold ${isOvertime ? 'text-red-700' : 'text-emerald-700'}`}>
                  {formatTimer(elapsedSeconds)} / {task.billableDurationMinutes?.toString().padStart(2, '0')}:00
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${
                  isOvertime ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${getProgress()}%` }}
              />
            </div>
            {isOvertime && (
              <p className="text-xs text-red-600 mt-2 font-medium">
                ⚠️ Time limit exceeded - contact manager
              </p>
            )}
          </div>
        )}

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-auto px-6 py-6">
          {/* Title */}
          <h2 className="text-3xl font-bold text-blue-500 mb-2">{task.title}</h2>

          {/* Description */}
          {task.description && (
            <p className="text-base text-gray-700 mb-4 leading-relaxed">{task.description}</p>
          )}

          {/* Media */}
          {((task.images && task.images.length > 0) || (task.attachments && task.attachments.length > 0)) && (
            <div className="mb-6">
              <img
                src={task.images?.[0] || task.attachments?.[0]}
                alt="Task attachment"
                className="w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            </div>
          )}

          {/* Meta Rows - Only render if data exists */}
          <div className="space-y-0">
            {/* Start time */}
            {task.startTime && (
              <div className="flex items-center gap-3 py-4 border-b">
                <Clock className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-gray-900 flex-1">Start time</span>
                <span className="text-gray-700">{formatTaskDate(task.startTime)}</span>
              </div>
            )}

            {/* Due date */}
            {task.dueTime && (
              <div className="flex items-center gap-3 py-4 border-b">
                <AlertCircle className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-gray-900 flex-1">Due date</span>
                <span className="text-gray-700">{formatTaskDate(task.dueTime)}</span>
              </div>
            )}

            {/* Assigned to */}
            {assignedUser && (
              <div className="flex items-center gap-3 py-4 border-b">
                <User className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-gray-900 flex-1">Assigned to</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-7 w-7 rounded-full ${assignedUser.color} flex items-center justify-center text-white text-xs font-semibold`}
                  >
                    {assignedUser.avatar}
                  </div>
                  <span className="text-gray-700">{assignedUser.name}</span>
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
              <div className="flex items-center gap-3 py-4 border-b">
                <Tag className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-gray-900 flex-1">Tags</span>
                <div className="flex gap-2 flex-wrap">
                  {task.tags.map((tagId, index) => {
                    const tag = AVAILABLE_TAGS.find(t => t.id === tagId)
                    return tag ? (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${tag.color}`}
                      >
                        {tag.label}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            )}

            {/* Photo of Finished Task */}
            {task.requirePhoto && (
              <>
                <div className="flex items-center gap-3 py-4 border-b">
                  <Camera className="h-5 w-5 text-blue-400" />
                  <span className="font-bold text-gray-900 flex-1">Photo of finished task</span>
                  <button
                    type="button"
                    onClick={() => setIsProofMenuOpen(true)}
                    className="text-blue-500 hover:text-blue-600 text-base"
                  >
                    Take Photo
                  </button>
                </div>

                {/* Photo Display - if photo exists */}
                {proofPhoto && (
                  <div className="py-4 border-b">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative group">
                        <div
                          className="w-full aspect-[4/3] rounded-lg border border-gray-200 cursor-pointer bg-gray-50 overflow-hidden relative"
                          onClick={() => setMediaInEditor(originalProofPhoto)}
                        >
                          <img
                            src={proofPhoto}
                            alt="Proof of completion"
                            className="w-full h-full object-cover"
                          />
                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Revoke URLs to free memory
                              if (proofPhoto) {
                                URL.revokeObjectURL(proofPhoto)
                              }
                              if (originalProofPhoto && originalProofPhoto !== proofPhoto) {
                                URL.revokeObjectURL(originalProofPhoto)
                              }
                              setProofPhoto(null)
                              setOriginalProofPhoto(null)
                            }}
                            className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Location */}
            {task.location && (
              <div className="flex items-center gap-3 py-4 border-b">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="font-bold text-gray-900 flex-1">Location</span>
                <span className="text-blue-500 text-sm truncate max-w-[200px]">{task.location}</span>
              </div>
            )}

            {/* Checklist */}
            {checklist && checklist.length > 0 && (
              <div className="py-4 border-b">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                  <span className="font-bold text-gray-900">Checklist</span>
                  <span className={`text-sm font-medium ${
                    isChecklistComplete() ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {checklist.filter(item => item.isChecked).length} / {checklist.length}
                    {isChecklistComplete() && ' ✓'}
                  </span>
                </div>
                <div className="space-y-2 ml-8">
                  {checklist.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 -ml-2 pl-2 pr-2 py-1 rounded transition-colors"
                      onClick={() => toggleChecklistItem(item.id)}
                    >
                      <div className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                        item.isChecked 
                          ? 'bg-blue-500 border-blue-500' 
                          : 'border-gray-300 hover:border-blue-400'
                      }`}>
                        {item.isChecked && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <span className={`transition-all ${item.isChecked ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Photo Upload Menu (Hidden, triggered from main list) */}
          {isProofMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsProofMenuOpen(false)}
              />
              <div className="fixed top-[120px] right-4 bg-white border rounded-lg shadow-lg py-2 w-48 z-20">
                <button
                  type="button"
                  onClick={() => {
                    cameraInputRef.current?.click()
                    setIsProofMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <Camera className="h-5 w-5 text-gray-700" />
                  <span className="text-base">Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click()
                    setIsProofMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <Image className="h-5 w-5 text-gray-700" />
                  <span className="text-base">Saved Images</span>
                </button>
              </div>
            </>
          )}

          {/* Hidden file inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleProofPhotoSelect}
            className="hidden"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProofPhotoSelect}
            className="hidden"
          />
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-6 py-6 border-t">
          {/* Action Buttons */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={() => setShowReminderSheet(true)}
              className="flex-1 h-12 bg-purple-500 hover:bg-purple-600 text-white text-base font-medium rounded-full"
            >
              Send reminder
            </Button>
            <Button 
              disabled={!canMarkAsDone() || (task.isBillable && !isClockedIn && isOvertime)}
              className={`flex-1 h-12 text-white text-base font-medium rounded-full flex items-center justify-center gap-2 transition-all ${
                task.isBillable && !isClockedIn && isOvertime
                  ? 'bg-red-500 hover:bg-red-600'
                  : canMarkAsDone() 
                  ? (task.isBillable && !isClockedIn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-teal-400 hover:bg-teal-500')
                  : 'bg-gray-300 cursor-not-allowed opacity-60'
              }`}
              onClick={() => {
                // Overtime billable tasks need manager approval
                if (task.isBillable && !isClockedIn && isOvertime) {
                  alert("Time limit exceeded. Please contact your supervisor to resolve this task.")
                  return
                }

                if (!canMarkAsDone()) {
                  if (!isPhotoProofComplete()) {
                    alert("You must upload a photo to complete this task.")
                  } else if (!isChecklistComplete()) {
                    alert("Please complete all checklist items first.")
                  }
                  return
                }
                
                // Mark task as complete
                if (task.id) {
                  // Show success message for billable tasks
                  if (task.isBillable && !isClockedIn) {
                    alert(`Task Complete! $${task.billableRate?.toFixed(2)} credited to your account.`)
                  }
                  onComplete(task.id)
                  onClose() // Close viewer to show updated list
                }
              }}
            >
              <CheckCircle className="h-5 w-5" />
              {task.isBillable && !isClockedIn && isOvertime 
                ? 'Time Limit Exceeded - Contact Manager'
                : task.isBillable && !isClockedIn
                ? `Complete & Claim $${task.billableRate?.toFixed(2)}`
                : 'Mark as done'}
              {!canMarkAsDone() && !isOvertime && (
                <span className="text-xs ml-1">
                  {!isPhotoProofComplete() ? '(Photo required)' : '(Complete checklist)'}
                </span>
              )}
            </Button>
          </div>

          {/* Created by */}
          {task.createdBy && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>Created by</span>
              <div
                className={`h-5 w-5 rounded-full ${task.createdBy.color} flex items-center justify-center text-white text-xs font-semibold`}
              >
                {task.createdBy.avatar}
              </div>
              <span>{task.createdBy.name}</span>
              <span>At {task.createdBy.date}</span>
            </div>
          )}
        </div>
      </div>

      {/* Media Crop Editor */}
      {mediaInEditor && (
        <MediaCropEditor
          isOpen={!!mediaInEditor}
          onClose={() => setMediaInEditor(null)}
          imageSrc={mediaInEditor}
          onCropComplete={handleCropComplete}
        />
      )}

      {/* Reminder Sheet Modal */}
      {showReminderSheet && <ReminderSheet onClose={() => setShowReminderSheet(false)} />}
    </>
  )
}

function ReminderSheet({ onClose }: { onClose: () => void }) {
  const [reminders, setReminders] = useState([
    { id: 1, name: "Pete Seager", avatar: "PS", color: "bg-orange-400", sent: false },
    { id: 2, name: "Sarah Johnson", avatar: "SJ", color: "bg-blue-400", sent: false },
    { id: 3, name: "Mike Chen", avatar: "MC", color: "bg-green-400", sent: false },
    { id: 4, name: "Emma Davis", avatar: "ED", color: "bg-purple-400", sent: false },
  ])

  const handleRemindOne = (id: number) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, sent: true } : r)))
  }

  const handleRemindEveryone = () => {
    setReminders(reminders.map((r) => ({ ...r, sent: true })))
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      {/* Bottom Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b">
          <h2 className="text-xl font-semibold text-center">Send reminder</h2>
        </div>

        {/* Assignee List - Scrollable */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="space-y-3">
            {reminders.map((person) => (
              <div key={person.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-full ${person.color} flex items-center justify-center text-white text-sm font-semibold`}
                  >
                    {person.avatar}
                  </div>
                  <span className="text-base font-medium text-gray-900">{person.name}</span>
                </div>

                {person.sent ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    Sent
                  </div>
                ) : (
                  <Button
                    onClick={() => handleRemindOne(person.id)}
                    className="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-full text-sm font-medium h-auto"
                  >
                    Remind
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 h-12 bg-white border-gray-300 text-gray-700 rounded-full text-base font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleRemindEveryone}
            className="flex-[2] h-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full text-base font-medium"
          >
            Remind everyone
          </Button>
        </div>
      </div>
    </>
  )
}

