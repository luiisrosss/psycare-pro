'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, DollarSign, FileText, TrendingUp, TrendingDown } from 'lucide-react'

export default function DashboardMetrics() {
  // Datos de ejemplo - en producción vendrían de Supabase
  const metrics = {
    totalPatients: 47,
    activePatients: 32,
    appointmentsToday: 3,
    appointmentsThisWeek: 12,
    monthlyRevenue: 2840,
    pendingNotes: 3,
    weeklyGrowth: 12, // Porcentaje de crecimiento semanal
    monthlyGrowth: 8   // Porcentaje de crecimiento mensual
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
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
          <Users className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activePatients}</div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            {getGrowthIcon(metrics.weeklyGrowth)}
            <span className={getGrowthColor(metrics.weeklyGrowth)}>
              +{metrics.weeklyGrowth}%
            </span>
            <span>vs semana pasada</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {metrics.totalPatients} pacientes totales
          </p>
        </CardContent>
      </Card>

      {/* Citas Hoy */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
          <Calendar className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.appointmentsToday}</div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span>{metrics.appointmentsThisWeek} esta semana</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Próxima: 10:00 - María García
          </p>
        </CardContent>
      </Card>

      {/* Ingresos del Mes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ingresos del Mes</CardTitle>
          <DollarSign className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.monthlyRevenue)}</div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            {getGrowthIcon(metrics.monthlyGrowth)}
            <span className={getGrowthColor(metrics.monthlyGrowth)}>
              +{metrics.monthlyGrowth}%
            </span>
            <span>vs mes pasado</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Promedio: {formatCurrency(metrics.monthlyRevenue / 30)}/día
          </p>
        </CardContent>
      </Card>

      {/* Notas Pendientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notas Pendientes</CardTitle>
          <FileText className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.pendingNotes}</div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <FileText className="h-3 w-3 text-gray-400" />
            <span>Requieren revisión</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Última actualización: hace 2 horas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
