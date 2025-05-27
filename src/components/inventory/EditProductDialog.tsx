
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ProductEditForm } from "./ProductEditForm";
import { ProductDeleteDialog } from "./ProductDeleteDialog";
import { validateProductForm } from "@/utils/productValidation";

interface Product {
  id: string;
  name: string;
  category_id: string;
  category: {
    name: string;
  };
  price: number;
  stock: number;
  width: number;
  height: number;
  weight: number;
  description?: string;
}

interface EditProductDialogProps {
  product: Product;
  onProductUpdated: () => void;
  children?: React.ReactNode;
}

export function EditProductDialog({ product, onProductUpdated, children }: EditProductDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: product.name,
    category_id: product.category_id,
    price: product.price.toString(),
    stock: product.stock.toString(),
    width: product.width.toString(),
    height: product.height.toString(),
    weight: product.weight.toString(),
    description: product.description || '',
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateProductForm(formData);
    if (validationError) {
      toast({
        title: validationError.title,
        description: validationError.description,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: formData.name.trim(),
          category_id: formData.category_id,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          width: parseFloat(formData.width),
          height: parseFloat(formData.height),
          weight: parseFloat(formData.weight),
          description: formData.description.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: "Produto atualizado",
        description: "As alterações foram salvas com sucesso!",
      });

      await queryClient.invalidateQueries({ queryKey: ['products'] });
      onProductUpdated();
      setIsOpen(false);
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    console.log('Excluindo produto:', product.id);

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) {
        console.error('Erro ao excluir produto:', error);
        throw error;
      }

      console.log('Produto excluído com sucesso');

      toast({
        title: "Produto excluído",
        description: "O produto foi removido com sucesso!",
      });

      setIsOpen(false);
      onProductUpdated();
      
    } catch (error: any) {
      console.error('Erro durante exclusão:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o produto. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: product.name,
      category_id: product.category_id,
      price: product.price.toString(),
      stock: product.stock.toString(),
      width: product.width.toString(),
      height: product.height.toString(),
      weight: product.weight.toString(),
      description: product.description || '',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button variant="outline" size="sm">Editar</Button>}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Produto</DialogTitle>
          <DialogDescription>
            Faça as alterações necessárias nos dados do produto.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <ProductEditForm 
            product={product}
            formData={formData}
            onInputChange={handleInputChange}
          />

          <DialogFooter className="gap-2 mt-4">
            <div className="flex justify-between items-center w-full">
              <ProductDeleteDialog 
                product={product}
                isDeleting={isDeleting}
                onDelete={handleDelete}
              />

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
