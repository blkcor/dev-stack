'use client'


import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { SubmitHandler, DefaultValues, FieldValues, Path } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z, type ZodType } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import ROUTES from '@/constants/routes'

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T, any, any>
  defaultValues: T
  onSubmit: (data: T) => Promise<ActionResponse>
  formType: 'SIGN_IN' | 'SIGN_UP'
}

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  })

  const handleSubmit: SubmitHandler<T> = async data => {
    const result = await onSubmit(data)
    if (result.success) {
      toast.success('Success', {
        description: formType === 'SIGN_IN' ? 'Sign in successful' : 'Sign up successful',
        position: 'top-center',
      })
      router.push(ROUTES.HOME)
    } else {
      toast.error(`Error ${result.status}`, {
        description: result?.error?.message,
        position: 'top-center',
      })
    }
  }

  const buttonText = formType === 'SIGN_IN' ? 'Sign-in' : 'Sign-up'

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className='mt-10 space-y-6'>
        {Object.keys(defaultValues).map(field => {
          return (
            <FormField
              key={field}
              control={form.control}
              name={field as Path<T>}
              render={({ field }) => (
                <FormItem className='flex w-full flex-col gap-2.5'>
                  <FormLabel className='paragraph-medium text-dark400_light700'>
                    {field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type={field.name === 'password' ? 'password' : 'text'}
                      className='paragraph-regular background-light700_dark300 light-border-2 text-dark300_light700 no-focus rounded-1.5 min-h-12 border'
                      placeholder={`Please input ${field.name}`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        })}

        <Button
          className='primary-gradient paragraph-medium rounded-2 font-inter text-light-900! duration-all min-h-12 w-full cursor-pointer px-4 py-3 hover:opacity-90'
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? buttonText + '...' : buttonText}
        </Button>

        {formType === 'SIGN_IN' ? (
          <p>
            Do not have an account?{' '}
            <Link
              className='paragraph-semibold primary-text-gradient hover:opacity-90'
              href={ROUTES.SIGN_UP}
            >
              Sign up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <Link
              className='paragraph-semibold primary-text-gradient hover:opacity-90'
              href={ROUTES.SIGN_IN}
            >
              Sign in
            </Link>
          </p>
        )}
      </form>
    </Form>
  )
}

export default AuthForm
