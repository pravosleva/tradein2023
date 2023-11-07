/* eslint-disable @typescript-eslint/ban-ts-comment */
import { groupLog } from './groupLog'
import { NEvents } from '~/types'

/* eslint-disable @typescript-eslint/no-explicit-any */
const PUBLIC_URL = '/static3' // process?.env?.PUBLIC_URL || '/static3'

// let _c = 0

type TProps = {
  noSharedWorkers?: boolean;
  isDebugEnabled?: boolean;
}

class Singleton {
  private static instance: Singleton
  metrixWorker: SharedWorker | Worker;
  noSharedWorkers: boolean | undefined;
  isDebugEnabled: boolean | undefined;

  private constructor({ noSharedWorkers, isDebugEnabled }: TProps) {
    this.noSharedWorkers = noSharedWorkers
    this.isDebugEnabled = isDebugEnabled
    switch (true) {
      case noSharedWorkers:
        this.metrixWorker = new Worker(`${PUBLIC_URL}/ww/dx.w.js`)

        // Etc.
        break
      default:
        this.metrixWorker = SharedWorker
          ? new SharedWorker(`${PUBLIC_URL}/ww/dx.sw.js`)
          : new Worker(`${PUBLIC_URL}/ww/dx.w.js`)
        if (this.metrixWorker instanceof SharedWorker) this.metrixWorker.port.start()

        // Etc.
        break
    }
  }
  public static getInstance(props: TProps): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton(props)

    return Singleton.instance
  }
  private log ({ label, msgs }: { label: string; msgs?: any[] }): void {
    if (this.isDebugEnabled) groupLog({ namespace: `-webWorkersInstance: ${label}`, items: msgs || [] })
  } 

  public subscribeOnData<T>({ wName, cb }: { wName: string; cb: (d: T) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #1`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].onmessage = cb
        break
      // @ts-ignore
      case this[wName] instanceof SharedWorker:
        // @ts-ignore
        this[wName].port.onmessage = cb
        break
      default:
        break
    }
  }

  public subscribeOnErr<T>({ wName, cb }: { wName: string; cb: (d: T) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #2`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].onmessageerror = cb
        break
      // @ts-ignore
      case this[wName] instanceof SharedWorker:
        // _c++
        // @ts-ignore
        this[wName].port.onmessageerror = cb
        break
      default:
        break
    }
  }

  public post<T>({ wName, eType, data }: { wName: string; eType: string; data: T; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #3`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].post({ __eType: eType, ...data })
        break
      // @ts-ignore
      case this[wName] instanceof SharedWorker:
        this.log({ label: 'before post to sw...' })
        // @ts-ignore
        // console.log(typeof this[wName])
        // console.log(this[wName].port)
        // @ts-ignore
        this[wName].port.postMessage({ __eType: eType, ...data })
        break
      default:
        break
    }
  }

  public terminate({ wName, cb }: { wName: string; cb?: (d: any) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #4`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].terminate()
        if (cb) cb({ ok: true })
        break
      // @ts-ignore
      case this[wName] instanceof SharedWorker:
        // @ts-ignore
        this[wName].port.postMessage({ __eType: NEvents.ESharedWorkerCustom.CLIENT_TO_WORKER_DIE })
        break
      default:
        break
    }
  }
}

export const wws = Singleton.getInstance({
  noSharedWorkers: false,
  isDebugEnabled: true,
})
