
import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';
import { supabase as supabaseClient } from '@/integrations/supabase/client';

// Export the client for consistency across the app
export const supabase = supabaseClient;

// Helper function to check connection with timeout and retry logic
export const checkSupabaseConnection = async (retries = 3): Promise<boolean> => {
  let attempts = 0;
  
  while (attempts < retries) {
    try {
      console.log(`Attempt ${attempts + 1} to check Supabase connection...`);
      
      // Set a timeout for the query
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Using profiles table which we have permission to access
      const { data, error } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })
        .abortSignal(controller.signal);
      
      clearTimeout(timeoutId);
      
      if (error) {
        console.error('Supabase connection check failed:', error.message);
        attempts++;
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1500));
        continue;
      }
      
      console.log('Supabase connection successful!');
      return true;
    } catch (error) {
      console.error('Supabase connection check failed with exception:', error);
      attempts++;
      
      if (attempts >= retries) {
        console.error('Max retries reached. Supabase connection failed.');
        return false;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
  
  return false;
};
