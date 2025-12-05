'use client'

import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'
import React, { use, useState } from 'react'
import { toast } from 'sonner'

import { toggleSaveQuestion } from '@/lib/actions/collection.action'
import { cn } from '@/lib/utils'

interface Props {
  questionId: string
  hasSavedPromise: Promise<ActionResponse<{ saved: boolean }>>

}
const SaveQuestion = ({ questionId, hasSavedPromise }: Props) => {
  const session = useSession()
  const userId = session.data?.user?.id
  const [isLoading, setIsLoading] = useState(false)
  const { data } = use(hasSavedPromise)
  const saved = data?.saved

  const handleSave = async () => {
    if (!userId) return toast.error('Error', {
      description: 'You need to be logged in to save a question.'
    })

    setIsLoading(true)
    try {
      const { data: toggledResult, error: toggledError, success } = await toggleSaveQuestion({ questionId })

      if (!success) {
        return toast.error('Error', {
          description: toggledError instanceof Error ? toggledError.message : 'Something went wrong please try again later.'
        })
      }

      toast.success('Success', {
        description: `Question ${toggledResult?.saved ? 'saved' : 'unsaved'} successfully`
      })
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Something went wrong please try again later.'
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (

    <>
      <Icon
        onClick={handleSave}
        icon={saved ? 'mingcute:star-fill' : 'solar:star-outline'}
        className={cn('size-4.5 cursor-pointer', `${isLoading && 'opacity-50'} `, `${saved ? 'text-primary-500 hover:text-primary-100' : 'text-primary-100 hover:text-primary-500'}`)} />
    </>
  )
}

export default SaveQuestion
