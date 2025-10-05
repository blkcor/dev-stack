export const authProviders = ['github', 'google'] as const

export type ProviderName = (typeof authProviders)[number]

interface AuthInfo {
  provider: (typeof authProviders)[number]
  icon: string
}

export const authList: AuthInfo[] = [
  {
    provider: 'github',
    icon: 'line-md:github-loop',
  },
  {
    provider: 'google',
    icon: 'material-icon-theme:google',
  },
]
