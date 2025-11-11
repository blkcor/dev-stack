import { notFound, redirect } from 'next/navigation'


import { auth } from '@/auth'
import QuestionForm from '@/components/forms/QuestionForm'
import ROUTES from '@/constants/routes'
import { getQuestion } from '@/lib/actions/question.action'

const EditQuestion = async ({ params }: RouteParam) => {
  const { id } = await params
  if (!id) return notFound()

  const session = await auth()
  if (!session) redirect('/sign-in')

  const { data: question, success } = await getQuestion({ questionId: id })
  if (!success) {
    return notFound()
  }

  if (question && question?.author.toString() !== session?.user?.id) {
    redirect(ROUTES.QUESTION(question._id.toString()))
  }

  return (
    <>
      <main>
        <QuestionForm question={question} isEdit />
      </main>
    </>
  )
}

export default EditQuestion
