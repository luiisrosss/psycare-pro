'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Download, Send, Euro, Calendar, User } from 'lucide-react'

export default function FacturacionPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('todos')
  const [filtroMes, setFiltroMes] = useState('todos')

  // Datos de ejemplo - en producción vendrían de Supabase
  const facturas = [
    {
      id: 'FAC-2024-001',
      paciente: 'María García',
      fecha: '2024-01-15',
      concepto: 'Sesión de terapia individual',
      cantidad: 1,
      precio: 60,
      total: 60,
      estado: 'pagada',
      fechaVencimiento: '2024-01-30',
      metodoPago: 'Transferencia'
    },
    {
      id: 'FAC-2024-002',
      paciente: 'Juan Pérez',
      fecha: '2024-01-16',
      concepto: 'Sesión de terapia de pareja',
      cantidad: 1,
      precio: 80,
      total: 80,
      estado: 'pendiente',
      fechaVencimiento: '2024-01-31',
      metodoPago: 'Efectivo'
    },
    {
      id: 'FAC-2024-003',
      paciente: 'Ana López',
      fecha: '2024-01-17',
      concepto: 'Evaluación psicológica',
      cantidad: 1,
      precio: 120,
      total: 120,
      estado: 'vencida',
      fechaVencimiento: '2024-01-20',
      metodoPago: 'Transferencia'
    }
  ]

  const pacientes = [
    { id: '1', nombre: 'María García' },
    { id: '2', nombre: 'Juan Pérez' },
    { id: '3', nombre: 'Ana López' },
    { id: '4', nombre: 'Carlos Ruiz' },
    { id: '5', nombre: 'Laura Martín' }
  ]

  const handleNuevaFactura = () => {
    setMostrarFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'pagada':
        return <Badge className="bg-green-100 text-green-800">Pagada</Badge>
      case 'pendiente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
      case 'vencida':
        return <Badge className="bg-red-100 text-red-800">Vencida</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const facturasFiltradas = facturas.filter(factura => {
    const coincideBusqueda = factura.paciente.toLowerCase().includes(busqueda.toLowerCase()) ||
                           factura.id.toLowerCase().includes(busqueda.toLowerCase())
    const coincideEstado = filtroEstado === 'todos' || factura.estado === filtroEstado
    return coincideBusqueda && coincideEstado
  })

  const totalFacturado = facturas.reduce((sum, factura) => sum + factura.total, 0)
  const totalPagado = facturas.filter(f => f.estado === 'pagada').reduce((sum, factura) => sum + factura.total, 0)
  const totalPendiente = facturas.filter(f => f.estado === 'pendiente').reduce((sum, factura) => sum + factura.total, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Facturación</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona tus facturas y pagos</p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Facturado</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalFacturado}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Euro className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Pagado</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalPagado}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Euro className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendiente</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalPendiente}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Euro className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar facturas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pagada">Pagada</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="vencida">Vencida</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleNuevaFactura}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Factura
        </Button>
      </div>

      {/* Tabla de facturas */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-gray-900">Facturas ({facturasFiltradas.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Concepto</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vencimiento</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {facturasFiltradas.map((factura) => (
                <TableRow key={factura.id}>
                  <TableCell className="font-medium">{factura.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {factura.paciente}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(factura.fecha).toLocaleDateString('es-ES')}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{factura.concepto}</TableCell>
                  <TableCell className="font-medium">€{factura.total}</TableCell>
                  <TableCell>{getEstadoBadge(factura.estado)}</TableCell>
                  <TableCell>{new Date(factura.fechaVencimiento).toLocaleDateString('es-ES')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Descargar PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Send className="h-4 w-4 mr-2" />
                          Enviar por email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Formulario de nueva factura */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nueva Factura</CardTitle>
            </CardHeader>
            <CardContent>
              <NuevaFacturaForm 
                pacientes={pacientes}
                onCerrar={handleCerrarFormulario}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Componente del formulario de nueva factura
function NuevaFacturaForm({ pacientes, onCerrar }: { pacientes: any[], onCerrar: () => void }) {
  const [formData, setFormData] = useState({
    paciente: '',
    fecha: new Date().toISOString().split('T')[0],
    concepto: '',
    cantidad: 1,
    precio: 60,
    fechaVencimiento: '',
    metodoPago: 'Transferencia',
    notas: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se enviaría a Supabase
    console.log('Nueva factura:', formData)
    onCerrar()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Paciente</label>
          <Select value={formData.paciente} onValueChange={(value) => setFormData({...formData, paciente: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar paciente" />
            </SelectTrigger>
            <SelectContent>
              {pacientes.map((paciente) => (
                <SelectItem key={paciente.id} value={paciente.nombre}>
                  {paciente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <Input
            type="date"
            value={formData.fecha}
            onChange={(e) => setFormData({...formData, fecha: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Concepto</label>
        <Input
          placeholder="Ej: Sesión de terapia individual"
          value={formData.concepto}
          onChange={(e) => setFormData({...formData, concepto: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
          <Input
            type="number"
            min="1"
            value={formData.cantidad}
            onChange={(e) => setFormData({...formData, cantidad: parseInt(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
          <Input
            type="number"
            min="0"
            step="0.01"
            value={formData.precio}
            onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value)})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total (€)</label>
          <Input
            value={formData.cantidad * formData.precio}
            disabled
            className="bg-gray-50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Vencimiento</label>
          <Input
            type="date"
            value={formData.fechaVencimiento}
            onChange={(e) => setFormData({...formData, fechaVencimiento: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
          <Select value={formData.metodoPago} onValueChange={(value) => setFormData({...formData, metodoPago: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Transferencia">Transferencia</SelectItem>
              <SelectItem value="Efectivo">Efectivo</SelectItem>
              <SelectItem value="Bizum">Bizum</SelectItem>
              <SelectItem value="PayPal">PayPal</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <Input
          placeholder="Notas adicionales (opcional)"
          value={formData.notas}
          onChange={(e) => setFormData({...formData, notas: e.target.value})}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Crear Factura
        </Button>
      </div>
    </form>
  )
}
