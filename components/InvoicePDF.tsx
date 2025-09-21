'use client'

import { Button } from '@/components/ui/button'
import { Download, Send } from 'lucide-react'

interface InvoicePDFProps {
  invoice: {
    id: string
    invoice_number: string
    date: string
    due_date: string
    concept: string
    quantity: number
    unit_price: number
    total_amount: number
    status: string
    payment_method?: string
    notes?: string
    patient?: {
      first_name: string
      last_name: string
      email?: string
    }
  }
  psychologist?: {
    name: string
    email: string
    phone?: string
    address?: string
    tax_id?: string
  }
}

export default function InvoicePDF({ invoice, psychologist }: InvoicePDFProps) {
  const handleDownloadPDF = () => {
    // En una implementación real, aquí se generaría el PDF
    // Por ahora, simulamos la descarga
    const invoiceData = {
      ...invoice,
      psychologist
    }
    
    const dataStr = JSON.stringify(invoiceData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `factura-${invoice.invoice_number}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleSendEmail = () => {
    // En una implementación real, aquí se enviaría por email
    alert(`Enviando factura ${invoice.invoice_number} por email a ${invoice.patient?.email || 'email no disponible'}`)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadPDF}
        className="flex items-center gap-2"
      >
        <Download className="h-4 w-4" />
        PDF
      </Button>
      
      {invoice.patient?.email && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSendEmail}
          className="flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Email
        </Button>
      )}
    </div>
  )
}

// Componente para mostrar la vista previa de la factura
export function InvoicePreview({ invoice, psychologist }: InvoicePDFProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">FACTURA</h1>
          <p className="text-gray-600">Número: {invoice.invoice_number}</p>
        </div>
        <div className="text-right">
          {psychologist && (
            <>
              <h2 className="text-lg font-semibold text-gray-900">{psychologist.name}</h2>
              <p className="text-gray-600">{psychologist.email}</p>
              {psychologist.phone && <p className="text-gray-600">{psychologist.phone}</p>}
              {psychologist.address && <p className="text-gray-600">{psychologist.address}</p>}
              {psychologist.tax_id && <p className="text-gray-600">NIF: {psychologist.tax_id}</p>}
            </>
          )}
        </div>
      </div>

      {/* Información del cliente */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Facturar a:</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="font-medium text-gray-900">
            {invoice.patient?.first_name} {invoice.patient?.last_name}
          </p>
          {invoice.patient?.email && (
            <p className="text-gray-600">{invoice.patient.email}</p>
          )}
        </div>
      </div>

      {/* Detalles de la factura */}
      <div className="mb-8">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <p className="text-sm text-gray-600">Fecha de emisión:</p>
            <p className="font-medium">{new Date(invoice.date).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Fecha de vencimiento:</p>
            <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString('es-ES')}</p>
          </div>
        </div>
      </div>

      {/* Tabla de servicios */}
      <div className="mb-8">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Descripción</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-900">Cantidad</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Precio Unit.</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-3 px-4">{invoice.concept}</td>
              <td className="text-center py-3 px-4">{invoice.quantity}</td>
              <td className="text-right py-3 px-4">€{invoice.unit_price.toFixed(2)}</td>
              <td className="text-right py-3 px-4 font-semibold">€{invoice.total_amount.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-xl font-bold text-gray-900">€{invoice.total_amount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Información de pago */}
      {invoice.payment_method && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Información de Pago:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">Método de pago: <span className="font-medium">{invoice.payment_method}</span></p>
            {invoice.payment_method === 'Transferencia' && (
              <div className="mt-2 text-sm text-gray-600">
                <p>Banco: [Nombre del banco]</p>
                <p>IBAN: [Número de cuenta]</p>
                <p>Concepto: {invoice.invoice_number}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notas */}
      {invoice.notes && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notas:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-600">{invoice.notes}</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-8 border-t">
        <p>Gracias por confiar en nuestros servicios profesionales.</p>
        <p className="mt-2">Para cualquier consulta, no dude en contactarnos.</p>
      </div>
    </div>
  )
}
