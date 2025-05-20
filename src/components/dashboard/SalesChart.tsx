
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", vendas: 4000 },
  { name: "Fev", vendas: 3000 },
  { name: "Mar", vendas: 5000 },
  { name: "Abr", vendas: 2780 },
  { name: "Mai", vendas: 1890 },
  { name: "Jun", vendas: 2390 },
  { name: "Jul", vendas: 3490 },
];

const SalesChart = () => {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Visão Geral de Vendas</CardTitle>
        <div className="bg-blue-50 text-blue-600 text-xs rounded-full px-2 py-1">
          2023
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `R$ ${value}`}
              />
              <Tooltip formatter={(value) => [`R$ ${value}`, "Vendas"]} />
              <Area
                type="monotone"
                dataKey="vendas"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorVendas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesChart;
