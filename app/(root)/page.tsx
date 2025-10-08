import Link from 'next/link'

import LocalSearch from '@/components/search/LocalSearch'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'

// TODO: replace the static data with the dynamic data from the backend
const questions = [
  {
    _id: 1,
    title: 'How to learn React?',
    description: 'I am new to frontend development. How should I start learning React effectively?',
    tags: [
      { _id: 1, name: 'react' },
      { _id: 2, name: 'javascript' },
    ],
    author: { _id: 1, name: 'John Doe' },
    upvotes: 10,
    answers: 4,
    views: 120,
    createdAt: new Date('2025-09-01T10:00:00'),
  },
  {
    _id: 2,
    title: 'Difference between useEffect and useLayoutEffect?',
    description:
      'Can someone explain the key differences between useEffect and useLayoutEffect in React?',
    tags: [
      { _id: 3, name: 'react-hooks' },
      { _id: 2, name: 'javascript' },
    ],
    author: { _id: 2, name: 'Alice Johnson' },
    upvotes: 23,
    answers: 6,
    views: 250,
    createdAt: new Date('2025-09-03T15:32:00'),
  },
  {
    _id: 3,
    title: 'What is a closure in JavaScript?',
    description:
      'I often hear about closures in JS interviews. What exactly are they and why are they useful?',
    tags: [
      { _id: 2, name: 'javascript' },
      { _id: 4, name: 'functional-programming' },
    ],
    author: { _id: 3, name: 'Robert Miles' },
    upvotes: 45,
    answers: 10,
    views: 560,
    createdAt: new Date('2025-09-04T09:15:00'),
  },
  {
    _id: 4,
    title: 'How does async/await work under the hood?',
    description:
      'I understand how to use async/await, but what is happening internally in JavaScript?',
    tags: [
      { _id: 5, name: 'async-await' },
      { _id: 2, name: 'javascript' },
    ],
    author: { _id: 4, name: 'Emily Carter' },
    upvotes: 31,
    answers: 5,
    views: 470,
    createdAt: new Date('2025-09-06T18:00:00'),
  },
  {
    _id: 5,
    title: 'Best practices for structuring a Next.js app?',
    description:
      'What are some recommended folder structures or conventions for large-scale Next.js projects?',
    tags: [
      { _id: 6, name: 'nextjs' },
      { _id: 7, name: 'architecture' },
    ],
    author: { _id: 5, name: 'Sophia Lin' },
    upvotes: 18,
    answers: 3,
    views: 320,
    createdAt: new Date('2025-09-07T13:20:00'),
  },
]

interface SearchParamsProps {
  /**
   * this is async because the component is rendered in the server
   */
  searchParams: Promise<{ [key: string]: string }>
}
export default async function Home({ searchParams }: SearchParamsProps) {
  const { query } = await searchParams

  const filteredQuestions = questions.filter(question =>
    question.title.toLowerCase().includes(query?.toLowerCase() || '')
  )
  return (
    <>
      <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>

        <Button className='primary-gradient !text-light-900 min-h-[46px] px-4 py-3' asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className='mt-11'>
        <LocalSearch
          route='/'
          placeHolder='Search Questions...'
          otherClasses='flex-1'
          icon='material-symbols:search-sharp'
        />
      </section>
      {/* <section>filters</section> */}

      <div className='mt-10 flex w-full flex-col gap-6'>
        {filteredQuestions.map(question => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  )
}
