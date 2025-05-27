
interface FormData {
  name: string;
  category_id: string;
  price: string;
  stock: string;
  width: string;
  height: string;
  weight: string;
}

export interface ValidationError {
  title: string;
  description: string;
}

export function validateProductForm(formData: FormData): ValidationError | null {
  if (!formData.name.trim()) {
    return {
      title: "Erro de validação",
      description: "Nome do produto é obrigatório.",
    };
  }

  if (!formData.category_id) {
    return {
      title: "Erro de validação",
      description: "Categoria é obrigatória.",
    };
  }

  const price = parseFloat(formData.price);
  const stock = parseInt(formData.stock);
  const width = parseFloat(formData.width);
  const height = parseFloat(formData.height);
  const weight = parseFloat(formData.weight);

  if (isNaN(price) || price <= 0) {
    return {
      title: "Erro de validação",
      description: "Preço deve ser um número positivo.",
    };
  }

  if (isNaN(stock) || stock < 0) {
    return {
      title: "Erro de validação",
      description: "Estoque deve ser um número não negativo.",
    };
  }

  if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
    return {
      title: "Erro de validação",
      description: "Dimensões e peso devem ser números positivos.",
    };
  }

  return null;
}
