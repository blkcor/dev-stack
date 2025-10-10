import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 标签缩写到完整名称的映射
const TAG_NAME_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  cpp: 'cplusplus',
  'c++': 'cplusplus',
  cs: 'csharp',
  'c#': 'csharp',
  rb: 'ruby',
  go: 'go',
  golang: 'go',
  kt: 'kotlin',
  rs: 'rust',
  php: 'php',
  java: 'java',
  swift: 'swift',
  dart: 'dart',
  vue: 'vuejs',
  next: 'nextjs',
  react: 'react',
  angular: 'angularjs',
  node: 'nodejs',
  express: 'express',
  mongo: 'mongodb',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mysql: 'mysql',
  redis: 'redis',
  docker: 'docker',
  k8s: 'kubernetes',
  kubernetes: 'kubernetes',
  aws: 'amazonwebservices',
  gcp: 'googlecloud',
  azure: 'azure',
  vite: 'vitejs',
}

export function getDevIconClass(name: string) {
  const normalizedName = name.trim().replace(/[.\s]/g, '').toLowerCase()
  // 检查是否有映射，如果有则使用映射后的名称
  const mappedName = TAG_NAME_MAP[normalizedName] || normalizedName
  return `devicon-${mappedName}-plain colored`
}

// 检查标签是否有对应的 devicon
export function hasDevIcon(name: string): boolean {
  const normalizedName = name.trim().replace(/[.\s]/g, '').toLowerCase()
  const mappedName = TAG_NAME_MAP[normalizedName] || normalizedName
  // 常见的有 devicon 的技术标签
  const commonDevIcons = [
    'javascript',
    'typescript',
    'python',
    'java',
    'cplusplus',
    'csharp',
    'ruby',
    'go',
    'rust',
    'php',
    'swift',
    'kotlin',
    'dart',
    'html5',
    'css3',
    'react',
    'vuejs',
    'angular',
    'angularjs',
    'nextjs',
    'nodejs',
    'express',
    'django',
    'flask',
    'spring',
    'laravel',
    'rails',
    'mongodb',
    'postgresql',
    'mysql',
    'redis',
    'sqlite',
    'docker',
    'kubernetes',
    'git',
    'github',
    'gitlab',
    'aws',
    'amazonwebservices',
    'azure',
    'googlecloud',
    'firebase',
    'graphql',
    'jest',
    'webpack',
    'vitejs',
    'vitest',
    'tailwindcss',
    'bootstrap',
    'sass',
    'less',
    'redux',
    'c',
  ]
  return commonDevIcons.includes(mappedName)
}

// 获取标签首字母（用于后备显示）
export function getTagInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
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
