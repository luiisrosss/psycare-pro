'use client'

import { FileText, User, Calendar, Clock, Eye } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ClinicalNote {
  id: string
  paciente: string
  fecha: string
  tipo: 'individual' | 'pareja' | 'familiar' | 'grupal'
  contenido: string
  resumen?: string
  estado: 'borrador' | 'completada' | 'pendiente'
  fechaCreacion: string
}

export default function RecentNotes() {
  // Datos de ejemplo - en producción vendrían de Supabase
  const notes: ClinicalNote[] = [
    {
      id: '1',
      paciente: 'María García',
      fecha: '2024-01-15',
      tipo: 'individual',
      contenido: 'Sesión enfocada en técnicas de relajación y manejo de ansiedad. El paciente mostró buena receptividad a los ejercicios de respiración.',
      resumen: 'Técnicas de relajación y manejo de ansiedad. Buena receptividad.',
      estado: 'completada',
      fechaCreacion: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      paciente: 'Juan Pérez',
      fecha: '2024-01-15',
      tipo: 'pareja',
      contenido: 'Terapia de pareja enfocada en comunicación efectiva. Se trabajó en técnicas de escucha activa y expresión de emociones.',
      resumen: 'Terapia de pareja - comunicación efectiva y escucha activa.',
      estado: 'completada',
      fechaCreacion: '2024-01-15T11:30:00Z'
    },
    {
      id: '3',
      paciente: 'Ana López',
      fecha: '2024-01-16',
      tipo: 'familiar',
      contenido: 'Sesión familiar para abordar conflictos entre padres e hijos adolescentes. Se establecieron nuevas dinámicas de comunicación.',
      resumen: 'Conflicto familiar - nuevas dinámicas de comunicación.',
      estado: 'pendiente',
      fechaCreacion: '2024-01-16T16:00:00Z'
    },
    {
      id: '4',
      paciente: 'Carlos Ruiz',
      fecha: '2024-01-17',
      tipo: 'individual',
      contenido: 'Evaluación inicial del paciente. Se identificaron áreas de trabajo principales: autoestima y relaciones interpersonales.',
      resumen: 'Evaluación inicial - autoestima y relaciones interpersonales.',
      estado: 'completada',
      fechaCreacion: '2024-01-17T10:00:00Z'
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

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pendiente':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'borrador':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha)
    const hoy = new Date()
    const ayer = new Date(hoy)
    ayer.setDate(hoy.getDate() - 1)

    if (fechaObj.toDateString() === hoy.toDateString()) {
      return 'Hoy'
    } else if (fechaObj.toDateString() === ayer.toDateString()) {
      return 'Ayer'
    } else {
      return fechaObj.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      })
    }
  }

  const truncarTexto = (texto: string, maxLength: number) => {
    if (texto.length <= maxLength) return texto
    return texto.substring(0, maxLength) + '...'
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No hay notas clínicas</p>
        <p className="text-sm text-gray-400 mt-1">Crea tu primera nota para comenzar</p>
        <Link href="/notas">
          <Button variant="outline" size="sm" className="mt-3">
            <FileText className="h-4 w-4 mr-2" />
            Ver Notas
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.slice(0, 3).map((note) => (
        <div key={note.id} className="p-3 rounded-lg border border-gray-200 bg-white">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-sm">{note.paciente}</h4>
                <Badge className={`text-xs border ${obtenerColorTipo(note.tipo)}`}>
                  {note.tipo.charAt(0).toUpperCase() + note.tipo.slice(1)}
                </Badge>
                <Badge className={`text-xs border ${obtenerColorEstado(note.estado)}`}>
                  {note.estado.charAt(0).toUpperCase() + note.estado.slice(1)}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Calendar className="h-3 w-3" />
                <span>{formatearFecha(note.fecha)}</span>
                <Clock className="h-3 w-3 ml-2" />
                <span>{new Date(note.fechaCreacion).toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>

              <p className="text-xs text-gray-700 mb-2">
                {note.resumen ? truncarTexto(note.resumen, 80) : truncarTexto(note.contenido, 80)}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Link href={`/notas?view=${note.id}`}>
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </Button>
            </Link>
          </div>
        </div>
      ))}

      {notes.length > 3 && (
        <div className="text-center pt-2">
          <Link href="/notas">
            <Button variant="ghost" size="sm" className="text-blue-600">
              Ver todas las notas ({notes.length})
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
