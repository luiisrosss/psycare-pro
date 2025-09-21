'use client'

import { UserButton } from "@clerk/nextjs"
import { Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm">
      {/* Mobile menu button */}
      <Button variant="ghost" size="sm" className="lg:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Abrir sidebar</span>
      </Button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Search */}
        <div className="relative flex flex-1 items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Buscar pacientes, citas, notas..."
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-300"
          />
        </div>

        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

          {/* Profile dropdown */}
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8",
                userButtonPopoverCard: "shadow-lg border border-gray-200",
                userButtonPopoverActionButton: "text-gray-700 hover:bg-gray-50",
                userButtonPopoverActionButtonText: "text-sm font-medium"
              }
            }}
          />
        </div>
      </div>
    </header>
  )
}
