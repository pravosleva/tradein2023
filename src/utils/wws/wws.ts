/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NEvents } from '~/types'
import { groupLog } from '../groupLog'
import pkg from '../../../package.json'
import { NViDevtools, vi } from '~/common/vi'
import structuredClone from '@ungap/structured-clone'
import { EReportType } from './types'
import { EStep } from '~/common/xstate/stepMachine'

/* eslint-disable @typescript-eslint/no-explicit-any */
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL
const PUBLIC_URL = VITE_PUBLIC_URL ? `${VITE_PUBLIC_URL}/static3/common` : '/static3/common' // process?.env?.PUBLIC_URL || '/static3'
const VITE_GIT_SHA1 = import.meta.env.VITE_GIT_SHA1

// let _c = 0

type TProps = {
  noSharedWorkers?: boolean;
  isDebugEnabled?: boolean;
}
type TTsListItem = {
  descr: string;
  p: number;
  ts: number;
  label: string;
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
        this.metrixWorker = new Worker(`${PUBLIC_URL}/web-workers/dx.worker.js?ts=${new Date().getTime()}&v=${pkg.version}&gitSHA1=${VITE_GIT_SHA1}`)

        // Etc.
        break
      default:
        this.metrixWorker = typeof SharedWorker !== 'undefined'
          ? new SharedWorker(`${PUBLIC_URL}/web-workers/dx.shared-worker.js?ts=${new Date().getTime()}&v=${pkg.version}&gitSHA1=${VITE_GIT_SHA1}`)
          : new Worker(`${PUBLIC_URL}/web-workers/dx.worker.js?ts=${new Date().getTime()}&v=${pkg.version}&gitSHA1=${VITE_GIT_SHA1}`)
        if (typeof SharedWorker !== 'undefined' && this.metrixWorker instanceof SharedWorker) this.metrixWorker.port.start()

        // Etc.
        break
    }
  }
  public static getInstance(props: TProps): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton(props)

    return Singleton.instance
  }
  private log({ label, msgs }: { label: string; msgs?: any[] }): void {
    if (this.isDebugEnabled) groupLog({ namespace: `-webWorkersInstance: ${label}`, items: msgs || [] })
  }

  public subscribeOnData<T>({ wName, cb }: { wName: string; cb: (d: T) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #wws:1`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].onmessage = cb
        break
      // @ts-ignore
      case typeof SharedWorker !== 'undefined' && this[wName] instanceof SharedWorker:
        // @ts-ignore
        this[wName].port.onmessage = cb
        break
      default:
        break
    }
  }

  public subscribeOnErr<T>({ wName, cb }: { wName: string; cb: (d: T) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #wws:2`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].onmessageerror = cb
        break
      // @ts-ignore
      case typeof SharedWorker !== 'undefined' && this[wName] instanceof SharedWorker:
        // _c++
        // @ts-ignore
        this[wName].port.onmessageerror = cb
        break
      default:
        break
    }
  }

  public post<T>(e: { wName: string; eType: string; data?: T; }) {
    const { wName, eType, data } = e
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #wws:3`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].postMessage({ __eType: eType, ...data })
        break
      // @ts-ignore
      case this[wName] instanceof SharedWorker:
        this.log({ label: 'before post to sw...', msgs: [e] })
        // @ts-ignore
        this[wName].port.postMessage({ __eType: eType, ...data })
        break
      default:
        break
    }
  }

  public terminate({ wName, cb }: { wName: string; cb?: (d: any) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #wws:4`)

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

  public resetHistory({ wName }: { wName: string; }): void {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #wws:5`)

    this.post<{ tsList: TTsListItem[] }>({
      wName,
      eType: NEvents.ECustom.CLIENT_TO_WORKER_RESET_HISTORY,
    })
  }
  public resetMxHistory() {
    this.resetHistory({ wName: 'metrixWorker' })
  }

  public sendTheFullHistoryReport({ comment, network }: {
    comment: string;
    network: NViDevtools.TNetwork;
  }): Promise<{ ok: boolean; message?: string; }> {
    try {
      if (!vi.common.stateValue)
        throw new Error('Отправка истории на данном этапе не предусмотрена (значение vi.common.stateValue не определено) #wws:6')

      this.post<{
        input: {
          ts: number;
          room: string;
          metrixEventType: NEvents.EMetrixClientOutgoing;
          reportType: EReportType;
          stateValue: EStep;
          app: {
            name: string;
            version: string;
          };
          stepDetails?: {
            [key: string]: any;
            comment: string;
            network: NViDevtools.TNetwork;
          };
          gitSHA1: string;
          uniquePageLoadKey: string;
          uniqueUserDataLoadKey: string;
        }
      }>({
        wName: 'metrixWorker',
        eType: NEvents.ECustom.CLIENT_TO_WORKER_MESSAGE,
        data: {
          input: {
            ts: new Date().getTime(),
            room: 'FOR_EXAMPLE',
            metrixEventType: NEvents.EMetrixClientOutgoing.SP_HISTORY_REPORT_EV,
            reportType: EReportType.WARNING,
            stateValue: vi.common.stateValue,
            app: {
              name: vi.common.app.name,
              version: vi.common.app.version,
            },
            stepDetails: {
              comment,
              network: structuredClone(network, { lossy: true, json: true }),
            },
            gitSHA1: VITE_GIT_SHA1,
            uniquePageLoadKey: vi.uniquePageLoadKey,
            uniqueUserDataLoadKey: vi.uniqueUserDataLoadKey,
          },
        },
      })

      return Promise.resolve({ ok: true, message: 'Sent to Worker' })
    } catch (err: any) {
      if (this.isDebugEnabled) groupLog({ namespace: 'wws err', items: [err] })

      return Promise.reject({ ok: false, message: err?.message || 'No err.message' })
    }
  }
}

export const wws = Singleton.getInstance({
  noSharedWorkers: false,
  isDebugEnabled: false,
})
