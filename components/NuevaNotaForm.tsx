'use client'

import { useState } from 'react'
import { FileText, User, Calendar, Clock, X, Save, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AISessionSummary from './AISessionSummary'

interface Paciente {
  id: string
  nombre: string
  email: string
  telefono: string
}

interface NuevaNotaFormProps {
  onClose: () => void
  onSave: (nota: any) => void
}

// Datos de ejemplo de pacientes
const pacientesEjemplo: Paciente[] = [
  { id: '1', nombre: 'María García', email: 'maria@email.com', telefono: '+34 600 123 456' },
  { id: '2', nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '+34 600 234 567' },
  { id: '3', nombre: 'Ana López', email: 'ana@email.com', telefono: '+34 600 345 678' },
  { id: '4', nombre: 'Carlos Ruiz', email: 'carlos@email.com', telefono: '+34 600 456 789' },
  { id: '5', nombre: 'Laura Martín', email: 'laura@email.com', telefono: '+34 600 567 890' }
]

export default function NuevaNotaForm({ onClose, onSave }: NuevaNotaFormProps) {
  const [formData, setFormData] = useState({
    pacienteId: '',
    fecha: new Date().toISOString().split('T')[0],
    tipo: 'individual',
    duracion: '50',
    contenido: '',
    resumen: '',
    estado: 'borrador'
  })

  const [errores, setErrores] = useState<Record<string, string>>({})
  const [tabActivo, setTabActivo] = useState('contenido')

  const tiposSesion = [
    { value: 'individual', label: 'Individual', icon: User, color: 'bg-blue-100 text-blue-800' },
    { value: 'pareja', label: 'Pareja', icon: User, color: 'bg-green-100 text-green-800' },
    { value: 'familiar', label: 'Familiar', icon: User, color: 'bg-purple-100 text-purple-800' },
    { value: 'grupal', label: 'Grupal', icon: User, color: 'bg-orange-100 text-orange-800' }
  ]

  const duraciones = [
    { value: '30', label: '30 minutos' },
    { value: '45', label: '45 minutos' },
    { value: '50', label: '50 minutos' },
    { value: '60', label: '1 hora' },
    { value: '90', label: '1.5 horas' },
    { value: '120', label: '2 horas' }
  ]

  const plantillas = [
    {
      id: 'evaluacion_inicial',
      nombre: 'Evaluación Inicial',
      contenido: `## Evaluación Inicial

### Información del Paciente
- **Motivo de consulta:** 
- **Historia clínica relevante:** 
- **Medicamentos actuales:** 
- **Expectativas del tratamiento:** 

### Observaciones Clínicas
- **Estado de ánimo:** 
- **Nivel de ansiedad:** 
- **Comunicación:** 
- **Insight:** 

### Plan de Tratamiento
- **Objetivos terapéuticos:** 
- **Frecuencia de sesiones:** 
- **Técnicas a utilizar:** 

### Notas Adicionales
`
    },
    {
      id: 'sesion_individual',
      nombre: 'Sesión Individual',
      contenido: `## Sesión Individual

### Resumen de la Sesión
- **Temas abordados:** 
- **Técnicas utilizadas:** 
- **Respuesta del paciente:** 

### Progreso Observado
- **Mejoras identificadas:** 
- **Áreas de trabajo:** 
- **Resistencia o dificultades:** 

### Tareas para la Próxima Sesión
- **Ejercicios asignados:** 
- **Temas a abordar:** 

### Notas Clínicas
`
    },
    {
      id: 'terapia_pareja',
      nombre: 'Terapia de Pareja',
      contenido: `## Terapia de Pareja

### Dinámica de la Pareja
- **Patrones de comunicación observados:** 
- **Conflictos identificados:** 
- **Fortalezas de la relación:** 

### Trabajo Realizado
- **Técnicas aplicadas:** 
- **Ejercicios realizados:** 
- **Respuesta de ambos miembros:** 

### Progreso
- **Mejoras en la comunicación:** 
- **Resolución de conflictos:** 
- **Intimidad emocional:** 

### Plan para la Próxima Sesión
`
    }
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
    }

    if (!formData.contenido.trim()) {
      nuevosErrores.contenido = 'El contenido de la nota es obligatorio'
    }

    setErrores(nuevosErrores)
    return Object.keys(nuevosErrores).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validarFormulario()) {
      const pacienteSeleccionado = pacientesEjemplo.find(p => p.id === formData.pacienteId)
      
      const nuevaNota = {
        id: Date.now().toString(),
        paciente: pacienteSeleccionado?.nombre || '',
        pacienteId: formData.pacienteId,
        fecha: formData.fecha,
        tipo: formData.tipo,
        duracion: parseInt(formData.duracion),
        contenido: formData.contenido,
        resumen: formData.resumen,
        estado: formData.estado,
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString()
      }

      onSave(nuevaNota)
      onClose()
    }
  }

  const aplicarPlantilla = (plantilla: any) => {
    setFormData(prev => ({ ...prev, contenido: plantilla.contenido }))
    setTabActivo('contenido')
  }

  const pacienteSeleccionado = pacientesEjemplo.find(p => p.id === formData.pacienteId)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Nueva Nota Clínica
            </CardTitle>
            <CardDescription>
              Documenta una nueva sesión clínica
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label htmlFor="duracion">Duración</Label>
                <Select value={formData.duracion} onValueChange={(value) => handleInputChange('duracion', value)}>
                  <SelectTrigger>
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
              </div>
            </div>

            {/* Tipo de Sesión */}
            <div className="space-y-2">
              <Label>Tipo de Sesión</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {tiposSesion.map((tipo) => (
                  <Button
                    key={tipo.value}
                    type="button"
                    variant={formData.tipo === tipo.value ? 'default' : 'outline'}
                    className={`justify-start ${formData.tipo === tipo.value ? '' : obtenerColorTipo(tipo.value)}`}
                    onClick={() => handleInputChange('tipo', tipo.value)}
                  >
                    <tipo.icon className="h-4 w-4 mr-2" />
                    {tipo.label}
                  </Button>
                ))}
              </div>
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

            {/* Tabs para contenido y plantillas */}
            <Tabs value={tabActivo} onValueChange={setTabActivo}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="contenido">Contenido de la Nota</TabsTrigger>
                <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
                <TabsTrigger value="ia">IA Resumen</TabsTrigger>
              </TabsList>

              <TabsContent value="contenido" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contenido">Contenido de la Nota *</Label>
                  <Textarea
                    id="contenido"
                    placeholder="Describe la sesión, observaciones clínicas, técnicas utilizadas, respuesta del paciente, progreso observado..."
                    value={formData.contenido}
                    onChange={(e) => handleInputChange('contenido', e.target.value)}
                    className={errores.contenido ? 'border-red-500' : ''}
                    rows={12}
                  />
                  {errores.contenido && (
                    <p className="text-sm text-red-500">{errores.contenido}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="resumen">Resumen (Opcional)</Label>
                  <Textarea
                    id="resumen"
                    placeholder="Resumen breve de la sesión para referencia rápida..."
                    value={formData.resumen}
                    onChange={(e) => handleInputChange('resumen', e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>

              <TabsContent value="plantillas" className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Plantillas Disponibles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plantillas.map((plantilla) => (
                      <Card key={plantilla.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-base">{plantilla.nombre}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={() => aplicarPlantilla(plantilla)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Usar Plantilla
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="ia" className="space-y-4">
                <AISessionSummary
                  sessionNotes={formData.contenido}
                  patientName={pacienteSeleccionado?.nombre || ''}
                  sessionDate={formData.fecha}
                  onSummaryGenerated={(summary) => {
                    // Opcional: agregar el resumen al contenido de la nota
                    setFormData(prev => ({
                      ...prev,
                      contenido: prev.contenido + '\n\n--- RESUMEN IA ---\n' + summary
                    }))
                  }}
                />
              </TabsContent>
            </Tabs>

            {/* Estado de la nota */}
            <div className="space-y-2">
              <Label>Estado de la Nota</Label>
              <Select value={formData.estado} onValueChange={(value) => handleInputChange('estado', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borrador">Borrador</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="pendiente">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Guardar Nota
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function obtenerColorTipo(tipo: any) {
  return tipo.color
}
