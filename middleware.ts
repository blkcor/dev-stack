// https://nextjs.org/docs/app/api-reference/file-conventions/proxy
// the middleware function in the middleware.ts is the specified file in next.js
// before a request is coming or the response is completed.
export { auth as middleware } from '@/auth'
