import { Suspense } from 'react'
import { FileText, Plus, Search, Filter, Calendar, User, Clock, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import ListaNotas from '@/components/ListaNotas'
import ListaNotasSkeleton from '@/components/ListaNotasSkeleton'
import NuevaNotaForm from '@/components/NuevaNotaForm'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { obtenerEstadisticasNotas } from '@/lib/actions/notes.actions'

export default async function NotasPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    patient?: string; 
    type?: string; 
    date?: string;
    showForm?: string;
  };
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Obtener estadísticas de notas
  let estadisticas;
  try {
    estadisticas = await obtenerEstadisticasNotas();
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    estadisticas = {
      totalNotas: 0,
      notasEstaSemana: 0,
      tiposCount: {}
    };
  }

  const mostrarFormulario = searchParams.showForm === 'true';

  const tiposSesion = [
    { value: 'individual', label: 'Individual' },
    { value: 'pareja', label: 'Pareja' },
    { value: 'familiar', label: 'Familiar' },
    { value: 'grupal', label: 'Grupal' }
  ]

  const pacientesEjemplo = [
    { id: '1', nombre: 'María García' },
    { id: '2', nombre: 'Juan Pérez' },
    { id: '3', nombre: 'Ana López' },
    { id: '4', nombre: 'Carlos Ruiz' },
    { id: '5', nombre: 'Laura Martín' }
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Notas</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona y organiza todas tus notas clínicas</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notas</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.totalNotas}</div>
            <p className="text-xs text-gray-600">
              +{estadisticas.notasEstaSemana} esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-gray-600">
              Requieren revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estadisticas.notasEstaSemana}</div>
            <p className="text-xs text-gray-600">
              Notas creadas esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
            <User className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-600">
              Con notas recientes
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
            Encuentra notas específicas por paciente, fecha o tipo de sesión
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <Input
                placeholder="Buscar en notas..."
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
              <label className="text-sm font-medium">Tipo de Sesión</label>
              <Select defaultValue={searchParams.type || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los tipos</SelectItem>
                  {tiposSesion.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
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

      {/* Lista de Notas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notas Clínicas
          </CardTitle>
          <CardDescription>
            Historial completo de todas las notas de sesiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<ListaNotasSkeleton />}>
            <ListaNotas 
              busqueda={searchParams.search || ''}
              filtroPaciente={searchParams.patient || ''}
              filtroTipo={searchParams.type || ''}
              filtroFecha={searchParams.date || ''}
            />
          </Suspense>
        </CardContent>
      </Card>

      {/* Plantillas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Plantillas Comunes</CardTitle>
            <CardDescription>
              Accede a plantillas predefinidas para agilizar la documentación
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Evaluación Inicial
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Sesión Individual
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Terapia de Pareja
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Notas Recientes</CardTitle>
            <CardDescription>
              Últimas notas creadas para acceso rápido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">María García - Individual</span>
                <Badge variant="default">Hoy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Juan Pérez - Pareja</span>
                <Badge variant="secondary">Ayer</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Ana López - Familiar</span>
                <Badge variant="outline">2 días</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tus notas de forma eficiente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Nota
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Exportar Notas
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formulario de Nueva Nota */}
      {mostrarFormulario && (
        <NuevaNotaForm
          onClose={() => {}}
          onSave={() => {}}
        />
      )}
    </div>
  )
}
