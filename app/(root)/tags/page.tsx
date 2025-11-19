import { use } from "react"

import DataRenderer from "@/components/DataRenderer"
import { EMPTY_TAG } from "@/constants/states"
import { getTags } from "@/lib/actions/tag.action"

interface SearchParamsProps {
  /**
   * this is async because the component is rendered in the server
   */
  searchParams: Promise<{ [key: string]: string }>
}
const Pages = ({ searchParams }: SearchParamsProps) => {
  const { page, pageSize, filter, query } = use(searchParams)

  const { data, success, error } = use(getTags({ page: Number(page) || 1, pageSize: Number(pageSize) || 10, query: query || '', filter: filter || '' }))

  const { tags } = data || {}


  return (
    <>
      {/* Tags Data Renderer */}
      <DataRenderer
        data={tags}
        success={success}
        error={error}
        empty={EMPTY_TAG}
        renderer={(tags) => {
          return <div className='mt-10 flex w-full flex-col gap-6'>
            {tags.map((tag) => {
              return <div key={tag._id.toString()}>
                {tag.name}
              </div>
            })}
          </div>
        }
        }
      />
    </>
  )
}

export default Pages
