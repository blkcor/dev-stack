import * as React from 'react'

import { EMPTY_ANSWERS } from '@/constants/states'
import { IAnswerAuthorPopulated } from '@/database/answer.model'

import AnswerCard from '../cards/AnswerCard'
import DataRenderer from '../DataRenderer'

interface AllAnswersProps extends ActionResponse<IAnswerAuthorPopulated[]> {
  totalAnswers?: number
}

const AllAnswers = ({
  data,
  success,
  error,
  totalAnswers
}: AllAnswersProps) => {
  return <div className='mt-11'>
    <div className='flex items-center justify-between'>
      <h3 className='primary-text-gradient'>
        {
          totalAnswers === 1 ? `${totalAnswers} Answer` : `${totalAnswers} Answers`
        }
      </h3>
      <p>Filters</p>
    </div>
    <DataRenderer
      success={success}
      error={error}
      data={data}
      empty={EMPTY_ANSWERS}
      renderer={(answers) => answers.map((answer) => <AnswerCard key={answer._id} answer={answer} />)}
    />
  </div>
}

export default AllAnswers
