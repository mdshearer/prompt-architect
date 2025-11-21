'use client'

/**
 * Shared Check Icon Component
 *
 * A reusable checkmark icon used for selection indicators across the app.
 * Extracted to reduce code duplication in selector components.
 *
 * @module check-icon
 */

interface CheckIconProps {
  /** Additional CSS classes */
  className?: string
  /** Size variant */
  size?: 'sm' | 'md'
}

/**
 * Circular checkmark icon for selection indicators
 *
 * @example
 * <CheckIcon size="md" />
 * <CheckIcon className="flex-shrink-0" />
 */
export default function CheckIcon({ className = '', size = 'md' }: CheckIconProps) {
  const sizeClasses = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'

  return (
    <div className={`${sizeClasses} rounded-full bg-optimi-primary flex items-center justify-center ${className}`}>
      <svg className={`${iconSize} text-white`} fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  )
}
