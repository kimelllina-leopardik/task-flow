/**
 * Supabase Client Integration Guide & Setup
 * 
 * Once you are ready to connect Supabase:
 * 1. Install @supabase/supabase-js:
 *    npm install @supabase/supabase-js
 * 
 * 2. Add your project credentials in .env.example / .env:
 *    VITE_SUPABASE_URL=https://your-project.supabase.co
 *    VITE_SUPABASE_ANON_KEY=your-anon-key
 * 
 * 3. Supabase Schema Reference for "tasks" table:
 *    create table tasks (
 *      id uuid default gen_random_uuid() primary key,
 *      user_id uuid references auth.users not null,
 *      title text not null,
 *      description text,
 *      completed boolean default false not null,
 *      priority text default 'medium',
 *      due_date date,
 *      created_at timestamp with time zone default timezone('utc'::text, now()) not null
 *    );
 * 
 *    -- Enable Row Level Security (RLS)
 *    alter table tasks enable row level security;
 *    create policy "Users can only view their own tasks"
 *      on tasks for select using (auth.uid() = user_id);
 *    create policy "Users can insert their own tasks"
 *      on tasks for insert with check (auth.uid() = user_id);
 *    create policy "Users can update their own tasks"
 *      on tasks for update using (auth.uid() = user_id);
 *    create policy "Users can delete their own tasks"
 *      on tasks for delete using (auth.uid() = user_id);
 */

export const isSupabaseConfigured = false;
