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
import { SaleDetailsDialog } from "@/components/sales/SaleDetailsDialog";
import { EditSaleDialog } from "@/components/sales/EditSaleDialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

const statusMap: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  enviado: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

type Sale = Database["public"]["Tables"]["sales"]["Row"];

export default function Sales() {
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const { toast } = useToast();

  // Busca vendas do Supabase
  const { data: sales = [], isLoading, error, refetch } = useQuery({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("id, customer, date, products, status, total")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Filtros
  const filteredSales = (sales as Sale[]).filter((sale) => {
    const id = sale.id ? String(sale.id).toLowerCase() : "";
    const customer = sale.customer ? String(sale.customer).toLowerCase() : "";
    const products = sale.products ? String(sale.products).toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    const dateMatch = !date || sale.date === format(date, "dd/MM/yyyy");
    return (
      (id.includes(search) || customer.includes(search) || products.includes(search)) && dateMatch
    );
  });

  // Handlers
  const handleAddSale = async () => {
    await refetch();
    toast({ title: "Venda adicionada", description: "Venda salva com sucesso!" });
  };

  const handleDeleteSale = async (id?: string) => {
    const saleId = id || selectedSaleId;
    if (saleId) {
      const { error } = await supabase.from("sales").delete().eq("id", saleId);
      if (error) {
        toast({ title: "Erro ao excluir venda", description: error.message, variant: "destructive" });
        return;
      }
      await refetch();
      setDeleteDialogOpen(false);
      setDetailsDialogOpen(false);
      setSelectedSaleId(null);
      setSelectedSale(null);
      toast({ title: "Venda excluída", description: "Venda removida com sucesso!" });
    }
  };

  const handleEditSale = async (updated: Sale) => {
    const { error } = await supabase
      .from("sales")
      .update({
        customer: updated.customer,
        date: updated.date,
        products: updated.products,
        status: updated.status,
        total: updated.total,
      })
      .eq("id", updated.id);
    if (error) {
      toast({ title: "Erro ao editar venda", description: error.message, variant: "destructive" });
      return;
    }
    await refetch();
    setEditDialogOpen(false);
    setSelectedSale(null);
    toast({ title: "Venda editada", description: "Venda atualizada com sucesso!" });
  };

  // Ajuste: converte o campo total para string ao passar para dialogs
  const selectedSaleForDialog = selectedSale
    ? { ...selectedSale, total: typeof selectedSale.total === "number" ? selectedSale.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : selectedSale.total }
    : null;

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
            onChange={e => setSearchTerm(e.target.value)}
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
          {isLoading ? (
            <div className="flex items-center justify-center h-40 text-lg">Carregando vendas...</div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-lg text-red-600">Erro ao carregar vendas: {error.message}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Produtos</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSales.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Nenhuma venda encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">{sale.id}</TableCell>
                      <TableCell>{sale.customer}</TableCell>
                      <TableCell>{sale.date}</TableCell>
                      <TableCell>{sale.products}</TableCell>
                      <TableCell>
                        <Badge className={statusMap[sale.status]?.color || ""}>
                          {statusMap[sale.status]?.label || sale.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {typeof sale.total === "number"
                          ? sale.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                          : sale.total}
                      </TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
          )}
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
        sale={selectedSaleForDialog}
        onDelete={handleDeleteSale}
      />
      <EditSaleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        sale={selectedSaleForDialog}
        onSave={async (updated) => {
          // Converte o campo total de string para number antes de salvar
          const totalNumber = Number(
            String(updated.total).replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(/,/g, ".")
          );
          await handleEditSale({ ...selectedSale!, ...updated, total: totalNumber });
        }}
      />
    </div>
  );
}
