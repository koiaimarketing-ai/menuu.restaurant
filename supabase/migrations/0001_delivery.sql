-- Warung Jakarta — delivery checkout schema
-- Run in the Supabase SQL editor (or `supabase db push`).

create table if not exists public.delivery_quotes (
  id text primary key,
  outlet_id text not null,
  destination jsonb,
  distance_metres numeric,
  distance_km numeric,
  static_duration_sec numeric,
  traffic_aware_duration_sec numeric,
  traffic_class text,
  weather_class text,
  is_peak boolean,
  distance_fee numeric,
  dynamic_multiplier numeric,
  platform_fee numeric,
  service_adjustment numeric,
  final_delivery_fee numeric,
  food_subtotal numeric,
  total_payable numeric,
  created_at timestamptz default now(),
  expires_at timestamptz
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  visit_type text not null,            -- 'Going Now' | 'Delivery Now'
  outlet_id text,
  quote_id text references public.delivery_quotes(id),
  customer_name text,
  customer_contact text,
  delivery_address text,
  delivery_place_id text,
  delivery_lat numeric,
  delivery_lng numeric,
  food_subtotal numeric,
  delivery_fee numeric default 0,
  total_payable numeric,
  payment_status text not null default 'awaiting_receipt_confirmation',
                                       -- 'awaiting_receipt_confirmation' | 'payment_confirmed'
  delivery_status text default 'pending', -- 'pending' | 'preparing_delivery'
  created_at timestamptz default now(),
  confirmed_at timestamptz
);

-- Row level security: lock down by default; only the service role (server) writes.
alter table public.orders enable row level security;
alter table public.delivery_quotes enable row level security;
