import Image from 'next/image'
import React from 'react'

import { DEFAULT_EMPTY, DEFAULT_ERROR } from '@/constants/states'

import { Button } from './ui/button'

interface Props<T> {
  success: boolean
  error?: {
    message: string
    details?: Record<string, Array<string>>
  },
  data: T[] | null | undefined,
  empty: {
    title: string
    message: string
    button?: {
      text: string
      href: string
    }
  },
  renderer: (data: T[]) => React.ReactNode
}


interface StateSkeletonProps {
  image: {
    dark: string
    light: string,
    alt: string
  },
  title: string
  message: string
  button?: {
    text: string
    href: string
  }
}

const StateSkeleton = ({ image, title, message, button }: React.PropsWithChildren<StateSkeletonProps>) => {
  return <div className='mt-16 w-full flex flex-col items-center justify-center sm:mt-36 gap-4'>
    <>
      <Image src={image.dark} alt={image.alt} width={270} height={200} className='hidden object-contain dark:block' />
      <Image src={image.light} alt={image.alt} width={270} height={200} className='block object-contain dark:hidden' />
    </>
    <h2 className='h2-bold text-dark200_light900 mt-4'>{title}</h2>
    <p className='body-regular text-dark500_light700 max-w-md'>{message}</p>
    {button && (
      <a href={button.href} >
        <Button variant="outline" className='cursor-pointer paragraph-medium min-h-[46px] rounded-lg px-4 py-3 text-light-900 '>{button.text}</Button>
      </a>
    )}
  </div >
}

const DataRenderer = <T,>({ success, error, data, empty = DEFAULT_EMPTY, renderer }: Props<T>) => {
  if (!data || data.length === 0) return <StateSkeleton image={{ dark: "/images/question-dark.svg", light: "/images/question-light.svg", alt: "question mark" }} title={empty.title} message={empty.message} button={empty.button} />

  if (!success) return <StateSkeleton image={{ dark: "/images/error-dark.svg", light: "/images/error-light.svg", alt: "error" }} title={error?.message || DEFAULT_ERROR.title} message={error?.details && JSON.stringify(error.details, null, 2) || DEFAULT_ERROR.message} button={DEFAULT_ERROR.button} />

  return <>{renderer(data)}</>
}

export default DataRenderer
