"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, User, LogOut } from "lucide-react"

export default function AdminMorePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b px-4 py-2 flex items-center gap-2 z-10 h-14">
        <button 
          className="h-12 w-12 rounded-full flex items-center justify-center hover:bg-purple-50 text-purple-600 transition-colors -ml-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-[30px] w-[30px]" strokeWidth={2.5} />
        </button>
        <h1 className="text-lg font-semibold flex-1">More</h1>
      </div>

      {/* Content */}
      <div className="py-6">
        
        {/* Mode Switch Section */}
        <div className="mb-6">
          <h2 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Switch Mode</h2>
          <div className="bg-white border-y border-gray-100">
            <button
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-base font-bold text-blue-600">Switch to Employee View</p>
                  <p className="text-xs text-gray-500 mt-0.5">View your schedule, clock in/out, tasks</p>
                </div>
              </div>
              <ArrowLeft className="h-5 w-5 text-gray-400 rotate-180" />
            </button>
          </div>
        </div>

        {/* Admin Settings Placeholder */}
        <div className="mb-6">
          <h2 className="px-4 mb-2 text-xs font-bold text-gray-500 uppercase tracking-wide">Manager Settings</h2>
          <div className="bg-white border-y border-gray-100 divide-y divide-gray-100">
            <button className="w-full px-4 py-4 text-left hover:bg-slate-50 transition-colors">
              <p className="text-base text-gray-900">Notification Preferences</p>
              <p className="text-xs text-gray-500 mt-0.5">Manager alerts and updates</p>
            </button>
            <button className="w-full px-4 py-4 text-left hover:bg-slate-50 transition-colors">
              <p className="text-base text-gray-900">Location Settings</p>
              <p className="text-xs text-gray-500 mt-0.5">Manage store locations</p>
            </button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="px-4">
          <button
            onClick={() => console.log('Sign out')}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-red-200 hover:bg-red-50 text-red-600 rounded-xl font-semibold transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  )
}

