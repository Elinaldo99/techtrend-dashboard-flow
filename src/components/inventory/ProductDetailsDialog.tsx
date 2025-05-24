
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  category: {
    name: string;
  };
  price: number;
  stock: number;
  width: number;
  height: number;
  weight: number;
  description?: string;
  created_at: string;
}

interface ProductDetailsDialogProps {
  product: Product;
  children?: React.ReactNode;
}

export function ProductDetailsDialog({ product, children }: ProductDetailsDialogProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || <Button variant="outline" size="sm">Detalhes</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Produto</DialogTitle>
          <DialogDescription>
            Informações completas do produto selecionado.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-500">Nome do Produto</h4>
            <p className="text-base font-medium">{product.name}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-500">Categoria</h4>
            <Badge className="mt-1">{product.category.name}</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-500">Preço</h4>
              <p className="text-base font-medium">{formatPrice(product.price)}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500">Estoque</h4>
              <p className="text-base font-medium">{product.stock} unidades</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm text-gray-500">Largura</h4>
              <p className="text-base">{product.width} cm</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500">Altura</h4>
              <p className="text-base">{product.height} cm</p>
            </div>
            <div>
              <h4 className="font-medium text-sm text-gray-500">Peso</h4>
              <p className="text-base">{product.weight} kg</p>
            </div>
          </div>
          
          {product.description && (
            <div>
              <h4 className="font-medium text-sm text-gray-500">Descrição</h4>
              <p className="text-base">{product.description}</p>
            </div>
          )}
          
          <div>
            <h4 className="font-medium text-sm text-gray-500">Data de Cadastro</h4>
            <p className="text-base">{formatDate(product.created_at)}</p>
          </div>
          
          <div>
            <h4 className="font-medium text-sm text-gray-500">Código do Produto</h4>
            <p className="text-base font-mono text-sm">{product.id.substring(0, 8)}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
