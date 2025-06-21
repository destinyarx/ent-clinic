// stores/user.ts
export interface UserProfile {
  id: string|null
  name: string|null
  birthdate: string|null,
  email: string|null
  role: string|null
  permissions: string[]|null,
  position: string|null,
  designationArea: string|null,
  licenseNumber: string|null
}

interface RolePermission {
  permissions: {
    id: number
    name: string
  }
}

export const useUserStore = defineStore('user', () => {
  // Supabase clients
  const supabase = useSupabaseClient();
  const supabaseUser = useSupabaseUser();

  // state
  const profile = ref<UserProfile | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // getter-like helper
  function hasPermission(perm: string) {
    if (!profile.value?.permissions) return null;
    
    return profile.value?.permissions.includes(perm) ?? false
  }

  async function signOut() {
    profile.value = { 
      id: null, 
      name: null, 
      birthdate: null,
      email: null,
      role: null, 
      permissions: null,
      position: null,
      designationArea: null,
      licenseNumber: null
    }
  }

  async function setUserInfo() {
    loading.value = true
    error.value = null

    try {
      const user = supabaseUser.value;

      if (!user) {
        throw new Error('No authenticated user')
      }

      // fetch user info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, first_name, middle_name, last_name, email, birthdate, role, position, designation_area, license_number')
        .eq('supabase_id', user.id)
        .single();

      if (userError || !userData) throw userError ?? new Error('User not found')

      const { id, first_name, middle_name, last_name, email, birthdate, role, position, designation_area, license_number } = userData
      const fullName = [first_name, middle_name, last_name].join(' ');

      // fetch permissions
      const { data: permissions, error: permissionError } = await supabase
        .from('role_permissions')
        .select('permissions!inner(id, name)')
        .eq('role', role)

      if (permissionError) throw permissionError;

      const permissionNames = permissions?.map((r: RolePermission) => r.permissions.name) ?? []

      profile.value = { 
        id: supabaseUser.value?.id ?? null, 
        name: fullName,
        designationArea: designation_area,
        licenseNumber: license_number,
        permissions: permissionNames,
        birthdate,
        role, 
        position,
        email,
      }

    } catch (e) {
      error.value = (e as Error).message
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    profile,
    loading,
    error,

    // getters
    hasPermission,

    // actions
    setUserInfo,
    signOut
  }
}, {
  persist: true,
})
