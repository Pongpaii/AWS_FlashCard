import { serviceIconUrl } from '../../data/serviceIcons'

interface ServiceIconProps {
  serviceId: string
  /** Rendered width and height in pixels. */
  size?: number
  className?: string
}

/** The AWS Architecture Icon for a service. Decorative: the name is always shown next to it. */
export function ServiceIcon({ serviceId, size = 48, className = '' }: ServiceIconProps) {
  const url = serviceIconUrl(serviceId)
  if (url === undefined) return null

  return (
    <img
      src={url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      draggable={false}
      className={`shrink-0 rounded-md ${className}`}
    />
  )
}
