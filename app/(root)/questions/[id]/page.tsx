

import React, { use } from 'react'

const QuestionDetail = ({ params }: RouteParam) => {
  const { id } = use(params)
  return (
    <div>
      <h1 className='h1-bold text-dark100_light900'>Question Detail</h1>
      <p className='body-medium text-dark200_light200'>Question {id}</p>
    </div>
  )
}

export default QuestionDetail
