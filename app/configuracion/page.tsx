'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Save, User, Mail, Phone, MapPin, CreditCard, Shield, Download, Trash2, AlertTriangle } from 'lucide-react'
import { 
  getPsychologistProfile, 
  updatePsychologistProfile,
  getBillingSettings,
  updateBillingSettings,
  exportUserData,
  deleteUserAccount,
  type PsychologistProfile,
  type BillingSettings
} from '@/lib/actions/profile.actions'
import { useUser } from '@clerk/nextjs'

export default function ConfiguracionPage() {
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [perfilData, setPerfilData] = useState<Partial<PsychologistProfile>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    tax_id: '',
    specialization: '',
    license_number: '',
    bio: ''
  })

  const [facturacionData, setFacturacionData] = useState<Partial<BillingSettings>>({
    bank_name: '',
    iban: '',
    swift: '',
    payment_terms: '30 días',
    currency: 'EUR',
    tax_rate: 21
  })


  // Cargar datos al montar el componente
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Cargar perfil
      const profile = await getPsychologistProfile()
      if (profile) {
        setPerfilData(profile)
      } else if (user) {
        // Si no hay perfil, usar datos de Clerk
        setPerfilData({
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
        })
      }

      // Cargar configuración de facturación
      const billing = await getBillingSettings()
      if (billing) {
        setFacturacionData(billing)
      }

    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSavePerfil = async () => {
    try {
      setSaving(true)
      const result = await updatePsychologistProfile(perfilData)
      if (result.success) {
        alert('Perfil actualizado correctamente')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Error al guardar el perfil')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveFacturacion = async () => {
    try {
      setSaving(true)
      const result = await updateBillingSettings(facturacionData)
      if (result.success) {
        alert('Configuración de facturación actualizada')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error saving billing:', error)
      alert('Error al guardar la configuración de facturación')
    } finally {
      setSaving(false)
    }
  }


  const handleExportData = async () => {
    try {
      setSaving(true)
      const result = await exportUserData()
      if (result.success && result.data) {
        // Crear y descargar archivo JSON
        const dataStr = JSON.stringify(result.data, null, 2)
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
        const exportFileDefaultName = `psycare-data-${new Date().toISOString().split('T')[0]}.json`
        
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUri)
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
        
        alert('Datos exportados correctamente')
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      alert('Error al exportar los datos')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setSaving(true)
      const result = await deleteUserAccount()
      if (result.success) {
        alert('Cuenta eliminada correctamente. Serás redirigido al login.')
        // Redirigir al login
        window.location.href = '/sign-in'
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error al eliminar la cuenta')
    } finally {
      setSaving(false)
    }
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
          <TabsTrigger value="cuenta" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Cuenta
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
                <Button 
                  onClick={handleSavePerfil} 
                  disabled={saving || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Perfil'}
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
                <Button 
                  onClick={handleSaveFacturacion} 
                  disabled={saving || loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar Facturación'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Gestión de Cuenta */}
        <TabsContent value="cuenta">
          <div className="space-y-6">
            {/* Exportar Datos */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  Exportar Datos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Descarga todos tus datos en formato JSON. Esto incluye tu perfil, pacientes, citas, notas clínicas y facturas.
                </p>
                <Button 
                  onClick={handleExportData} 
                  disabled={saving || loading}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4 mr-2" />
                  {saving ? 'Exportando...' : 'Exportar Mis Datos'}
                </Button>
              </CardContent>
            </Card>

            {/* Eliminar Cuenta */}
            <Card className="border-0 shadow-sm border-red-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-5 w-5" />
                  Zona de Peligro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Eliminar Cuenta</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Elimina permanentemente tu cuenta y todos los datos asociados. Esta acción no se puede deshacer.
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Button 
                      onClick={handleDeleteAccount} 
                      disabled={saving || loading}
                      variant="destructive"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {saving ? 'Eliminando...' : 'Eliminar Cuenta'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de la Cuenta */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-gray-600" />
                  Información de la Cuenta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">ID de Usuario</span>
                    <span className="text-sm text-gray-900 font-mono">{user?.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Email Principal</span>
                    <span className="text-sm text-gray-900">{user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Miembro desde</span>
                    <span className="text-sm text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Última Actividad</span>
                    <span className="text-sm text-gray-900">
                      {user?.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString('es-ES') : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
