'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import * as React from 'react'
import { useForm } from 'react-hook-form'

import Editor from '@/components/Editor'
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
import { AskQuestionSchema } from '@/lib/validation'

const QuestionForm = () => {
  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: '',
      content: '',
      tags: [],
    },
  })

  const handleCreateQuestion = async () => {}

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
                  className='paragraph-regular background- light-border-2 text-dark300_light700 no-focus min-h-[56px] border'
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
                <Editor />
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
                    className='paragraph-regular background- light-border-2 text-dark300_light700 no-focus min-h-[56px] border'
                    placeholder='Add tags...'
                    {...field}
                  />
                  Tags
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
          <Button type='submit' className='primary-gradient !text-light-900'>
            Ask Question
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default QuestionForm
