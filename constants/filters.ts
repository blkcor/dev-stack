export const filters = [
  {
    name: 'Newest',
    value: 'newest',
  },
  {
    name: 'Popular',
    value: 'popular',
  },
  {
    name: 'Unanswered',
    value: 'unanswered',
  },
  {
    name: 'Recommended',
    value: 'recommended',
  },
] as const

export type FilterName = (typeof filters)[number]['name']
