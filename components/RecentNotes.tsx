import { FileText, User, Calendar, Clock, Eye, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { obtenerMetricasDashboard } from '@/lib/actions/dashboard.actions'

interface NotaClinica {
  id: string
  paciente: string
  fecha: string
  tipo: 'individual' | 'pareja' | 'familiar' | 'grupal'
  duracion: number
  contenido: string
  resumen?: string
  estado: 'borrador' | 'completada' | 'pendiente'
}

// Datos de ejemplo
const notasRecientes: NotaClinica[] = [
  {
    id: '1',
    paciente: 'María García',
    fecha: '2024-01-15',
    tipo: 'individual',
    duracion: 50,
    contenido: 'Sesión enfocada en técnicas de relajación y manejo de ansiedad. El paciente mostró buena receptividad a los ejercicios de respiración.',
    resumen: 'Técnicas de relajación y manejo de ansiedad. Buena receptividad.',
    estado: 'completada'
  },
  {
    id: '2',
    paciente: 'Juan Pérez',
    fecha: '2024-01-15',
    tipo: 'pareja',
    duracion: 60,
    contenido: 'Terapia de pareja enfocada en comunicación efectiva. Se trabajó en técnicas de escucha activa y expresión de emociones.',
    resumen: 'Terapia de pareja - comunicación efectiva y escucha activa.',
    estado: 'completada'
  },
  {
    id: '3',
    paciente: 'Ana López',
    fecha: '2024-01-16',
    tipo: 'familiar',
    duracion: 45,
    contenido: 'Sesión familiar para abordar conflictos entre padres e hijos adolescentes. Se establecieron nuevas dinámicas de comunicación.',
    resumen: 'Conflicto familiar - nuevas dinámicas de comunicación.',
    estado: 'pendiente'
  }
]

export default async function RecentNotes() {
  // Obtener datos reales de Supabase con manejo de errores
  let notasRecientes = []
  try {
    const metrics = await obtenerMetricasDashboard()
    notasRecientes = metrics.recentNotes
  } catch (error) {
    console.error('Error al obtener notas recientes:', error)
    // Usar datos de ejemplo en caso de error
    notasRecientes = notasEjemplo
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

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleVerNota = (id: string) => {
    console.log('Ver nota:', id)
    // Aquí se implementaría la lógica para ver la nota completa
  }

  const handleEditarNota = (id: string) => {
    console.log('Editar nota:', id)
    // Aquí se implementaría la lógica para editar la nota
  }

  return (
    <div className="space-y-3">
      {notasRecientes.map((nota) => (
        <Card key={nota.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {nota.patient_name}
                  </h4>
                  <Badge className={cn('text-xs border', obtenerColorTipo(nota.note_type))}>
                    {nota.note_type.charAt(0).toUpperCase() + nota.note_type.slice(1)}
                  </Badge>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatearFecha(nota.created_at)}
                  </div>
                </div>

                <h5 className="text-xs font-medium text-gray-900 mb-1">{nota.title}</h5>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleVerNota(nota.id)}
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={() => handleEditarNota(nota.id)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Editar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {notasRecientes.length === 0 && (
        <div className="text-center py-6">
          <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No hay notas recientes</p>
        </div>
      )}
    </div>
  )
}