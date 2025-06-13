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
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ["low-stock-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, stock")
        .lte("stock", 5);
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div className="p-4 text-center">Carregando produtos com baixo estoque...</div>;
  }
  if (error) {
    return <div className="p-4 text-center text-red-600">Erro ao carregar produtos: {error.message}</div>;
  }
  if (!Array.isArray(products) || products.length === 0) {
    return <div className="p-4 text-center text-gray-500">Nenhum produto com baixo estoque.</div>;
  }

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
            {products.length > 0 ? (
              products.map((item) => (
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
