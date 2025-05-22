
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Mail, Phone, Plus } from "lucide-react";

const customersData = [
  {
    id: "C001",
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 98765-4321",
    totalPurchases: "R$ 12.499,00",
    lastPurchase: "20/05/2023",
    status: "ativo",
  },
  {
    id: "C002",
    name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 91234-5678",
    totalPurchases: "R$ 23.750,00",
    lastPurchase: "15/05/2023",
    status: "ativo",
  },
  {
    id: "C003",
    name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(21) 99876-5432",
    totalPurchases: "R$ 5.899,00",
    lastPurchase: "10/05/2023",
    status: "ativo",
  },
  {
    id: "C004",
    name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(21) 98765-4321",
    totalPurchases: "R$ 9.450,00",
    lastPurchase: "05/05/2023",
    status: "inativo",
  },
  {
    id: "C005",
    name: "Lucas Ferreira",
    email: "lucas.ferreira@email.com",
    phone: "(11) 97654-3210",
    totalPurchases: "R$ 18.250,00",
    lastPurchase: "30/04/2023",
    status: "ativo",
  },
  {
    id: "C006",
    name: "Julia Mendes",
    email: "julia.mendes@email.com",
    phone: "(11) 96543-2109",
    totalPurchases: "R$ 7.800,00",
    lastPurchase: "25/04/2023",
    status: "inativo",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  ativo: { label: "Ativo", color: "bg-green-100 text-green-800" },
  inativo: { label: "Inativo", color: "bg-gray-100 text-gray-800" },
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customersData.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Total em Compras</TableHead>
                <TableHead>Última Compra</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.id}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        {customer.email}
                      </div>
                      <div className="flex items-center mt-1">
                        <Phone className="h-3 w-3 mr-2" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{customer.totalPurchases}</TableCell>
                  <TableCell>{customer.lastPurchase}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[customer.status].color}>
                      {statusMap[customer.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Histórico
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
