
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "Celulares", value: 35 },
  { name: "Notebooks", value: 25 },
  { name: "Acessórios", value: 20 },
  { name: "TVs e Áudio", value: 15 },
  { name: "Outros", value: 5 },
];

const COLORS = ["#3B82F6", "#4ADE80", "#FB923C", "#A855F7", "#F87171"];

const InventoryChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Distribuição do Inventário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, "Porcentagem"]} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryChart;
