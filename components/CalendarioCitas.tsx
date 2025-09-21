'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Clock, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Cita {
  id: string
  paciente: string
  fecha: string
  hora: string
  duracion: number
  tipo: 'individual' | 'pareja' | 'familiar'
  estado: 'programada' | 'completada' | 'cancelada' | 'no_asistio'
  notas?: string
}

// Datos de ejemplo
const citasEjemplo: Cita[] = [
  {
    id: '1',
    paciente: 'María García',
    fecha: '2024-01-15',
    hora: '09:00',
    duracion: 50,
    tipo: 'individual',
    estado: 'programada'
  },
  {
    id: '2',
    paciente: 'Juan Pérez',
    fecha: '2024-01-15',
    hora: '11:30',
    duracion: 60,
    tipo: 'pareja',
    estado: 'programada'
  },
  {
    id: '3',
    paciente: 'Ana López',
    fecha: '2024-01-15',
    hora: '16:00',
    duracion: 45,
    tipo: 'familiar',
    estado: 'programada'
  },
  {
    id: '4',
    paciente: 'Carlos Ruiz',
    fecha: '2024-01-16',
    hora: '10:00',
    duracion: 50,
    tipo: 'individual',
    estado: 'programada'
  },
  {
    id: '5',
    paciente: 'Laura Martín',
    fecha: '2024-01-17',
    hora: '14:30',
    duracion: 60,
    tipo: 'pareja',
    estado: 'programada'
  }
]

export default function CalendarioCitas() {
  const [vistaActual, setVistaActual] = useState<'semanal' | 'mensual'>('semanal')
  const [fechaActual, setFechaActual] = useState(new Date())

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  const obtenerCitasDelDia = (fecha: string) => {
    return citasEjemplo.filter(cita => cita.fecha === fecha)
  }

  const obtenerColorTipo = (tipo: string) => {
    switch (tipo) {
      case 'individual':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pareja':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'familiar':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'programada':
        return 'bg-blue-500'
      case 'completada':
        return 'bg-green-500'
      case 'cancelada':
        return 'bg-red-500'
      case 'no_asistio':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual)
    if (direccion === 'anterior') {
      nuevaFecha.setMonth(nuevaFecha.getMonth() - 1)
    } else {
      nuevaFecha.setMonth(nuevaFecha.getMonth() + 1)
    }
    setFechaActual(nuevaFecha)
  }

  const navegarSemana = (direccion: 'anterior' | 'siguiente') => {
    const nuevaFecha = new Date(fechaActual)
    if (direccion === 'anterior') {
      nuevaFecha.setDate(nuevaFecha.getDate() - 7)
    } else {
      nuevaFecha.setDate(nuevaFecha.getDate() + 7)
    }
    setFechaActual(nuevaFecha)
  }

  const obtenerDiasDelMes = () => {
    const año = fechaActual.getFullYear()
    const mes = fechaActual.getMonth()
    const primerDia = new Date(año, mes, 1)
    const ultimoDia = new Date(año, mes + 1, 0)
    const diasDelMes = ultimoDia.getDate()
    const primerDiaSemana = primerDia.getDay()

    const dias = []
    
    // Días del mes anterior
    for (let i = primerDiaSemana - 1; i >= 0; i--) {
      const fecha = new Date(año, mes, -i)
      dias.push({
        fecha: fecha.toISOString().split('T')[0],
        numero: fecha.getDate(),
        esDelMesActual: false,
        esHoy: false
      })
    }
    
    // Días del mes actual
    for (let i = 1; i <= diasDelMes; i++) {
      const fecha = new Date(año, mes, i)
      const hoy = new Date()
      dias.push({
        fecha: fecha.toISOString().split('T')[0],
        numero: i,
        esDelMesActual: true,
        esHoy: fecha.toDateString() === hoy.toDateString()
      })
    }
    
    // Días del mes siguiente
    const diasRestantes = 42 - dias.length
    for (let i = 1; i <= diasRestantes; i++) {
      const fecha = new Date(año, mes + 1, i)
      dias.push({
        fecha: fecha.toISOString().split('T')[0],
        numero: i,
        esDelMesActual: false,
        esHoy: false
      })
    }
    
    return dias
  }

  const obtenerDiasDeLaSemana = () => {
    const inicioSemana = new Date(fechaActual)
    inicioSemana.setDate(fechaActual.getDate() - fechaActual.getDay())
    
    const dias = []
    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioSemana)
      fecha.setDate(inicioSemana.getDate() + i)
      const hoy = new Date()
      
      dias.push({
        fecha: fecha.toISOString().split('T')[0],
        numero: fecha.getDate(),
        nombre: diasSemana[i],
        esHoy: fecha.toDateString() === hoy.toDateString()
      })
    }
    
    return dias
  }

  const renderVistaSemanal = () => {
    const dias = obtenerDiasDeLaSemana()
    
    return (
      <div className="space-y-4">
        {/* Header de la semana */}
        <div className="grid grid-cols-7 gap-2">
          {dias.map((dia, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {dia.nombre}
              </div>
              <div className={cn(
                "w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium",
                dia.esHoy 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-900 hover:bg-gray-100"
              )}>
                {dia.numero}
              </div>
            </div>
          ))}
        </div>

        {/* Citas de la semana */}
        <div className="grid grid-cols-7 gap-2">
          {dias.map((dia, index) => {
            const citasDelDia = obtenerCitasDelDia(dia.fecha)
            
            return (
              <div key={index} className="min-h-[200px] border border-gray-200 rounded-lg p-2">
                <div className="space-y-1">
                  {citasDelDia.map((cita) => (
                    <div
                      key={cita.id}
                      className={cn(
                        "p-2 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow",
                        obtenerColorTipo(cita.tipo)
                      )}
                    >
                      <div className="font-medium">{cita.hora}</div>
                      <div className="truncate">{cita.paciente}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          obtenerColorEstado(cita.estado)
                        )} />
                        <span className="text-xs capitalize">
                          {cita.tipo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  const renderVistaMensual = () => {
    const dias = obtenerDiasDelMes()
    
    return (
      <div className="space-y-4">
        {/* Header del mes */}
        <div className="grid grid-cols-7 gap-2">
          {diasSemana.map((dia) => (
            <div key={dia} className="text-center text-sm font-medium text-gray-600 py-2">
              {dia}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-2">
          {dias.map((dia, index) => {
            const citasDelDia = obtenerCitasDelDia(dia.fecha)
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[120px] border border-gray-200 rounded-lg p-2",
                  !dia.esDelMesActual && "bg-gray-50",
                  dia.esHoy && "bg-blue-50 border-blue-300"
                )}
              >
                <div className={cn(
                  "text-sm font-medium mb-1",
                  !dia.esDelMesActual && "text-gray-400",
                  dia.esHoy && "text-blue-600"
                )}>
                  {dia.numero}
                </div>
                
                <div className="space-y-1">
                  {citasDelDia.slice(0, 3).map((cita) => (
                    <div
                      key={cita.id}
                      className={cn(
                        "p-1 rounded text-xs cursor-pointer hover:shadow-sm transition-shadow",
                        obtenerColorTipo(cita.tipo)
                      )}
                    >
                      <div className="font-medium">{cita.hora}</div>
                      <div className="truncate">{cita.paciente}</div>
                    </div>
                  ))}
                  
                  {citasDelDia.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{citasDelDia.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles del calendario */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {vistaActual === 'semanal' 
              ? `Semana del ${fechaActual.getDate()} de ${meses[fechaActual.getMonth()]}`
              : `${meses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`
            }
          </h2>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => vistaActual === 'semanal' ? navegarSemana('anterior') : navegarMes('anterior')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => vistaActual === 'semanal' ? navegarSemana('siguiente') : navegarMes('siguiente')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={vistaActual === 'semanal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVistaActual('semanal')}
          >
            Semanal
          </Button>
          <Button
            variant={vistaActual === 'mensual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setVistaActual('mensual')}
          >
            Mensual
          </Button>
        </div>
      </div>

      {/* Calendario */}
      <Card>
        <CardContent className="p-6">
          {vistaActual === 'semanal' ? renderVistaSemanal() : renderVistaMensual()}
        </CardContent>
      </Card>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Individual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Pareja</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-100 border border-purple-200 rounded"></div>
          <span>Familiar</span>
        </div>
      </div>
    </div>
  )
}
