
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

const inventoryItems = [
  {
    id: "SKU-001",
    name: "iPhone 13 Pro",
    category: "Celulares",
    price: "R$ 6.999,00",
    stock: 8,
    status: "Em estoque",
  },
  {
    id: "SKU-002",
    name: "Samsung Galaxy S21",
    category: "Celulares",
    price: "R$ 4.999,00",
    stock: 12,
    status: "Em estoque",
  },
  {
    id: "SKU-003",
    name: "MacBook Pro 14\"",
    category: "Notebooks",
    price: "R$ 14.999,00",
    stock: 5,
    status: "Em estoque",
  },
  {
    id: "SKU-004",
    name: "iPad Air",
    category: "Tablets",
    price: "R$ 4.799,00",
    stock: 10,
    status: "Em estoque",
  },
  {
    id: "SKU-005",
    name: "Sony WH-1000XM4",
    category: "Acessórios",
    price: "R$ 1.899,00",
    stock: 4,
    status: "Estoque baixo",
  },
  {
    id: "SKU-006",
    name: "Apple Watch Series 7",
    category: "Acessórios",
    price: "R$ 3.799,00",
    stock: 7,
    status: "Em estoque",
  },
  {
    id: "SKU-007",
    name: "TV Samsung QLED 55\"",
    category: "TVs e Áudio",
    price: "R$ 4.299,00",
    stock: 3,
    status: "Estoque baixo",
  },
  {
    id: "SKU-008",
    name: "JBL Flip 6",
    category: "TVs e Áudio",
    price: "R$ 699,00",
    stock: 15,
    status: "Em estoque",
  },
];

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = inventoryItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciamento de Inventário</h1>
        <Button>Adicionar Produto</Button>
      </div>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SKU</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Preço</TableHead>
                <TableHead className="text-center">Estoque</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.price}</TableCell>
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
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
