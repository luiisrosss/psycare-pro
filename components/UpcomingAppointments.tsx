'use client'

import { Calendar, Clock, User, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Appointment {
  id: string
  paciente: string
  fecha: string
  hora: string
  tipo: 'individual' | 'pareja' | 'familiar' | 'grupal'
  duracion: number
  estado: 'programada' | 'completada' | 'cancelada' | 'no_asistio'
  notas?: string
}

export default function UpcomingAppointments() {
  // Datos de ejemplo - en producción vendrían de Supabase
  const appointments: Appointment[] = [
    {
      id: '1',
      paciente: 'María García',
      fecha: '2024-01-15',
      hora: '10:00',
      tipo: 'individual',
      duracion: 50,
      estado: 'programada',
      notas: 'Seguimiento de ansiedad'
    },
    {
      id: '2',
      paciente: 'Juan Pérez',
      fecha: '2024-01-15',
      hora: '11:30',
      tipo: 'pareja',
      duracion: 60,
      estado: 'programada',
      notas: 'Terapia de pareja'
    },
    {
      id: '3',
      paciente: 'Ana López',
      fecha: '2024-01-16',
      hora: '09:00',
      tipo: 'individual',
      duracion: 45,
      estado: 'programada',
      notas: 'Evaluación inicial'
    },
    {
      id: '4',
      paciente: 'Carlos Ruiz',
      fecha: '2024-01-16',
      hora: '14:30',
      tipo: 'familiar',
      duracion: 60,
      estado: 'programada',
      notas: 'Terapia familiar'
    }
  ]

  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pareja':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'familiar':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'grupal':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha)
    const hoy = new Date()
    const mañana = new Date(hoy)
    mañana.setDate(hoy.getDate() + 1)

    if (fechaObj.toDateString() === hoy.toDateString()) {
      return 'Hoy'
    } else if (fechaObj.toDateString() === mañana.toDateString()) {
      return 'Mañana'
    } else {
      return fechaObj.toLocaleDateString('es-ES', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      })
    }
  }

  const esHoy = (fecha: string) => {
    const fechaObj = new Date(fecha)
    const hoy = new Date()
    return fechaObj.toDateString() === hoy.toDateString()
  }

  const esProximaHora = (hora: string) => {
    const ahora = new Date()
    const [horaCita, minutoCita] = hora.split(':').map(Number)
    const horaCitaObj = new Date()
    horaCitaObj.setHours(horaCita, minutoCita, 0, 0)
    
    const diferencia = horaCitaObj.getTime() - ahora.getTime()
    return diferencia > 0 && diferencia <= 60 * 60 * 1000 // Próxima hora
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No hay citas programadas</p>
        <p className="text-sm text-gray-400 mt-1">Agrega tu primera cita para comenzar</p>
        <Link href="/citas">
          <Button variant="outline" size="sm" className="mt-3">
            <Calendar className="h-4 w-4 mr-2" />
            Ver Calendario
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.slice(0, 4).map((appointment) => (
        <div
          key={appointment.id}
          className={`p-3 rounded-lg border ${
            esHoy(appointment.fecha) && esProximaHora(appointment.hora)
              ? 'border-orange-300 bg-orange-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{appointment.paciente}</h4>
                {esHoy(appointment.fecha) && esProximaHora(appointment.hora) && (
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Calendar className="h-3 w-3" />
                <span>{formatearFecha(appointment.fecha)}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{appointment.hora}</span>
                <span>•</span>
                <span>{appointment.duracion} min</span>
              </div>

              {appointment.notas && (
                <p className="text-xs text-gray-500 mb-2">{appointment.notas}</p>
              )}

              <Badge className={`text-xs border ${obtenerColorTipo(appointment.tipo)}`}>
                {appointment.tipo.charAt(0).toUpperCase() + appointment.tipo.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      ))}

      {appointments.length > 4 && (
        <div className="text-center pt-2">
          <Link href="/citas">
            <Button variant="ghost" size="sm" className="text-blue-600">
              Ver todas las citas ({appointments.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
