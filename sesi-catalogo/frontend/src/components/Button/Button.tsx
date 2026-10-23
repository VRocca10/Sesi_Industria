import type { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'

type ButtonProps =
  | ({ to: string; variant?: 'light' | 'outline' } & Omit<ComponentPropsWithoutRef<typeof Link>, 'to'>)
  | ({ to?: never; variant?: 'light' | 'outline' } & ComponentPropsWithoutRef<'button'>)

export function Button(props: ButtonProps) {
  if (props.to !== undefined) {
    const { variant = 'light', className = '', ...rest } = props
    return <Link className={`button button--${variant} ${className}`} {...rest} />
  }
  const { variant = 'light', className = '', ...rest } = props
  return <button type="button" className={`button button--${variant} ${className}`} {...rest} />
}
