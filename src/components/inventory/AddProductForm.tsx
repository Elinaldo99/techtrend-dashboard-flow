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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Package, Plus, MoreVertical, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

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
  width: z.string().refine(
    (val) => {
      const number = parseFloat(val);
      return !isNaN(number) && number > 0;
    },
    {
      message: "Largura deve ser um número positivo",
    }
  ),
  height: z.string().refine(
    (val) => {
      const number = parseFloat(val);
      return !isNaN(number) && number > 0;
    },
    {
      message: "Altura deve ser um número positivo",
    }
  ),
  weight: z.string().refine(
    (val) => {
      const number = parseFloat(val);
      return !isNaN(number) && number > 0;
    },
    {
      message: "Peso deve ser um número positivo",
    }
  ),
  description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface Category {
  id: string;
  name: string;
}

export function AddProductForm({
  onSubmitSuccess,
}: {
  onSubmitSuccess: () => void;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);

  // Fetch categories from Supabase
  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching categories:', error);
        throw new Error(error.message);
      }
      
      return data as Category[];
    },
  });

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      category: "",
      price: "",
      stock: "",
      width: "",
      height: "",
      weight: "",
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

  function formatWeight(value: string) {
    // Remove caracteres não numéricos, exceto ponto ou vírgula
    let numericValue = value.replace(/[^\d.,]/g, "");
    
    // Substitui vírgula por ponto para cálculos
    numericValue = numericValue.replace(",", ".");
    
    const number = parseFloat(numericValue);
    if (isNaN(number)) return value;
    
    // Formata o peso para ter sempre 2 casas decimais
    return number.toFixed(2);
  }

  async function handleAddCategory() {
    if (newCategory.trim().length > 0) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([{ name: newCategory }])
          .select()
          .single();
        
        if (error) throw error;
        
        toast({
          title: "Categoria adicionada",
          description: `A categoria "${newCategory}" foi adicionada com sucesso.`,
        });
        
        // Refresh categories list
        refetchCategories();
        
        // Set the form value to the new category
        if (data) {
          form.setValue("category", data.id);
        }
        
        // Reset state and close dialog
        setNewCategory("");
        setIsNewCategoryDialogOpen(false);
      } catch (error) {
        console.error('Error adding category:', error);
        toast({
          title: "Erro ao adicionar categoria",
          description: "Ocorreu um erro ao adicionar a categoria.",
          variant: "destructive",
        });
      }
    }
  }

  async function handleDeleteCategory(categoryId: string, categoryName: string) {
    setIsDeletingCategory(true);

    try {
      // Check if category is being used by any products
      const { data: productsUsingCategory, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('category_id', categoryId);

      if (checkError) throw checkError;

      if (productsUsingCategory && productsUsingCategory.length > 0) {
        toast({
          title: "Não é possível excluir",
          description: `A categoria "${categoryName}" está sendo usada por ${productsUsingCategory.length} produto(s). Remova ou altere a categoria desses produtos primeiro.`,
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      toast({
        title: "Categoria excluída",
        description: `A categoria "${categoryName}" foi excluída com sucesso.`,
      });
      
      // Refresh categories list
      refetchCategories();
      
      // Clear form field if the deleted category was selected
      if (form.getValues("category") === categoryId) {
        form.setValue("category", "");
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingCategory(false);
    }
  }

  async function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);

    try {
      // Extract numeric values from formatted strings
      const priceValue = parseFloat(data.price.replace(/[^\d,]/g, '').replace(',', '.'));
      const widthValue = parseFloat(data.width);
      const heightValue = parseFloat(data.height);
      const weightValue = parseFloat(data.weight);
      
      // Insert product into Supabase
      const { error } = await supabase
        .from('products')
        .insert([
          {
            name: data.name,
            category_id: data.category,
            price: priceValue,
            stock: parseInt(data.stock),
            width: widthValue,
            height: heightValue,
            weight: weightValue,
            description: data.description || null,
          },
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Produto adicionado",
        description: `${data.name} foi adicionado ao inventário.`,
      });
      
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Ocorreu um erro ao adicionar o produto.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
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
                <div className="flex gap-2">
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{category.name}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 ml-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      className="text-destructive cursor-pointer"
                                      onSelect={(e) => e.preventDefault()}
                                    >
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Excluir categoria
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza de que deseja excluir a categoria "{category.name}"? 
                                        Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteCategory(category.id, category.name)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        disabled={isDeletingCategory}
                                      >
                                        {isDeletingCategory ? "Excluindo..." : "Excluir"}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsNewCategoryDialogOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> 
                    Nova
                  </Button>
                </div>
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

          {/* Campos de dimensões e peso */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="width"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Largura (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="ex: 10"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altura (cm)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="ex: 5"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Peso (kg)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ex: 0.50"
                      type="number"
                      min="0.01"
                      step="0.01"
                      {...rest}
                      onChange={(e) => {
                        const formatted = e.target.value;
                        onChange(formatted);
                      }}
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

      {/* Modal para adicionar nova categoria */}
      <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Categoria</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="new-category"
                placeholder="Nome da categoria"
                className="col-span-4"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewCategoryDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
