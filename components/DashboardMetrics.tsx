import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { obtenerMetricasDashboard } from '@/lib/actions/dashboard.actions'

export default async function DashboardMetrics() {
  // Obtener métricas reales de Supabase con manejo de errores
  let metrics;
  try {
    metrics = await obtenerMetricasDashboard()
  } catch (error) {
    console.error('Error al obtener métricas del dashboard:', error)
    // Métricas por defecto en caso de error
    metrics = {
      totalPatients: 0,
      activePatients: 0,
      appointmentsToday: 0,
      appointmentsThisWeek: 0,
      monthlyRevenue: 0,
      pendingNotes: 0,
      weeklyGrowth: 0,
      monthlyGrowth: 0,
      recentAppointments: [],
      recentNotes: []
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Pacientes Activos */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.activePatients}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs">
            {getGrowthIcon(metrics.weeklyGrowth)}
            <span className={getGrowthColor(metrics.weeklyGrowth)}>
              +{metrics.weeklyGrowth}%
            </span>
            <span className="text-gray-500">vs semana pasada</span>
          </div>
        </CardContent>
      </Card>

      {/* Citas Hoy */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Citas Hoy</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.appointmentsToday}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span className="text-gray-500">{metrics.appointmentsThisWeek} esta semana</span>
          </div>
        </CardContent>
      </Card>

      {/* Ingresos del Mes */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-semibold text-gray-900">{formatCurrency(metrics.monthlyRevenue)}</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs">
            {getGrowthIcon(metrics.monthlyGrowth)}
            <span className={getGrowthColor(metrics.monthlyGrowth)}>
              +{metrics.monthlyGrowth}%
            </span>
            <span className="text-gray-500">vs mes pasado</span>
          </div>
        </CardContent>
      </Card>

      {/* Notas Pendientes */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Notas Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{metrics.pendingNotes}</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs">
            <FileText className="h-3 w-3 text-gray-400" />
            <span className="text-gray-500">Requieren revisión</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
