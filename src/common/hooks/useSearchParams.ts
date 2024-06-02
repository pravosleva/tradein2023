import { useState } from 'react'

// NOTE: See also https://github.com/srsolano/useSearchParams/blob/master/src/use-search-params.js

export const useSearchParams = () => {
  const [searchParams] = useState(new URLSearchParams(window.location.search))
  const [queryString, setQueryString] = useState(searchParams.toString())

  const append = (name: string, value: string | number) => {
    searchParams.append(name, String(value))
    setQueryString(searchParams.toString())
  };

  const entries = () => Array.from(searchParams.entries())

  const get = (name: string) => searchParams.get(name)

  const getAll = (name: string) => searchParams.getAll(name)

  const has = (name: string) => searchParams.has(name)

  const keys = () => Array.from(searchParams.keys())

  const remove = (name: string) => {
    searchParams.delete(name)
    setQueryString(searchParams.toString())
  };

  const set = (name: string, value: string | number) => {
    searchParams.set(name, String(value))
    setQueryString(searchParams.toString())
  };

  const sort = () => {
    searchParams.sort()
    setQueryString(searchParams.toString())
  };

  const values = () => Array.from(searchParams.values())

  return { queryString, append, entries, get, getAll, has, keys, remove, set, sort, values }
}
