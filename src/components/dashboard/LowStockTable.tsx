
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
}

const LowStockTable = () => {
  // Buscar produtos com estoque baixo do Supabase
  const { data: lowStockItems = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      console.log('Buscando produtos com estoque baixo...');
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          stock,
          categories:category_id(name)
        `)
        .lte('stock', 5)
        .order('stock', { ascending: true });
      
      if (error) {
        console.error('Error fetching low stock products:', error);
        return [];
      }
      
      console.log('Produtos com estoque baixo encontrados:', data?.length || 0);
      
      return data.map(product => ({
        id: product.id,
        name: product.name,
        category: product.categories?.name || 'Sem categoria',
        stock: product.stock,
      }));
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Produtos com Estoque Baixo</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-center">Estoque</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id.substring(0, 8)}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-center">{item.stock}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item.stock <= 2
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {item.stock <= 2 ? "Crítico" : "Baixo"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Nenhum produto com estoque baixo
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LowStockTable;
