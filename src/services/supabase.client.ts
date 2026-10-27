import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ewkhfqezeaufqpyaqamn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3a2hmcWV6ZWF1ZnFweWFxYW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxNjEyOTAsImV4cCI6MjA0NzczNzI5MH0.placeholder';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
