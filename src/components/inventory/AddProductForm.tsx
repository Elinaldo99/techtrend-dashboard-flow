
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package } from "lucide-react";

// Schema para validação do formulário
const productSchema = z.object({
  name: z.string().min(3, {
    message: "Nome do produto deve ter pelo menos 3 caracteres",
  }),
  category: z.string().min(1, {
    message: "Selecione uma categoria",
  }),
  price: z.string().refine(
    (val) => {
      const number = val.replace(/[^\d]/g, "");
      return number.length > 0;
    },
    {
      message: "Preço é obrigatório",
    }
  ),
  stock: z.string().refine(
    (val) => {
      const number = parseInt(val);
      return !isNaN(number) && number >= 0;
    },
    {
      message: "Estoque deve ser um número positivo",
    }
  ),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AddProductForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Categorias disponíveis
  const categories = [
    "Celulares",
    "Notebooks",
    "Tablets",
    "TVs e Áudio",
    "Acessórios",
    "Outros",
  ];

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      stock: "",
      description: "",
    },
  });

  function formatPrice(value: string) {
    // Remove todos os caracteres não numéricos
    const numericValue = value.replace(/[^\d]/g, "");
    
    // Se não houver valor, retorna vazio
    if (!numericValue) return "";
    
    // Converte para número e formata como moeda brasileira
    const price = (parseInt(numericValue) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    
    return price;
  }

  function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);
    
    // Simulando uma chamada de API
    setTimeout(() => {
      // Gerando ID único para o produto
      const productId = `SKU-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`;
      
      // Aqui você faria a integração real com backend
      console.log("Produto adicionado:", {
        id: productId,
        ...data,
        status: parseInt(data.stock) > 5 ? "Em estoque" : "Estoque baixo",
      });
      
      toast({
        title: "Produto adicionado",
        description: `${data.name} foi adicionado ao inventário.`,
      });
      
      form.reset();
      setIsSubmitting(false);
      onSubmitSuccess();
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Produto</FormLabel>
              <FormControl>
                <Input placeholder="ex: iPhone 13 Pro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field: { onChange, ...rest } }) => (
              <FormItem>
                <FormLabel>Preço</FormLabel>
                <FormControl>
                  <Input
                    placeholder="ex: R$ 1.999,00"
                    {...rest}
                    onChange={(e) => {
                      const formatted = formatPrice(e.target.value);
                      onChange(formatted);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantidade em Estoque</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="ex: 10"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Detalhes do produto..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            <Package className="mr-2 h-4 w-4" />
            {isSubmitting ? "Adicionando..." : "Adicionar Produto"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
