'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Switch } from '@/components/ui/switch'
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Bell, Clock, Mail, Calendar, User } from 'lucide-react'

export default function RecordatoriosPage() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [filtroEstado, setFiltroEstado] = useState('todos')

  // Datos de ejemplo - en producción vendrían de Supabase
  const recordatorios = [
    {
      id: '1',
      tipo: 'cita',
      titulo: 'Recordatorio de cita - María García',
      descripcion: 'Cita programada para mañana a las 10:00 AM',
      fechaProgramada: '2024-01-22T10:00:00',
      estado: 'activo',
      paciente: 'María García',
      metodoEnvio: 'email',
      enviado: false,
      fechaCreacion: '2024-01-20T09:00:00'
    },
    {
      id: '2',
      tipo: 'pago',
      titulo: 'Recordatorio de pago - Juan Pérez',
      descripcion: 'Factura pendiente de pago desde hace 5 días',
      fechaProgramada: '2024-01-21T14:00:00',
      estado: 'enviado',
      paciente: 'Juan Pérez',
      metodoEnvio: 'sms',
      enviado: true,
      fechaCreacion: '2024-01-18T10:00:00'
    },
    {
      id: '3',
      tipo: 'seguimiento',
      titulo: 'Seguimiento post-sesión - Ana López',
      descripcion: 'Recordatorio para llamar al paciente después de la sesión',
      fechaProgramada: '2024-01-23T16:00:00',
      estado: 'activo',
      paciente: 'Ana López',
      metodoEnvio: 'email',
      enviado: false,
      fechaCreacion: '2024-01-21T11:00:00'
    }
  ]

  const pacientes = [
    { id: '1', nombre: 'María García', email: 'maria@email.com', telefono: '+34 600 123 456' },
    { id: '2', nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '+34 600 234 567' },
    { id: '3', nombre: 'Ana López', email: 'ana@email.com', telefono: '+34 600 345 678' },
    { id: '4', nombre: 'Carlos Ruiz', email: 'carlos@email.com', telefono: '+34 600 456 789' },
    { id: '5', nombre: 'Laura Martín', email: 'laura@email.com', telefono: '+34 600 567 890' }
  ]

  const handleNuevoRecordatorio = () => {
    setMostrarFormulario(true)
  }

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false)
  }

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'cita':
        return <Badge className="bg-blue-100 text-blue-800">Cita</Badge>
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>
      case 'seguimiento':
        return <Badge className="bg-purple-100 text-purple-800">Seguimiento</Badge>
      default:
        return <Badge variant="secondary">{tipo}</Badge>
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-yellow-100 text-yellow-800">Activo</Badge>
      case 'enviado':
        return <Badge className="bg-green-100 text-green-800">Enviado</Badge>
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge variant="secondary">{estado}</Badge>
    }
  }

  const getMetodoIcon = (metodo: string) => {
    switch (metodo) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-600" />
      case 'sms':
        return <Bell className="h-4 w-4 text-green-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const recordatoriosFiltrados = recordatorios.filter(recordatorio => {
    const coincideBusqueda = recordatorio.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                           recordatorio.paciente.toLowerCase().includes(busqueda.toLowerCase())
    const coincideTipo = filtroTipo === 'todos' || recordatorio.tipo === filtroTipo
    const coincideEstado = filtroEstado === 'todos' || recordatorio.estado === filtroEstado
    return coincideBusqueda && coincideTipo && coincideEstado
  })

  const totalActivos = recordatorios.filter(r => r.estado === 'activo').length
  const totalEnviados = recordatorios.filter(r => r.estado === 'enviado').length
  const totalPendientes = recordatorios.filter(r => !r.enviado).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Recordatorios</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona recordatorios automáticos para citas y pagos</p>
      </div>

      {/* Métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">{totalActivos}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Bell className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Enviados</p>
                <p className="text-2xl font-semibold text-gray-900">{totalEnviados}</p>
              </div>
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="text-2xl font-semibold text-gray-900">{totalPendientes}</p>
              </div>
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
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
              placeholder="Buscar recordatorios..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="cita">Cita</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="seguimiento">Seguimiento</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleNuevoRecordatorio}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Recordatorio
        </Button>
      </div>

      {/* Tabla de recordatorios */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-medium text-gray-900">Recordatorios ({recordatoriosFiltrados.length})</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Fecha Programada</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recordatoriosFiltrados.map((recordatorio) => (
                <TableRow key={recordatorio.id}>
                  <TableCell>{getTipoBadge(recordatorio.tipo)}</TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="font-medium text-gray-900 truncate">{recordatorio.titulo}</p>
                      <p className="text-sm text-gray-500 truncate">{recordatorio.descripcion}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      {recordatorio.paciente}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {new Date(recordatorio.fechaProgramada).toLocaleString('es-ES')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMetodoIcon(recordatorio.metodoEnvio)}
                      <span className="text-sm capitalize">{recordatorio.metodoEnvio}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getEstadoBadge(recordatorio.estado)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="h-4 w-4 mr-2" />
                          Enviar Ahora
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

      {/* Formulario de nuevo recordatorio */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Nuevo Recordatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <NuevoRecordatorioForm 
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

// Componente del formulario de nuevo recordatorio
function NuevoRecordatorioForm({ pacientes, onCerrar }: { pacientes: any[], onCerrar: () => void }) {
  const [formData, setFormData] = useState({
    tipo: 'cita',
    paciente: '',
    titulo: '',
    descripcion: '',
    fechaProgramada: '',
    horaProgramada: '',
    metodoEnvio: 'email',
    activo: true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se enviaría a Supabase
    console.log('Nuevo recordatorio:', formData)
    onCerrar()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Recordatorio</label>
          <Select value={formData.tipo} onValueChange={(value) => setFormData({...formData, tipo: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cita">Cita</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="seguimiento">Seguimiento</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
        <Input
          placeholder="Ej: Recordatorio de cita - María García"
          value={formData.titulo}
          onChange={(e) => setFormData({...formData, titulo: e.target.value})}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <Input
          placeholder="Descripción del recordatorio"
          value={formData.descripcion}
          onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
          <Input
            type="date"
            value={formData.fechaProgramada}
            onChange={(e) => setFormData({...formData, fechaProgramada: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
          <Input
            type="time"
            value={formData.horaProgramada}
            onChange={(e) => setFormData({...formData, horaProgramada: e.target.value})}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Método de Envío</label>
        <Select value={formData.metodoEnvio} onValueChange={(value) => setFormData({...formData, metodoEnvio: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="activo"
          checked={formData.activo}
          onCheckedChange={(checked) => setFormData({...formData, activo: checked})}
        />
        <label htmlFor="activo" className="text-sm font-medium text-gray-700">
          Recordatorio activo
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCerrar}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Crear Recordatorio
        </Button>
      </div>
    </form>
  )
}
