export {}

declare global {
  interface Tag {
    _id: string
    name: string
  }

  interface Author {
    _id: string
    name: string
    avatar: string
  }

  interface Question {
    _id: string
    title: string
    tags: Tag[]
    author: Author
    upvotes: number
    answers: number
    views: number
    createdAt: Date
  }
}
