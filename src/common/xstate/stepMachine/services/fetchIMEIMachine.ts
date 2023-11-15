/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { EErrCode, TStepMachineContextFormat } from '~/common/xstate/stepMachine'
import { getReadableSnakeCase } from '~/utils/aux-ops'
import { httpClient } from '~/utils/httpClient'

export const fetchIMEIMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<any> => {
  // NOTE: thats received data from states[EStep.SendImei].invoke.data (for example)
  // console.log(_invMeta.data)
  const cleanupImeiStep = () => {
    context.imei.response = null
    context.imei.uiMsg = null
    context.imei.result.state = 'pending'
  }
  cleanupImeiStep()
  const cleanupEnterMemoryAndColorStep = () => {
    context.memory.selectedItem = null
    context.color.selectedItem = null
  }
  cleanupEnterMemoryAndColorStep()

  const res = await httpClient.sendIMEI({
    IMEI: context.imei.value,
    responseValidator: ({ res }) => res.ok && !!res?.phone?.color_choices
  })
    .catch((err) => {
      return { ok: false, ...(err || { ok: false, message: err?.message || EErrCode.ERR4 }) }
    })

  if (res.ok) {
    context.imei.result.state = 'success'

    // -- NOTE: Set anything to state.context
    // 1. Reset dynamic lists (Col: Will be update when memoryList will be selected; Mem: too)
    context.color.dynamicList = []
    context.memory.dynamicList = []
    // 2. Set memoryList from response
    try {
      // ---
      // TODO: Check color_choices
      // 2.1 Incorrect res.phone?.color_choices
      // ---
      const memoryList = Object.keys(res.phone?.color_choices)
      context.imei.result.memoryList = memoryList.map((value) => ({ id: value, value, label: value.toUpperCase() }))
    } catch (err: any) {
      context.imei.result.state = 'error'
      return Promise.reject(new Error(`${EErrCode.ERR5}: res.ok But! Не удалось составить список memoryList: ${err?.message || 'No err?.message'}`))
    }
    // ---
    // TODO: Обработка ошибочных кейсов
    // 3.1 Память определена: Формируем список выбора цветов
    if (res.phone.memory) {
      if (!res.phone.color_choices[res.phone.memory]) return Promise.reject({ ok: false, message: `Неконсистентный ответ: нет выбора цвета для памяти ${res.phone.memory}` })
      context.color.dynamicList = res.phone.color_choices[res.phone.memory].map((value: string) => ({ id: value, label: getReadableSnakeCase(value), value }))
    }
    // 3.2 Цвет определен, память - нет: Формируем выбор памяти
    if (res.phone.color && !res.phone.memory) {
      if (!res.phone.memory_choices) return Promise.reject({ ok: false, message: 'Неконсистентный ответ: нет выбора памяти' })
      const memoryDynamicList = []
      for (const memory in res.phone.color_choices) {
        const _list = res.phone.color_choices[memory]
        if (_list.includes(res.phone.color)) memoryDynamicList.push({ id: memory, value: memory, label: memory.toUpperCase() })
      }
      if (memoryDynamicList.length === 0) return Promise.reject({ ok: false, message: `Неконсистентный ответ: не удалось сформировать список выбора памяти для цвета ${res.phone.color}` })
      context.memory.dynamicList = memoryDynamicList
    }
    // ---
    // --

    return Promise.resolve(res)
  }

  context.imei.result.state = 'error'
  return Promise.reject(res)
}
