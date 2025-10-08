import qs from 'query-string'

export const formUrlQuery = ({
  params,
  key,
  value,
}: {
  params: string
  key: string
  value: string
}) => {
  const queryString = qs.parse(params)
  queryString[key] = value

  return qs.stringifyUrl({
    url: window.location.pathname,
    query: queryString,
  })
}

export const removeKeyFormUrlQuery = ({
  params,
  keys,
}: {
  params: string
  keys: Array<string>
}) => {
  const queryString = qs.parse(params)
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(queryString, key)) {
      delete queryString[key]
    }
  }
  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: queryString,
    },
    {
      skipNull: true,
    }
  )
}
