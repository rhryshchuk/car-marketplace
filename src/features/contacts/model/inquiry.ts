export type InquiryInput = {
  name: string
  phone: string
  email: string
  message: string
}

export type InquiryField = keyof InquiryInput

export type InquiryErrors = Partial<Record<InquiryField, string>>

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateInquiry(input: InquiryInput): InquiryErrors {
  const errors: InquiryErrors = {}

  if (input.name.trim() === '') {
    errors.name = 'Вкажіть ім’я.'
  }

  if (input.phone.trim() === '') {
    errors.phone = 'Вкажіть номер телефону.'
  }

  const email = input.email.trim()
  if (email !== '' && !emailPattern.test(email)) {
    errors.email = 'Перевірте формат електронної пошти.'
  }

  return errors
}
