'use client'

import { useState } from 'react'
import { X, Save, FileText, User, Calendar, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NuevaNotaFormProps {
  onClose: () => void
  onSave: (nota: any) => void
}

interface Paciente {
  id: string
  nombre: string
}

// Datos de ejemplo
const pacientesEjemplo: Paciente[] = [
  { id: '1', nombre: 'María García' },
  { id: '2', nombre: 'Juan Pérez' },
  { id: '3', nombre: 'Ana López' },
  { id: '4', nombre: 'Carlos Ruiz' },
  { id: '5', nombre: 'Laura Martín' }
]

const tiposSesion = [
  { value: 'individual', label: 'Individual' },
  { value: 'pareja', label: 'Pareja' },
  { value: 'familiar', label: 'Familiar' },
  { value: 'grupal', label: 'Grupal' }
]

const tiposNota = [
  { value: 'session', label: 'Sesión' },
  { value: 'assessment', label: 'Evaluación' },
  { value: 'treatment_plan', label: 'Plan de Tratamiento' },
  { value: 'progress', label: 'Progreso' },
  { value: 'other', label: 'Otro' }
]

export default function NuevaNotaForm({ onClose, onSave }: NuevaNotaFormProps) {
  const [formData, setFormData] = useState({
    pacienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'individual',
    tipoNota: 'session',
    duracion: 50,
    titulo: '',
    contenido: '',
    resumen: '',
    tags: [] as string[],
    esConfidencial: true
  })

  const [nuevoTag, setNuevoTag] = useState('')
  const [errores, setErrores] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error si existe
    if (errores[field]) {
      setErrores(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const handleAgregarTag = () => {
    if (nuevoTag.trim() && !formData.tags.includes(nuevoTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, nuevoTag.trim()]
      }))
      setNuevoTag('')
    }
  }

  const handleEliminarTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAgregarTag()
    }
  }

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.pacienteId) {
      nuevosErrores.pacienteId = 'Debe seleccionar un paciente'
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'Debe seleccionar una fecha'
    }

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio'
    }

    if (!formData.contenido.trim()) {
      nuevosErrores.contenido = 'El contenido es obligatorio'
    }

    if (formData.duracion <= 0) {
      nuevosErrores.duracion = 'La duración debe ser mayor a 0'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validarFormulario()) {
      return
    }

    const pacienteSeleccionado = pacientesEjemplo.find(p => p.id === formData.pacienteId)
    
    const nuevaNota = {
      id: Date.now().toString(),
      paciente: pacienteSeleccionado?.nombre || '',
      pacienteId: formData.pacienteId,
      fecha: formData.fecha,
      tipo: formData.tipo,
      tipoNota: formData.tipoNota,
      duracion: formData.duracion,
      titulo: formData.titulo,
      contenido: formData.contenido,
      resumen: formData.resumen,
      tags: formData.tags,
      esConfidencial: formData.esConfidencial,
      estado: 'borrador',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    }

    onSave(nuevaNota)
  }

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nueva Nota Clínica
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente *</Label>
                <Select 
                  value={formData.pacienteId} 
                  onValueChange={(value) => handleInputChange('pacienteId', value)}
                >
                  <SelectTrigger className={cn(errores.pacienteId && 'border-red-500')}>
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {pacientesEjemplo.map((paciente) => (
                      <SelectItem key={paciente.id} value={paciente.id}>
                        {paciente.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.pacienteId && (
                  <p className="text-sm text-red-600">{errores.pacienteId}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de la sesión *</Label>
                <Input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className={cn(errores.fecha && 'border-red-500')}
                />
                {errores.fecha && (
                  <p className="text-sm text-red-600">{errores.fecha}</p>
                )}
              </div>
            </div>

            {/* Tipo de sesión y nota */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de sesión</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleInputChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposSesion.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-xs border', obtenerColorTipo(tipo.value))}>
                            {tipo.label}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoNota">Tipo de nota</Label>
                <Select 
                  value={formData.tipoNota} 
                  onValueChange={(value) => handleInputChange('tipoNota', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposNota.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label htmlFor="duracion">Duración (minutos) *</Label>
              <Input
                type="number"
                min="15"
                max="180"
                step="15"
                value={formData.duracion}
                onChange={(e) => handleInputChange('duracion', parseInt(e.target.value))}
                className={cn(errores.duracion && 'border-red-500')}
              />
              {errores.duracion && (
                <p className="text-sm text-red-600">{errores.duracion}</p>
              )}
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título de la nota *</Label>
              <Input
                placeholder="Ej: Sesión de evaluación inicial"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className={cn(errores.titulo && 'border-red-500')}
              />
              {errores.titulo && (
                <p className="text-sm text-red-600">{errores.titulo}</p>
              )}
            </div>

            {/* Contenido */}
            <div className="space-y-2">
              <Label htmlFor="contenido">Contenido de la nota *</Label>
              <Textarea
                placeholder="Describe los aspectos principales de la sesión, observaciones, técnicas utilizadas, progreso del paciente, etc."
                value={formData.contenido}
                onChange={(e) => handleInputChange('contenido', e.target.value)}
                className={cn('min-h-32', errores.contenido && 'border-red-500')}
              />
              {errores.contenido && (
                <p className="text-sm text-red-600">{errores.contenido}</p>
              )}
            </div>

            {/* Resumen */}
            <div className="space-y-2">
              <Label htmlFor="resumen">Resumen (opcional)</Label>
              <Textarea
                placeholder="Resumen breve de los puntos clave de la sesión"
                value={formData.resumen}
                onChange={(e) => handleInputChange('resumen', e.target.value)}
                className="min-h-20"
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">Etiquetas</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar etiqueta (ej: ansiedad, depresión, terapia cognitiva)"
                  value={nuevoTag}
                  onChange={(e) => setNuevoTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button type="button" variant="outline" onClick={handleAgregarTag}>
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="cursor-pointer"
                      onClick={() => handleEliminarTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Nota
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}