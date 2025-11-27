'use client'


import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import { type MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import { useRef, useState, useTransition } from 'react'
import type { SubmitHandler, } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { createAnswer } from '@/lib/actions/answer.action'
import { AnswerSchema } from '@/lib/validation'

import { Button } from '../ui/button'

const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})



const AnswerForm = ({ questionId }: {
  questionId: string
}) => {
  const [isSubmitting, startAnswerTransition] = useTransition()
  const [isAISubmitting, setIsAISubmitting] = useState<boolean>(false)
  const editorRef = useRef<MDXEditorMethods>(null)

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: ''
    }
  })

  const handleSubmit: SubmitHandler<z.infer<typeof AnswerSchema>> = async (data) => {
    startAnswerTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: data.content
      })
      if (result.success) {
        form.reset()
        if(editorRef.current){
          editorRef.current.setMarkdown('')
        }
        toast.success('Success', {
          description: 'Your answer has been posted successfully'
        })
      } else {
        toast.error('Error', {
          description: result.error?.message || 'Something went wrong while posting your answer'
        })
      }
    })
  }

  return (
    <div>
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:gap-2 sm:items-center'>
        <h4 className='paragraph-semibold text-dark400_light800'>Write your answer here</h4>
        <Button className='btn! light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none transition-all duration-300 hover:scale-105 dark:text-primary-500' disabled={isAISubmitting}>
          {
            isAISubmitting ? <div className='flex items-center gap-2 p-2'>
              <Icon className='size-4 animate-spin' icon='tdesign:load' />
              <span>Generating...</span>
            </div> :
              <div className='flex items-center gap-2 cursor-pointer'>
                <Icon className='mr-2 size-4' icon='bi:stars' />
                <span>Generate AI Answer</span>
              </div>
          }
        </Button>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className='mt-6 flex w-full flex-col gap-10'>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => {
              return (
                <FormItem
                  className='flex w-full flex-col gap-3'
                >
                  <FormControl>
                    <Editor editorRef={editorRef} value={field.value} fieldChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <div className='flex justify-end'>
            <Button type='submit' className='primary-gradient w-fit cursor-pointer transition-all duration-300 hover:scale-105' disabled={isSubmitting}>
              {
                isSubmitting ? <div className='flex items-center gap-2 p-2'>
                  <Icon className='size-4 animate-spin' icon='tdesign:load' />
                  <span>Posting...</span>
                </div> : 'Post Answer'
              }
            </Button>
          </div>
        </form>
      </Form >
    </div>
  )
}

export default AnswerForm
