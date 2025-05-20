
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const salesData = [
  {
    id: "#ORD-001",
    customer: "João Silva",
    date: "20/05/2023",
    products: "iPhone 13 Pro",
    status: "entregue",
    payment: "Cartão de Crédito",
    total: "R$ 6.999,00",
  },
  {
    id: "#ORD-002",
    customer: "Maria Oliveira",
    date: "19/05/2023",
    products: "MacBook Pro 14\"",
    status: "pendente",
    payment: "PIX",
    total: "R$ 14.999,00",
  },
  {
    id: "#ORD-003",
    customer: "Pedro Santos",
    date: "18/05/2023",
    products: "AirPods Pro",
    status: "enviado",
    payment: "Boleto",
    total: "R$ 1.899,00",
  },
  {
    id: "#ORD-004",
    customer: "Ana Costa",
    date: "17/05/2023",
    products: "iPad Air",
    status: "cancelado",
    payment: "Cartão de Crédito",
    total: "R$ 4.799,00",
  },
  {
    id: "#ORD-005",
    customer: "Lucas Ferreira",
    date: "16/05/2023",
    products: "Samsung Galaxy S21",
    status: "entregue",
    payment: "PIX",
    total: "R$ 4.999,00",
  },
  {
    id: "#ORD-006",
    customer: "Julia Mendes",
    date: "15/05/2023",
    products: "Apple Watch Series 7",
    status: "enviado",
    payment: "Cartão de Débito",
    total: "R$ 3.799,00",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  enviado: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const filteredSales = salesData.filter(
    (sale) =>
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.products.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Histórico de Vendas</h1>
        <Button>Nova Venda</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <Input
            placeholder="Buscar vendas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PP") : "Filtrar por data"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {date && (
            <Button variant="ghost" onClick={() => setDate(undefined)}>
              Limpar filtro
            </Button>
          )}
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.products}</TableCell>
                  <TableCell>
                    <Badge className={statusMap[sale.status].color}>
                      {statusMap[sale.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{sale.payment}</TableCell>
                  <TableCell className="text-right">{sale.total}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      Detalhes
                    </Button>
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

export default Sales;
