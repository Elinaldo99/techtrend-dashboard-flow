
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
import { AddProductDrawer } from "@/components/inventory/AddProductDrawer";
import { ProductDetailsDialog } from "@/components/inventory/ProductDetailsDialog";
import { EditProductDialog } from "@/components/inventory/EditProductDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  created_at: string;
  status: string;
}

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch products from Supabase
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Buscando produtos...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          category_id,
          price,
          stock,
          width,
          height,
          weight,
          description,
          created_at,
          categories:category_id(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching products:', error);
        throw new Error(error.message);
      }
      
      console.log('Produtos encontrados:', data?.length || 0);
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        category_id: product.category_id,
        category: product.categories,
        price: product.price,
        stock: product.stock,
        width: product.width,
        height: product.height,
        weight: product.weight,
        description: product.description,
        created_at: product.created_at,
        status: product.stock > 5 ? "Em estoque" : "Estoque baixo"
      }));
    },
  });

  const handleProductUpdated = async () => {
    console.log('Forçando atualização da lista de produtos...');
    await refetch();
    console.log('Lista de produtos atualizada');
  };

  // Filter products based on search term
  const filteredItems = products.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format price for display
  const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciamento de Inventário</h1>
        <AddProductDrawer />
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button variant="outline" onClick={handleProductUpdated}>
            Atualizar
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    Carregando produtos...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.id.substring(0, 8)}</TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.category.name}</TableCell>
                    <TableCell className="text-right">{formatPrice(item.price)}</TableCell>
                    <TableCell className="text-center">{item.stock}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          item.status === "Estoque baixo"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <EditProductDialog 
                          product={item} 
                          onProductUpdated={handleProductUpdated}
                        />
                        <ProductDetailsDialog product={item} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    {searchTerm ? "Nenhum produto encontrado." : "Nenhum produto cadastrado."}
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

export default Inventory;
