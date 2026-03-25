import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://idyzhselhzjufhhnfhje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkeXpoc2VsaHpqdWZoaG5maGplIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1NjMzMzQsImV4cCI6MjA4OTEzOTMzNH0.DHG_FtMIaK8YYSzL1ShkDZMEq1LZUAAR5fX65jRL96c';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
