import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppShell } from '@/app/layout/AppShell'
import { AboutPage } from '@/features/about'
import {
  AdminDashboardPage,
  AdminGuard,
  AdminInquiriesPage,
  AdminLoginPage,
  AdminSessionSync,
  AdminVehicleCreatePage,
  AdminVehicleEditPage,
} from '@/features/admin'
import { CatalogPage, HomePage, VehicleDetailsPage } from '@/features/catalog'
import { ContactsPage } from '@/features/contacts'
import { FavoritesPage, FavoritesProvider } from '@/features/favorites'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FavoritesProvider>
          <AdminSessionSync />
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/catalog/:vehicleId" element={<VehicleDetailsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminGuard />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
              <Route path="/admin/vehicles/new" element={<AdminVehicleCreatePage />} />
              <Route path="/admin/vehicles/:vehicleId" element={<AdminVehicleEditPage />} />
            </Route>
          </Routes>
        </FavoritesProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
