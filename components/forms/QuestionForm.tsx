'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '@iconify/react'
import { type MDXEditorMethods } from '@mdxeditor/editor'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import * as React from 'react'
import { useRef, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import TagCard from '@/components/cards/TagCard'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ROUTES from '@/constants/routes'
import { createQuestion, editQuestion } from '@/lib/actions/question.action'
import { AskQuestionSchema } from '@/lib/validation'
const Editor = dynamic(() => import('@/components/editor'), {
  ssr: false,
})


interface QuestionFormProps {
  isEdit?: boolean
  question?: Question
}

const QuestionForm = ({ isEdit, question }: QuestionFormProps) => {

  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof AskQuestionSchema>>({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || '',
      content: question?.content || '',
      tags: question?.tags?.map(t => t.name) || [],
    },
  })

  const handleCreateQuestion = async (data: z.infer<typeof AskQuestionSchema>) => {

    startTransition(async () => {
      if (isEdit && question) {
        const result = await editQuestion({ questionId: question._id, ...data })
        if (result.success) {
          toast.success("Success", {
            description: 'Your question has been updated successfully'
          })
          router.push(ROUTES.QUESTION(question._id.toString()))
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || 'Something went wrong'
          })
        }
      } else {
        const result = await createQuestion(data)
        if (result.success) {
          toast.success("Success", {
            description: 'Your question has been asked successfully'
          })
          if (result.data)
            router.push(ROUTES.QUESTION(result.data._id.toString()))
        } else {
          toast.error(`Error ${result.status}`, {
            description: result.error?.message || 'Something went wrong'
          })
        }
      }
    })
  }

  const handleAddTag = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: Array<string> }
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentTag = e.currentTarget.value.trim()
      if (currentTag && currentTag.length <= 15 && !field.value.includes(currentTag)) {
        form.setValue('tags', [...field.value, currentTag])
        e.currentTarget.value = ''
        form.clearErrors('tags')
      } else if (currentTag.length >= 15) {
        form.setError('tags', {
          type: 'manual',
          message: 'Tag should be less than 15 characters',
        })
      } else {
        form.setError('tags', {
          type: 'manual',
          message: 'Tag is already in the field',
        })
      }
    }
  }

  const handleDeleteTag = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter(t => t !== tag)
    if (newTags.length === 0) {
      form.setError('tags', {
        type: 'manual',
        message: 'Tags should not be empty',
      })
    }
    form.setValue('tags', newTags)
  }

  const editorRef = useRef<MDXEditorMethods>(null)
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className='flex w-full flex-col gap-10'
      >
        {/* Title */}
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Question Title <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  className='paragraph-regular background- light-border-2 text-dark300_light700 no-focus min-h-14 border'
                  placeholder='please enter question title...'
                  {...field}
                />
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Be specific and imagine you&apos;re asking a question to another person
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Content */}
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Detailed explanation of your question <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <Editor editorRef={editorRef} value={field.value} fieldChange={field.onChange} />
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Introduce the question and explain what you&apos;ve put in the title.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tags */}
        <FormField
          control={form.control}
          name='tags'
          render={({ field }) => (
            <FormItem className='flex w-full flex-col gap-3'>
              <FormLabel className='paragraph-semibold text-dark400_light800'>
                Tags <span className='text-primary-500'>*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className='paragraph-regular background- light-border-2 text-dark300_light700 no-focus min-h-14 border'
                    placeholder='Add tags...'
                    onKeyDown={e => handleAddTag(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className='flex-start mt-2.5 flex-wrap gap-2.5'>
                      {field?.value?.map(tag => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          compact
                          removeAble
                          handleRemove={() => handleDeleteTag(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription className='body-regular text-light-500 mt-2.5'>
                Add up to 5 tags to describe what your question is about.You need to press the enter
                key to add a tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='mt-16 flex justify-end'>


          <Button
            type='submit'
            className='primary-gradient text-light-900 cursor-pointer px-10 transition-all duration-300 hover:scale-105 hover:bg-primary-600 hover:text-white'
            disabled={isPending}
          >
            {
              isPending ? (
                <>
                  <Icon icon="tabler:loader" className='animate-spin mr-2 size-4' />
                  <span>Submitting...</span>
                </>
              ) : <>{isEdit ? 'Edit' : 'Ask Question'}</>
            }
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default QuestionForm
