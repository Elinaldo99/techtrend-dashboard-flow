import { ShoppingCart, TrendingUp, Package, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import InventoryChart from "@/components/dashboard/InventoryChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockTable from "@/components/dashboard/LowStockTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  // Buscar estatísticas reais do Supabase
  const { data: sales = [] } = useQuery({
    queryKey: ["sales-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("sales").select("total");
      if (error) throw error;
      return data || [];
    },
  });
  const { data: products = [] } = useQuery({
    queryKey: ["products-dashboard"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id");
      if (error) throw error;
      return data || [];
    },
  });
  // Não existe tabela customers, então exibe 0
  const customersCount = 0;

  // Calcular total de vendas e receita
  const totalVendas = sales.length;
  const receita = sales.reduce((acc, s) => acc + (typeof s.total === 'number' ? s.total : 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString()} - {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vendas"
          value={totalVendas.toLocaleString("pt-BR")}
          change=""
          isPositive={true}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Receita"
          value={receita.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          change=""
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Produtos"
          value={products.length.toLocaleString("pt-BR")}
          change=""
          isPositive={true}
          icon={Package}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Clientes"
          value={customersCount.toLocaleString("pt-BR")}
          change=""
          isPositive={true}
          icon={Users}
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SalesChart />
        <InventoryChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentOrders />
        <LowStockTable />
      </div>
    </div>
  );
};

export default Dashboard;
