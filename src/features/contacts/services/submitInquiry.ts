import { supabase } from '@/lib/supabase'

export type InquirySubmission = {
  name: string
  phone: string
  email: string
  message: string
  vehicleId: number | null
}

export async function submitInquiry(input: InquirySubmission) {
  const email = input.email.trim()
  const message = input.message.trim()
  const { error } = await supabase.from('vehicle_inquiries').insert({
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: email === '' ? null : email,
    message: message === '' ? null : message,
    vehicle_id: input.vehicleId,
    status: 'new',
  })

  if (error) {
    throw new Error('Не вдалося надіслати заявку. Спробуй ще раз.')
  }
}
