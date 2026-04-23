import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const saveService = {
  async getSaves(userId: string) {
    const { data, error } = await supabase
      .from('saves')
      .select('*')
      .eq('user_id', userId)
      .order('slot', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async saveGame(saveData: any) {
    const { data, error } = await supabase
      .from('saves')
      .upsert(saveData, { onConflict: 'id' });
    
    if (error) throw error;
    return data;
  },

  async loadSave(saveId: string) {
    const { data, error } = await supabase
      .from('saves')
      .select('*')
      .eq('id', saveId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteSave(saveId: string) {
    const { error } = await supabase
      .from('saves')
      .delete()
      .eq('id', saveId);
    
    if (error) throw error;
  },
};
