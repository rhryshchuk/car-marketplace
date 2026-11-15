import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { adminAccessQueryKey } from '@/features/admin/services/adminAuth'
import { supabase } from '@/lib/supabase'

export function AdminSessionSync() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(() => {
      void queryClient.invalidateQueries({ queryKey: adminAccessQueryKey })
    })

    return () => data.subscription.unsubscribe()
  }, [queryClient])

  return null
}
