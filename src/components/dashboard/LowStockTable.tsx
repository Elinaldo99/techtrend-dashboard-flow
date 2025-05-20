
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const lowStockItems = [
  {
    id: "SKU-001",
    name: "iPhone 13 Pro",
    category: "Celulares",
    stock: 3,
    minStock: 5,
  },
  {
    id: "SKU-002",
    name: "Samsung Galaxy S21",
    category: "Celulares",
    stock: 2,
    minStock: 5,
  },
  {
    id: "SKU-003",
    name: "Sony WH-1000XM4",
    category: "Acessórios",
    stock: 4,
    minStock: 10,
  },
  {
    id: "SKU-004",
    name: "Apple Watch Series 7",
    category: "Acessórios",
    stock: 1,
    minStock: 5,
  },
];

const LowStockTable = () => {
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
            {lowStockItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LowStockTable;
