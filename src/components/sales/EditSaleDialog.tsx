import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Sale {
  id: string;
  customer: string;
  date: string;
  products: string;
  status: string;
  total: string;
}

interface EditSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onSave: (sale: Sale) => void;
}

export function EditSaleDialog({ open, onOpenChange, sale, onSave }: EditSaleDialogProps) {
  const [form, setForm] = useState<Sale | null>(null);

  useEffect(() => {
    setForm(sale);
  }, [sale]);

  if (!form) return null;

  const handleChange = (field: keyof Sale, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form) onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Venda</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cliente</label>
            <Input value={form.customer} onChange={e => handleChange("customer", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Data</label>
            <Input value={form.date} onChange={e => handleChange("date", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Produtos</label>
            <Input value={form.products} onChange={e => handleChange("products", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <Input value={form.status} onChange={e => handleChange("status", e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total</label>
            <Input value={form.total} onChange={e => handleChange("total", e.target.value)} required />
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
