'use client'

import { useState, Suspense } from 'react'
import { Calendar, Plus, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CalendarioCitas from '@/components/CalendarioCitas'
import CalendarioCitasSkeleton from '@/components/CalendarioCitasSkeleton'
import NuevaCitaForm from '@/components/NuevaCitaForm'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function CitasPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const [mostrarFormulario, setMostrarFormulario] = useState(false)

  if (!isLoaded) {
    return <div>Cargando...</div>
  }

  if (!isSignedIn) {
    router.push('/sign-in')
    return null
  }

  const handleNuevaCita = () => {
    setMostrarFormulario(true)
  }

  const handleGuardarCita = (cita: any) => {
    console.log('Nueva cita creada:', cita)
    // Aquí se implementaría la lógica para guardar en Supabase
    setMostrarFormulario(false)
  }

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Citas</h1>
        <p className="mt-1 text-sm text-gray-600">Organiza y gestiona todas tus citas</p>
      </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleNuevaCita}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cita
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">
              +2 desde ayer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Clock className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-600">
              +3 vs semana pasada
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-gray-600">
              Requieren confirmación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
            <Calendar className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-gray-600">
              Esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Citas
          </CardTitle>
          <CardDescription>
            Vista semanal y mensual de todas tus citas programadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<CalendarioCitasSkeleton />}>
            <CalendarioCitas />
          </Suspense>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Citas de Hoy</CardTitle>
            <CardDescription>
              Revisa las citas programadas para hoy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">09:00 - María García</span>
                <Badge variant="default">Individual</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">11:30 - Juan Pérez</span>
                <Badge variant="secondary">Pareja</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">16:00 - Ana López</span>
                <Badge variant="outline">Familiar</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Próximas Citas</CardTitle>
            <CardDescription>
              Citas programadas para los próximos días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">Mañana 10:00 - Carlos Ruiz</span>
                <Badge variant="default">Individual</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Miércoles 14:30 - Laura Martín</span>
                <Badge variant="secondary">Pareja</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tus citas de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleNuevaCita}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cita
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Ver Calendario
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="w-4 h-4 mr-2" />
                Gestionar Pacientes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Nueva Cita */}
      {mostrarFormulario && (
        <NuevaCitaForm
          onClose={handleCerrarFormulario}
          onSave={handleGuardarCita}
        />
      )}
    </div>
  )
}