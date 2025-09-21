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
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Clínico</h1>
          <p className="mt-2 text-gray-600">Bienvenido a tu centro de gestión profesional</p>
        </div>

        {/* Métricas principales */}
        <Suspense fallback={<DashboardMetricsSkeleton />}>
          <DashboardMetrics />
        </Suspense>

        {/* Acciones rápidas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>
                Accede rápidamente a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/pacientes">
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gestionar Pacientes
                  </Button>
                </Link>
                <Link href="/citas">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver Calendario
                  </Button>
                </Link>
                <Link href="/notas">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Notas Clínicas
                  </Button>
                </Link>
                <Link href="/facturacion">
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Facturación
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Resumen Semanal
              </CardTitle>
              <CardDescription>
                Actividad de la última semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sesiones realizadas</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nuevos pacientes</span>
                  <Badge variant="secondary">3</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Notas completadas</span>
                  <Badge variant="secondary">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ingresos semanales</span>
                  <Badge variant="default">€480</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Alertas y Recordatorios
              </CardTitle>
              <CardDescription>
                Tareas pendientes y notificaciones importantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">3 notas pendientes</p>
                    <p className="text-xs text-gray-600">Requieren revisión</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cita en 30 minutos</p>
                    <p className="text-xs text-gray-600">María García - 10:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Backup completado</p>
                    <p className="text-xs text-gray-600">Datos seguros</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default Page