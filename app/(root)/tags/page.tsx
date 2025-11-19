import { use } from "react"

import TagCard from "@/components/cards/TagCard"
import DataRenderer from "@/components/DataRenderer"
import LocalSearch from "@/components/search/LocalSearch"
import ROUTES from "@/constants/routes"
import { EMPTY_TAG } from "@/constants/states"
import { getTags } from "@/lib/actions/tag.action"


const Pages = ({ searchParams }: RouteParam) => {
  const { page, pageSize, filter, query } = use(searchParams)

  const { data, success, error } = use(getTags({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || '', filter: filter || '' }))

  const { tags } = data || {}


  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
      <section className="mt-11">
        <LocalSearch route={ROUTES.TAGS}
          placeHolder='Search Tags...'
          otherClasses='flex-1'
          icon='material-symbols:search-sharp'
        />

        {/* Tags Data Renderer */}



        <div className="mt-10">
          <DataRenderer
            data={tags}
            success={success}
            error={error}
            empty={EMPTY_TAG}
            renderer={(tags) => {
              return <div className='grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
                {tags.map((tag) => {
                  return <TagCard key={tag._id.toString()} _id={tag._id.toString()} name={tag.name} questions={tag.questions} />
                })}
              </div>
            }}
          />
        </div>
      </section>
    </>
  )
}

export default Pages
