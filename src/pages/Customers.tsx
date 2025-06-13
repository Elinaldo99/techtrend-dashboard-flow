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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

// Add a local Customer type for type safety
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  total_purchases: number;
  last_purchase: string | null;
  status: string;
}

// Use a more specific type for sales history
interface CustomerSale {
  id: string;
  date: string;
  products: string;
  total: number;
  status: string;
}

const statusMap: Record<string, { label: string; color: string }> = {
  ativo: { label: "Ativo", color: "bg-green-100 text-green-800" },
  inativo: { label: "Inativo", color: "bg-gray-100 text-gray-800" },
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    total_purchases: "",
    last_purchase: "",
    status: "ativo",
  });
  const [editForm, setEditForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    total_purchases: '',
    last_purchase: '',
    status: 'ativo',
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [customerSales, setCustomerSales] = useState<CustomerSale[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Novo gerador de ID: número aleatório de até 5 dígitos
  function generateCustomerId() {
    return Math.floor(10000 + Math.random() * 90000).toString(); // 5 dígitos
  }

  // Fetch customers from Supabase
  const {
    data: customers = [],
    isLoading,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("id, name, email, phone, total_purchases, last_purchase, status");
      if (error) throw error;
      return (data || []) as Customer[];
    },
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInput = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!form.name || !form.email) {
        toast({
          title: "Campos obrigatórios",
          description: "Nome e Email são obrigatórios.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      const generatedId = generateCustomerId();
      const { error } = await supabase.from("customers").insert([
        {
          id: generatedId,
          name: form.name,
          email: form.email,
          phone: form.phone,
          total_purchases: form.total_purchases
            ? Number(
                form.total_purchases
                  .replace(/[^\d,]/g, "")
                  .replace(",", ".")
              )
            : 0,
          last_purchase: form.last_purchase || null,
          status: form.status,
        } as TablesInsert<"customers">,
      ]);
      if (error) throw error;
      toast({
        title: "Cliente adicionado",
        description: `Cliente ${form.name} cadastrado com sucesso!`,
      });
      setForm({
        name: "",
        email: "",
        phone: "",
        total_purchases: "",
        last_purchase: "",
        status: "ativo",
      });
      setModalOpen(false);
      await queryClient.invalidateQueries({ queryKey: ["customers"] });
      await queryClient.refetchQueries({ queryKey: ["customers"] });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast({
        title: "Erro ao adicionar cliente",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      total_purchases: customer.total_purchases?.toString() || '',
      last_purchase: customer.last_purchase || '',
      status: customer.status,
    });
    setEditModalOpen(true);
  };

  const handleEditInput = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      if (!editForm.name || !editForm.email) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Nome e Email são obrigatórios.',
          variant: 'destructive',
        });
        setEditLoading(false);
        return;
      }
      const { error } = await supabase.from('customers').update({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        total_purchases: editForm.total_purchases
          ? Number(
              editForm.total_purchases
                .replace(/[^\d,]/g, "")
                .replace(",", ".")
            )
          : 0,
        last_purchase: editForm.last_purchase || null,
        status: editForm.status,
      } as TablesUpdate<"customers">)
      .eq("id", editForm.id);
      if (error) throw error;
      toast({
        title: 'Cliente atualizado',
        description: `Cliente ${editForm.name} atualizado com sucesso!`,
      });
      setEditModalOpen(false);
      setSelectedCustomer(null);
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      await queryClient.refetchQueries({ queryKey: ['customers'] });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast({
        title: 'Erro ao atualizar cliente',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    if (!editForm.id) return;
    setEditLoading(true);
    try {
      const { error } = await supabase.from('customers').delete().eq('id', editForm.id);
      if (error) throw error;
      toast({
        title: 'Cliente excluído',
        description: `Cliente removido com sucesso!`,
      });
      setEditModalOpen(false);
      setSelectedCustomer(null);
      await queryClient.invalidateQueries({ queryKey: ['customers'] });
      await queryClient.refetchQueries({ queryKey: ['customers'] });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      toast({
        title: 'Erro ao excluir cliente',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setEditLoading(false);
    }
  };

  const openHistoryModal = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    // Busca vendas do cliente pelo nome (ou id, se disponível)
    const { data, error } = await supabase
      .from('sales')
      .select('id, date, products, total, status')
      .eq('customer', customer.name);
    if (error) {
      setCustomerSales([]);
      setHistoryLoading(false);
      toast({
        title: 'Erro ao buscar histórico',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    setCustomerSales(data || []);
    setHistoryLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Editar Cliente Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input value={editForm.name} onChange={e => handleEditInput('name', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={editForm.email} onChange={e => handleEditInput('email', e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input value={editForm.phone} onChange={e => handleEditInput('phone', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total em Compras</label>
              <Input value={editForm.total_purchases} onChange={e => handleEditInput('total_purchases', e.target.value)} placeholder="R$ 0,00" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Última Compra</label>
              <Input type="date" value={editForm.last_purchase} onChange={e => handleEditInput('last_purchase', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select className="w-full border rounded px-2 py-1" value={editForm.status} onChange={e => handleEditInput('status', e.target.value)}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={handleDeleteCustomer} disabled={editLoading}>
                {editLoading ? 'Excluindo...' : 'Excluir'}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={editLoading}>{editLoading ? 'Salvando...' : 'Salvar'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Histórico de Compras Modal */}
      <Dialog open={historyModalOpen} onOpenChange={setHistoryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de Compras de {selectedCustomer?.name}</DialogTitle>
          </DialogHeader>
          {historyLoading ? (
            <div className="py-6 text-center">Carregando histórico...</div>
          ) : customerSales.length === 0 ? (
            <div className="py-6 text-center">Nenhuma venda encontrada para este cliente.</div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Produtos</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>{sale.date ? new Date(sale.date).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>{sale.products}</TableCell>
                      <TableCell>{sale.status}</TableCell>
                      <TableCell>{sale.total?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciamento de Clientes</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCustomer} className="space-y-4">
            {/* ID field removed */}
            <div>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <Input
                value={form.name}
                onChange={(e) => handleInput("name", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => handleInput("email", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Telefone</label>
              <Input
                value={form.phone}
                onChange={(e) => handleInput("phone", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Total em Compras
              </label>
              <Input
                value={form.total_purchases}
                onChange={(e) => handleInput("total_purchases", e.target.value)}
                placeholder="R$ 0,00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Última Compra
              </label>
              <Input
                type="date"
                value={form.last_purchase}
                onChange={(e) => handleInput("last_purchase", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                className="w-full border rounded px-2 py-1"
                value={form.status}
                onChange={(e) => handleInput("status", e.target.value)}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Carregando clientes...
                  </TableCell>
                </TableRow>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
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
                    <TableCell>
                      {customer.total_purchases?.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }) || "R$ 0,00"}
                    </TableCell>
                    <TableCell>
                      {customer.last_purchase
                        ? new Date(customer.last_purchase).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          statusMap[customer.status]?.color || ""
                        }
                      >
                        {statusMap[customer.status]?.label || customer.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openEditModal(customer)}>
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openHistoryModal(customer)}>
                          Histórico
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
