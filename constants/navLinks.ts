interface NavLink {
  icon: string
  label: string
  route: string
}

export const navLinks: NavLink[] = [
  {
    icon: 'line-md:home',
    label: 'Home',
    route: '/',
  },
  {
    icon: 'iconoir:community',
    label: 'Community',
    route: '/community',
  },
  {
    icon: 'icon-park-outline:collection-records',
    label: 'Collections',
    route: '/collections',
  },
  {
    icon: 'hugeicons:new-job',
    label: 'Find Jobs',
    route: '/jobs',
  },
  {
    icon: 'mingcute:tag-line',
    label: 'Tags',
    route: '/tags',
  },
  {
    icon: 'iconamoon:profile-thin',
    label: 'Profile',
    route: '/profile',
  },
  {
    icon: 'mingcute:question-line',
    label: 'Ask a Question',
    route: '/questions/ask',
  },
]
