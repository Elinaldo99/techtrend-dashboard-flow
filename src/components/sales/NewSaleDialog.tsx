import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Sale {
  id: string;
  customer: string;
  date: string;
  products: string;
  status: string;
  payment: string;
  total: string;
}

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSale: (sale: Sale) => void;
}

type ProductInStock = { id: string; name: string; stock: number };

export default function NewSaleDialog({ open, onOpenChange, onAddSale }: NewSaleDialogProps) {
  const [customer, setCustomer] = useState("");
  const [date, setDate] = useState<string>(format(new Date(), "dd/MM/yyyy"));
  const [products, setProducts] = useState("");
  const [status, setStatus] = useState("pendente");
  const [payment, setPayment] = useState("");
  const [total, setTotal] = useState("");
  const [loading, setLoading] = useState(false);

  // Buscar produtos em estoque
  const { data: productsList = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["products-in-stock"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock")
        .gt("stock", 0);
      if (error) throw error;
      return data || [];
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Converter total para número (remover R$ e pontos, trocar vírgula por ponto)
    const totalNumber = Number(
      total
        .replace(/[^\d,]/g, "") // remove tudo exceto dígitos e vírgula
        .replace(/\./g, "") // remove pontos
        .replace(/,/g, ".") // troca vírgula por ponto
    );
    // Converter data para ISO (de dd/MM/yyyy para yyyy-MM-dd)
    let isoDate = date;
    try {
      const [day, month, year] = date.split("/");
      isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    } catch {
      // fallback: mantém o valor original
    }
    // Salva a venda no Supabase
    const { data: inserted, error } = await supabase.from('sales').insert([
      {
        // Não envie o campo id!
        customer,
        date: isoDate,
        products,
        status,
        payment,
        total: Number(totalNumber),
        created_at: new Date().toISOString(),
      },
    ]).select().single();
    setLoading(false);
    if (error) {
      alert('Erro ao salvar venda: ' + JSON.stringify(error, null, 2));
      return;
    }
    onAddSale({
      id: inserted?.id?.toString() || '',
      customer,
      date: isoDate,
      products,
      status,
      payment,
      total: totalNumber.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
    });
    onOpenChange(false);
    setCustomer("");
    setDate(format(new Date(), "dd/MM/yyyy"));
    setProducts("");
    setStatus("pendente");
    setPayment("");
    setTotal("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID (opcional)</label>
            <Input placeholder="ID (opcional)" value={customer} onChange={e => setCustomer(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <Input placeholder="Cliente" value={customer} onChange={e => setCustomer(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <Input placeholder="Data (dd/MM/yyyy)" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Produtos</label>
            <Select value={products} onValueChange={setProducts} disabled={loadingProducts}>
              <SelectTrigger>
                <SelectValue placeholder={loadingProducts ? "Carregando..." : "Selecione um produto"} />
              </SelectTrigger>
              <SelectContent>
                {(productsList as ProductInStock[]).map((p) => (
                  <SelectItem key={p.id} value={p.name}>{p.name} (Estoque: {p.stock})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
            <Select value={payment} onValueChange={setPayment}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                <SelectItem value="Pix">Pix</SelectItem>
                <SelectItem value="Cartao de Débito">Cartão de Débito</SelectItem>
                <SelectItem value="Cartao de Crédito">Cartão de Crédito</SelectItem>
                <SelectItem value="A Prazo">A Prazo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total</label>
            <Input 
              placeholder="Total (apenas número)" 
              type="text"
              inputMode="decimal"
              value={total}
              onChange={e => {
                // Formata para Real Brasileiro conforme digita
                const raw = e.target.value.replace(/\D/g, "");
                const number = Number(raw) / 100;
                setTotal(number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
              }}
              required 
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>{loading ? "Salvando..." : "Salvar"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
