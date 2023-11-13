/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios, { AxiosError, AxiosInstance, AxiosResponse, CancelToken } from 'axios'
// import axiosRetry from 'axios-retry'
// @ts-ignore
import * as rax from 'retry-axios'

const VITE_BASE_API_URL = import.meta.env.VITE_BASE_API_URL

export class Api {
  axiosInstance: AxiosInstance

  constructor() {
    const axiosInstance = this.axiosInstance = axios.create({
      baseURL: VITE_BASE_API_URL,
      // timeout: 1000,
      // headers: { 'X-Custom-Header': 'foobar' },
    })
    // v1:
    // axiosRetry(this.axiosInstance, { retries: 5, retryDelay: axiosRetry.exponentialDelay })

    // v2:
    // @ts-ignore
    axiosInstance.defaults.raxConfig = {
      instance: axiosInstance,
      // You can set the backoff type.
      // options are 'exponential' (default), 'static' or 'linear'
      backoffType: 'exponential',
      // Retry 5 times on requests that return a response (500, etc) before giving up. Defaults to 3.
      retry: 5,
      // Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
      noResponseRetries: 5,
      httpMethodsToRetry: ['GET', 'OPTIONS', 'POST'],
      // You can detect when a retry is happening, and figure out how many
      // retry attempts have been made
      onRetryAttempt: (err: any) => {
        const cfg: any = rax.getConfig(err)
        console.log(`Retry attempt #${cfg.currentRetryAttempt}`)
      },
    };
    // const _interceptorId = rax.attach(axiosInstance)
    // console.log(_interceptorId)
    rax.attach(axiosInstance)

    this.api = this.api.bind(this)
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
          // console.dir({ err })
          switch (true) {
            case err instanceof AxiosError:
              return { isOk: false, message: err.message, res: { ...(err?.response?.data || { ok: false, message: _msg }) } }
            default:
              return { isOk: false, message: err?.message, res: { ok: false, message: err?.message, ...(err || { ok: false, message: _msg }) } }
          }
        }
        return { isOk: false, message: err.message || 'No err.message', res: { ...(err || { ok: false, message: _msg }) } }
      })

    // console.log(result) // { isOk: true, res: { ok: true, _originalBody: { username: 'pravosleva', chatId: 432590698 } } }

    return result.isOk ? Promise.resolve(result.res) : Promise.reject(result.res)
  }
}
