import Link from 'next/link'
import { use } from 'react'

import QuestionCard from '@/components/cards/QuestionCard'
import DataRenderer from '@/components/DataRenderer'
import HomeFilter from '@/components/filters/HomeFilter'
import LocalSearch from '@/components/search/LocalSearch'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'
import { EMPTY_QUESTION } from '@/constants/states'
import { getQuestions } from '@/lib/actions/question.action'


export default function Home({ searchParams }: RouteParam) {
  const { page, pageSize, query, filter } = use(searchParams)

  const { data, success, error } = use(getQuestions({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || '', filter: filter || '' }))

  const { questions } = data || {}


  // const filteredQuestions = answers?.filter(question =>
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
          route={ROUTES.HOME}
          placeHolder='Search Questions...'
          otherClasses='flex-1'
          icon='material-symbols:search-sharp'
        />
      </section>

      {/* HomeFilter */}
      <HomeFilter />

      {/* Question Data Renderer */}
      <DataRenderer
        data={questions}
        success={success}
        error={error}
        empty={EMPTY_QUESTION}
        renderer={(questions) => {
          return <div className='mt-10 flex w-full flex-col gap-6'>
            {questions.map((question) => (
              <QuestionCard key={question._id.toString()} question={question} collected={false} />
            ))}
          </div>
        }
        }
      />
    </>
  )
}
