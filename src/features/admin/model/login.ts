export type LoginErrors = {
  email?: string
  password?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {}

  if (!emailPattern.test(email.trim())) {
    errors.email = 'Вкажіть електронну пошту.'
  }

  if (password === '') {
    errors.password = 'Вкажіть пароль.'
  }

  return errors
}
