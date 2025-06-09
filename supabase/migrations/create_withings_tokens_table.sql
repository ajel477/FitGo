-- Create the user_withings_tokens table
create table if not exists public.user_withings_tokens (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    access_token text not null,
    refresh_token text not null,
    expires_in timestamp with time zone not null,
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now() not null,
    unique(user_id)
);

-- Enable RLS (Row Level Security)
alter table public.user_withings_tokens enable row level security;

-- Create policy to allow users to only see and modify their own tokens
create policy "Users can only access their own tokens"
    on public.user_withings_tokens
    for all
    using (auth.uid() = user_id);

-- Grant access to authenticated users
grant all on public.user_withings_tokens to authenticated; 