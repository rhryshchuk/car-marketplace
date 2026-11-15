import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  className?: string
}

export function Container({ children, className }: ContainerProps) {
  const classes = ['mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8', className]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
