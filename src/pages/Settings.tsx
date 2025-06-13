import { useState, useEffect } from "react";
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

const Settings = () => {
  // Estado de edição
  const [editProfile, setEditProfile] = useState(false);
  const [editStore, setEditStore] = useState(false);
  const [editNotif, setEditNotif] = useState(false);

  // Estado local editável
  const [profile, setProfile] = useState({ name: "Administrador", email: "admin@techtrend.com", password: "********" });
  const [store, setStore] = useState({
    name: "TechTrend Store",
    email: "contato@techtrendstore.com",
    phone: "(11) 3456-7890",
    address: "Av. Paulista, 1234, São Paulo - SP",
  });
  const [notif, setNotif] = useState({
    lowStock: true,
    newOrder: true,
    salesReport: true,
    productUpdates: false,
  });

  // Carregar dados do localStorage ao iniciar
  useEffect(() => {
    const savedProfile = localStorage.getItem("settings_profile");
    const savedStore = localStorage.getItem("settings_store");
    const savedNotif = localStorage.getItem("settings_notif");
    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedStore) setStore(JSON.parse(savedStore));
    if (savedNotif) setNotif(JSON.parse(savedNotif));
  }, []);

  // Salvar dados no localStorage ao clicar em Salvar
  const handleSaveProfile = () => {
    localStorage.setItem("settings_profile", JSON.stringify(profile));
    setEditProfile(false);
  };
  const handleSaveStore = () => {
    localStorage.setItem("settings_store", JSON.stringify(store));
    setEditStore(false);
  };
  const handleSaveNotif = () => {
    localStorage.setItem("settings_notif", JSON.stringify(notif));
    setEditNotif(false);
  };

  // Handlers
  const handleProfileChange = (field: string, value: string) => setProfile((prev) => ({ ...prev, [field]: value }));
  const handleStoreChange = (field: string, value: string) => setStore((prev) => ({ ...prev, [field]: value }));
  const handleNotifChange = (field: string) => setNotif((prev) => ({ ...prev, [field]: !prev[field] }));

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
              <CardDescription>Gerencie suas informações pessoais e credenciais.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-purple-600 text-white text-xl">{profile.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" disabled>Alterar Foto</Button>
                </div>
              </div>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    {editProfile ? (
                      <Input value={profile.name} onChange={e => handleProfileChange("name", e.target.value)} />
                    ) : (
                      <div className="border rounded px-3 py-2 bg-gray-50">{profile.name}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    {editProfile ? (
                      <Input value={profile.email} onChange={e => handleProfileChange("email", e.target.value)} />
                    ) : (
                      <div className="border rounded px-3 py-2 bg-gray-50">{profile.email}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Senha</Label>
                  {editProfile ? (
                    <Input value={profile.password} onChange={e => handleProfileChange("password", e.target.value)} type="password" />
                  ) : (
                    <div className="border rounded px-3 py-2 bg-gray-50">********</div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {editProfile ? (
                <Button onClick={handleSaveProfile}>Salvar</Button>
              ) : (
                <Button onClick={() => setEditProfile(true)}>Editar</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Loja</CardTitle>
              <CardDescription>Gerencie as configurações gerais da sua loja.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome da Loja</Label>
                {editStore ? (
                  <Input value={store.name} onChange={e => handleStoreChange("name", e.target.value)} />
                ) : (
                  <div className="border rounded px-3 py-2 bg-gray-50">{store.name}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>E-mail de Contato</Label>
                {editStore ? (
                  <Input value={store.email} onChange={e => handleStoreChange("email", e.target.value)} />
                ) : (
                  <div className="border rounded px-3 py-2 bg-gray-50">{store.email}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                {editStore ? (
                  <Input value={store.phone} onChange={e => handleStoreChange("phone", e.target.value)} />
                ) : (
                  <div className="border rounded px-3 py-2 bg-gray-50">{store.phone}</div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Endereço</Label>
                {editStore ? (
                  <Input value={store.address} onChange={e => handleStoreChange("address", e.target.value)} />
                ) : (
                  <div className="border rounded px-3 py-2 bg-gray-50">{store.address}</div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {editStore ? (
                <Button onClick={handleSaveStore}>Salvar</Button>
              ) : (
                <Button onClick={() => setEditStore(true)}>Editar</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>Configure como e quando deseja receber notificações do sistema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Alerta de estoque baixo</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações quando produtos estiverem com estoque baixo.</p>
                </div>
                <Switch checked={notif.lowStock} onCheckedChange={() => editNotif && handleNotifChange("lowStock") } disabled={!editNotif} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Nova venda</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações quando novas vendas forem registradas.</p>
                </div>
                <Switch checked={notif.newOrder} onCheckedChange={() => editNotif && handleNotifChange("newOrder") } disabled={!editNotif} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Relatórios mensais</Label>
                  <p className="text-sm text-muted-foreground">Receba relatórios mensais de vendas e desempenho.</p>
                </div>
                <Switch checked={notif.salesReport} onCheckedChange={() => editNotif && handleNotifChange("salesReport") } disabled={!editNotif} />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Atualizações de produtos</Label>
                  <p className="text-sm text-muted-foreground">Receba notificações sobre atualizações de produtos.</p>
                </div>
                <Switch checked={notif.productUpdates} onCheckedChange={() => editNotif && handleNotifChange("productUpdates") } disabled={!editNotif} />
              </div>
            </CardContent>
            <CardFooter>
              {editNotif ? (
                <Button onClick={handleSaveNotif}>Salvar</Button>
              ) : (
                <Button onClick={() => setEditNotif(true)}>Editar</Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
