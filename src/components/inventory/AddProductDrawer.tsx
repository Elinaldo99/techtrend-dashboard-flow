
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { AddProductForm } from "./AddProductForm";
import { Plus } from "lucide-react";
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface AddProductDrawerProps {
  children?: React.ReactNode;
}

export function AddProductDrawer({ children }: AddProductDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();

  const handleProductAdded = () => {
    // Refresh products list when a product is added
    queryClient.invalidateQueries({ queryKey: ['products'] });
    
    // Close the drawer
    if (closeButtonRef.current) {
      closeButtonRef.current.click();
    }
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-lg p-6">
          <DrawerHeader>
            <DrawerTitle>Adicionar Produto</DrawerTitle>
            <DrawerDescription>
              Preencha os campos abaixo para adicionar um novo produto ao inventário.
            </DrawerDescription>
          </DrawerHeader>
          <div className="mt-4 max-h-[calc(90vh-200px)] overflow-y-auto">
            <AddProductForm onSubmitSuccess={handleProductAdded} />
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button ref={closeButtonRef} variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
