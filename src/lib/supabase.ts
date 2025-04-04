
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// Use the supabase client from integrations instead of creating a new one
import { supabase } from '@/integrations/supabase/client';

// Export the client for backward compatibility
export { supabase };

// Add helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    // Try a simple query that should always work
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection check failed:', error.message);
      return false;
    }
    
    console.log('Supabase connection successful!');
    return true;
  } catch (error) {
    console.error('Supabase connection check failed with exception:', error);
    return false;
  }
};
