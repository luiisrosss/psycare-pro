'use client'

import { useState } from 'react'
import { X, Save, Bell, User, Calendar, Clock, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NuevoRecordatorioFormProps {
  onClose: () => void
  onSave: (recordatorio: any) => void
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

const tiposRecordatorio = [
  { value: 'appointment', label: 'Cita', icon: '📅' },
  { value: 'payment', label: 'Pago', icon: '💰' },
  { value: 'note', label: 'Nota', icon: '📝' },
  { value: 'follow_up', label: 'Seguimiento', icon: '🔄' },
  { value: 'custom', label: 'Personalizado', icon: '🔔' }
]

export default function NuevoRecordatorioForm({ onClose, onSave }: NuevoRecordatorioFormProps) {
  const [formData, setFormData] = useState({
    pacienteId: '',
    tipo: 'custom',
    titulo: '',
    mensaje: '',
    fechaRecordatorio: '',
    horaRecordatorio: ''
  })

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

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.pacienteId) {
      nuevosErrores.pacienteId = 'Debe seleccionar un paciente'
    }

    if (!formData.titulo.trim()) {
      nuevosErrores.titulo = 'El título es obligatorio'
    }

    if (!formData.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es obligatorio'
    }

    if (!formData.fechaRecordatorio) {
      nuevosErrores.fechaRecordatorio = 'Debe seleccionar una fecha'
    }

    if (!formData.horaRecordatorio) {
      nuevosErrores.horaRecordatorio = 'Debe seleccionar una hora'
    }

    // Validar que la fecha no sea en el pasado
    const fechaCompleta = new Date(`${formData.fechaRecordatorio}T${formData.horaRecordatorio}`)
    const ahora = new Date()
    
    if (fechaCompleta <= ahora) {
      nuevosErrores.fechaRecordatorio = 'La fecha debe ser en el futuro'
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
    const fechaCompleta = new Date(`${formData.fechaRecordatorio}T${formData.horaRecordatorio}`)
    
    const nuevoRecordatorio = {
      id: Date.now().toString(),
      paciente: pacienteSeleccionado?.nombre || '',
      pacienteId: formData.pacienteId,
      reminder_type: formData.tipo,
      title: formData.titulo,
      message: formData.mensaje,
      reminder_date: fechaCompleta.toISOString(),
      is_sent: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    onSave(nuevoRecordatorio)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Nuevo Recordatorio
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
                <Label htmlFor="tipo">Tipo de recordatorio</Label>
                <Select 
                  value={formData.tipo} 
                  onValueChange={(value) => handleInputChange('tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposRecordatorio.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div className="flex items-center gap-2">
                          <span>{tipo.icon}</span>
                          <span>{tipo.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">Título del recordatorio *</Label>
              <Input
                placeholder="Ej: Recordatorio de cita - María García"
                value={formData.titulo}
                onChange={(e) => handleInputChange('titulo', e.target.value)}
                className={cn(errores.titulo && 'border-red-500')}
              />
              {errores.titulo && (
                <p className="text-sm text-red-600">{errores.titulo}</p>
              )}
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <Label htmlFor="mensaje">Mensaje del recordatorio *</Label>
              <Textarea
                placeholder="Describe el contenido del recordatorio..."
                value={formData.mensaje}
                onChange={(e) => handleInputChange('mensaje', e.target.value)}
                className={cn('min-h-24', errores.mensaje && 'border-red-500')}
              />
              {errores.mensaje && (
                <p className="text-sm text-red-600">{errores.mensaje}</p>
              )}
            </div>

            {/* Fecha y hora */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaRecordatorio">Fecha del recordatorio *</Label>
                <Input
                  type="date"
                  value={formData.fechaRecordatorio}
                  onChange={(e) => handleInputChange('fechaRecordatorio', e.target.value)}
                  className={cn(errores.fechaRecordatorio && 'border-red-500')}
                />
                {errores.fechaRecordatorio && (
                  <p className="text-sm text-red-600">{errores.fechaRecordatorio}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="horaRecordatorio">Hora del recordatorio *</Label>
                <Input
                  type="time"
                  value={formData.horaRecordatorio}
                  onChange={(e) => handleInputChange('horaRecordatorio', e.target.value)}
                  className={cn(errores.horaRecordatorio && 'border-red-500')}
                />
                {errores.horaRecordatorio && (
                  <p className="text-sm text-red-600">{errores.horaRecordatorio}</p>
                )}
              </div>
            </div>

            {/* Vista previa */}
            {formData.titulo && formData.mensaje && formData.fechaRecordatorio && formData.horaRecordatorio && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Vista previa del recordatorio:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={cn('text-xs border', obtenerColorTipo(formData.tipo))}>
                      {tiposRecordatorio.find(t => t.value === formData.tipo)?.icon} {tiposRecordatorio.find(t => t.value === formData.tipo)?.label}
                    </Badge>
                    <span className="text-sm font-medium">{formData.titulo}</span>
                  </div>
                  <p className="text-sm text-gray-700">{formData.mensaje}</p>
                  <p className="text-xs text-gray-500">
                    Programado para: {new Date(`${formData.fechaRecordatorio}T${formData.horaRecordatorio}`).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Crear Recordatorio
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
