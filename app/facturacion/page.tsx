import { Suspense } from 'react'
import { DollarSign, Plus, Search, Filter, Calendar, User, Clock, Eye, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ListaFacturas from '@/components/ListaFacturas'
import ListaFacturasSkeleton from '@/components/ListaFacturasSkeleton'
import NuevaFacturaForm from '@/components/NuevaFacturaForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { obtenerEstadisticasFacturacion } from '@/lib/actions/invoice.actions'

export default async function FacturacionPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    patient?: string; 
    status?: string; 
    date?: string;
    showForm?: string;
  };
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Obtener estadísticas de facturación
  let estadisticas;
  try {
    estadisticas = await obtenerEstadisticasFacturacion();
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    estadisticas = {
      totalFacturas: 0,
      facturasPagadas: 0,
      facturasPendientes: 0,
      ingresosTotales: 0,
      ingresosMesActual: 0
    };
  }

  const mostrarFormulario = searchParams.showForm === 'true';

  const pacientesEjemplo = [
    { id: '1', nombre: 'María García' },
    { id: '2', nombre: 'Juan Pérez' },
    { id: '3', nombre: 'Ana López' },
    { id: '4', nombre: 'Carlos Ruiz' },
    { id: '5', nombre: 'Laura Martín' }
  ]

  const estadosFactura = [
    { value: 'draft', label: 'Borrador' },
    { value: 'sent', label: 'Enviada' },
    { value: 'paid', label: 'Pagada' },
    { value: 'overdue', label: 'Vencida' },
    { value: 'cancelled', label: 'Cancelada' }
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Facturación</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona tus facturas y pagos de pacientes</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalFacturas}</div>
            <p className="text-xs text-gray-600">
              {estadisticas.facturasPagadas} pagadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.facturasPendientes}</div>
            <p className="text-xs text-gray-600">
              Requieren seguimiento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(estadisticas.ingresosTotales)}</div>
            <p className="text-xs text-gray-600">
              Desde el inicio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Este Mes</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(estadisticas.ingresosMesActual)}</div>
            <p className="text-xs text-gray-600">
              Ingresos del mes actual
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
            Encuentra facturas específicas por paciente, estado o fecha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Buscar por número, paciente..."
                defaultValue={searchParams.search || ''}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Paciente</label>
              <Select defaultValue={searchParams.patient || ''}>
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
              <label className="text-sm font-medium">Estado</label>
              <Select defaultValue={searchParams.status || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los estados</SelectItem>
                  {estadosFactura.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha</label>
              <Input
                type="date"
                defaultValue={searchParams.date || ''}
              />
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

      {/* Lista de Facturas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Facturas
          </CardTitle>
          <CardDescription>
            Historial completo de todas las facturas emitidas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ListaFacturasSkeleton />}>
            <ListaFacturas 
              busqueda={searchParams.search || ''}
              filtroPaciente={searchParams.patient || ''}
              filtroEstado={searchParams.status || ''}
              filtroFecha={searchParams.date || ''}
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Crear Factura</CardTitle>
            <CardDescription>
              Genera una nueva factura para un paciente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Factura
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Desde Cita
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Facturas Pendientes</CardTitle>
            <CardDescription>
              Facturas que requieren seguimiento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">María García - €50</span>
                <Badge variant="outline">Enviada</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Juan Pérez - €60</span>
                <Badge variant="destructive">Vencida</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ana López - €45</span>
                <Badge variant="secondary">Borrador</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tus facturas de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Factura
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Exportar Facturas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Nueva Factura */}
      {mostrarFormulario && (
        <NuevaFacturaForm
          onClose={() => {}}
          onSave={() => {}}
        />
      )}
    </div>
  )
}