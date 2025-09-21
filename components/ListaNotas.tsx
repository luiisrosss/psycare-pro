'use client'

import { useState } from 'react'
import { FileText, User, Calendar, Clock, Eye, Edit, Trash2, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface NotaClinica {
  id: string
  paciente: string
  pacienteId: string
  fecha: string
  tipo: 'individual' | 'pareja' | 'familiar' | 'grupal'
  duracion: number
  contenido: string
  resumen?: string
  estado: 'borrador' | 'completada' | 'pendiente'
  fechaCreacion: string
  fechaActualizacion: string
}

// Datos de ejemplo
const notasEjemplo: NotaClinica[] = [
  {
    id: '1',
    paciente: 'María García',
    pacienteId: '1',
    fecha: '2024-01-15',
    tipo: 'individual',
    duracion: 50,
    contenido: 'Sesión enfocada en técnicas de relajación y manejo de ansiedad. El paciente mostró buena receptividad a los ejercicios de respiración.',
    resumen: 'Técnicas de relajación y manejo de ansiedad. Buena receptividad.',
    estado: 'completada',
    fechaCreacion: '2024-01-15T10:00:00Z',
    fechaActualizacion: '2024-01-15T10:50:00Z'
  },
  {
    id: '2',
    paciente: 'Juan Pérez',
    pacienteId: '2',
    fecha: '2024-01-15',
    tipo: 'pareja',
    duracion: 60,
    contenido: 'Terapia de pareja enfocada en comunicación efectiva. Se trabajó en técnicas de escucha activa y expresión de emociones.',
    resumen: 'Terapia de pareja - comunicación efectiva y escucha activa.',
    estado: 'completada',
    fechaCreacion: '2024-01-15T11:30:00Z',
    fechaActualizacion: '2024-01-15T12:30:00Z'
  },
  {
    id: '3',
    paciente: 'Ana López',
    pacienteId: '3',
    fecha: '2024-01-16',
    tipo: 'familiar',
    duracion: 45,
    contenido: 'Sesión familiar para abordar conflictos entre padres e hijos adolescentes. Se establecieron nuevas dinámicas de comunicación.',
    resumen: 'Conflicto familiar - nuevas dinámicas de comunicación.',
    estado: 'pendiente',
    fechaCreacion: '2024-01-16T16:00:00Z',
    fechaActualizacion: '2024-01-16T16:45:00Z'
  },
  {
    id: '4',
    paciente: 'Carlos Ruiz',
    pacienteId: '4',
    fecha: '2024-01-17',
    tipo: 'individual',
    duracion: 50,
    contenido: 'Evaluación inicial del paciente. Se identificaron áreas de trabajo principales: autoestima y relaciones interpersonales.',
    resumen: 'Evaluación inicial - autoestima y relaciones interpersonales.',
    estado: 'completada',
    fechaCreacion: '2024-01-17T10:00:00Z',
    fechaActualizacion: '2024-01-17T10:50:00Z'
  },
  {
    id: '5',
    paciente: 'Laura Martín',
    pacienteId: '5',
    fecha: '2024-01-17',
    tipo: 'individual',
    duracion: 50,
    contenido: 'Seguimiento de progreso. El paciente ha mostrado mejoras significativas en el manejo del estrés laboral.',
    resumen: 'Seguimiento - mejoras en manejo del estrés laboral.',
    estado: 'borrador',
    fechaCreacion: '2024-01-17T14:30:00Z',
    fechaActualizacion: '2024-01-17T15:20:00Z'
  }
]

interface ListaNotasProps {
  busqueda: string
  filtroPaciente: string
  filtroTipo: string
  filtroFecha: string
}

export default function ListaNotas({ busqueda, filtroPaciente, filtroTipo, filtroFecha }: ListaNotasProps) {
  const [notas, setNotas] = useState<NotaClinica[]>(notasEjemplo)

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

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-500'
      case 'pendiente':
        return 'bg-orange-500'
      case 'borrador':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const obtenerTextoEstado = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'Completada'
      case 'pendiente':
        return 'Pendiente'
      case 'borrador':
        return 'Borrador'
      default:
        return 'Desconocido'
    }
  }

  const filtrarNotas = () => {
    return notas.filter(nota => {
      const cumpleBusqueda = !busqueda || 
        nota.contenido.toLowerCase().includes(busqueda.toLowerCase()) ||
        nota.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
        (nota.resumen && nota.resumen.toLowerCase().includes(busqueda.toLowerCase()))

      const cumplePaciente = !filtroPaciente || nota.pacienteId === filtroPaciente
      const cumpleTipo = !filtroTipo || nota.tipo === filtroTipo
      const cumpleFecha = !filtroFecha || nota.fecha === filtroFecha

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

  const handleEliminarNota = (id: string) => {
    setNotas(notas.filter(nota => nota.id !== id))
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
                    {nota.paciente}
                  </h3>
                  <Badge className={cn('border', obtenerColorTipo(nota.tipo))}>
                    {nota.tipo.charAt(0).toUpperCase() + nota.tipo.slice(1)}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={cn(
                      'border',
                      nota.estado === 'completada' && 'border-green-500 text-green-700',
                      nota.estado === 'pendiente' && 'border-orange-500 text-orange-700',
                      nota.estado === 'borrador' && 'border-gray-500 text-gray-700'
                    )}
                  >
                    {obtenerTextoEstado(nota.estado)}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatearFecha(nota.fecha)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {nota.duracion} min
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {formatearHora(nota.fechaCreacion)}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-gray-700 line-clamp-2">
                    {nota.contenido}
                  </p>
                </div>

                {nota.resumen && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Resumen:</strong> {nota.resumen}
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
