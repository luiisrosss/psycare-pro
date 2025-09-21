'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Calendar, ExternalLink, RefreshCw, CheckCircle, AlertCircle, Settings } from 'lucide-react'

interface GoogleCalendarIntegrationProps {
  isConnected: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onSync?: () => void
}

export default function GoogleCalendarIntegration({ 
  isConnected, 
  onConnect, 
  onDisconnect, 
  onSync 
}: GoogleCalendarIntegrationProps) {
  const [isSyncing, setIsSyncing] = useState(false)
  const [autoSync, setAutoSync] = useState(true)
  const [lastSync, setLastSync] = useState(new Date())

  const handleConnect = async () => {
    // En producción, aquí se abriría la ventana de autorización de Google
    try {
      // Simulación de conexión
      await new Promise(resolve => setTimeout(resolve, 1000))
      onConnect?.()
    } catch (error) {
      console.error('Error al conectar con Google Calendar:', error)
    }
  }

  const handleDisconnect = async () => {
    try {
      // Simulación de desconexión
      await new Promise(resolve => setTimeout(resolve, 500))
      onDisconnect?.()
    } catch (error) {
      console.error('Error al desconectar Google Calendar:', error)
    }
  }

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      // Simulación de sincronización
      await new Promise(resolve => setTimeout(resolve, 2000))
      setLastSync(new Date())
      onSync?.()
    } catch (error) {
      console.error('Error al sincronizar:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Google Calendar
          <Badge className="bg-blue-100 text-blue-800">Professional</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isConnected ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Conectar con Google Calendar
            </h3>
            <p className="text-gray-600 mb-6">
              Sincroniza tus citas automáticamente con Google Calendar para una gestión unificada.
            </p>
            <Button 
              onClick={handleConnect}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Conectar con Google
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Estado de conexión */}
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-900">Conectado</h4>
                  <p className="text-sm text-green-700">
                    Última sincronización: {lastSync.toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisconnect}
                className="text-red-600 hover:text-red-700"
              >
                Desconectar
              </Button>
            </div>

            {/* Configuración de sincronización */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Configuración de Sincronización</h4>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Sincronización Automática</h5>
                  <p className="text-sm text-gray-600">
                    Sincroniza automáticamente las citas cada 15 minutos
                  </p>
                </div>
                <Switch
                  checked={autoSync}
                  onCheckedChange={setAutoSync}
                />
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Sincronización Bidireccional</h5>
                  <p className="text-sm text-gray-600">
                    Los cambios en Google Calendar se reflejan en PsyCare Pro
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Activo</Badge>
              </div>

              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h5 className="font-medium text-gray-900">Notificaciones de Google</h5>
                  <p className="text-sm text-gray-600">
                    Recibe recordatorios de Google Calendar
                  </p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Configurado</Badge>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-3">
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex-1"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sincronizar Ahora
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('https://calendar.google.com', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Google Calendar
              </Button>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Settings className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">Configuración Avanzada</h5>
                  <p className="text-sm text-blue-800 mb-2">
                    Para configurar permisos específicos o cambiar la configuración de sincronización:
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configuración Avanzada
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para mostrar el historial de sincronización
export function SyncHistory({ syncHistory }: { syncHistory: any[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 text-blue-600" />
          Historial de Sincronización
        </CardTitle>
      </CardHeader>
      <CardContent>
        {syncHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <RefreshCw className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No hay historial de sincronización</p>
          </div>
        ) : (
          <div className="space-y-3">
            {syncHistory.map((sync, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  {sync.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {sync.type === 'import' ? 'Importación' : 'Exportación'} de citas
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(sync.timestamp).toLocaleString('es-ES')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{sync.count} citas</p>
                  <Badge 
                    className={sync.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                  >
                    {sync.status === 'success' ? 'Éxito' : 'Error'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
