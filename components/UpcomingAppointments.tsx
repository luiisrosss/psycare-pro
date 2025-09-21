import { Calendar, Clock, Users, User, Phone, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { obtenerMetricasDashboard } from '@/lib/actions/dashboard.actions'

interface Cita {
  id: string
  paciente: string
  pacienteId: string
  fecha: string
  hora: string
  duracion: number
  tipo: 'individual' | 'pareja' | 'familiar' | 'grupal'
  estado: 'programada' | 'completada' | 'cancelada' | 'no_asistio'
  telefono?: string
  email?: string
  notas?: string
}

// Datos de ejemplo
const citasProximas: Cita[] = [
  {
    id: '1',
    paciente: 'María García',
    pacienteId: '1',
    fecha: '2024-01-15',
    hora: '09:00',
    duracion: 50,
    tipo: 'individual',
    estado: 'programada',
    telefono: '+34 612 345 678',
    email: 'maria.garcia@email.com'
  },
  {
    id: '2',
    paciente: 'Juan Pérez',
    pacienteId: '2',
    fecha: '2024-01-15',
    hora: '11:30',
    duracion: 60,
    tipo: 'pareja',
    estado: 'programada',
    telefono: '+34 623 456 789',
    email: 'juan.perez@email.com'
  },
  {
    id: '3',
    paciente: 'Ana López',
    pacienteId: '3',
    fecha: '2024-01-15',
    hora: '16:00',
    duracion: 45,
    tipo: 'familiar',
    estado: 'programada',
    telefono: '+34 634 567 890',
    email: 'ana.lopez@email.com'
  },
  {
    id: '4',
    paciente: 'Carlos Ruiz',
    pacienteId: '4',
    fecha: '2024-01-16',
    hora: '10:00',
    duracion: 50,
    tipo: 'individual',
    estado: 'programada',
    telefono: '+34 645 678 901',
    email: 'carlos.ruiz@email.com'
  }
]

export default async function UpcomingAppointments() {
  // Obtener datos reales de Supabase con manejo de errores
  let citasProximas = []
  try {
    const metrics = await obtenerMetricasDashboard()
    citasProximas = metrics.recentAppointments
  } catch (error) {
    console.error('Error al obtener citas próximas:', error)
    // Usar datos de ejemplo en caso de error
    citasProximas = citasEjemplo
  }
  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'couple':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'family':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'group':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'scheduled':
        return 'bg-blue-500'
      case 'confirmed':
        return 'bg-green-500'
      case 'completed':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'no_show':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const obtenerTextoEstado = (estado: string) => {
    switch (estado) {
      case 'scheduled':
        return 'Programada'
      case 'confirmed':
        return 'Confirmada'
      case 'completed':
        return 'Completada'
      case 'cancelled':
        return 'Cancelada'
      case 'no_show':
        return 'No asistió'
      default:
        return 'Desconocido'
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

  const obtenerIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return <User className="h-3 w-3" />
      case 'couple':
        return <Users className="h-3 w-3" />
      case 'family':
        return <Users className="h-3 w-3" />
      case 'group':
        return <Users className="h-3 w-3" />
      default:
        return <User className="h-3 w-3" />
    }
  }

  const handleVerCita = (id: string) => {
    console.log('Ver cita:', id)
    // Aquí se implementaría la lógica para ver la cita completa
  }

  const handleEditarCita = (id: string) => {
    console.log('Editar cita:', id)
    // Aquí se implementaría la lógica para editar la cita
  }

  const handleLlamar = (telefono: string) => {
    window.open(`tel:${telefono}`, '_self')
  }

  const handleEnviarEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self')
  }

  return (
    <div className="space-y-3">
      {citasProximas.map((cita) => (
        <Card key={cita.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {cita.patient_name}
                  </h4>
                  <Badge className={cn('text-xs border', obtenerColorTipo(cita.session_type))}>
                    {obtenerIconoTipo(cita.session_type)}
                    <span className="ml-1">{cita.session_type.charAt(0).toUpperCase() + cita.session_type.slice(1)}</span>
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn(
                      'text-xs border',
                      cita.status === 'scheduled' && 'border-blue-500 text-blue-700',
                      cita.status === 'confirmed' && 'border-green-500 text-green-700',
                      cita.status === 'completed' && 'border-green-500 text-green-700',
                      cita.status === 'cancelled' && 'border-red-500 text-red-700',
                      cita.status === 'no_show' && 'border-orange-500 text-orange-700'
                    )}
                  >
                    {obtenerTextoEstado(cita.status)}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatearFecha(cita.appointment_date)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleVerCita(cita.id)}
              >
                <Calendar className="h-3 w-3 mr-1" />
                Ver
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleEditarCita(cita.id)}
              >
                <Clock className="h-3 w-3 mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {citasProximas.length === 0 && (
        <div className="text-center py-6">
          <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No hay citas próximas</p>
        </div>
      )}
    </div>
  )
}