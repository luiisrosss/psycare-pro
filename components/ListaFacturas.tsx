import { FileText, User, Calendar, Clock, Eye, Edit, Trash2, MoreHorizontal, DollarSign, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { obtenerFacturas, eliminarFactura, marcarFacturaComoPagada } from '@/lib/actions/invoice.actions'

interface Factura {
  id: string
  psychologist_id: string
  patient_id: string
  invoice_number: string
  invoice_date: string
  due_date?: string
  amount: number
  tax_rate: number
  total_amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  created_at: string
  updated_at: string
  patients?: {
    first_name: string
    last_name: string
    email?: string
  }
}

// Datos de ejemplo para cuando no hay conexión a Supabase
const facturasEjemplo: Factura[] = [
  {
    id: '1',
    psychologist_id: '1',
    patient_id: '1',
    invoice_number: 'INV-2024-000001',
    invoice_date: '2024-01-15',
    due_date: '2024-02-15',
    amount: 50.00,
    tax_rate: 0,
    total_amount: 50.00,
    status: 'paid',
    notes: 'Sesión individual',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    patients: {
      first_name: 'María',
      last_name: 'García',
      email: 'maria.garcia@email.com'
    }
  },
  {
    id: '2',
    psychologist_id: '1',
    patient_id: '2',
    invoice_number: 'INV-2024-000002',
    invoice_date: '2024-01-16',
    due_date: '2024-02-16',
    amount: 60.00,
    tax_rate: 0,
    total_amount: 60.00,
    status: 'sent',
    notes: 'Terapia de pareja',
    created_at: '2024-01-16T11:30:00Z',
    updated_at: '2024-01-16T11:30:00Z',
    patients: {
      first_name: 'Juan',
      last_name: 'Pérez',
      email: 'juan.perez@email.com'
    }
  }
]

interface ListaFacturasProps {
  busqueda: string
  filtroPaciente: string
  filtroEstado: string
  filtroFecha: string
}

export default async function ListaFacturas({ busqueda, filtroPaciente, filtroEstado, filtroFecha }: ListaFacturasProps) {
  // Intentar obtener facturas de Supabase, usar datos de ejemplo si falla
  let facturas: Factura[] = facturasEjemplo;
  
  try {
    facturas = await obtenerFacturas();
  } catch (error) {
    console.error('Error al obtener facturas:', error);
    // Usar datos de ejemplo en caso de error
  }

  const obtenerColorEstado = (estado: string) => {
    switch (estado) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'cancelled':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const obtenerTextoEstado = (estado: string) => {
    switch (estado) {
      case 'paid':
        return 'Pagada'
      case 'sent':
        return 'Enviada'
      case 'overdue':
        return 'Vencida'
      case 'draft':
        return 'Borrador'
      case 'cancelled':
        return 'Cancelada'
      default:
        return 'Desconocido'
    }
  }

  const obtenerIconoEstado = (estado: string) => {
    switch (estado) {
      case 'paid':
        return <CheckCircle className="h-3 w-3" />
      case 'overdue':
        return <AlertCircle className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const filtrarFacturas = () => {
    return facturas.filter(factura => {
      const nombrePaciente = factura.patients ? `${factura.patients.first_name} ${factura.patients.last_name}` : '';
      
      const cumpleBusqueda = !busqueda || 
        factura.invoice_number.toLowerCase().includes(busqueda.toLowerCase()) ||
        nombrePaciente.toLowerCase().includes(busqueda.toLowerCase()) ||
        (factura.notes && factura.notes.toLowerCase().includes(busqueda.toLowerCase()))

      const cumplePaciente = !filtroPaciente || factura.patient_id === filtroPaciente
      const cumpleEstado = !filtroEstado || factura.status === filtroEstado
      const cumpleFecha = !filtroFecha || factura.invoice_date === filtroFecha

      return cumpleBusqueda && cumplePaciente && cumpleEstado && cumpleFecha
    })
  }

  const notasFiltradas = filtrarFacturas()

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatearMoneda = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const handleEliminarFactura = async (id: string) => {
    try {
      await eliminarFactura(id);
      // La página se recargará automáticamente debido a revalidatePath
    } catch (error) {
      console.error('Error al eliminar factura:', error);
    }
  }

  const handleMarcarComoPagada = async (id: string) => {
    try {
      await marcarFacturaComoPagada(id);
      // La página se recargará automáticamente debido a revalidatePath
    } catch (error) {
      console.error('Error al marcar factura como pagada:', error);
    }
  }

  const handleVerFactura = (id: string) => {
    console.log('Ver factura:', id)
    // Aquí se implementaría la lógica para ver la factura completa
  }

  const handleEditarFactura = (id: string) => {
    console.log('Editar factura:', id)
    // Aquí se implementaría la lógica para editar la factura
  }

  if (notasFiltradas.length === 0) {
    return (
      <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron facturas</h3>
        <p className="text-gray-600">
          {busqueda || filtroPaciente || filtroEstado || filtroFecha
            ? 'Intenta ajustar los filtros de búsqueda'
            : 'Aún no tienes facturas registradas'
          }
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {notasFiltradas.map((factura) => (
        <Card key={factura.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {factura.invoice_number}
                  </h3>
                  <Badge className={cn('border', obtenerColorEstado(factura.status))}>
                    {obtenerIconoEstado(factura.status)}
                    <span className="ml-1">{obtenerTextoEstado(factura.status)}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {factura.patients ? `${factura.patients.first_name} ${factura.patients.last_name}` : 'Paciente desconocido'}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatearFecha(factura.invoice_date)}
                  </div>
                  {factura.due_date && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Vence: {formatearFecha(factura.due_date)}
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Importe base: {formatearMoneda(factura.amount)}</p>
                      {factura.tax_rate > 0 && (
                        <p className="text-sm text-gray-600">IVA ({factura.tax_rate}%): {formatearMoneda(factura.amount * factura.tax_rate / 100)}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        Total: {formatearMoneda(factura.total_amount)}
                      </p>
                    </div>
                  </div>
                </div>

                {factura.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">
                      <strong>Notas:</strong> {factura.notes}
                    </p>
                  </div>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleVerFactura(factura.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Factura
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditarFactura(factura.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  {factura.status !== 'paid' && (
                    <DropdownMenuItem onClick={() => handleMarcarComoPagada(factura.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Pagada
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={() => handleEliminarFactura(factura.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Resumen de resultados */}
      <div className="text-center text-sm text-gray-600 pt-4 border-t">
        Mostrando {notasFiltradas.length} de {facturas.length} facturas
      </div>
    </div>
  )
}
