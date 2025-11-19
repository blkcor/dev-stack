import Link from 'next/link'


import QuestionCard from '@/components/cards/QuestionCard'
import HomeFilter from '@/components/filters/HomeFilter'
import LocalSearch from '@/components/search/LocalSearch'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'
import { getQuestions } from '@/lib/actions/question.action'


interface SearchParamsProps {
  /**
   * this is async because the component is rendered in the server
   */
  searchParams: Promise<{ [key: string]: string }>
}
export default async function Home({ searchParams }: SearchParamsProps) {
  const { page, pageSize, query, filter } = await searchParams

  const { data, success, error } = await getQuestions({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || '', filter: filter || '' })

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
      {
        success ?
          <div className='mt-10 flex w-full flex-col gap-6'>
            {questions && questions.length > 0 ? questions.map(question => (
              <QuestionCard key={question._id.toString()} question={question} />
            )) : (
              <div className='mt-10 flex w-full items-center justify-center'>
                <span className='text-dark400_light700'>No Question Found</span>
              </div>
            )}
          </div> : (
            <div className='mt-10 flex w-full items-center justify-center'>
              <span className='text-dark400_light700'>{error?.message || 'Something went wrong'}</span>
            </div>
          )
      }
    </>
  )
}
