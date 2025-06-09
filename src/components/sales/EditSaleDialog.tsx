import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface Sale {
  id: string;
  customer: string;
  date: string;
  products: string;
  status: string;
  payment: string;
  total: string;
}

interface EditSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onSave: (sale: Sale) => void;
}

export default function EditSaleDialog({ open, onOpenChange, sale, onSave }: EditSaleDialogProps) {
  const [form, setForm] = useState<Sale | null>(sale);

  // Atualiza o form quando abrir com nova venda
  useEffect(() => {
    setForm(sale);
  }, [sale, open]);

  if (!form) return null;

  const handleChange = (field: keyof Sale, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">ID</label>
            <Input placeholder="ID" value={form.id} onChange={e => handleChange("id", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <Input placeholder="Cliente" value={form.customer} onChange={e => handleChange("customer", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <Input placeholder="Data (dd/MM/yyyy)" value={form.date} onChange={e => handleChange("date", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Produtos</label>
            <Input placeholder="Produtos" value={form.products} onChange={e => handleChange("products", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Select value={form.status} onValueChange={v => handleChange("status", v)}>
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
            <Input placeholder="Forma de Pagamento" value={form.payment} onChange={e => handleChange("payment", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total</label>
            <Input 
              placeholder="Total (apenas número)" 
              type="text"
              inputMode="decimal"
              value={form.total}
              onChange={e => {
                // Formata para Real Brasileiro conforme digita
                const raw = e.target.value.replace(/\D/g, "");
                const number = Number(raw) / 100;
                handleChange("total", number.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }));
              }}
              required 
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
