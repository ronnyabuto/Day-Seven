-- Database Schema for Day Seven (Ghost Engine)

-- 1. Bookings Table
create table if not exists bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  
  -- Guest Details
  guest_name text not null,
  guest_email text not null,
  guest_phone text not null,
  
  -- Suite Details
  suite_id text not null, -- 'nomad', 'minimalist', etc.
  
  -- Reservation Dates
  start_date timestamptz not null,
  end_date timestamptz not null,
  
  -- Financials
  total_amount numeric,
  currency text default 'KES',
  
  -- Status
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Metadata (flexible column for flags)
  metadata jsonb default '{}'::jsonb
);

-- 2. Enable Row Level Security (RLS)
alter table bookings enable row level security;

-- 3. RLS Policies
-- Policy: Allow purely public insert (for the booking form) using SERVICE ROLE key in backend
-- But if using client-side auth later, we might want:
create policy "Enable insert for service role only" 
on bookings for insert 
to service_role 
with check (true);

-- Policy: Allow read access for finding blocked dates (Public)
-- We only expose specific columns in the query, but at RLS level we can allow read 
-- for anyone to check availability, or restrict to service_role if `getBlockedDates` runs on server (which it does).
-- Since our `getBlockedDates` uses `adminClient` (service role), we strictly don't need public read policies yet.
-- This keeps guest data secure.

create policy "Enable read access for service role only"
on bookings for select
to service_role
using (true);

-- 4. Realtime
-- Enable realtime for bookings so the admin dashboard or calendar can update live (optional)
alter publication supabase_realtime add table bookings;

-- 5. Indexes for Performance
-- Creating indexes on frequently queried columns (suite_id, status, dates)
create index if not exists bookings_suite_id_idx on bookings(suite_id);
create index if not exists bookings_dates_idx on bookings(start_date, end_date);
create index if not exists bookings_status_idx on bookings(status);

-- 6. Comments
comment on table bookings is 'Core reservation table for Day Seven suites.';
comment on column bookings.metadata is 'Stores extra flags like verified_id (bool), mpesa_checkout_id (text).';
