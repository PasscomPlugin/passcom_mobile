"use client"

import { Suspense, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Info, Plus, Send } from "lucide-react"

function ChatConversationContent() {
  const router = useRouter()
  const [messageText, setMessageText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Mock conversation data
  const [messages] = useState([
    {
      id: 1,
      sender: "them",
      senderName: "Sarah",
      senderAvatar: "SM",
      text: "Hey Jim, can you come in 30 mins early tomorrow?",
      timestamp: "2:34 PM",
    },
    {
      id: 2,
      sender: "me",
      text: "Sure, no problem. Is it busy?",
      timestamp: "2:35 PM",
    },
    {
      id: 3,
      sender: "them",
      senderName: "Sarah",
      senderAvatar: "SM",
      text: "Yeah, huge rush just hit.",
      timestamp: "2:36 PM",
    },
  ])

  // Scroll to bottom on mount
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (messageText.trim()) {
      console.log("Sending message:", messageText)
      // In a real app, this would send the message to the backend
      setMessageText("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-2 flex items-center justify-between z-10 h-14">
        <button
          onClick={() => router.push("/chat")}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors -ml-2"
        >
          <ArrowLeft className="h-6 w-6" strokeWidth={2} />
        </button>

        <div className="flex-1 flex flex-col items-center">
          <span className="text-base font-bold text-gray-900">Sarah (Manager)</span>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-gray-500">Active now</span>
          </div>
        </div>

        <button
          onClick={() => console.log("Info clicked")}
          className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 transition-colors"
        >
          <Info className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-end gap-2 ${
              message.sender === "me" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar (only for incoming messages) */}
            {message.sender === "them" && (
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">{message.senderAvatar}</span>
              </div>
            )}

            {/* Message Bubble */}
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                message.sender === "me"
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-900 rounded-bl-sm"
              }`}
            >
              <p className="text-base leading-relaxed">{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area (Sticky Bottom) */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Plus Button */}
          <button
            onClick={() => console.log("Attachment clicked")}
            className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
          >
            <Plus className="h-6 w-6" strokeWidth={2} />
          </button>

          {/* Input Field */}
          <input
            type="text"
            placeholder="Message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!messageText.trim()}
            className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
              messageText.trim()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <Send className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChatConversationPage() {
  return (
    <Suspense fallback={null}>
      <ChatConversationContent />
    </Suspense>
  )
}

