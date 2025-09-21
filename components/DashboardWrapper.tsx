'use client'

import { Suspense } from 'react'
import DashboardMetricsSkeleton from './DashboardMetricsSkeleton'
import UpcomingAppointmentsSkeleton from './UpcomingAppointmentsSkeleton'
import RecentNotesSkeleton from './RecentNotesSkeleton'
import DashboardMetrics from './DashboardMetrics'
import UpcomingAppointments from './UpcomingAppointments'
import RecentNotes from './RecentNotes'

export default function DashboardWrapper() {
  return (
    <>
      {/* Métricas principales */}
      <Suspense fallback={<DashboardMetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Próximas Citas</h2>
          <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
            <UpcomingAppointments />
          </Suspense>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Notas Recientes</h2>
          <Suspense fallback={<RecentNotesSkeleton />}>
            <RecentNotes />
          </Suspense>
        </div>
      </div>
    </>
  )
}
