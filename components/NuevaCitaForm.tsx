'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, User, FileText, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Paciente {
  id: string
  nombre: string
  email: string
  telefono: string
}

interface NuevaCitaFormProps {
  onClose: () => void
  onSave: (cita: any) => void
}

// Datos de ejemplo de pacientes
const pacientesEjemplo: Paciente[] = [
  { id: '1', nombre: 'María García', email: 'maria@email.com', telefono: '+34 600 123 456' },
  { id: '2', nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '+34 600 234 567' },
  { id: '3', nombre: 'Ana López', email: 'ana@email.com', telefono: '+34 600 345 678' },
  { id: '4', nombre: 'Carlos Ruiz', email: 'carlos@email.com', telefono: '+34 600 456 789' },
  { id: '5', nombre: 'Laura Martín', email: 'laura@email.com', telefono: '+34 600 567 890' }
]

export default function NuevaCitaForm({ onClose, onSave }: NuevaCitaFormProps) {
  const [formData, setFormData] = useState({
    pacienteId: '',
    fecha: '',
    hora: '',
    duracion: '50',
    tipo: 'individual',
    tarifa: '',
    notas: ''
  })

  const [errores, setErrores] = useState<Record<string, string>>({})

  const tiposSesion = [
    { value: 'individual', label: 'Individual', icon: User, color: 'bg-blue-100 text-blue-800' },
    { value: 'pareja', label: 'Pareja', icon: Users, color: 'bg-green-100 text-green-800' },
    { value: 'familiar', label: 'Familiar', icon: Users, color: 'bg-purple-100 text-purple-800' }
  ]

  const duraciones = [
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '50', label: '50 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1.5 horas' },
    { value: '120', label: '2 horas' }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error si se corrige el campo
    if (errores[field]) {
      setErrores(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.pacienteId) {
      nuevosErrores.pacienteId = 'Debe seleccionar un paciente'
    }

    if (!formData.fecha) {
      nuevosErrores.fecha = 'Debe seleccionar una fecha'
    } else {
      const fechaSeleccionada = new Date(formData.fecha)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0)
      
      if (fechaSeleccionada < hoy) {
        nuevosErrores.fecha = 'La fecha no puede ser anterior a hoy'
      }
    }

    if (!formData.hora) {
      nuevosErrores.hora = 'Debe seleccionar una hora'
    }

    if (!formData.duracion) {
      nuevosErrores.duracion = 'Debe seleccionar una duración'
    }

    if (!formData.tipo) {
      nuevosErrores.tipo = 'Debe seleccionar un tipo de sesión'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validarFormulario()) {
      const pacienteSeleccionado = pacientesEjemplo.find(p => p.id === formData.pacienteId)
      
      const nuevaCita = {
        id: Date.now().toString(),
        paciente: pacienteSeleccionado?.nombre || '',
        pacienteId: formData.pacienteId,
        fecha: formData.fecha,
        hora: formData.hora,
        duracion: parseInt(formData.duracion),
        tipo: formData.tipo,
        tarifa: formData.tarifa,
        notas: formData.notas,
        estado: 'programada',
        fechaCreacion: new Date().toISOString()
      }

      onSave(nuevaCita)
      onClose()
    }
  }

  const pacienteSeleccionado = pacientesEjemplo.find(p => p.id === formData.pacienteId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Nueva Cita
            </CardTitle>
            <CardDescription>
              Programa una nueva cita con un paciente
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Paciente */}
            <div className="space-y-2">
              <Label htmlFor="paciente">Paciente *</Label>
              <Select value={formData.pacienteId} onValueChange={(value) => handleInputChange('pacienteId', value)}>
                <SelectTrigger className={errores.pacienteId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecciona un paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientesEjemplo.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{paciente.nombre}</span>
                        <span className="text-sm text-gray-500">{paciente.email}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errores.pacienteId && (
                <p className="text-sm text-red-500">{errores.pacienteId}</p>
              )}
            </div>

            {/* Información del paciente seleccionado */}
            {pacienteSeleccionado && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Información del paciente</h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>Email: {pacienteSeleccionado.email}</div>
                  <div>Teléfono: {pacienteSeleccionado.telefono}</div>
                </div>
              </div>
            )}

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange('fecha', e.target.value)}
                  className={errores.fecha ? 'border-red-500' : ''}
                />
                {errores.fecha && (
                  <p className="text-sm text-red-500">{errores.fecha}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="hora">Hora *</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => handleInputChange('hora', e.target.value)}
                  className={errores.hora ? 'border-red-500' : ''}
                />
                {errores.hora && (
                  <p className="text-sm text-red-500">{errores.hora}</p>
                )}
              </div>
            </div>

            {/* Duración y Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duracion">Duración *</Label>
                <Select value={formData.duracion} onValueChange={(value) => handleInputChange('duracion', value)}>
                  <SelectTrigger className={errores.duracion ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona duración" />
                  </SelectTrigger>
                  <SelectContent>
                    {duraciones.map((duracion) => (
                      <SelectItem key={duracion.value} value={duracion.value}>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {duracion.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.duracion && (
                  <p className="text-sm text-red-500">{errores.duracion}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Sesión *</Label>
                <Select value={formData.tipo} onValueChange={(value) => handleInputChange('tipo', value)}>
                  <SelectTrigger className={errores.tipo ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposSesion.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        <div className="flex items-center gap-2">
                          <tipo.icon className="h-4 w-4" />
                          {tipo.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errores.tipo && (
                  <p className="text-sm text-red-500">{errores.tipo}</p>
                )}
              </div>
            </div>

            {/* Tipo seleccionado visual */}
            {formData.tipo && (
              <div className="flex justify-center">
                {tiposSesion.map((tipo) => {
                  if (tipo.value === formData.tipo) {
                    return (
                      <Badge key={tipo.value} className={`${tipo.color} border`}>
                        <tipo.icon className="h-3 w-3 mr-1" />
                        {tipo.label}
                      </Badge>
                    )
                  }
                  return null
                })}
              </div>
            )}

            {/* Tarifa */}
            <div className="space-y-2">
              <Label htmlFor="tarifa">Tarifa (€)</Label>
              <Input
                id="tarifa"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.tarifa}
                onChange={(e) => handleInputChange('tarifa', e.target.value)}
              />
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas">Notas previas</Label>
              <Textarea
                id="notas"
                placeholder="Notas adicionales sobre la cita..."
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                rows={3}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Calendar className="h-4 w-4 mr-2" />
                Crear Cita
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
