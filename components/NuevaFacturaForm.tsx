'use client'

import { useState } from 'react'
import { X, Save, FileText, User, Calendar, DollarSign, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface NuevaFacturaFormProps {
  onClose: () => void
  onSave: (factura: any) => void
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

export default function NuevaFacturaForm({ onClose, onSave }: NuevaFacturaFormProps) {
  const [formData, setFormData] = useState({
    pacienteId: '',
    fechaFactura: new Date().toISOString().split('T')[0],
    fechaVencimiento: '',
    importe: 0,
    tasaImpuestos: 0,
    notas: ''
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

  const calcularTotal = () => {
    const importe = formData.importe || 0
    const impuestos = importe * (formData.tasaImpuestos / 100)
    return importe + impuestos
  }

  const validarFormulario = () => {
    const nuevosErrores: Record<string, string> = {}

    if (!formData.pacienteId) {
      nuevosErrores.pacienteId = 'Debe seleccionar un paciente'
    }

    if (!formData.fechaFactura) {
      nuevosErrores.fechaFactura = 'Debe seleccionar una fecha de factura'
    }

    if (formData.importe <= 0) {
      nuevosErrores.importe = 'El importe debe ser mayor a 0'
    }

    if (formData.tasaImpuestos < 0 || formData.tasaImpuestos > 100) {
      nuevosErrores.tasaImpuestos = 'La tasa de impuestos debe estar entre 0 y 100'
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
    const total = calcularTotal()
    
    const nuevaFactura = {
      id: Date.now().toString(),
      paciente: pacienteSeleccionado?.nombre || '',
      pacienteId: formData.pacienteId,
      invoice_number: `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      invoice_date: formData.fechaFactura,
      due_date: formData.fechaVencimiento || null,
      amount: formData.importe,
      tax_rate: formData.tasaImpuestos,
      total_amount: total,
      status: 'draft',
      notes: formData.notas,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    onSave(nuevaFactura)
  }

  const formatearMoneda = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nueva Factura
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
                <Label htmlFor="fechaFactura">Fecha de factura *</Label>
                <Input
                  type="date"
                  value={formData.fechaFactura}
                  onChange={(e) => handleInputChange('fechaFactura', e.target.value)}
                  className={cn(errores.fechaFactura && 'border-red-500')}
                />
                {errores.fechaFactura && (
                  <p className="text-sm text-red-600">{errores.fechaFactura}</p>
                )}
              </div>
            </div>

            {/* Fecha de vencimiento */}
            <div className="space-y-2">
              <Label htmlFor="fechaVencimiento">Fecha de vencimiento (opcional)</Label>
              <Input
                type="date"
                value={formData.fechaVencimiento}
                onChange={(e) => handleInputChange('fechaVencimiento', e.target.value)}
              />
            </div>

            {/* Importe e impuestos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="importe">Importe (€) *</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.importe}
                  onChange={(e) => handleInputChange('importe', parseFloat(e.target.value) || 0)}
                  className={cn(errores.importe && 'border-red-500')}
                />
                {errores.importe && (
                  <p className="text-sm text-red-600">{errores.importe}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tasaImpuestos">Tasa de impuestos (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={formData.tasaImpuestos}
                  onChange={(e) => handleInputChange('tasaImpuestos', parseFloat(e.target.value) || 0)}
                  className={cn(errores.tasaImpuestos && 'border-red-500')}
                />
                {errores.tasaImpuestos && (
                  <p className="text-sm text-red-600">{errores.tasaImpuestos}</p>
                )}
              </div>
            </div>

            {/* Cálculo del total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Importe base:</span>
                  <span className="text-sm font-medium">{formatearMoneda(formData.importe)}</span>
                </div>
                {formData.tasaImpuestos > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Impuestos ({formData.tasaImpuestos}%):</span>
                    <span className="text-sm font-medium">
                      {formatearMoneda(formData.importe * formData.tasaImpuestos / 100)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatearMoneda(calcularTotal())}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <Label htmlFor="notas">Notas (opcional)</Label>
              <Textarea
                placeholder="Información adicional sobre la factura..."
                value={formData.notas}
                onChange={(e) => handleInputChange('notas', e.target.value)}
                className="min-h-20"
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Crear Factura
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
