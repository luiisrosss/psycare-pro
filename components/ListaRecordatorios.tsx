import { Bell, User, Calendar, Clock, Eye, Edit, Trash2, MoreHorizontal, CheckCircle, AlertCircle, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { obtenerRecordatorios, eliminarRecordatorio, marcarRecordatorioComoEnviado } from '@/lib/actions/reminder.actions'

interface Recordatorio {
  id: string
  psychologist_id: string
  patient_id: string
  appointment_id?: string
  reminder_type: 'appointment' | 'payment' | 'note' | 'follow_up' | 'custom'
  title: string
  message: string
  reminder_date: string
  is_sent: boolean
  sent_at?: string
  created_at: string
  updated_at: string
  patients?: {
    first_name: string
    last_name: string
    email?: string
    phone?: string
  }
  appointments?: {
    appointment_date: string
    session_type: string
  }
}

// Datos de ejemplo para cuando no hay conexión a Supabase
const recordatoriosEjemplo: Recordatorio[] = [
  {
    id: '1',
    psychologist_id: '1',
    patient_id: '1',
    reminder_type: 'appointment',
    title: 'Recordatorio de cita - María García',
    message: 'Tienes una cita programada para mañana a las 10:00. Tipo de sesión: Individual',
    reminder_date: '2024-01-15T09:00:00Z',
    is_sent: false,
    created_at: '2024-01-14T10:00:00Z',
    updated_at: '2024-01-14T10:00:00Z',
    patients: {
      first_name: 'María',
      last_name: 'García',
      email: 'maria.garcia@email.com',
      phone: '+34 612 345 678'
    },
    appointments: {
      appointment_date: '2024-01-15T10:00:00Z',
      session_type: 'individual'
    }
  },
  {
    id: '2',
    psychologist_id: '1',
    patient_id: '2',
    reminder_type: 'payment',
    title: 'Recordatorio de pago - Juan Pérez',
    message: 'La factura INV-2024-000001 por 60€ vence el 20/01/2024. Recuerda contactar al paciente.',
    reminder_date: '2024-01-17T09:00:00Z',
    is_sent: true,
    sent_at: '2024-01-17T09:05:00Z',
    created_at: '2024-01-16T10:00:00Z',
    updated_at: '2024-01-17T09:05:00Z',
    patients: {
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@email.com',
      phone: '+34 623 456 789'
    }
  }
]

interface ListaRecordatoriosProps {
  busqueda: string
  filtroPaciente: string
  filtroTipo: string
  filtroEstado: string
}

export default async function ListaRecordatorios({ busqueda, filtroPaciente, filtroTipo, filtroEstado }: ListaRecordatoriosProps) {
  // Intentar obtener recordatorios de Supabase, usar datos de ejemplo si falla
  let recordatorios: Recordatorio[] = recordatoriosEjemplo;
  
  try {
    recordatorios = await obtenerRecordatorios();
  } catch (error) {
    console.error('Error al obtener recordatorios:', error);
    // Usar datos de ejemplo en caso de error
  }

  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'appointment':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'payment':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'note':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'follow_up':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'custom':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerTextoEstado = (isSent: boolean, reminderDate: string) => {
    if (isSent) {
      return 'Enviado'
    }
    
    const ahora = new Date()
    const fechaRecordatorio = new Date(reminderDate)
    
    if (fechaRecordatorio < ahora) {
      return 'Vencido'
    }
    
    return 'Pendiente'
  }

  const obtenerColorEstado = (isSent: boolean, reminderDate: string) => {
    if (isSent) {
      return 'border-green-500 text-green-700'
    }
    
    const ahora = new Date()
    const fechaRecordatorio = new Date(reminderDate)
    
    if (fechaRecordatorio < ahora) {
      return 'border-red-500 text-red-700'
    }
    
    return 'border-orange-500 text-orange-700'
  }

  const obtenerIconoEstado = (isSent: boolean, reminderDate: string) => {
    if (isSent) {
      return <CheckCircle className="h-3 w-3" />
    }
    
    const ahora = new Date()
    const fechaRecordatorio = new Date(reminderDate)
    
    if (fechaRecordatorio < ahora) {
      return <AlertCircle className="h-3 w-3" />
    }
    
    return <Clock className="h-3 w-3" />
  }

  const filtrarRecordatorios = () => {
    return recordatorios.filter(recordatorio => {
      const nombrePaciente = recordatorio.patients ? `${recordatorio.patients.first_name} ${recordatorio.patients.last_name}` : '';
      
      const cumpleBusqueda = !busqueda || 
        recordatorio.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        recordatorio.message.toLowerCase().includes(busqueda.toLowerCase()) ||
        nombrePaciente.toLowerCase().includes(busqueda.toLowerCase())

      const cumplePaciente = !filtroPaciente || recordatorio.patient_id === filtroPaciente
      const cumpleTipo = !filtroTipo || recordatorio.reminder_type === filtroTipo
      
      let cumpleEstado = true
      if (filtroEstado) {
        const estado = obtenerTextoEstado(recordatorio.is_sent, recordatorio.reminder_date)
        cumpleEstado = estado.toLowerCase() === filtroEstado.toLowerCase()
      }

      return cumpleBusqueda && cumplePaciente && cumpleTipo && cumpleEstado
    })
  }

  const recordatoriosFiltrados = filtrarRecordatorios()

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatearHora = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleEliminarRecordatorio = async (id: string) => {
    try {
      await eliminarRecordatorio(id);
      // La página se recargará automáticamente debido a revalidatePath
    } catch (error) {
      console.error('Error al eliminar recordatorio:', error);
    }
  }

  const handleMarcarComoEnviado = async (id: string) => {
    try {
      await marcarRecordatorioComoEnviado(id);
      // La página se recargará automáticamente debido a revalidatePath
    } catch (error) {
      console.error('Error al marcar recordatorio como enviado:', error);
    }
  }

  const handleVerRecordatorio = (id: string) => {
    console.log('Ver recordatorio:', id)
    // Aquí se implementaría la lógica para ver el recordatorio completo
  }

  const handleEditarRecordatorio = (id: string) => {
    console.log('Editar recordatorio:', id)
    // Aquí se implementaría la lógica para editar el recordatorio
  }

  if (recordatoriosFiltrados.length === 0) {
    return (
      <div className="text-center py-8">
        <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron recordatorios</h3>
        <p className="text-gray-600">
          {busqueda || filtroPaciente || filtroTipo || filtroEstado
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'Aún no tienes recordatorios programados'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recordatoriosFiltrados.map((recordatorio) => (
        <Card key={recordatorio.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {recordatorio.title}
                  </h3>
                  <Badge className={cn('border', obtenerColorTipo(recordatorio.reminder_type))}>
                    {recordatorio.reminder_type.charAt(0).toUpperCase() + recordatorio.reminder_type.slice(1)}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn('border', obtenerColorEstado(recordatorio.is_sent, recordatorio.reminder_date))}
                  >
                    {obtenerIconoEstado(recordatorio.is_sent, recordatorio.reminder_date)}
                    <span className="ml-1">{obtenerTextoEstado(recordatorio.is_sent, recordatorio.reminder_date)}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {recordatorio.patients ? `${recordatorio.patients.first_name} ${recordatorio.patients.last_name}` : 'Paciente desconocido'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatearFecha(recordatorio.reminder_date)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatearHora(recordatorio.reminder_date)}
                  </div>
                  {recordatorio.is_sent && recordatorio.sent_at && (
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Enviado: {formatearHora(recordatorio.sent_at)}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-gray-700 line-clamp-2">
                    {recordatorio.message}
                  </p>
                </div>

                {recordatorio.appointments && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Cita relacionada:</strong> {formatearFecha(recordatorio.appointments.appointment_date)} - {recordatorio.appointments.session_type}
                    </p>
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleVerRecordatorio(recordatorio.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Recordatorio
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditarRecordatorio(recordatorio.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {!recordatorio.is_sent && (
                    <DropdownMenuItem onClick={() => handleMarcarComoEnviado(recordatorio.id)}>
                      <Send className="h-4 w-4 mr-2" />
                      Marcar como Enviado
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleEliminarRecordatorio(recordatorio.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Resumen de resultados */}
      <div className="text-center text-sm text-gray-600 pt-4 border-t">
        Mostrando {recordatoriosFiltrados.length} de {recordatorios.length} recordatorios
      </div>
    </div>
  )
}
