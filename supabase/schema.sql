-- Havana Heating and Air: admin documents schema.
-- Paste into Supabase: SQL Editor -> New query -> Run. Safe to re-run.

create extension if not exists pgcrypto;

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists customers_name_address_key
  on public.customers (lower(name), lower(address));

-- One table for both estimates and invoices.
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('invoice', 'estimate')),
  number text not null unique,
  customer_id uuid references public.customers (id) on delete set null,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null default '',
  customer_address text not null,
  items jsonb not null,
  subtotal numeric(12, 2) not null,
  discount numeric(12, 2) not null default 0,
  tax numeric(12, 2) not null default 0,
  total numeric(12, 2) not null,
  issue_date date not null,
  due_date date not null,            -- invoices: due date. estimates: expiry date.
  -- invoices: unpaid | partial | paid | overdue
  -- estimates: draft | sent | accepted | declined | expired
  status text not null,
  payment_method text not null default 'other',
  notes text not null default '',
  converted_from uuid references public.documents (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists documents_type_created_idx on public.documents (type, created_at desc);
create index if not exists documents_customer_idx on public.documents (customer_id);

-- Lock everything down: no public/anon access. The app uses the service role
-- key from server routes that sit behind the admin login.
alter table public.customers enable row level security;
alter table public.documents enable row level security;

-- ───────── Phase 2: expenses, fuel, mileage ─────────
create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  expense_date date not null,
  category text not null,
  vendor text not null default '',
  amount numeric(12, 2) not null check (amount > 0),
  payment_method text not null default 'card',
  notes text not null default '',
  gallons numeric(8, 3),                 -- fuel only
  odometer numeric(10, 1),               -- fuel / maintenance
  receipt_path text,                     -- object path in the private "receipts" bucket
  created_at timestamptz not null default now()
);
create index if not exists expenses_date_idx on public.expenses (expense_date desc);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  trip_date date not null,
  start_odometer numeric(10, 1),
  end_odometer numeric(10, 1),
  miles numeric(8, 1) not null check (miles > 0),
  purpose text not null default 'Job site',
  customer_name text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists trips_date_idx on public.trips (trip_date desc);

alter table public.expenses enable row level security;
alter table public.trips enable row level security;

-- ───────── Phase 3: sales tax paid on materials ─────────
alter table public.expenses add column if not exists sales_tax_paid numeric(12, 2) not null default 0;
