import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDevIconClass(name: string) {
  const formattedName = name.trim().replace(/[.\s]/g, '').toLowerCase()
  return `devicon-${formattedName}-plain colored`
}
