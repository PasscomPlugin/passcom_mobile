"use client"

import { useState } from "react"
import { Check, X, Clock, User, AlertCircle } from "lucide-react"
import { useGlobalApp } from "@/context/GlobalContext"

export default function ManagerDashboard() {
  const { requests, updateRequestStatus } = useGlobalApp()

  // Mock data for clocked-in employees
  const [clockedIn] = useState([
    { id: 1, name: "Sarah Mitchell", role: "Shift Lead", time: "2h 15m", avatar: "SM" },
    { id: 2, name: "Mike Chen", role: "Server", time: "1h 45m", avatar: "MC" },
    { id: 3, name: "Amy Rodriguez", role: "Host", time: "3h 30m", avatar: "AR" },
    { id: 4, name: "John Davis", role: "Kitchen", time: "2h 05m", avatar: "JD" },
  ])

  // Filter to show only pending requests
  const pendingRequests = requests.filter(r => r.status === 'pending')
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  const handleApprove = (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))
    updateRequestStatus(id, 'approved')
    setTimeout(() => {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 1000)
  }

  const handleDeny = (id: string) => {
    setProcessingIds(prev => new Set(prev).add(id))
    updateRequestStatus(id, 'denied')
    setTimeout(() => {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview and quick actions</p>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-6">
        
        {/* Widget 1: Live Floor */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                <h2 className="text-base font-bold text-gray-900">Live Floor</h2>
              </div>
              <div className="px-3 py-1 bg-white rounded-full border border-purple-200">
                <span className="text-sm font-bold text-purple-600">{clockedIn.length}/6 Active</span>
              </div>
            </div>
          </div>

          {/* Employee List */}
          <div className="divide-y divide-gray-100">
            {clockedIn.map((employee) => (
              <div key={employee.id} className="flex items-center gap-3 px-4 py-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0">
                  <span className="text-white text-xs font-bold">{employee.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{employee.name}</p>
                  <p className="text-xs text-gray-500">{employee.role}</p>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-full">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-xs font-medium text-green-700">{employee.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Approvals */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h2 className="text-base font-bold text-gray-900">Pending Approvals</h2>
              </div>
              <div className="px-3 py-1 bg-white rounded-full border border-orange-200">
                <span className="text-sm font-bold text-orange-600">{pendingRequests.length}</span>
              </div>
            </div>
          </div>

          {/* Approval List */}
          {pendingRequests.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {pendingRequests.map((request) => {
                const isProcessing = processingIds.has(request.id)
                const requestStatus = requests.find(r => r.id === request.id)?.status
                
                return (
                  <div key={request.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{request.type} Request</p>
                        <p className="text-xs text-gray-600 mt-0.5">{request.userName}</p>
                        <p className="text-xs text-gray-500 mt-1">{request.detail}</p>
                      </div>
                      {isProcessing && requestStatus === 'approved' && (
                        <div className="px-2 py-1 bg-green-100 rounded-md animate-in fade-in duration-200">
                          <span className="text-xs font-medium text-green-700">Approved</span>
                        </div>
                      )}
                      {isProcessing && requestStatus === 'denied' && (
                        <div className="px-2 py-1 bg-red-100 rounded-md animate-in fade-in duration-200">
                          <span className="text-xs font-medium text-red-700">Denied</span>
                        </div>
                      )}
                    </div>
                    
                    {!isProcessing && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                          Approve
                        </button>
                        <button
                          onClick={() => handleDeny(request.id)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                          <X className="h-4 w-4" strokeWidth={2.5} />
                          Deny
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-4 py-8 text-center">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <p className="text-sm font-medium text-gray-900">All caught up!</p>
              <p className="text-xs text-gray-500 mt-1">No pending approvals</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

