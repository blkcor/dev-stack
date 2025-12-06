const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ASK_QUESTION: '/questions/ask',
  QUESTION: (id: string) => `/questions/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  TAG: (id: string) => `/tag/${id}`,
  TAGS: '/tags',
  JOBS: '/jobs',
  COLLECTIONS: '/collections',
  COMMUNITY: '/community',
}

export default ROUTES
