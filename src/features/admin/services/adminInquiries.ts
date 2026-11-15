import { supabase } from '@/lib/supabase'
import { isInquiryStatus, type InquiryStatus } from '@/features/admin/model/inquiryStatus'

export const adminInquiriesQueryKey = ['admin-inquiries'] as const

export type AdminInquiry = {
  id: string
  vehicleId: number | null
  vehicleLabel: string | null
  name: string
  phone: string
  email: string | null
  message: string | null
  status: InquiryStatus
  createdAt: string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function readVehicleLabel(value: unknown): string | null {
  if (Array.isArray(value)) return readVehicleLabel(value[0])
  if (!isRecord(value) || typeof value.brand !== 'string' || typeof value.model !== 'string') {
    return null
  }
  return `${value.brand} ${value.model}`
}

function readInquiry(value: unknown): AdminInquiry {
  if (!isRecord(value) || typeof value.id !== 'string' || typeof value.name !== 'string') {
    throw new Error('Не вдалося прочитати заявку.')
  }
  if (typeof value.phone !== 'string' || typeof value.status !== 'string' || typeof value.created_at !== 'string') {
    throw new Error('Не вдалося прочитати заявку.')
  }
  if (!isInquiryStatus(value.status)) {
    throw new Error('Не вдалося прочитати статус заявки.')
  }

  const vehicleId = value.vehicle_id === null ? null : Number(value.vehicle_id)
  if (vehicleId !== null && !Number.isInteger(vehicleId)) {
    throw new Error('Не вдалося прочитати заявку.')
  }

  return {
    id: value.id,
    vehicleId,
    vehicleLabel: readVehicleLabel(value.vehicles),
    name: value.name,
    phone: value.phone,
    email: typeof value.email === 'string' ? value.email : null,
    message: typeof value.message === 'string' ? value.message : null,
    status: value.status,
    createdAt: value.created_at,
  }
}

export async function getAdminInquiries() {
  const { data, error } = await supabase
    .from('vehicle_inquiries')
    .select('id, vehicle_id, name, phone, email, message, status, created_at, vehicles(brand, model)')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error('Не вдалося завантажити заявки.')
  }

  return (data ?? []).map((row) => readInquiry(row))
}

export async function updateInquiryStatus(id: string, status: InquiryStatus) {
  const { error } = await supabase.from('vehicle_inquiries').update({ status }).eq('id', id)
  if (error) {
    throw new Error('Не вдалося змінити статус заявки.')
  }
}

export async function deleteInquiry(id: string) {
  const { error } = await supabase.from('vehicle_inquiries').delete().eq('id', id)
  if (error) {
    throw new Error('Не вдалося видалити заявку.')
  }
}
