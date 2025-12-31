"use client"

import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Search, Megaphone, Users } from "lucide-react"

function ChatInboxContent() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data
  const channels = [
    {
      id: "1",
      name: "📢 Announcements",
      icon: Megaphone,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      lastMessage: "Holiday hours update...",
      timestamp: "2h ago",
      unread: false,
    },
    {
      id: "2",
      name: "☕️ Barista Team",
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      lastMessage: "Mike: Who closed last night?",
      timestamp: "4h ago",
      unread: false,
    },
  ]

  const directMessages = [
    {
      id: "3",
      name: "Sarah (Manager)",
      avatar: "SM",
      lastMessage: "Approved your time off request.",
      timestamp: "1h ago",
      unread: true,
    },
    {
      id: "4",
      name: "Mike Johnson",
      avatar: "MJ",
      lastMessage: "Thanks for covering!",
      timestamp: "3h ago",
      unread: false,
    },
    {
      id: "5",
      name: "Liz Carter",
      avatar: "LC",
      lastMessage: "See you tomorrow.",
      timestamp: "Yesterday",
      unread: false,
    },
  ]

  const handleNavigateToChat = (chatId: string) => {
    router.push(`/chat/${chatId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-2 flex items-center justify-between z-10 h-14">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        <button
          onClick={() => console.log("New message")}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-blue-600 transition-colors"
        >
          <Plus className="h-6 w-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search people or channels"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto pb-6">
        {/* Section 1: Team Channels */}
        <div className="mt-6 mb-6">
          <h2 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Team Channels
          </h2>
          <div className="bg-white border-y border-gray-100 divide-y divide-gray-100">
            {channels.map((channel) => {
              const Icon = channel.icon
              return (
                <button
                  key={channel.id}
                  onClick={() => handleNavigateToChat(channel.id)}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`h-12 w-12 rounded-full ${channel.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`h-6 w-6 ${channel.iconColor}`} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-semibold text-gray-900 truncate">
                        {channel.name}
                      </span>
                      <span className="text-xs text-gray-500 shrink-0 ml-2">
                        {channel.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{channel.lastMessage}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Section 2: Direct Messages */}
        <div className="mb-6">
          <h2 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">
            Direct Messages
          </h2>
          <div className="bg-white border-y border-gray-100 divide-y divide-gray-100">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                onClick={() => handleNavigateToChat(dm.id)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors text-left relative"
              >
                {/* Unread indicator */}
                {dm.unread && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-blue-600" />
                )}

                {/* Avatar */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-sm font-bold">{dm.avatar}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-base truncate ${
                        dm.unread ? "font-semibold text-gray-900" : "font-medium text-gray-900"
                      }`}
                    >
                      {dm.name}
                    </span>
                    <span className="text-xs text-gray-500 shrink-0 ml-2">{dm.timestamp}</span>
                  </div>
                  <p
                    className={`text-sm truncate ${
                      dm.unread ? "font-medium text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {dm.lastMessage}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatInboxPage() {
  return (
    <Suspense fallback={null}>
      <ChatInboxContent />
    </Suspense>
  )
}
