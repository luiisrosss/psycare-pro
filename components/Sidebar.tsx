'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  Bell,
  Settings,
  ChevronRight,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: LayoutDashboard,
    current: false
  },
  { 
    name: 'Pacientes', 
    href: '/pacientes', 
    icon: Users,
    current: false
  },
  { 
    name: 'Citas', 
    href: '/citas', 
    icon: Calendar,
    current: false
  },
  { 
    name: 'Notas', 
    href: '/notas', 
    icon: FileText,
    current: false
  },
  { 
    name: 'Facturación', 
    href: '/facturacion', 
    icon: CreditCard,
    current: false
  },
  { 
    name: 'Recordatorios', 
    href: '/recordatorios', 
    icon: Bell,
    current: false
  },
]

const quickActions = [
  { name: 'Nuevo Paciente', href: '/pacientes', icon: Users },
  { name: 'Nueva Cita', href: '/citas', icon: Calendar },
  { name: 'Nueva Nota', href: '/notas', icon: FileText },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900">PsyCare Pro</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6">
        <ul role="list" className="flex flex-1 flex-col gap-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "group flex gap-x-3 rounded-lg p-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-600"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                  {isActive && (
                    <ChevronRight className="ml-auto h-4 w-4 text-blue-700" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className="px-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Acciones Rápidas
          </h3>
          <div className="space-y-1">
            {quickActions.map((action) => (
              <Link key={action.name} href={action.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <Plus className="h-4 w-4 mr-2 text-gray-400" />
                  {action.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="mt-auto pt-6">
          <Link href="/configuracion">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            >
              <Settings className="h-4 w-4 mr-2 text-gray-400" />
              Configuración
            </Button>
          </Link>
        </div>
      </nav>
    </div>
  )
}
