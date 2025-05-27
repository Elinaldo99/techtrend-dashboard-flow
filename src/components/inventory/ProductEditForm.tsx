
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  category_id: string;
  category: {
    name: string;
  };
  price: number;
  stock: number;
  width: number;
  height: number;
  weight: number;
  description?: string;
}

interface ProductEditFormProps {
  product: Product;
  formData: {
    name: string;
    category_id: string;
    price: string;
    stock: string;
    width: string;
    height: string;
    weight: string;
    description: string;
  };
  onInputChange: (field: string, value: string) => void;
}

export function ProductEditForm({ product, formData, onInputChange }: ProductEditFormProps) {
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw new Error(error.message);
      return data as Category[];
    },
  });

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Produto *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          placeholder="Digite o nome do produto"
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Categoria *</Label>
        <Select value={formData.category_id} onValueChange={(value) => onInputChange('category_id', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => onInputChange('price', e.target.value)}
            placeholder="0,00"
            required
          />
        </div>
        <div>
          <Label htmlFor="stock">Estoque *</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => onInputChange('stock', e.target.value)}
            placeholder="0"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="width">Largura (cm) *</Label>
          <Input
            id="width"
            type="number"
            step="0.1"
            min="0"
            value={formData.width}
            onChange={(e) => onInputChange('width', e.target.value)}
            placeholder="0.0"
            required
          />
        </div>
        <div>
          <Label htmlFor="height">Altura (cm) *</Label>
          <Input
            id="height"
            type="number"
            step="0.1"
            min="0"
            value={formData.height}
            onChange={(e) => onInputChange('height', e.target.value)}
            placeholder="0.0"
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">Peso (kg) *</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            min="0"
            value={formData.weight}
            onChange={(e) => onInputChange('weight', e.target.value)}
            placeholder="0.0"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          placeholder="Descrição opcional do produto"
          rows={3}
        />
      </div>
    </div>
  );
}
