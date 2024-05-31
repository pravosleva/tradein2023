/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError, AxiosInstance, AxiosResponse, CancelToken } from 'axios'
import clsx from 'clsx'
// import axiosRetry from 'axios-retry'
// @ts-ignore
import * as rax from 'retry-axios'
import { groupLog, TGroupLogProps } from '~/utils/groupLog'

const VITE_BASE_API_URL = import.meta.env.VITE_BASE_API_URL

type TRaxConfig = {
  // NOTE: Retry 5 times on requests that return a response (500, etc) before giving up. Defaults to 3.
  retry: number;
  // NOTE: Milliseconds to delay at first. Defaults to 100. Only considered when backoffType is 'static'
  retryDelay?: number;
  // NOTE: You can set the backoff type. Options are 'exponential' (default), 'static' or 'linear'
  backoffType: 'exponential' | 'static' | 'linear';
  // NOTE: Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
  noResponseRetries: number;
  // NOTE: HTTP methods to automatically retry.  Defaults to: ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT']
  httpMethodsToRetry: ('GET' | 'POST' | 'HEAD' | 'OPTIONS' | 'DELETE' | 'PUT')[];
  // NOTE: The response status codes to retry.  Supports a double array with a list of ranges.  Defaults to: [[100, 199], [429, 429], [500, 599]]
  statusCodesToRetry?: number[][];
  // NOTE: If you are using a non static instance of Axios you need to pass that instance here (const ax = axios.create())
  instance: AxiosInstance;
  // NOTE: You can detect when a retry is happening, and figure out how many retry attempts have been made
  onRetryAttempt: (err: any) => void;
  currentRetryAttempt?: number;
}

export type TAPIProps = {
  isDebugEnabled: boolean;
}

export class API {
  axiosInstance: AxiosInstance
  isDebugEnabled: boolean

  constructor({ isDebugEnabled }: TAPIProps) {
    this.isDebugEnabled = isDebugEnabled
    const axiosInstance = this.axiosInstance = axios.create({
      baseURL: VITE_BASE_API_URL,
      // timeout: 1000,
      // headers: { 'X-Custom-Header': 'foobar' },
    })
    axiosInstance.interceptors.request.use(
      (config) => {
        // NOTE: Do something before request is sent
        this.log({ namespace: 'API:axios-interceptor:req', items: [config] })
        return config;
      },
      (error) => {
        // NOTE: Do something with request error
        this.log({ namespace: 'API:axios-interceptor:req-err', items: [error] })
        return Promise.reject(error);
      },
    )
    axiosInstance.interceptors.response.use(
      (response) => {
        // NOTE: Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        this.log({ namespace: 'API:axios-interceptor:res', items: [response] })
        return response;
      },
      (error) => {
        // NOTE: Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        this.log({ namespace: 'API:axios-interceptor:res-err', items: [error] })
        return Promise.reject(error);
      },
    )

    // v1:
    // axiosRetry(this.axiosInstance, { retries: 5, retryDelay: axiosRetry.exponentialDelay })

    // v2:
    // @ts-ignore
    axiosInstance.defaults.raxConfig = {
      instance: axiosInstance,
      // NOTE: You can set the backoff type.
      // options are 'exponential' (default), 'static' or 'linear'
      backoffType: 'exponential',
      // NOTE: Retry 5 times on requests that return a response (500, etc) before giving up. Defaults to 3.
      retry: 5,
      // NOTE: Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
      noResponseRetries: 5,
      httpMethodsToRetry: ['GET', 'OPTIONS', 'POST'],
      // NOTE: You can detect when a retry is happening, and figure out how many
      // retry attempts have been made
      onRetryAttempt: (err: AxiosError) => {
        // NOTE: This interceptor has lower priority than axios interceptors
        const raxConfig: TRaxConfig = rax.getConfig(err)
        const msgs = [`Retry attempt #${raxConfig.currentRetryAttempt}`]

        try {
          const internalAxiosRequestConfig = err.config
          // console.log(internalAxiosRequestConfig?.baseURL)
          if (!internalAxiosRequestConfig?.url)
            throw new Error(`Ожидалось поле url (строка), получено: ${clsx(typeof internalAxiosRequestConfig?.url, `(${typeof internalAxiosRequestConfig?.url})`)}`)
          else
            msgs.push(internalAxiosRequestConfig?.url)
        } catch (__err: any) {
          msgs.push(`ERR: Не удалось проанализировать попытку запроса: ${__err.message || 'No err.message'}`)
          console.warn(__err)
        } finally {
          this.log({ namespace: 'API:rax', items: msgs })
        }
      },
    };
    // const _interceptorId = rax.attach(axiosInstance)
    // console.log(_interceptorId)
    rax.attach(axiosInstance)

    this.api = this.api.bind(this)
  }

  log(ps: TGroupLogProps) {
    if (this.isDebugEnabled) groupLog(ps)
  }

  universalAxiosResponseHandler(validator: (data: any) => boolean) {
    return (axiosRes: AxiosResponse) => {

      try {
        if (!validator(axiosRes)) {
          // console.log('- case 1: axiosRes')
          // console.log(axiosRes)
          return { isOk: false, res: axiosRes.data }
        }
        // console.log('- case 2: axiosRes')
        // console.log(axiosRes)
        return { isOk: true, res: axiosRes.data }
      } catch (err: any) {
        // console.log('- case 3: axiosRes')
        // console.log(axiosRes)
        return { isOk: false, res: axiosRes?.data || err, message: err.message || 'No err.message' }
      }
    }
  }

  // getErrorMsg(data: any) {
  //   return data?.message ? data?.message : 'Извините, что-то пошло не так'
  // }

  async api({ url, method, data, cancelToken }: { url: string; method: 'POST' | 'GET'; data?: any, cancelToken: CancelToken }): Promise<any> {
    const axioOpts: any = {
      method,
      url,
      // mode: 'cors',
      cancelToken,
    }
    if (data) axioOpts.data = data

    const result = await this.axiosInstance(axioOpts)
      // .then((res: any) => res)
      .then(
        this.universalAxiosResponseHandler(({ data }) => {
          // console.log(data)
          return data?.ok === true || data?.ok === false // NOTE: API like smartprice
        })
      )
      .catch((err: any) => {
        let _msg
        try {
          _msg = err?.toString()
        } catch (er: any) {
          _msg = `ERR: ${err?.message || er?.message || 'No er.message'}`
        }

        if (axios.isCancel(err)) {
          console.log('Request canceled', err.message)
        } else {
          // console.dir({ config: err?.response?.config })
          switch (true) {
            case err instanceof AxiosError:
              // console.log(err?.response)
              // return { isOk: false, message: err.message, res: err?.response?.data || { ok: false, message: _msg } }
              return {
                isOk: false,
                message: err.message,
                res: {
                  ok: false,
                  message: err.message,
                  url: err?.response?.config.url,
                },
              }
            default:
              return {
                isOk: false,
                message: err?.message,
                res: {
                  ok: false,
                  message: err?.message,
                  ...(err || { ok: false, message: _msg }),
                },
              }
          }
        }
        return {
          isOk: false,
          message: err.message || 'No err.message',
          res: {
            ...(err || { ok: false, message: _msg }),
          },
        }
      })

    // console.log(result) // { isOk: true, res: { ok: true, _originalBody: { username: 'pravosleva', chatId: 432590698 } } }

    return result.isOk ? Promise.resolve(result.res) : Promise.reject(result.res)
  }
}
