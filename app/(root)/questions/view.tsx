'use client'

import { useEffect } from "react"
import { toast } from "sonner"

import { incrementViews } from "@/lib/actions/question.action"

const View = ({ questionId }: { questionId: string }) => {
  const handleIncrementView = async () => {
    const result = await incrementViews({ questionId })
    if (result.success) {
      toast.success('Success', {
        description: 'Question views incremented successfully',
      })
    } else {
      toast.error('Error', {
        description: result.error?.message
      })
    }
  }

  useEffect(() => {
    handleIncrementView()
  })

  return null
}

export default View
