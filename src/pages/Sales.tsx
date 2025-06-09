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
import NewSaleDialog from "@/components/sales/NewSaleDialog";
import SaleDeleteDialog from "@/components/sales/SaleDeleteDialog";
import SaleDetailsDialog from "@/components/sales/SaleDetailsDialog";
import EditSaleDialog from "@/components/sales/EditSaleDialog";

interface Sale {
  id: string;
  customer: string;
  date: string;
  products: string;
  status: string;
  payment: string;
  total: string;
}

const salesData: Sale[] = [];

const statusMap: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  enviado: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

const Sales = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sales, setSales] = useState<Sale[]>(salesData);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  const filteredSales = sales.filter(
    (sale) =>
      (sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.products.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!date || sale.date === format(date, "dd/MM/yyyy"))
  );

  const handleAddSale = (sale: Sale) => {
    setSales([sale, ...sales]);
  };

  const handleDeleteSale = (id?: string) => {
    const saleId = id || selectedSaleId;
    if (saleId) {
      setSales(sales.filter((sale) => sale.id !== saleId));
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      setSelectedSaleId(null);
      setSelectedSale(null);
    }
  };

  const handleEditSale = (updated: Sale) => {
    setSales(sales.map(s => s.id === updated.id ? updated : s));
    setEditDialogOpen(false);
    setSelectedSale(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Histórico de Vendas</h1>
        <Button onClick={() => setDialogOpen(true)}>Nova Venda</Button>
        <NewSaleDialog open={dialogOpen} onOpenChange={setDialogOpen} onAddSale={handleAddSale} />
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
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedSale(sale);
                          setDetailsDialogOpen(true);
                        }}
                      >
                        Detalhes
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setSelectedSale(sale);
                          setEditDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <SaleDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDeleteSale}
        saleId={selectedSaleId || ""}
      />
      <SaleDetailsDialog
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        sale={selectedSale}
        onDelete={handleDeleteSale}
      />
      <EditSaleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        sale={selectedSale}
        onSave={handleEditSale}
      />
    </div>
  );
};

export default Sales;
