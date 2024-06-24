/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { AnyEventObject, InvokeMeta } from 'xstate'
import {
  // EAppModeMenu1,
  EErrCode,
  TStepMachineContextFormat,
} from '~/common/xstate/stepMachine'
import { getReadableSnakeCase } from '~/utils/aux-ops'
import { NResponseValidate, httpClient, NSP } from '~/utils/httpClient'
import { vi } from '~/common/vi'
import clsx from 'clsx'
// import { checkByEmployeeCfg, checkDeviceCfg, checkDeviceDefectsCfg, pickUpDeviceCfg } from './ui-cfg'
// import { TListboxProps } from '~/common/components/tailwind/Listbox'

export const fetchIMEIMachine = async (context: TStepMachineContextFormat, _ev: AnyEventObject, _invMeta: InvokeMeta): Promise<NResponseValidate.TResult<NSP.TImeiResponse>> => {
  // if (!context.appMode.currentMode) {
  //   const message = [
  //     'Ошибка валидации перед запросом',
  //     'Режим appMode должен быть определен до отправки IMEI received',
  //     `Текущее значение: ${context.appMode.currentMode || 'empty'} (${typeof context.appMode.currentMode})`,
  //     'Возможные причины: 1) Забыли обновить значение при выборе режима (скорее всего); 2) xstate (маловероятно)',
  //     '(frontend only)',
  //   ].join(' // ')
  //   return Promise.reject({
  //     ok: false,
  //     message,
  //   })
  // }
  
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
    // mts_tradein_mode: context.appMode.currentMode,
    rules: {
      go_to_final_step: {
        isRequired: false,
        validate: (val, fullResponse) => {
          const res: NResponseValidate.TResult<NSP.TImeiResponse> = { ok: true }
          switch (true) {
            case typeof val !== 'boolean':
              res.ok = false
              res.message = 'Поле должно соответствовать логическому типу данных'
              break
            case val === true:
              if (val === true) {
                const _msgs = []
                if (!fullResponse?.condition) {
                  _msgs.push(
                    `В случае { "go_to_final_step": true }, ответ должен содержать непустое поле "condition", получено ${clsx(fullResponse?.condition || 'empty', `(${typeof fullResponse?.condition})`)}`
                  )
                }
                if (!fullResponse?.condition_limit_reason) {
                  _msgs.push(
                    `В случае { "go_to_final_step": true }, ответ должен содержать непустое поле "condition_limit_reason", получено ${clsx(fullResponse?.condition_limit_reason || 'empty', `(${typeof fullResponse?.condition_limit_reason})`)}`
                  )
                }
                if (_msgs.length > 0) {
                  res.ok = false
                  res.message = _msgs.join('; ')
                  res._showDetailsInUi = true
                }
              }
              break
            default:
              break
          }
          return res
        }
      },
      id: {
        isRequired: true,
        validate: (val) => {
          const res: NResponseValidate.TResult<NSP.TImeiResponse> = { ok: true }
          switch (true) {
            case typeof val !== 'number':
              res.ok = false
              res.message = 'Поле должно быть числом'
              break
            case typeof val === 'number' && val <= 0:
              res.ok = false
              res.message = 'Поле должно быть положительным числом'
              break
            default:
              break
          }
          return res
        }
      },
      phone: {
        isRequired: true,
        validate: (val) => {
          // NOTE: Обработка ошибочных кейсов
          const subfieldsForCheck = [
            // -- NOTE: Unnecessary for mtsmain
            'color_choices',
            'memory_choices',
            // --
            // -- NOTE: Может быть закомментирировано на время демонстраций для mtsmain
            // 'color',
            // 'memory',
            // --
            'vendor',
            'type',
            'model',
          ]
          const res: NResponseValidate.TResult<NSP.TImeiResponse> = { ok: true }
          const msgs = []
          for (const key of subfieldsForCheck) {
            switch (key) {
              // case 'color':
              // case 'memory':
              //   switch (vi.smState.appMode.currentMode) {
              //     case EAppModeMenu1.PODPISKA_MTS:
              //       if (!val?.[key]) msgs.push(`Не получено поле "${key}". Вместо этого получено: ${clsx(val?.[key], `(тип ${typeof val?.[key]})`)}`)
              //       break
              //     case EAppModeMenu1.CLASSIC_TRADEIN:
              //       switch (key) {
              //         case 'memory':
              //           if ((!!val?.memory && !val?.color) && !val?.color_choices?.[val.memory])
              //             msgs.push([
              //               `Неконсистентный ответ: нет выбора цвета для памяти "${val?.memory}"`,
              //               'Данная память не обнаружена в объекте val?.color_choices -> Ожидаемый результат: не сможем предложить список опций для выбора цвета на шаге с выбором цвета',
              //             ].join('. '))
              //           break
              //         default:
              //           break
              //       }
              //       break
              //     default:
              //       break
              //   }
              //   break
              case 'vendor':
              case 'type':
              case 'model':
                if (!val?.[key]) msgs.push(`Не получено поле "${key}". Вместо этого получено: ${clsx(val?.[key], `(тип ${typeof val?.[key]})`)} -> Ожидаемый результат: недостаточно данных для отображения`)
                break
              case 'color_choices': {
                // ---
                // NOTE: Check color_choices
                // 2.1 Incorrect res.phone?.color_choices for detected color
                // ---
                switch (true) {
                  case !!val?.memory && !val?.color:
                    if (!val?.color_choices) msgs.push(`Неконсистентный ответ: некорректное поле "color_choices" (получен тип ${typeof val?.color_choices})`)
                    else if (!val?.color_choices[val?.memory]) {
                      const _msgs = []
                      _msgs.push(`Неконсистентный ответ: в поле "color_choices" не обнаружен список цветов, соответствующий значению памяти "${val?.memory}"`)
                      _msgs.push(`Значение memory "${val?.memory}", определенное на сервере как память устройства, является нестандартным для объекта "color_choices" с ключами "${Object.keys(val?.color_choices).join(', ')}"`)
                      msgs.push(_msgs.join('. '))
                      res._showDetailsInUi = true
                    }
                    break
                  case !val?.memory && !!val?.color:
                    if (!val?.color_choices)
                      msgs.push(`Неконсистентный ответ: некорректное поле "color_choices" (получен тип ${typeof val?.color_choices}). Объект "color_choices" необходим для формирования списка для выбора памяти, соответствующей цвету "${val.color}"`)
                    break
                  case !val?.memory:
                    if (!val?.color_choices)
                      msgs.push('Неконсистентный ответ: объект "color_choices" не обнаружен -> Ожидаемый результат: Не сможем сформировать список опций для выбора памяти')
                    break
                  default:
                    break
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
                    msgs.push([
                      'Неконсистентный ответ: некорректное поле "memory_choices"',
                      `(получен тип ${typeof val?.memory_choices}, ожидался список строк)`,
                    ].join(' '))
                  else if (val?.color_choices) {
                    const memoryDynamicList = []
                    for (const memory in val.color_choices) {
                      const _list = val.color_choices[memory]
                      if (_list.includes(val.color)) memoryDynamicList.push({ id: memory, value: memory, label: memory.toUpperCase() })
                    }
                    if (memoryDynamicList.length === 0) {
                      msgs.push(`Ожидаемый результат: не сможем сформировать список опций для выбора памяти устройства для цвета "${val.color}" <- Ни один из списков "color_choices[memory]" не содержит цвет "${val.color}"`)
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
            res.message = `Результат проверки поля "res.phone" -> ${msgs.join('; ')}`
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
            case !val:
              msgs.push(`Значение поля должно быть объектом, получено: ${val || 'empty'} (${typeof val})`)
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
            res.message = `Результат проверки поля "res.possible_prices" -> ${msgs.join('; ')}`
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

  vi.setImeiStepResponse({ res, reqState: res.ok ? 'success' : 'error' })

  if (res.ok) {
    context.imei.result.state = 'success'

    // -- NOTE: Set anything to state.context
    // 1. Reset dynamic lists (Col: Will be update when memoryList will be selected; Mem: too)
    context.color.dynamicList = []
    context.memory.dynamicList = []
    // 2. Set memoryList from response

    // --- NOTE: Если память не пришла, ее нужно будет предложить выбрать
    if (!res.phone.memory) {
      try {
        const memoryList = Object.keys(res.phone?.color_choices)
        context.imei.result.memoryList = memoryList.map((value) => ({ id: value, value, label: value.toUpperCase() }))
      } catch (err: any) {
        context.imei.result.state = 'error'
        return Promise.reject(new Error(`${EErrCode.ERR5} res.ok BUT! Не удалось составить список memoryList из объекта "res.phone?.color_choices" <- ${err?.message || 'No err?.message'}`))
      }
    }
    // ---
    
    // --- 3. Mutate context (special computed results)
    // 3.1 Память определена: Формируем список выбора цветов
    if (!!res.phone?.memory && !res.phone?.color) {
      context.color.dynamicList = res.phone.color_choices[res.phone.memory].map((value: string) => ({ id: value, label: getReadableSnakeCase(value), value }))
    }
    // 3.2 Цвет определен, память - нет: Формируем выбор памяти
    if (!!res.phone.color && !res.phone.memory) {
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

    // -- NOTE: Опросник для шага "Проверка сотрудником" (Подписка)
    // const { vendor } = res.phone
    // const targetCheckByEmployeeConfig = vendor
    //   ? checkByEmployeeCfg[vendor] || checkByEmployeeCfg.DEFAULT
    //   : checkByEmployeeCfg.DEFAULT

    // context.checkByEmployee.targetConfig = targetCheckByEmployeeConfig
    // --

    // -- NOTE: Опросник для шага "Проверьте устройство" (Trade-In)
    // const targetCheckDeviceConfig = vendor
    //   ? checkDeviceCfg[vendor] || checkDeviceCfg.DEFAULT
    //   : checkDeviceCfg.DEFAULT

    // context.checkDevice.targetConfig = targetCheckDeviceConfig
    // --

    // -- NOTE: Опросник для шага "Проверьте дефекты устройства" (Trade-In)
    // const targetCheckDeviceDefectsConfig = vendor
    //   ? checkDeviceDefectsCfg[vendor] || checkDeviceDefectsCfg.DEFAULT
    //   : checkDeviceDefectsCfg.DEFAULT

    // context.checkDeviceDefects.targetConfig = targetCheckDeviceDefectsConfig
    // --

    // -- NOTE: Опросник для шага "Заберите устройство" (Trade-In)
    // const targetPickUpDeviceDefectsConfig = vendor
    //   ? pickUpDeviceCfg[vendor] || pickUpDeviceCfg.DEFAULT
    //   : pickUpDeviceCfg.DEFAULT

    // context.pickUpDevice.targetConfig = targetPickUpDeviceDefectsConfig
    // --

    return Promise.resolve(res)
  }

  context.imei.result.state = 'error'
  return Promise.reject(res)
}
