import { defineStore } from 'pinia';

interface UserProfile {
  id: number;
  name: string;
  role: string;
}

interface DatabaseUser {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  role: string;
  supabase_id: string;
}

export const useUserStore = defineStore('user', () => {
    const profile = ref<UserProfile | null>(null);
    const loading = ref(false);
  
    async function setUserInfo() {
      const supabase = useSupabaseClient();
      const user = useSupabaseUser();

      if (!user.value) return;
      
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('supabase_id', user.value.id)
        .single<DatabaseUser>();

      if (data) {
        profile.value = {
          id: data.id,
          name: `${data.first_name} ${data.middle_name} ${data.last_name}`,
          role: data.role,
        }
      }
    }
  
    return { profile, loading, setUserInfo };
  }, {
    persist: true 
  })
  