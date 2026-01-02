"use client"

import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Users, Calendar, UserPlus, Menu } from "lucide-react"

export default function AdminBottomNav() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      id: "team",
      label: "Team",
      icon: Users,
      path: "/admin/team",
    },
    {
      id: "schedule",
      label: "Schedule",
      icon: Calendar,
      path: "/admin/schedule",
    },
    {
      id: "recruit",
      label: "Recruit",
      icon: UserPlus,
      path: "/admin/recruitment",
    },
    {
      id: "more",
      label: "More",
      icon: Menu,
      path: "/admin/more",
    },
  ]

  const isActive = (path: string) => {
    if (path === "/admin") {
      return pathname === "/admin"
    }
    return pathname?.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)

          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center min-w-[64px] py-1.5 px-2 rounded-lg transition-all ${
                active
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`${active ? "h-6 w-6" : "h-5 w-5"} transition-all`}
                strokeWidth={active ? 2.5 : 2}
              />
              <span
                className={`text-[11px] mt-1 font-medium ${
                  active ? "text-purple-600" : "text-gray-600"
                }`}
              >
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

