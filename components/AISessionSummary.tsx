'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sparkles, Copy, Check, RefreshCw } from 'lucide-react'

interface AISessionSummaryProps {
  sessionNotes: string
  patientName: string
  sessionDate: string
  onSummaryGenerated?: (summary: string) => void
}

export default function AISessionSummary({ 
  sessionNotes, 
  patientName, 
  sessionDate, 
  onSummaryGenerated 
}: AISessionSummaryProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generateSummary = async () => {
    setIsGenerating(true)
    setError('')
    
    try {
      // Simulación de llamada a IA - en producción sería una API real
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Resumen generado por IA (simulado)
      const aiSummary = `
## Resumen de Sesión - ${patientName}
**Fecha:** ${new Date(sessionDate).toLocaleDateString('es-ES')}

### Puntos Clave de la Sesión:
- El paciente mostró progreso significativo en la gestión de la ansiedad
- Se trabajó en técnicas de respiración y mindfulness
- Se identificaron patrones de pensamiento negativos recurrentes
- El paciente expresó mayor confianza en sus habilidades de afrontamiento

### Objetivos Alcanzados:
- ✅ Practicó técnicas de relajación durante la sesión
- ✅ Identificó 3 situaciones que le generan ansiedad
- ✅ Aplicó estrategias de reestructuración cognitiva

### Recomendaciones para la Próxima Sesión:
- Continuar con ejercicios de mindfulness diarios
- Trabajar en exposición gradual a situaciones temidas
- Revisar el progreso en el diario de emociones

### Observaciones Clínicas:
El paciente mantiene una actitud colaborativa y muestra motivación para el cambio. Se observa una reducción en los síntomas de ansiedad generalizada desde la sesión anterior.

### Plan de Acción:
1. Practicar técnicas de respiración 2 veces al día
2. Completar el diario de emociones diariamente
3. Programar exposición gradual a una situación específica
4. Revisar medicación con el psiquiatra si es necesario
      `.trim()

      setSummary(aiSummary)
      onSummaryGenerated?.(aiSummary)
    } catch (err) {
      setError('Error al generar el resumen. Por favor, inténtalo de nuevo.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  const regenerateSummary = () => {
    setSummary('')
    generateSummary()
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Resumen con IA
          <Badge className="bg-purple-100 text-purple-800">Professional</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!summary && !isGenerating && (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Generar Resumen Automático
            </h3>
            <p className="text-gray-600 mb-4">
              La IA analizará las notas de la sesión y generará un resumen profesional con puntos clave, objetivos y recomendaciones.
            </p>
            <Button 
              onClick={generateSummary}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generar Resumen
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Generando Resumen...
            </h3>
            <p className="text-gray-600">
              La IA está analizando las notas y creando un resumen profesional.
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
            <Button 
              onClick={generateSummary}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Reintentar
            </Button>
          </div>
        )}

        {summary && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Resumen Generado
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={regenerateSummary}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Regenerar
                </Button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                {summary}
              </pre>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Este resumen ha sido generado por IA y debe ser revisado por el profesional antes de incluirlo en el expediente del paciente.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Componente para mostrar el historial de resúmenes generados
export function AISummaryHistory({ summaries }: { summaries: any[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          Historial de Resúmenes IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        {summaries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>No hay resúmenes generados aún</p>
          </div>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {summary.patient_name} - {new Date(summary.session_date).toLocaleDateString('es-ES')}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Generado el {new Date(summary.created_at).toLocaleDateString('es-ES')}
                    </p>
                  </div>
                  <Badge className="bg-purple-100 text-purple-800">
                    IA Generado
                  </Badge>
                </div>
                <div className="bg-gray-50 rounded p-3">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                    {summary.summary_text.substring(0, 200)}...
                  </pre>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
