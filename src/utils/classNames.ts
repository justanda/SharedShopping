/**
 * Combine multiple class names with conditional logic
 * Similar to the popular 'classnames' or 'clsx' libraries
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
