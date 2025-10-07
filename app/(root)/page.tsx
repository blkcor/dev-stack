import Link from 'next/link'

import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'

export default function Home() {
  return (
    <>
      <section className='flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center'>
        <h1 className='h1-bold text-dark100_light900'>All Questions</h1>

        <Button className='primary-gradient !text-light-900 min-h-[46px] px-4 py-3' asChild>
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>

      <section className='mt-11'>local search</section>
      <section>filters</section>

      <div className='mt-10 flex w-full flex-col gap-6'>
        <p>Question Card1</p>
        <p>Question Card2</p>
        <p>Question Card3</p>
        <p>Question Card4</p>
        <p>Question Card5</p>
        <p>Question Card6</p>
      </div>
    </>
  )
}
