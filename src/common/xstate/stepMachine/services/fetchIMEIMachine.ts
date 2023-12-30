/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import { EErrCode, TStepMachineContextFormat } from '~/common/xstate/stepMachine'
import { getReadableSnakeCase } from '~/utils/aux-ops'
import { NResponseValidate, httpClient, NSP } from '~/utils/httpClient'
import { vi } from '~/common/vi'

export const fetchIMEIMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<NResponseValidate.TResult<NSP.TImeiResponse>> => {
  // NOTE: thats received data from states[EStep.SendImei].invoke.data (for example)
  // console.log(_invMeta.data)
  const cleanupImeiStep = () => {
    context.imei.response = null // NOTE: Больше поле response здесь не мутируем!
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
    rules: {
      phone: {
        isRequired: true,
        validate: (val) => {
          // NOTE: Обработка ошибочных кейсов
          const subfieldsForCheck = [
            'color_choices',
            'memory_choices',
          ]
          const res: NResponseValidate.TResult<NSP.TImeiResponse> = { ok: true }
          const msgs = []
          for (const key of subfieldsForCheck) {
            switch (key) {
              // case 'memory': {
              //   if (!!val?.memory && !val?.color_choices[val.memory])
              //     msgs.push(`Неконсистентный ответ: нет выбора цвета для памяти "${val?.memory}"`)
              //   break
              // }
              case 'color_choices': {
                // ---
                // NOTE: Check color_choices
                // 2.1 Incorrect res.phone?.color_choices for detected color
                // ---
                if (
                  val?.memory
                  // && !val?.color
                ) {
                  if (!val?.color_choices) msgs.push(`Неконсистентный ответ: некорректное поле color_choices (получен тип ${typeof val?.color_choices})`)
                  else if (!val?.color_choices[val?.memory]) {
                    const _msgs = []
                    _msgs.push(`Неконсистентный ответ: в поле color_choices нет списка выбора опций для памяти "${val?.memory}"`)
                    _msgs.push(`(значение memory "${val?.memory}", определенное на сервере как память устройства, является нестандартным для объекта color_choices с ключами "${Object.keys(val?.color_choices).join(', ')}")`)
                    msgs.push(_msgs.join(' '))
                    res._showDetailsInUi = true
                  }
                }
                break
              }
              case 'memory_choices': {
                if (!!val?.color && !val?.memory) {
                  if (
                    !val?.memory_choices
                    || !Array.isArray(val.memory_choices)
                    || val.memory_choices.length === 0
                  )
                    msgs.push(`Неконсистентный ответ: некорректное поле memory_choices (получен тип ${typeof val?.memory_choices}, должен быть список строк)`)
                  else if (val?.color_choices) {
                    const memoryDynamicList = []
                    for (const memory in val.color_choices) {
                      const _list = val.color_choices[memory]
                      if (_list.includes(val.color)) memoryDynamicList.push({ id: memory, value: memory, label: memory.toUpperCase() })
                    }
                    if (memoryDynamicList.length === 0) {
                      msgs.push(`Неконсистентный ответ: не сможем сформировать список опций для выбора памяти устройства для цвета "${val.color}" (ни один из списков color_choices[memory] не содержит цвет "${val.color}")`)
                      res._showDetailsInUi = true
                    }
                  }
                }
                break
              }
              default:
                break
            }
          }

          if (msgs.length > 0) {
            res.ok = false
            res.message = `Результат проверки поля res.phone -> ${msgs.join(', ')}`
          }
          return res
        },
      },
      possible_prices: {
        isRequired: true,
        validate: (val, _fullResponse) => {
          const res: NResponseValidate.TResult<NSP.TImeiResponse>  = { ok: true }
          const msgs = []

          switch (true) {
            case typeof val !== 'object':
              msgs.push('Значение поля должно быть объектом')
              break
            case Object.keys(val).length === 0:
              msgs.push('Объект не должен быть пустым')
              break
            default: {
              for (const condition in NSP.ECondition) {
                if (!val[condition]) msgs.push(`Ожидаемое содержимое не содержит ключ "${condition}" для отображения в таблице Предварительных скидок`)
              }

              // TODO? Можно проверить консистентность possible_prices c fullResponse.phone.color,
              // т.к. на след. шаге будет показана таблица с ценниками для минимального набора состояний NSP.ECondition
              break
            }
          }

          if (msgs.length > 0) {
            res.ok = false
            res.message = `Результат проверки поля res.possible_prices -> ${msgs.join(', ')}`
          }
          return res
        },
      },
      // TODO?: possible_subsidies
      // Можно проверить консистентность possible_subsidies,
      // что будет передано в таблицу под originalDataCases?.subsidiesStruct?.subsidies
    },
  })
    .catch((err) => {
      return {
        ok: false,
        message: err?.message || EErrCode.ERR4,
        ...(err || { message: err?.message || EErrCode.ERR4 }),
      }
    })

  vi.setImeiStepResponse(res)

  if (res.ok) {
    context.imei.result.state = 'success'

    // -- NOTE: Set anything to state.context
    // 1. Reset dynamic lists (Col: Will be update when memoryList will be selected; Mem: too)
    context.color.dynamicList = []
    context.memory.dynamicList = []
    // 2. Set memoryList from response

    try {
      const memoryList = Object.keys(res.phone?.color_choices)
      context.imei.result.memoryList = memoryList.map((value) => ({ id: value, value, label: value.toUpperCase() }))
    } catch (err: any) {
      context.imei.result.state = 'error'
      return Promise.reject(new Error(`${EErrCode.ERR5} res.ok BUT! Не удалось составить список memoryList <- ${err?.message || 'No err?.message'}`))
    }
    // --- 3. Mutate context (special computed results)
    // 3.1 Память определена: Формируем список выбора цветов
    if (res.phone.memory) {
      context.color.dynamicList = res.phone.color_choices[res.phone.memory].map((value: string) => ({ id: value, label: getReadableSnakeCase(value), value }))
    }
    // 3.2 Цвет определен, память - нет: Формируем выбор памяти
    if (res.phone.color && !res.phone.memory) {
      const memoryDynamicList = []
      for (const memory in res.phone.color_choices) {
        const _list = res.phone.color_choices[memory]
        if (_list.includes(res.phone.color)) memoryDynamicList.push({ id: memory, value: memory, label: memory.toUpperCase() })
      }
      // ---- NOTE: В этот кейс уже не попадем (see validation above)
      // if (memoryDynamicList.length === 0) return Promise.reject({
      //   ok: false,
      //   message: `Не удалось сформировать список выбора памяти для цвета "${res.phone.color}"`,
      //   _fromServer: res,
      //   _showDetailsInUi: true,
      // })
      // ----
      context.memory.dynamicList = memoryDynamicList
    }
    // ---
    // --

    return Promise.resolve(res)
  }

  context.imei.result.state = 'error'
  return Promise.reject(res)
}
