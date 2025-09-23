import { Suspense } from 'react'
import { Bell, Plus, Search, Filter, Calendar, User, Clock, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ListaRecordatorios from '@/components/ListaRecordatorios'
import ListaRecordatoriosSkeleton from '@/components/ListaRecordatoriosSkeleton'
import NuevoRecordatorioForm from '@/components/NuevoRecordatorioForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { obtenerEstadisticasRecordatorios } from '@/lib/actions/reminder.actions'

export default async function RecordatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    patient?: string;
    type?: string;
    status?: string;
    showForm?: string;
  }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const params = await searchParams;

  // Obtener estadísticas de recordatorios
  let estadisticas;
  try {
    estadisticas = await obtenerEstadisticasRecordatorios();
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    estadisticas = {
      totalRecordatorios: 0,
      recordatoriosEnviados: 0,
      recordatoriosPendientes: 0,
      recordatoriosHoy: 0
    };
  }

  const mostrarFormulario = params.showForm === 'true';

  const pacientesEjemplo = [
    { id: '1', nombre: 'María García' },
    { id: '2', nombre: 'Juan Pérez' },
    { id: '3', nombre: 'Ana López' },
    { id: '4', nombre: 'Carlos Ruiz' },
    { id: '5', nombre: 'Laura Martín' }
  ]

  const tiposRecordatorio = [
    { value: 'appointment', label: 'Cita' },
    { value: 'payment', label: 'Pago' },
    { value: 'note', label: 'Nota' },
    { value: 'follow_up', label: 'Seguimiento' },
    { value: 'custom', label: 'Personalizado' }
  ]

  const estadosRecordatorio = [
    { value: 'sent', label: 'Enviado' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'overdue', label: 'Vencido' }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Recordatorios</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona recordatorios automáticos para citas y pagos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recordatorios</CardTitle>
            <Bell className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalRecordatorios}</div>
            <p className="text-xs text-gray-600">
              {estadisticas.recordatoriosEnviados} enviados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.recordatoriosPendientes}</div>
            <p className="text-xs text-gray-600">
              Requieren atención
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hoy</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.recordatoriosHoy}</div>
            <p className="text-xs text-gray-600">
              Programados para hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enviados</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.recordatoriosEnviados}</div>
            <p className="text-xs text-gray-600">
              Completados exitosamente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Búsqueda y Filtros
          </CardTitle>
          <CardDescription>
            Encuentra recordatorios específicos por paciente, tipo o estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Buscar por título, mensaje..."
                defaultValue={params.search || ''}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Paciente</label>
              <Select defaultValue={params.patient || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los pacientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los pacientes</SelectItem>
                  {pacientesEjemplo.map((paciente) => (
                    <SelectItem key={paciente.id} value={paciente.id}>
                      {paciente.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select defaultValue={params.type || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {tiposRecordatorio.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select defaultValue={params.status || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  {estadosRecordatorio.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Recordatorios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recordatorios
          </CardTitle>
          <CardDescription>
            Historial completo de todos los recordatorios programados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ListaRecordatoriosSkeleton />}>
            <ListaRecordatorios
              busqueda={params.search || ''}
              filtroPaciente={params.patient || ''}
              filtroTipo={params.type || ''}
              filtroEstado={params.status || ''}
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Crear Recordatorio</CardTitle>
            <CardDescription>
              Programa un nuevo recordatorio personalizado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Recordatorio
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                Para Cita
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Recordatorios Pendientes</CardTitle>
            <CardDescription>
              Recordatorios que requieren atención inmediata
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">María García - Cita</span>
                <Badge variant="destructive">Vencido</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Juan Pérez - Pago</span>
                <Badge variant="outline">Pendiente</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ana López - Seguimiento</span>
                <Badge variant="secondary">Hoy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tus recordatorios de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Recordatorio
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todos
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Bell className="w-4 h-4 mr-2" />
                Enviar Pendientes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Nuevo Recordatorio */}
      {mostrarFormulario && (
        <NuevoRecordatorioForm
          onClose={() => {}}
          onSave={() => {}}
        />
      )}
    </div>
  )
}