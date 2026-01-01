"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, AlertTriangle } from "lucide-react"

type RouteInfo = {
  name: string
  path: string
  file: string
  group: string
  deprecated?: boolean
  notes?: string
}

function DebugContent() {
  const router = useRouter()

  const APP_ROUTES: RouteInfo[] = [
    // Core Navigation
    { name: "Home (Feed)", path: "/", file: "app/page.tsx", group: "Core" },
    { name: "Tasks", path: "/tasks", file: "app/tasks/page.tsx", group: "Core", notes: "Contains: ViewTasksSheet, SortStatusSheet, TagSelectionSheet, SortUserSheet, DateRangeModal, OverdueTasksModal, TaskEditor" },
    { name: "Schedule", path: "/schedule", file: "app/schedule/page.tsx", group: "Core", notes: "Contains: ShiftCard component" },
    { name: "Time Clock", path: "/time-clock", file: "app/time-clock/page.tsx", group: "Core", notes: "3-step wizard: tips, review, success" },
    { name: "Chat Inbox", path: "/chat", file: "app/chat/page.tsx", group: "Core", notes: "Tabbed: Channels & Direct Messages, Contains: New Message Sheet" },
    { name: "Settings", path: "/settings", file: "app/settings/page.tsx", group: "Core" },

    // Chat
    { name: "Chat Conversation", path: "/chat/1", file: "app/chat/[id]/page.tsx", group: "Chat", notes: "Rich media support: text, image, video, gif, document, location, contact, link" },

    // Schedule
    { name: "Shift Details", path: "/schedule/shift/1", file: "app/schedule/shift/[id]/page.tsx", group: "Schedule", notes: "Contains: FindReplacementSheet, ReplacementRequestSentModal" },

    // Availability & Time Off
    { name: "Availability Hub", path: "/availability", file: "app/availability/page.tsx", group: "Availability", notes: "3 tabs: Pattern (drag-to-paint), Calendar (weekly view with layers), Requests, Contains: Time Off Request Sheet" },
    { name: "Time Off List", path: "/time-off", file: "app/time-off/page.tsx", group: "Availability" },
    { name: "Time Off Request Form", path: "/time-off/request", file: "app/time-off/request/page.tsx", group: "Availability", notes: "Type selector, date range, reason" },

    // Notifications
    { name: "Notification Inbox", path: "/notifications", file: "app/notifications/page.tsx", group: "Notifications" },
    { name: "Notification Settings", path: "/notification-settings", file: "app/notification-settings/page.tsx", group: "Notifications", notes: "Global settings + categories" },
    { name: "Schedule Notifications", path: "/notification-settings/schedule", file: "app/notification-settings/schedule/page.tsx", group: "Notifications" },
    { name: "Task Notifications", path: "/notification-settings/tasks", file: "app/notification-settings/tasks/page.tsx", group: "Notifications" },
    { name: "Time Clock Notifications", path: "/notification-settings/time-clock", file: "app/notification-settings/time-clock/page.tsx", group: "Notifications" },
    { name: "Celebrations Notifications", path: "/notification-settings/celebrations", file: "app/notification-settings/celebrations/page.tsx", group: "Notifications" },
    { name: "Time Off Notifications", path: "/notification-settings/time-off", file: "app/notification-settings/time-off/page.tsx", group: "Notifications" },

    // Profile & Pay
    { name: "Profile", path: "/profile", file: "app/profile/page.tsx", group: "Profile", notes: "Hero, Essentials, Skills, HR, Settings" },
    { name: "Documents & Pay Stubs", path: "/profile/documents", file: "app/profile/documents/page.tsx", group: "Profile" },
    { name: "Direct Deposit", path: "/profile/direct-deposit", file: "app/profile/direct-deposit/page.tsx", group: "Profile" },
    { name: "Emergency Contact", path: "/profile/emergency-contact", file: "app/profile/emergency-contact/page.tsx", group: "Profile" },
    { name: "Pay Dashboard", path: "/pay", file: "app/pay/page.tsx", group: "Profile", notes: "Available balance, work history, instant cash out" },
  ]

  // Group routes by category
  const groupedRoutes = APP_ROUTES.reduce((acc, route) => {
    if (!acc[route.group]) {
      acc[route.group] = []
    }
    acc[route.group].push(route)
    return acc
  }, {} as Record<string, RouteInfo[]>)

  const groupOrder = ["Core", "Chat", "Schedule", "Availability", "Notifications", "Profile"]

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center gap-3 z-10">
        <button
          onClick={() => router.push("/")}
          className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-gray-700 text-gray-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-white">App Map & Audit</h1>
        <span className="text-xs text-gray-400 ml-auto">{APP_ROUTES.length} routes</span>
      </div>

      {/* Content */}
      <div className="px-4 py-6 max-w-6xl mx-auto">
        {groupOrder.map((groupName) => {
          const routes = groupedRoutes[groupName]
          if (!routes) return null

          return (
            <div key={groupName} className="mb-8">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                {groupName}
                <span className="text-xs bg-gray-800 px-2 py-0.5 rounded">
                  {routes.length}
                </span>
              </h2>
              <div className="space-y-2">
                {routes.map((route) => (
                  <div
                    key={route.path}
                    className={`bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors ${
                      route.deprecated ? "opacity-60" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Left: Name */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-base font-bold text-white">{route.name}</h3>
                          {route.deprecated && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-900/50 text-red-300 text-xs font-semibold rounded border border-red-800">
                              <AlertTriangle className="h-3 w-3" />
                              DELETE?
                            </span>
                          )}
                        </div>
                        <code className="text-xs text-gray-400 font-mono break-all">
                          {route.file}
                        </code>
                        {route.notes && (
                          <p className="text-xs text-gray-500 mt-2 italic">{route.notes}</p>
                        )}
                      </div>

                      {/* Right: Go Button */}
                      <button
                        onClick={() => router.push(route.path)}
                        className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors"
                      >
                        Go
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Stats */}
      <div className="fixed bottom-4 right-4 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 shadow-lg">
        <div className="text-xs text-gray-400 space-y-1">
          <div>Total Routes: <span className="text-white font-bold">{APP_ROUTES.length}</span></div>
          <div>Deprecated: <span className="text-red-400 font-bold">{APP_ROUTES.filter(r => r.deprecated).length}</span></div>
        </div>
      </div>
    </div>
  )
}

export default function DebugPage() {
  return (
    <Suspense fallback={null}>
      <DebugContent />
    </Suspense>
  )
}

