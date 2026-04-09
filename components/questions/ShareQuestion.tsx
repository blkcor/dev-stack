'use client'

import { Icon } from '@iconify/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

interface Props {
  questionId: string
}

const ShareQuestion = ({ questionId }: Props) => {
  const [isCopied, setIsCopied] = useState(false)

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/questions/${questionId}`

      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      toast.success('Success', {
        description: 'Link copied to clipboard successfully'
      })

      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to copy link. Please try again.'
      })
    }
  }

  return (
    <Icon
      onClick={handleShare}
      icon={isCopied ? 'material-symbols:check' : 'material-symbols:share'}
      className={cn(
        'size-4.5 cursor-pointer transition-colors duration-200',
        isCopied
          ? 'text-green-500'
          : 'text-primary-100 hover:text-primary-500'
      )}
    />
  )
}

export default ShareQuestion
