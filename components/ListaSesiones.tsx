import { FileText, User, Calendar, Clock, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { obtenerSesiones, eliminarSesion } from '@/lib/actions/notes.actions'

interface SesionClinica {
  id: string
  psychologist_id: string
  patient_id: string
  appointment_id?: string
  session_type: 'individual' | 'couple' | 'family' | 'group'
  title: string
  content: string
  ai_summary?: string
  tags: string[]
  is_confidential: boolean
  created_at: string
  updated_at: string
  patients?: {
    first_name: string
    last_name: string
  }
  appointments?: {
    appointment_date: string
    duration_minutes: number
    session_type: string
  }
}

// Datos de ejemplo para cuando no hay conexión a Supabase
const notasEjemplo: NotaClinica[] = [
  {
    id: '1',
    psychologist_id: '1',
    patient_id: '1',
    note_type: 'session',
    title: 'Sesión de evaluación inicial',
    content: 'Sesión enfocada en técnicas de relajación y manejo de ansiedad. El paciente mostró buena receptividad a los ejercicios de respiración.',
    ai_summary: 'Técnicas de relajación y manejo de ansiedad. Buena receptividad.',
    tags: ['ansiedad', 'relajación'],
    is_confidential: true,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:50:00Z',
    patients: {
      first_name: 'María',
      last_name: 'García'
    },
    appointments: {
      appointment_date: '2024-01-15T10:00:00Z',
      duration_minutes: 50,
      session_type: 'individual'
    }
  }
]

interface ListaNotasProps {
  busqueda: string
  filtroPaciente: string
  filtroTipo: string
  filtroFecha: string
}

export default async function ListaNotas({ busqueda, filtroPaciente, filtroTipo, filtroFecha }: ListaNotasProps) {
  // Intentar obtener notas de Supabase, usar datos de ejemplo si falla
  let notas: NotaClinica[] = notasEjemplo;
  
  try {
    notas = await obtenerNotas();
  } catch (error) {
    console.error('Error al obtener notas:', error);
    // Usar datos de ejemplo en caso de error
  }

  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'session':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'assessment':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'treatment_plan':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'progress':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerTextoEstado = (confidencial: boolean) => {
    return confidencial ? 'Confidencial' : 'Público'
  }

  const obtenerTextoEstadoColor = (confidencial: boolean) => {
    return confidencial ? 'border-red-500 text-red-700' : 'border-green-500 text-green-700'
  }

  const filtrarNotas = () => {
    return notas.filter(nota => {
      const nombrePaciente = nota.patients ? `${nota.patients.first_name} ${nota.patients.last_name}` : '';
      
      const cumpleBusqueda = !busqueda || 
        nota.content.toLowerCase().includes(busqueda.toLowerCase()) ||
        nota.title.toLowerCase().includes(busqueda.toLowerCase()) ||
        nombrePaciente.toLowerCase().includes(busqueda.toLowerCase()) ||
        (nota.ai_summary && nota.ai_summary.toLowerCase().includes(busqueda.toLowerCase()))

      const cumplePaciente = !filtroPaciente || nota.patient_id === filtroPaciente
      const cumpleTipo = !filtroTipo || nota.note_type === filtroTipo
      const cumpleFecha = !filtroFecha || nota.created_at.split('T')[0] === filtroFecha

      return cumpleBusqueda && cumplePaciente && cumpleTipo && cumpleFecha
    })
  }

  const notasFiltradas = filtrarNotas()

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

  const handleEliminarNota = async (id: string) => {
    try {
      await eliminarNota(id);
      // La página se recargará automáticamente debido a revalidatePath
    } catch (error) {
      console.error('Error al eliminar nota:', error);
    }
  }

  const handleVerNota = (id: string) => {
    console.log('Ver nota:', id)
    // Aquí se implementaría la lógica para ver la nota completa
  }

  const handleEditarNota = (id: string) => {
    console.log('Editar nota:', id)
    // Aquí se implementaría la lógica para editar la nota
  }

  if (notasFiltradas.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron notas</h3>
        <p className="text-gray-600">
          {busqueda || filtroPaciente || filtroTipo || filtroFecha
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'Aún no tienes notas clínicas registradas'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notasFiltradas.map((nota) => (
        <Card key={nota.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {nota.patients ? `${nota.patients.first_name} ${nota.patients.last_name}` : 'Paciente desconocido'}
                  </h3>
                  <Badge className={cn('border', obtenerColorTipo(nota.note_type))}>
                    {nota.note_type.charAt(0).toUpperCase() + nota.note_type.slice(1)}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn('border', obtenerTextoEstadoColor(nota.is_confidential))}
                  >
                    {obtenerTextoEstado(nota.is_confidential)}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatearFecha(nota.created_at)}
                  </div>
                  {nota.appointments && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {nota.appointments.duration_minutes} min
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {formatearHora(nota.created_at)}
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">{nota.title}</h4>
                  <p className="text-gray-700 line-clamp-2">
                    {nota.content}
                  </p>
                </div>

                {nota.ai_summary && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Resumen IA:</strong> {nota.ai_summary}
                    </p>
                  </div>
                )}

                {nota.tags && nota.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {nota.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
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
                  <DropdownMenuItem onClick={() => handleVerNota(nota.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Nota
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditarNota(nota.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleEliminarNota(nota.id)}
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
        Mostrando {notasFiltradas.length} de {notas.length} notas
      </div>
    </div>
  )
}
