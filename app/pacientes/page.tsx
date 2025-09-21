import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Calendar, Phone, Mail } from 'lucide-react';

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string; sort?: string };
}) {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/sign-in');
  }

  // Datos de ejemplo
  const mockPatients = [
    {
      id: '1',
      first_name: 'María',
      last_name: 'García López',
      email: 'maria.garcia@email.com',
      phone: '+34 612 345 678',
      date_of_birth: '1985-03-15',
      gender: 'female',
      status: 'active',
      created_at: '2024-01-15T10:30:00Z',
      last_appointment: '2024-01-20T16:00:00Z'
    },
    {
      id: '2',
      first_name: 'Carlos',
      last_name: 'Rodríguez Martín',
      email: 'carlos.rodriguez@email.com',
      phone: '+34 623 456 789',
      date_of_birth: '1978-07-22',
      gender: 'male',
      status: 'active',
      created_at: '2024-01-10T14:20:00Z',
      last_appointment: '2024-01-18T11:30:00Z'
    },
    {
      id: '3',
      first_name: 'Ana',
      last_name: 'Fernández Ruiz',
      email: 'ana.fernandez@email.com',
      phone: '+34 634 567 890',
      date_of_birth: '1992-11-08',
      gender: 'female',
      status: 'inactive',
      created_at: '2024-01-05T09:15:00Z',
      last_appointment: '2024-01-12T15:45:00Z'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-yellow-100 text-yellow-800">Inactivo</Badge>;
      case 'discharged':
        return <Badge className="bg-gray-100 text-gray-800">Dado de alta</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Pacientes</h1>
        <p className="mt-1 text-sm text-gray-600">Administra la información de tus pacientes</p>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, email o teléfono..."
                  className="pl-10"
                  defaultValue={searchParams.search || ''}
                />
              </div>
            </div>

            {/* Filtro por estado */}
            <Select defaultValue={searchParams.status || 'all'}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Estado del paciente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="discharged">Dado de alta</SelectItem>
              </SelectContent>
            </Select>

            {/* Ordenamiento */}
            <Select defaultValue={searchParams.sort || 'name'}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre</SelectItem>
                <SelectItem value="created_at">Fecha de registro</SelectItem>
                <SelectItem value="last_appointment">Última cita</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Aplicar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Última cita</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {patient.first_name} {patient.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Registrado: {formatDate(patient.created_at)}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {patient.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 text-gray-400" />
                          {patient.email}
                        </div>
                      )}
                      {patient.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-400" />
                          {patient.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.date_of_birth ? calculateAge(patient.date_of_birth) : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(patient.status)}
                  </TableCell>
                  <TableCell>
                    {patient.last_appointment ? (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {formatDate(patient.last_appointment)}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin citas</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}