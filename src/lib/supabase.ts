
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
      
      // Changed to use messages table instead of profiles as there might be permission issues
      const { data, error } = await supabase
        .from('messages')
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
      
      // Enable realtime for messages table
      await enableRealtimeForMessages();
      
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

// Enable realtime specifically for the messages table
const enableRealtimeForMessages = async () => {
  try {
    const channel = supabase.channel('public:messages');
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'messages'
    }, (payload) => {
      console.log('Realtime message update received:', payload);
    }).subscribe((status) => {
      console.log('Realtime subscription status for messages:', status);
    });
    
    return channel;
  } catch (error) {
    console.error('Error setting up realtime for messages:', error);
    return null;
  }
};
