
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [storeSettings, setStoreSettings] = useState({
    name: "TechTrend Store",
    email: "contato@techtrendstore.com",
    phone: "(11) 3456-7890",
    address: "Av. Paulista, 1234, São Paulo - SP",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    lowStock: true,
    newOrder: true,
    salesReport: true,
    productUpdates: false,
  });

  const handleStoreSettingsChange = (field: string, value: string) => {
    setStoreSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (field: string) => {
    setNotificationSettings((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveStoreSettings = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações da loja foram atualizadas com sucesso.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notificações atualizadas",
      description: "Suas preferências de notificação foram salvas com sucesso.",
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Perfil atualizado",
      description: "As informações do seu perfil foram atualizadas com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="store">Loja</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Perfil de Usuário</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e credenciais.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-purple-600 text-white text-xl">AT</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Alterar Foto
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" defaultValue="Administrador" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input id="email" defaultValue="admin@techtrend.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
              <CardDescription>
                Gerencie as configurações gerais da sua loja.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Nome da Loja</Label>
                <Input
                  id="store-name"
                  value={storeSettings.name}
                  onChange={(e) => handleStoreSettingsChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-email">E-mail de Contato</Label>
                <Input
                  id="store-email"
                  value={storeSettings.email}
                  onChange={(e) => handleStoreSettingsChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-phone">Telefone</Label>
                <Input
                  id="store-phone"
                  value={storeSettings.phone}
                  onChange={(e) => handleStoreSettingsChange("phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="store-address">Endereço</Label>
                <Input
                  id="store-address"
                  value={storeSettings.address}
                  onChange={(e) => handleStoreSettingsChange("address", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveStoreSettings}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alerta de estoque baixo</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando produtos estiverem com estoque baixo.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.lowStock}
                  onCheckedChange={() => handleNotificationToggle("lowStock")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nova venda</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações quando novas vendas forem registradas.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.newOrder}
                  onCheckedChange={() => handleNotificationToggle("newOrder")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios mensais</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba relatórios mensais de vendas e desempenho.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.salesReport}
                  onCheckedChange={() => handleNotificationToggle("salesReport")}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Atualizações de produtos</Label>
                  <p className="text-sm text-muted-foreground">
                    Receba notificações sobre atualizações de produtos.
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.productUpdates}
                  onCheckedChange={() => handleNotificationToggle("productUpdates")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
