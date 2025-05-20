
import { ShoppingCart, TrendingUp, Package, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import InventoryChart from "@/components/dashboard/InventoryChart";
import RecentOrders from "@/components/dashboard/RecentOrders";
import LowStockTable from "@/components/dashboard/LowStockTable";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Última atualização: 20/05/2023 - 14:30
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Vendas"
          value="R$ 45.689,00"
          change="12% desde mês passado"
          isPositive={true}
          icon={ShoppingCart}
          iconColor="text-blue-600"
        />
        <StatCard
          title="Receita"
          value="R$ 38.250,00"
          change="8% desde mês passado"
          isPositive={true}
          icon={TrendingUp}
          iconColor="text-green-600"
        />
        <StatCard
          title="Produtos"
          value="312"
          change="3% desde mês passado"
          isPositive={true}
          icon={Package}
          iconColor="text-orange-600"
        />
        <StatCard
          title="Clientes"
          value="145"
          change="5% desde mês passado"
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
