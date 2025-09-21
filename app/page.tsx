import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, DollarSign, FileText, Plus, Clock, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardMetricsSkeleton from "@/components/DashboardMetricsSkeleton";
import UpcomingAppointments from "@/components/UpcomingAppointments";
import UpcomingAppointmentsSkeleton from "@/components/UpcomingAppointmentsSkeleton";
import RecentNotes from "@/components/RecentNotes";
import RecentNotesSkeleton from "@/components/RecentNotesSkeleton";

const Page = async () => {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Resumen de tu actividad clínica</p>
      </div>

        {/* Métricas principales */}
        <Suspense fallback={<DashboardMetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>

        {/* Contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                Próximas Citas
              </CardTitle>
              <CardDescription>
                Citas programadas para hoy y los próximos días
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
                <UpcomingAppointments />
              </Suspense>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Notas Recientes
              </CardTitle>
              <CardDescription>
                Últimas notas clínicas creadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<RecentNotesSkeleton />}>
                <RecentNotes />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-gray-900">Resumen Semanal</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Sesiones realizadas</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Nuevos pacientes</span>
                  <span className="text-sm font-medium text-gray-900">3</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Notas completadas</span>
                  <span className="text-sm font-medium text-gray-900">8</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-gray-600">Ingresos semanales</span>
                  <span className="text-sm font-medium text-gray-900">€480</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium text-gray-900">Alertas</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">3 notas pendientes</p>
                    <p className="text-xs text-gray-500">Requieren revisión</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Cita en 30 minutos</p>
                    <p className="text-xs text-gray-500">María García - 10:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 py-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Backup completado</p>
                    <p className="text-xs text-gray-500">Datos seguros</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}

export default Page