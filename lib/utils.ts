import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDevIconClass(name: string) {
  const formattedName = name.trim().replace(/[.\s]/g, '').toLowerCase()
  return `devicon-${formattedName}-plain colored`
}

export function getTimeStamp(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  const seconds = Math.floor(diffMs / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(days / 365)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
  if (months < 12) return `${months <= 1 ? 'a' : months} month${months > 1 ? 's' : ''} ago`
  return `${years <= 1 ? 'a' : years} year${years > 1 ? 's' : ''} ago`
}

export function formatCount(count: number): string {
  if (count < 1000) {
    return count.toString()
  } else if (count < 10_000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  } else {
    return (count / 10_000).toFixed(1).replace(/\.0$/, '') + 'w'
  }
}
