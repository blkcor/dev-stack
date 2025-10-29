import { z } from 'zod'

export const SignInSchema = z.object({
  email: z
    .email({
      error: 'Please provide a valid email',
    })
    .min(1, {
      error: 'Email is required',
    }),

  password: z
    .string()
    .min(6, {
      error: 'Password is must be at least 6 characters',
    })
    .max(100, {
      error: 'Password cannot exceed 100 characters',
    }),
})

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(3, {
      error: 'Username must be at least 3 characters',
    })
    .max(30, {
      error: 'Username cannot exceed 30 characters',
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: 'Username can only contain letters, numbers and underscores',
    }),

  name: z
    .string()
    .min(1, {
      error: 'Name is required',
    })
    .max(50, {
      error: 'Name cannot exceed 50 characters',
    })
    .regex(/^[a-zA-Z\s]+$/, {
      error: 'Name can only contain letters and spaces',
    }),

  email: z
    .email({
      error: 'Please provide a valid email',
    })
    .min(1, {
      error: 'Email is required',
    }),
  password: z
    .string()
    .min(6, {
      error: 'Password must be at least 6 characters long',
    })
    .max(100, {
      error: 'Password cannot exceed 100 characters long',
    })
    .regex(/A-Z/, {
      error: 'Password must contain at least one uppercase letter',
    })
    .regex(/a-z/, {
      error: 'Password must contain at least one lowercase letter',
    })
    .regex(/0-9/, {
      error: 'Password must contain at least one number',
    })
    .regex(/[^a-zA-Z0-9]/, {
      error: 'Password must contain at least one special character',
    }),
})

export const AskQuestionSchema = z.object({
  title: z
    .string()
    .min(5, {
      error: 'Title must be at least 5 characters',
    })
    .max(100, {
      error: 'Title cannot exceed 100 characters',
    }),
  content: z.string().min(1, {
    error: 'Content is required',
  }),
  tags: z
    .array(z.string())
    .min(1, {
      error: 'At least one tag is required',
    })
    .max(5, {
      error: 'You can only add up to 5 tags',
    }),
})

export const UserSchema = z.object({
  name: z
    .string({
      error: iss => (iss.input === undefined ? 'Name is required.' : 'Invalid Name input.'),
    })
    .min(1, {
      error: 'Name is required',
    }),
  username: z
    .string({
      error: iss => (iss.input === undefined ? 'Username is required.' : 'Invalid Username input.'),
    })
    .min(3, {
      error: 'Username must be at least 3',
    }),
  email: z.email({
    error: iss => (iss.input === undefined ? 'Email is required' : 'Invalid Email input.'),
  }),
  bio: z.string().optional(),
  avatar: z
    .url({
      error: 'Please provide a valid avatar',
    })
    .optional(),
  location: z.string().optional(),
  portfolio: z
    .url({
      error: 'Please provide a valid portfolio URL',
    })
    .optional(),
  reputation: z.number().optional(),
})
