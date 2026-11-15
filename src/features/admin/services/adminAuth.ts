import { supabase } from '@/lib/supabase'

export const adminAccessQueryKey = ['admin-access'] as const

export type AdminAccess = 'anonymous' | 'forbidden' | 'allowed'

export async function signInAdmin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })

  if (error) {
    throw new Error('Невірна електронна пошта або пароль.')
  }

  const allowed = await fetchIsAdmin()
  if (!allowed) {
    await supabase.auth.signOut()
    throw new Error('Цей обліковий запис не має доступу до панелі.')
  }
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error('Не вдалося вийти з панелі.')
  }
}

export async function fetchIsAdmin() {
  const { data, error } = await supabase.rpc('is_admin')
  if (error) return false
  return data === true
}

export async function loadAdminAccess(): Promise<AdminAccess> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) return 'anonymous'

  const allowed = await fetchIsAdmin()
  if (!allowed) {
    await supabase.auth.signOut()
    return 'forbidden'
  }

  return 'allowed'
}
