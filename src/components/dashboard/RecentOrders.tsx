
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const orders = [
  {
    id: "#ORD-001",
    customer: "João Silva",
    product: "iPhone 13 Pro",
    total: "R$ 6.999,00",
    status: "entregue",
    date: "20/05/2023",
  },
  {
    id: "#ORD-002",
    customer: "Maria Oliveira",
    product: "MacBook Pro 14\"",
    total: "R$ 14.999,00",
    status: "pendente",
    date: "19/05/2023",
  },
  {
    id: "#ORD-003",
    customer: "Pedro Santos",
    product: "AirPods Pro",
    total: "R$ 1.899,00",
    status: "enviado",
    date: "18/05/2023",
  },
  {
    id: "#ORD-004",
    customer: "Ana Costa",
    product: "iPad Air",
    total: "R$ 4.799,00",
    status: "cancelado",
    date: "17/05/2023",
  },
];

const statusMap: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  enviado: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

const RecentOrders = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base font-medium">Pedidos Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.product}</TableCell>
                <TableCell className="text-right">{order.total}</TableCell>
                <TableCell>
                  <Badge className={statusMap[order.status].color}>
                    {statusMap[order.status].label}
                  </Badge>
                </TableCell>
                <TableCell>{order.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentOrders;
