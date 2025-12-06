import { use } from 'react'

import QuestionCard from '@/components/cards/QuestionCard'
import DataRenderer from '@/components/DataRenderer'
import LocalSearch from '@/components/search/LocalSearch'
import ROUTES from '@/constants/routes'
import { EMPTY_QUESTION } from '@/constants/states'
import { getSavedQuestions } from '@/lib/actions/collection.action'



export default function Collections({ searchParams }: RouteParam) {
  const { page, pageSize, query, filter } = use(searchParams)

  const { data, success, error } = use(getSavedQuestions({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || '', filter: filter || '' }))

  const { collections } = data || {}

  return (
    <>
      <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>Saved Questions</h1>
      </section>

      {/* Local Search */}
      <section className='mt-11'>
        <LocalSearch
          route={ROUTES.COLLECTIONS}
          placeHolder='Search Questions...'
          otherClasses='flex-1'
          icon='material-symbols:search-sharp'
        />
      </section>


      {/* Question Data Renderer */}
      <DataRenderer
        data={collections}
        success={success}
        error={error}
        empty={EMPTY_QUESTION}
        renderer={(collections) => {
          return <div className='mt-10 flex w-full flex-col gap-6'>
            {collections.map((collection) => (
              <QuestionCard key={collection._id.toString()} question={collection.question} />
            ))}
          </div>
        }
        }
      />
    </>
  )
}
