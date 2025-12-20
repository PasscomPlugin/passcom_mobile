"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Settings, Search, SlidersHorizontal, Eye, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TasksPage() {
  const router = useRouter()

  const [currentDate, setCurrentDate] = useState(new Date())

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Fix the Whiteboard",
      subtitle: "Starts Dec 16 4:33 PM - Due Dec 16 5:33 PM",
      priority: "Draft",
      completed: false,
    },
    {
      id: 2,
      title: "Update Documentation",
      subtitle: "Starts Dec 17 9:00 AM - Due Dec 17 11:00 AM",
      priority: "High",
      completed: false,
    },
    {
      id: 3,
      title: "Wash Hands",
      subtitle: "Starts Dec 16 4:34 PM - Due Dec 16 5:34 PM",
      completed: true,
    },
    {
      id: 4,
      title: "Review Code Changes",
      subtitle: "Starts Dec 18 2:00 PM - Due Dec 18 4:00 PM",
      completed: true,
    },
    {
      id: 5,
      title: "Team Standup Meeting",
      subtitle: "Starts Dec 19 10:00 AM - Due Dec 19 10:30 AM",
      completed: true,
    },
  ])

  const toggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const openTasks = tasks.filter((task) => !task.completed)
  const completedTasks = tasks.filter((task) => task.completed)

  // Date navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 1)
    setCurrentDate(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 1)
    setCurrentDate(newDate)
  }

  // Date formatting functions
  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
    return date.toLocaleDateString("en-US", options)
  }

  const getDateDisplayText = () => {
    if (isToday(currentDate)) {
      return "Today"
    }
    return formatDate(currentDate)
  }
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white px-4 py-4 flex items-center gap-2 border-b">
        {/* Back arrow */}
        <button onClick={() => router.back()} className="h-auto p-3 shrink-0 flex items-center justify-center">
          <ChevronLeft size={24} strokeWidth={3} />
        </button>

        {/* Date Range Selector - fills available width */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 gap-2 flex-1 min-w-0 h-12">
          <button onClick={goToPreviousDay} className="h-auto p-3 shrink-0 flex items-center justify-center">
            <ChevronLeft size={24} />
          </button>
          <span className="text-sm text-gray-600 whitespace-nowrap flex-1 text-center">{getDateDisplayText()}</span>
          <button onClick={goToNextDay} className="h-auto p-3 shrink-0 flex items-center justify-center">
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Right side icons - icons now 60px, circles 48px matching date area */}
        <div className="flex items-center gap-1 shrink-0">
          <button className="h-auto p-3 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <Search size={24} />
          </button>
          <button className="h-auto p-3 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <SlidersHorizontal size={24} />
          </button>
          <button className="h-auto p-3 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <Eye size={24} />
          </button>
          <button className="h-auto p-3 bg-gray-100 rounded-full hover:bg-gray-200 relative flex items-center justify-center">
            <Bell size={24} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
          </button>
          <button className="h-auto p-3 bg-gray-100 rounded-full hover:bg-gray-200 flex items-center justify-center">
            <Settings size={24} />
          </button>
        </div>
      </div>

      {/* Tasks Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {/* Open Tasks Section */}
        <div className="space-y-3">
          <button className="flex items-center gap-2 text-blue-500 font-semibold text-lg">
            Open tasks ({openTasks.length}) <ChevronRight className="h-5 w-5" />
          </button>

          {openTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 min-h-[68px] flex items-center justify-between cursor-pointer"
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex-1">
                <h3 className={`font-semibold text-base mb-1 ${task.completed ? "line-through text-gray-400" : ""}`}>
                  {task.title}
                </h3>
                <p className={`text-sm ${task.completed ? "text-gray-400" : "text-red-400"}`}>
                  {task.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {task.priority && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-100 px-3 py-1">
                    {task.priority}
                  </Badge>
                )}
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Done Tasks Section */}
        <div className="space-y-3">
          <button className="flex items-center gap-2 text-gray-400 font-semibold text-lg">
            Done tasks ({completedTasks.length}) <ChevronRight className="h-5 w-5" />
          </button>

          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="bg-green-50 rounded-lg p-4 shadow-sm border border-gray-200 min-h-[68px] flex items-center justify-between cursor-pointer"
              onClick={() => toggleTask(task.id)}
            >
              <div className="flex-1">
                <h3 className="font-semibold text-base mb-1 line-through text-gray-400">
                  {task.title}
                </h3>
                <p className="text-sm text-gray-400">{task.subtitle}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Button */}
      <div className="p-4 bg-white border-t">
        <Button
          onClick={() => alert("Open New Task Modal")}
          className="w-full h-14 rounded-full bg-cyan-400 hover:bg-cyan-500 text-white text-base font-medium"
        >
          Create task
        </Button>
      </div>
    </div>
  )
}

