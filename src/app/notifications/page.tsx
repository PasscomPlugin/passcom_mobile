"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const router = useRouter()
  
  const [myTasksEnabled, setMyTasksEnabled] = useState(true)
  const [tasksIMadeEnabled, setTasksIMadeEnabled] = useState(true)
  
  // State for individual toggles
  const [newTaskAssigned, setNewTaskAssigned] = useState(true)
  const [taskEdited, setTaskEdited] = useState(false)
  const [taskPastDue, setTaskPastDue] = useState(true)
  const [taskStartApproaching, setTaskStartApproaching] = useState(true)
  const [userCompletedTask, setUserCompletedTask] = useState(false)
  const [createdTaskPastDue, setCreatedTaskPastDue] = useState(true)
  const [userAddedComment, setUserAddedComment] = useState(true)
  const [userViewedTask, setUserViewedTask] = useState(false)
  const [createdTaskStartApproaching, setCreatedTaskStartApproaching] = useState(true)

  const handleMyTasksToggle = (checked: boolean) => {
    setMyTasksEnabled(checked)
    setNewTaskAssigned(checked)
    setTaskEdited(checked)
    setTaskPastDue(checked)
    setTaskStartApproaching(checked)
  }

  const handleTasksIMadeToggle = (checked: boolean) => {
    setTasksIMadeEnabled(checked)
    setUserCompletedTask(checked)
    setCreatedTaskPastDue(checked)
    setUserAddedComment(checked)
    setUserViewedTask(checked)
    setCreatedTaskStartApproaching(checked)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 shrink-0"
            onClick={() => router.back()}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold">Task notifications</h1>
        </div>
        <a href="#" className="text-blue-600 text-sm font-medium whitespace-nowrap">
          all notifications
        </a>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Section 1: My tasks */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">My tasks</h3>
              <Switch checked={myTasksEnabled} onCheckedChange={handleMyTasksToggle} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task is late</span>
              <Switch checked={taskPastDue} onCheckedChange={setTaskPastDue} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task start time is approaching</span>
              <Switch checked={taskStartApproaching} onCheckedChange={setTaskStartApproaching} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task was assigned to me</span>
              <Switch checked={newTaskAssigned} onCheckedChange={setNewTaskAssigned} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task was changed</span>
              <Switch checked={taskEdited} onCheckedChange={setTaskEdited} className="shrink-0" />
            </div>
          </div>
        </div>

        {/* Section 2: Tasks I made */}
        <div>
          <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-200">
            <div className="flex items-center justify-between p-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Tasks I made</h3>
              <Switch checked={tasksIMadeEnabled} onCheckedChange={handleTasksIMadeToggle} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task is late</span>
              <Switch checked={createdTaskPastDue} onCheckedChange={setCreatedTaskPastDue} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task start time is approaching</span>
              <Switch
                checked={createdTaskStartApproaching}
                onCheckedChange={setCreatedTaskStartApproaching}
                className="shrink-0"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">A task is complete</span>
              <Switch checked={userCompletedTask} onCheckedChange={setUserCompletedTask} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">New comment on a task</span>
              <Switch checked={userAddedComment} onCheckedChange={setUserAddedComment} className="shrink-0" />
            </div>
            <div className="flex items-center justify-between p-4">
              <span className="text-base">Someone viewed a task</span>
              <Switch checked={userViewedTask} onCheckedChange={setUserViewedTask} className="shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

