import ROUTES from './routes'

export const DEFAULT_EMPTY = {
  title: 'No data found',
  message: 'Looks like the database is taking a nap. Wake it up with some new entries!',
  button: {
    text: 'Add Data',
    href: ROUTES.HOME,
  },
}

export const DEFAULT_ERROR = {
  title: 'Oops! Something went wrong',
  message: 'Even our code can have a bad day. Give it another shot.',
  button: {
    text: 'Try again',
    href: ROUTES.HOME,
  },
}

export const EMPTY_QUESTION = {
  title: 'Ahh! No answers found',
  message: 'The question board is empty. Maybe it is waiting for you to ask a question!',
  button: {
    text: 'Ask a question',
    href: ROUTES.ASK_QUESTION,
  },
}

export const EMPTY_TAG = {
  title: 'Ahh! No tags found',
  message: 'The tag cloud is empty. Add some keywords to make it rain!',
  button: {
    text: 'Create tag',
    href: ROUTES.TAGS,
  },
}

export const EMPTY_ANSWERS = {
  title: 'Ahh! No answers found',
  message: 'The answer board is empty. Make it rain with your brilliant answers!',
}

export const EMPTY_COLLECTION = {
  title: 'Ahh! No collections found',
  message:
    "Looks like you haven't created any collections yet. Start curating something extraordinary today!",
  button: {
    text: 'Save to collection',
    href: ROUTES.COLLECTIONS,
  },
}
