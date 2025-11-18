import Link from 'next/link'


import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilter from '@/components/filters/HomeFilter'
import LocalSearch from '@/components/search/LocalSearch'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'
import { getQuestions } from '@/lib/actions/question.action'

/**
 * questions [
  {
    _id: '691354f1ad371e7bf5aa5614',
    title: 'How to learn frontend?',
    content: 'How to learn frontend, can any one could give some learning path for frontend?',
    tags: [ [Object], [Object] ],
    views: 0,
    upvotes: 0,
    downvotes: 0,
    answers: 0,
    author: { _id: '6910942c8a6b9556b192313c', name: 'blkcor' },
    createdAt: '2025-11-11T15:23:29.254Z',
    updatedAt: '2025-11-11T15:56:55.101Z',
    __v: 3
  },
 */

interface SearchParamsProps {
  /**
   * this is async because the component is rendered in the server
   */
  searchParams: Promise<{ [key: string]: string }>
}
export default async function Home({ searchParams }: SearchParamsProps) {
  const { page, pageSize, query, filter } = await searchParams

  const { data } = await getQuestions({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || '', filter: filter || '' })

  const { questions } = data || {}


  // const filteredQuestions = questions?.filter(question =>
  //   question.title.toLowerCase().includes(query?.toLowerCase() || '')
  // )
  return (
    <>
      <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>

        <Button className='primary-gradient text-light-900! min-h-[46px] px-4 py-3' asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      {/* Local Search */}
      <section className='mt-11'>
        <LocalSearch
          route='/'
          placeHolder='Search Questions...'
          otherClasses='flex-1'
          icon='material-symbols:search-sharp'
        />
      </section>

      {/* HomeFilter */}
      <HomeFilter />

      {/* Question Cards */}
      <div className='mt-10 flex w-full flex-col gap-6'>
        {questions && questions.length > 0 ? questions.map(question => (
          <QuestionCard key={question._id} question={question} />
        )) : (
          <div>No questions found.</div>
        )}
      </div>
    </>
  )
}
