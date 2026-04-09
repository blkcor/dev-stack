'use client'

import { Icon } from '@iconify/react'
import React, { useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'

interface Props {
  questionId: string
}

const ShareQuestion = ({ questionId }: Props) => {
  const [isCopied, setIsCopied] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleShare = async () => {
    try {
      const shareUrl = `${window.location.origin}/questions/${questionId}`

      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      toast.success('Success', {
        description: 'Link copied to clipboard successfully'
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to copy link. Please try again.'
      })
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <button
      onClick={handleShare}
      className="p-1 -m-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
      aria-label={isCopied ? "Link copied" : "Share question"}
      title={isCopied ? "Link copied" : "Share question"}
    >
      <Icon
        icon={isCopied ? 'material-symbols:check' : 'material-symbols:share'}
        className={cn(
          'size-4.5 cursor-pointer transition-colors duration-200',
          isCopied
            ? 'text-green-500'
            : 'text-primary-100 hover:text-primary-500'
        )}
      />
    </button>
  )
}

export default ShareQuestion
