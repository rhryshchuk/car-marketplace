export const inquiryStatuses = ['new', 'contacted', 'closed'] as const

export type InquiryStatus = (typeof inquiryStatuses)[number]

export const inquiryStatusLabels: Record<InquiryStatus, string> = {
  new: 'Нова',
  contacted: 'Зв’язались',
  closed: 'Закрита',
}

export function isInquiryStatus(value: string): value is InquiryStatus {
  return inquiryStatuses.some((status) => status === value)
}
