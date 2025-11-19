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

// 技术描述映射
const techDescriptionMap: Record<string, string> = {
  javascript:
    'JavaScript is a powerful, versatile programming language primarily used for web development, enabling interactive and dynamic content on websites.',
  typescript:
    'TypeScript is a strongly typed superset of JavaScript that adds static type definitions, making code more robust and maintainable.',
  python:
    'Python is a high-level, interpreted programming language known for its simplicity and readability, widely used in web development, data science, and automation.',
  java: 'Java is a class-based, object-oriented programming language designed to have minimal implementation dependencies, commonly used for enterprise applications.',
  cplusplus:
    'C++ is a powerful general-purpose programming language that supports procedural, object-oriented, and generic programming, widely used in system software and game development.',
  csharp:
    'C# is a modern, object-oriented programming language developed by Microsoft, primarily used for building Windows applications and games with Unity.',
  ruby: 'Ruby is a dynamic, open-source programming language with a focus on simplicity and productivity, known for its elegant syntax.',
  go: 'Go (Golang) is a statically typed, compiled programming language designed by Google, known for its simplicity, efficiency, and excellent support for concurrent programming.',
  rust: 'Rust is a systems programming language focused on safety, speed, and concurrency, preventing memory errors and data races at compile time.',
  php: 'PHP is a popular server-side scripting language designed for web development, powering many content management systems and frameworks.',
  swift:
    'Swift is a powerful and intuitive programming language developed by Apple for iOS, macOS, watchOS, and tvOS app development.',
  kotlin:
    'Kotlin is a modern, statically typed programming language that runs on the JVM, officially supported for Android development by Google.',
  dart: 'Dart is an object-oriented programming language developed by Google, optimized for building mobile, desktop, server, and web applications, especially with Flutter.',
  react:
    'React is a popular JavaScript library for building user interfaces, particularly single-page applications, developed and maintained by Meta (Facebook).',
  vuejs:
    'Vue.js is a progressive JavaScript framework for building user interfaces, known for its gentle learning curve and flexible architecture.',
  angularjs:
    'Angular is a TypeScript-based web application framework developed by Google, providing a comprehensive solution for building dynamic web applications.',
  nextjs:
    'Next.js is a React framework that enables server-side rendering and static site generation, optimizing performance and SEO for web applications.',
  nodejs:
    "Node.js is a JavaScript runtime built on Chrome's V8 engine, enabling server-side JavaScript execution and building scalable network applications.",
  express:
    'Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.',
  mongodb:
    'MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents, designed for scalability and developer productivity.',
  postgresql:
    'PostgreSQL is a powerful, open-source relational database system known for its robustness, extensibility, and standards compliance.',
  mysql:
    'MySQL is an open-source relational database management system, widely used for web applications and known for its reliability and performance.',
  redis:
    'Redis is an in-memory data structure store used as a database, cache, and message broker, known for its exceptional speed and versatility.',
  docker:
    'Docker is a platform that uses containerization to package applications and their dependencies, ensuring consistent deployment across environments.',
  kubernetes:
    'Kubernetes is an open-source container orchestration platform that automates deployment, scaling, and management of containerized applications.',
  amazonwebservices:
    'AWS (Amazon Web Services) is a comprehensive cloud computing platform offering a wide range of services including computing power, storage, and databases.',
  googlecloud:
    'Google Cloud Platform is a suite of cloud computing services that provides infrastructure, platform, and serverless computing environments.',
  azure:
    'Microsoft Azure is a cloud computing service offering a wide range of cloud services for building, testing, deploying, and managing applications.',
  vitejs:
    'Vite is a modern frontend build tool that provides a faster and leaner development experience for modern web projects.',
  git: 'Git is a distributed version control system for tracking changes in source code during software development.',
  github:
    'GitHub is a web-based platform for version control and collaboration, allowing developers to work together on projects.',
  gitlab:
    'GitLab is a web-based DevOps platform that provides Git repository management, CI/CD, and project management features.',
  firebase:
    'Firebase is a comprehensive app development platform by Google, providing backend services like authentication, databases, and hosting.',
  graphql:
    'GraphQL is a query language for APIs that allows clients to request exactly the data they need, making APIs more flexible and efficient.',
  jest: 'Jest is a delightful JavaScript testing framework with a focus on simplicity, providing built-in assertion and mocking capabilities.',
  webpack:
    'Webpack is a static module bundler for modern JavaScript applications, processing and bundling various assets for web deployment.',
  vitest:
    'Vitest is a blazing fast unit test framework powered by Vite, designed for modern JavaScript and TypeScript projects.',
  tailwindcss:
    'Tailwind CSS is a utility-first CSS framework that provides low-level utility classes for building custom designs quickly.',
  bootstrap:
    'Bootstrap is a popular CSS framework for developing responsive and mobile-first websites with pre-built components.',
  sass: 'Sass is a CSS preprocessor that adds features like variables, nested rules, and mixins, making CSS more maintainable.',
  less: 'Less is a CSS preprocessor that extends CSS with dynamic behavior such as variables, mixins, and functions.',
  redux:
    'Redux is a predictable state container for JavaScript apps, commonly used with React for managing application state.',
  django:
    'Django is a high-level Python web framework that encourages rapid development and clean, pragmatic design.',
  flask:
    'Flask is a lightweight Python web framework that provides the essentials for building web applications without imposing constraints.',
  spring:
    'Spring is a comprehensive framework for enterprise Java development, providing infrastructure support for developing Java applications.',
  laravel:
    'Laravel is an elegant PHP web framework with expressive syntax, designed to make web development tasks easier and more enjoyable.',
  rails:
    'Ruby on Rails is a server-side web application framework written in Ruby, following the MVC pattern and emphasizing convention over configuration.',
  sqlite:
    'SQLite is a C-language library that implements a small, fast, self-contained SQL database engine, commonly embedded in applications.',
  html5:
    'HTML5 is the latest version of HTML, the standard markup language for creating web pages and web applications.',
  css3: 'CSS3 is the latest evolution of Cascading Style Sheets, adding new styling features like animations, gradients, and flexbox.',
  c: 'C is a general-purpose programming language that provides low-level access to memory and is widely used in system programming.',
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

// 获取技术描述
export function getTechDescription(techName: string): string {
  const normalizedName = techName.trim().replace(/[.\s]/g, '').toLowerCase()
  const mappedName = TAG_NAME_MAP[normalizedName] || normalizedName

  // 如果在描述映射中找到，返回描述
  if (techDescriptionMap[mappedName]) {
    return techDescriptionMap[mappedName]
  }

  // 否则返回通用描述
  const capitalizedName = techName.charAt(0).toUpperCase() + techName.slice(1)
  return `${capitalizedName} is a technology or tool used in modern software development, providing developers with capabilities to build, deploy, and maintain applications efficiently.`
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
