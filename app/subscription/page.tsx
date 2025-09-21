import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap } from "lucide-react";
import { SUBSCRIPTION_PLANS } from "@/lib/stripe";
import { createSubscriptionCheckout } from "@/lib/actions/subscription.actions";

const Subscription = () => {
    const handleSubscribe = async (planId: string, interval: 'month' | 'year') => {
        try {
            const { url } = await createSubscriptionCheckout({ planId, interval });
            if (url) {
                window.location.href = url;
            }
        } catch (error) {
            console.error('Error creating subscription:', error);
        }
    };

    return (
        <div className="p-8">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Elige tu Plan Perfecto
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Gestión profesional para psicólogos. Elige el plan que mejor se adapte a tu práctica.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <Card 
                            key={plan.id} 
                            className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                        <Star className="h-4 w-4" />
                                        Más Popular
                                    </span>
                                </div>
                            )}
                            
                            <CardHeader className="text-center pb-4">
                                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                                <CardDescription className="text-gray-600 mt-2">
                                    {plan.description}
                                </CardDescription>
                                <div className="mt-6">
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-4xl font-bold text-gray-900">
                                            €{plan.price.monthly}
                                        </span>
                                        <span className="text-gray-600 ml-1">/mes</span>
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        o €{plan.price.annual}/mes si pagas anualmente
                                    </div>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="space-y-6">
                                {/* Features */}
                                <div className="space-y-3">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Buttons */}
                                <div className="space-y-3 pt-4">
                                    <Button 
                                        className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                                        onClick={() => handleSubscribe(plan.id, 'month')}
                                    >
                                        <Zap className="h-4 w-4 mr-2" />
                                        Comenzar Mensual
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => handleSubscribe(plan.id, 'year')}
                                    >
                                        Comenzar Anual (10% descuento)
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Additional Information */}
            <div className="max-w-4xl mx-auto mt-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center">
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Check className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle className="text-lg">Cumplimiento HIPAA</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Todos nuestros planes incluyen cumplimiento completo de HIPAA para proteger la información de tus pacientes.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Star className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle className="text-lg">Soporte Prioritario</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Respuesta rápida y soporte técnico especializado para profesionales de la salud mental.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                                <Check className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle className="text-lg">Backup Automático</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Tus datos están seguros con copias de seguridad automáticas y encriptación de extremo a extremo.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mx-auto mt-16">
                <h2 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h2>
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">¿Puedo cambiar de plan en cualquier momento?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Sí, puedes cambiar de plan en cualquier momento. Los cambios se aplicarán en tu próximo ciclo de facturación.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">¿Hay prueba gratuita?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                El plan Starter incluye 14 días de prueba gratuita. Los planes Professional y Enterprise no incluyen prueba gratuita.
                            </CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">¿Qué métodos de pago aceptan?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>
                                Aceptamos todas las tarjetas de crédito principales. Los pagos se procesan de forma segura a través de Stripe.
                            </CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Subscription