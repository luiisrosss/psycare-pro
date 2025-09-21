'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, User, Mail, Phone, MapPin, CreditCard, Shield, Bell } from 'lucide-react'

export default function ConfiguracionPage() {
  const [perfilData, setPerfilData] = useState({
    name: 'Dr. María García',
    email: 'maria.garcia@email.com',
    phone: '+34 600 123 456',
    address: 'Calle Mayor 123, 28001 Madrid',
    tax_id: '12345678A',
    specialization: 'Psicología Clínica',
    license_number: 'PSI-12345',
    bio: 'Psicóloga clínica con más de 10 años de experiencia en terapia cognitivo-conductual y terapia de pareja.'
  })

  const [facturacionData, setFacturacionData] = useState({
    bank_name: 'Banco Santander',
    iban: 'ES91 2100 0418 4502 0005 1332',
    swift: 'BSCHESMM',
    payment_terms: '30 días',
    currency: 'EUR',
    tax_rate: 21
  })

  const [notificacionesData, setNotificacionesData] = useState({
    email_notifications: true,
    appointment_reminders: true,
    payment_reminders: true,
    weekly_reports: true,
    marketing_emails: false
  })

  const handleSavePerfil = () => {
    // Aquí se guardaría en Supabase
    console.log('Guardando perfil:', perfilData)
    alert('Perfil actualizado correctamente')
  }

  const handleSaveFacturacion = () => {
    // Aquí se guardaría en Supabase
    console.log('Guardando facturación:', facturacionData)
    alert('Configuración de facturación actualizada')
  }

  const handleSaveNotificaciones = () => {
    // Aquí se guardaría en Supabase
    console.log('Guardando notificaciones:', notificacionesData)
    alert('Configuración de notificaciones actualizada')
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Configuración</h1>
        <p className="mt-1 text-sm text-gray-600">Gestiona tu perfil profesional y preferencias</p>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="perfil" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="facturacion" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Facturación
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificaciones
          </TabsTrigger>
        </TabsList>

        {/* Perfil Profesional */}
        <TabsContent value="perfil">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Información Profesional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <Input
                    value={perfilData.name}
                    onChange={(e) => setPerfilData({...perfilData, name: e.target.value})}
                    placeholder="Dr. María García"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    type="email"
                    value={perfilData.email}
                    onChange={(e) => setPerfilData({...perfilData, email: e.target.value})}
                    placeholder="maria.garcia@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <Input
                    value={perfilData.phone}
                    onChange={(e) => setPerfilData({...perfilData, phone: e.target.value})}
                    placeholder="+34 600 123 456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                  <Input
                    value={perfilData.address}
                    onChange={(e) => setPerfilData({...perfilData, address: e.target.value})}
                    placeholder="Calle Mayor 123, 28001 Madrid"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIF/NIE</label>
                  <Input
                    value={perfilData.tax_id}
                    onChange={(e) => setPerfilData({...perfilData, tax_id: e.target.value})}
                    placeholder="12345678A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Especialización</label>
                  <Input
                    value={perfilData.specialization}
                    onChange={(e) => setPerfilData({...perfilData, specialization: e.target.value})}
                    placeholder="Psicología Clínica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Colegiado</label>
                  <Input
                    value={perfilData.license_number}
                    onChange={(e) => setPerfilData({...perfilData, license_number: e.target.value})}
                    placeholder="PSI-12345"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biografía Profesional</label>
                <Textarea
                  value={perfilData.bio}
                  onChange={(e) => setPerfilData({...perfilData, bio: e.target.value})}
                  placeholder="Describe tu experiencia profesional..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePerfil} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Facturación */}
        <TabsContent value="facturacion">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Datos de Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Banco</label>
                  <Input
                    value={facturacionData.bank_name}
                    onChange={(e) => setFacturacionData({...facturacionData, bank_name: e.target.value})}
                    placeholder="Banco Santander"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                  <Input
                    value={facturacionData.iban}
                    onChange={(e) => setFacturacionData({...facturacionData, iban: e.target.value})}
                    placeholder="ES91 2100 0418 4502 0005 1332"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SWIFT/BIC</label>
                  <Input
                    value={facturacionData.swift}
                    onChange={(e) => setFacturacionData({...facturacionData, swift: e.target.value})}
                    placeholder="BSCHESMM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Términos de Pago</label>
                  <Input
                    value={facturacionData.payment_terms}
                    onChange={(e) => setFacturacionData({...facturacionData, payment_terms: e.target.value})}
                    placeholder="30 días"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                  <Input
                    value={facturacionData.currency}
                    onChange={(e) => setFacturacionData({...facturacionData, currency: e.target.value})}
                    placeholder="EUR"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IVA (%)</label>
                  <Input
                    type="number"
                    value={facturacionData.tax_rate}
                    onChange={(e) => setFacturacionData({...facturacionData, tax_rate: parseInt(e.target.value)})}
                    placeholder="21"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveFacturacion} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Facturación
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuración de Notificaciones */}
        <TabsContent value="notificaciones">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Preferencias de Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Notificaciones por Email</h3>
                    <p className="text-sm text-gray-600">Recibir notificaciones importantes por correo electrónico</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificacionesData.email_notifications}
                    onChange={(e) => setNotificacionesData({...notificacionesData, email_notifications: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Recordatorios de Citas</h3>
                    <p className="text-sm text-gray-600">Notificaciones automáticas antes de las citas programadas</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificacionesData.appointment_reminders}
                    onChange={(e) => setNotificacionesData({...notificacionesData, appointment_reminders: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Recordatorios de Pago</h3>
                    <p className="text-sm text-gray-600">Alertas cuando las facturas están próximas a vencer</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificacionesData.payment_reminders}
                    onChange={(e) => setNotificacionesData({...notificacionesData, payment_reminders: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Reportes Semanales</h3>
                    <p className="text-sm text-gray-600">Resumen semanal de actividad y métricas</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificacionesData.weekly_reports}
                    onChange={(e) => setNotificacionesData({...notificacionesData, weekly_reports: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Emails de Marketing</h3>
                    <p className="text-sm text-gray-600">Recibir información sobre nuevas funciones y promociones</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificacionesData.marketing_emails}
                    onChange={(e) => setNotificacionesData({...notificacionesData, marketing_emails: e.target.checked})}
                    className="h-4 w-4 text-blue-600 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotificaciones} className="bg-purple-600 hover:bg-purple-700">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Notificaciones
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
