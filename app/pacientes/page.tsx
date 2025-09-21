import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Card,
  CardBody,
  CardHeader,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner
} from '@heroui/react';
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

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'active':
        return <Chip color="success" variant="flat">Activo</Chip>;
      case 'inactive':
        return <Chip color="warning" variant="flat">Inactivo</Chip>;
      case 'discharged':
        return <Chip color="default" variant="flat">Dado de alta</Chip>;
      default:
        return <Chip variant="flat">{status}</Chip>;
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
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
          <p className="text-gray-600 mt-2">
            Administra la información de tus pacientes de forma segura y eficiente
          </p>
        </div>
        <Button 
          color="primary" 
          startContent={<Plus className="w-4 h-4" />}
          className="bg-blue-600 text-white"
        >
          Nuevo Paciente
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre, email o teléfono..."
                startContent={<Search className="w-4 h-4 text-gray-400" />}
                defaultValue={searchParams.search || ''}
                className="w-full"
              />
            </div>

            {/* Filtro por estado */}
            <Select 
              placeholder="Estado del paciente"
              defaultSelectedKeys={[searchParams.status || 'all']}
              className="w-full sm:w-48"
            >
              <SelectItem key="all" value="all">Todos los estados</SelectItem>
              <SelectItem key="active" value="active">Activo</SelectItem>
              <SelectItem key="inactive" value="inactive">Inactivo</SelectItem>
              <SelectItem key="discharged" value="discharged">Dado de alta</SelectItem>
            </Select>

            {/* Ordenamiento */}
            <Select 
              placeholder="Ordenar por"
              defaultSelectedKeys={[searchParams.sort || 'name']}
              className="w-full sm:w-48"
            >
              <SelectItem key="name" value="name">Nombre</SelectItem>
              <SelectItem key="created_at" value="created_at">Fecha de registro</SelectItem>
              <SelectItem key="last_appointment" value="last_appointment">Última cita</SelectItem>
            </Select>

            <Button 
              variant="bordered" 
              startContent={<Filter className="w-4 h-4" />}
              className="w-full sm:w-auto"
            >
              Aplicar Filtros
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Lista de pacientes */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Lista de Pacientes</h2>
        </CardHeader>
        <CardBody>
          <Table aria-label="Lista de pacientes">
            <TableHeader>
              <TableColumn>PACIENTE</TableColumn>
              <TableColumn>CONTACTO</TableColumn>
              <TableColumn>EDAD</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn>ÚLTIMA CITA</TableColumn>
              <TableColumn>ACCIONES</TableColumn>
            </TableHeader>
            <TableBody>
              {mockPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div>
                      <div className="font-semibold">
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
                          <Mail className="w-3 h-3 mr-2 text-gray-400" />
                          {patient.email}
                        </div>
                      )}
                      {patient.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-2 text-gray-400" />
                          {patient.phone}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {patient.date_of_birth ? calculateAge(patient.date_of_birth) : '-'}
                  </TableCell>
                  <TableCell>
                    {getStatusChip(patient.status)}
                  </TableCell>
                  <TableCell>
                    {patient.last_appointment ? (
                      <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                        {formatDate(patient.last_appointment)}
                      </div>
                    ) : (
                      <span className="text-gray-400">Sin citas</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dropdown>
                      <DropdownTrigger>
                        <Button 
                          isIconOnly 
                          variant="light" 
                          size="sm"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Acciones del paciente">
                        <DropdownItem 
                          key="view" 
                          startContent={<Eye className="w-4 h-4" />}
                        >
                          Ver detalles
                        </DropdownItem>
                        <DropdownItem 
                          key="edit" 
                          startContent={<Edit className="w-4 h-4" />}
                        >
                          Editar
                        </DropdownItem>
                        <DropdownItem 
                          key="delete" 
                          className="text-danger" 
                          color="danger"
                          startContent={<Trash2 className="w-4 h-4" />}
                        >
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
}
