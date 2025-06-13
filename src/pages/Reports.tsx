import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { Database } from "@/integrations/supabase/types";

const COLORS = ["#3B82F6", "#4ADE80", "#FB923C", "#A855F7", "#F87171", "#FACC15", "#60A5FA", "#F472B6", "#34D399", "#FBBF24"];
const statusMap: Record<string, { label: string; color: string }> = {
  pendente: { label: "Pendente", color: "bg-yellow-100 text-yellow-800" },
  enviado: { label: "Enviado", color: "bg-blue-100 text-blue-800" },
  entregue: { label: "Entregue", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

type Sale = Database["public"]["Tables"]["sales"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export default function Reports() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [reportType, setReportType] = useState("Vendas");
  const [searchTerm, setSearchTerm] = useState("");

  // Query vendas
  const { data: sales = [], isLoading: loadingSales, error: errorSales } = useQuery({
    queryKey: ["sales-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sales")
        .select("id, customer, date, products, status, total");
      if (error) throw error;
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Query produtos
  const { data: products = [], isLoading: loadingProducts, error: errorProducts } = useQuery({
    queryKey: ["products-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, category_id, stock");
      if (error) throw error;
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Query categorias reais
  const { data: categories = [], isLoading: loadingCategories, error: errorCategories } = useQuery({
    queryKey: ["categories-reports"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name");
      if (error) throw error;
      return data || [];
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  // Filtros
  const filteredSales = (sales as Sale[]).filter((sale) => {
    const id = sale.id ? String(sale.id).toLowerCase() : "";
    const customer = sale.customer ? String(sale.customer).toLowerCase() : "";
    const products = sale.products ? String(sale.products).toLowerCase() : "";
    const search = searchTerm.toLowerCase();
    let dateMatch = true;
    if (date && sale.date) {
      // Aceita dd/MM/yyyy, dd-MM-yyyy, yyyy-MM-dd, yyyy/MM/dd
      let saleDate: Date | null = null;
      const tryFormats = ["dd/MM/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "yyyy/MM/dd"];
      for (const fmt of tryFormats) {
        try {
          saleDate = parse(sale.date, fmt, new Date());
          if (!isNaN(saleDate.getTime())) break;
        } catch {
          // Ignorar erro de parse, tentar próximo formato
        }
      }
      if (saleDate) {
        dateMatch = saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear();
      }
    }
    return (
      (id.includes(search) || customer.includes(search) || products.includes(search)) && dateMatch
    );
  });

  // Gráfico de vendas por mês (do ano atual)
  const salesByMonth = Array.from({ length: 12 }, (_, i) => {
    const month = i;
    const name = format(new Date(new Date().getFullYear(), i, 1), "MMM");
    // Contar quantidade de vendas (não somar total em dinheiro)
    const vendas = filteredSales.filter(sale => {
      if (!sale.date) return false;
      let saleDate: Date | null = null;
      const tryFormats = ["dd/MM/yyyy", "dd-MM-yyyy", "yyyy-MM-dd", "yyyy/MM/dd"];
      for (const fmt of tryFormats) {
        try {
          saleDate = parse(sale.date, fmt, new Date());
          if (!isNaN(saleDate.getTime())) break;
        } catch {
          // Ignorar erro de parse, tentar próximo formato
        }
      }
      return saleDate && saleDate.getMonth() === month && saleDate.getFullYear() === new Date().getFullYear();
    }).length;
    return { name, vendas };
  });

  // Gráfico de pizza por categoria (dinâmico, só dados reais)
  const categoryData = categories.length > 0
    ? categories.map((cat) => ({
        name: cat.name,
        value: products.filter((p) => p.category_id === cat.id).length,
      })).filter((c) => c.value > 0)
    : [];

  // Evolução de vendas
  const lineData = salesByMonth.map((d) => ({
    name: d.name,
    vendas: d.vendas,
  }));

  // Exportar PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Vendas", 14, 16);
    autoTable(doc, {
      head: [["ID", "Cliente", "Data", "Produtos", "Status", "Total"]],
      body: filteredSales.map((row) => [row.id, row.customer, row.date, row.products, row.status, row.total]),
      startY: 24,
    });
    doc.save(`relatorio-vendas-${Date.now()}.pdf`);
  };

  // Gerar relatório (pode ser expandido para outros tipos)
  const gerarRelatorio = () => {
    alert("Relatório gerado! (mock)");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Relatórios</h1>
        <div className="flex gap-2">
          <Button onClick={exportPDF}>Exportar PDF</Button>
          <Button onClick={gerarRelatorio} variant="secondary">Gerar Relatório</Button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="bg-white rounded shadow p-4 min-w-[250px]">
          <div className="font-semibold mb-2">Filtros</div>
          <div className="mb-2">
            <label className="block text-xs mb-1">Tipo de Relatório</label>
            <select className="w-full border rounded px-2 py-1" value={reportType} onChange={e => setReportType(e.target.value)}>
              <option value="Vendas">Vendas</option>
              <option value="Produtos">Produtos</option>
            </select>
          </div>
          <div>
            <label className="block text-xs mb-1">Período</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PP") : "Selecione uma data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded shadow p-4">
            <div className="font-semibold mb-2">Relatório de Vendas</div>
            {loadingSales ? (
              <div className="text-center py-8">Carregando vendas...</div>
            ) : errorSales ? (
              <div className="text-center py-8 text-red-600">Erro ao carregar vendas: {errorSales.message}</div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={salesByMonth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="vendas" fill="#8884d8" name="Vendas" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Vendas por Categoria</div>
              {loadingProducts || loadingCategories ? (
                <div className="text-center py-8">Carregando produtos/categorias...</div>
              ) : errorProducts || errorCategories ? (
                <div className="text-center py-8 text-red-600">Erro ao carregar produtos/categorias</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="bg-white rounded shadow p-4">
              <div className="font-semibold mb-2">Evolução de Vendas</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="vendas" stroke="#8884d8" name="Vendas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded shadow p-4 mt-4">
        <div className="font-semibold mb-2">Tabela de Vendas</div>
        {loadingSales ? (
          <div className="text-center py-8">Carregando vendas...</div>
        ) : errorSales ? (
          <div className="text-center py-8 text-red-600">Erro ao carregar vendas: {errorSales.message}</div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="border px-2 py-1">ID</th>
                  <th className="border px-2 py-1">Cliente</th>
                  <th className="border px-2 py-1">Data</th>
                  <th className="border px-2 py-1">Produtos</th>
                  <th className="border px-2 py-1">Status</th>
                  <th className="border px-2 py-1">Total</th>
                </tr>
              </thead>
              <tbody>
                {(filteredSales as Sale[]).map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1">{row.id}</td>
                    <td className="border px-2 py-1">{row.customer}</td>
                    <td className="border px-2 py-1">{row.date}</td>
                    <td className="border px-2 py-1">{row.products}</td>
                    <td className="border px-2 py-1">{row.status}</td>
                    <td className="border px-2 py-1">{typeof row.total === 'number' ? row.total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
