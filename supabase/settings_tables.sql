-- Tabela de perfis de usuário (opcional, para nome/avatar)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  avatar_url text
);

-- Tabela de configurações da loja (apenas 1 registro)
create table if not exists store_settings (
  id serial primary key,
  name text,
  email text,
  phone text,
  address text
);

-- Tabela de preferências de notificação por usuário
create table if not exists user_notifications (
  user_id uuid primary key references auth.users(id) on delete cascade,
  lowStock boolean default false,
  newOrder boolean default false,
  salesReport boolean default false,
  productUpdates boolean default false
);
