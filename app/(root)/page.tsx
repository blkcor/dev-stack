import { signOut } from '@/auth'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'

export default function Home() {
  return (
    <>
      <h1 className='h1-bold'>Welcome to next.js project</h1>
      <form
        className='px-10 pt-[100px]'
        action={async () => {
          'use server'
          await signOut({
            redirectTo: ROUTES.SIGN_IN,
          })
        }}
      >
        <Button type='submit'>Logout</Button>
      </form>
    </>
  )
}
