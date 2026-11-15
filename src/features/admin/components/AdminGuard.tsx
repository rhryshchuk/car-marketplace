import { Navigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { AdminShell } from '@/features/admin/components/AdminShell'
import { adminAccessQueryKey, loadAdminAccess } from '@/features/admin/services/adminAuth'

export function AdminGuard() {
  const access = useQuery({
    queryKey: adminAccessQueryKey,
    queryFn: loadAdminAccess,
  })

  if (access.isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas px-4 text-white">
        <p className="text-sm text-mist">Перевірка доступу…</p>
      </div>
    )
  }

  if (access.isError || access.data !== 'allowed') {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ forbidden: access.data === 'forbidden' }}
      />
    )
  }

  return <AdminShell />
}
