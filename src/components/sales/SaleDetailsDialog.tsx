import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Sale {
  id: string;
  customer: string;
  date: string;
  products: string;
  status: string;
  total: string;
}

interface SaleDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Sale | null;
  onDelete: (id?: string) => void;
}

export function SaleDetailsDialog({ open, onOpenChange, sale, onDelete }: SaleDetailsDialogProps) {
  if (!sale) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Detalhes da Venda</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div><b>ID:</b> {sale.id}</div>
          <div><b>Cliente:</b> {sale.customer}</div>
          <div><b>Data:</b> {sale.date}</div>
          <div><b>Produtos:</b> {sale.products}</div>
          <div><b>Status:</b> <Badge>{sale.status}</Badge></div>
          <div><b>Total:</b> {sale.total}</div>
        </div>
        <DialogFooter>
          <Button variant="destructive" onClick={() => onDelete(sale.id)}>
            Excluir
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
