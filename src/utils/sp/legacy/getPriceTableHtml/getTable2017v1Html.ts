/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCfg, TDataCases } from './types'
import clsx from 'clsx'
import { groupLog } from '~/utils';
import { getFormattedPrice } from '~/utils/aux-ops'

type TProps = {
  // classNameStr: string;
  classNameMap?: {
    tablesWrapper?: {
      main: string;
    };
    table: {
      main: string;
      thead: {
        main: string;
        tr: {
          th: string;
        };
        
      };
      tbody: {
        tr: {
          main: string;
          th: string;
          td: string;
          numCell?: string;
        };
      };
    };
  };
  cfg: TCfg;
  originalDataCases: TDataCases;
}

const getCurrencySymbol = (cur: string) => {
    const mapping: any = {
      RUB: { value: '₽', title: 'Российский рубль' },
      BYN: { value: 'Br', title: 'Белорусский рубль' },
      KZT: { value: '₸', title: 'Казахстанский тенге' },
    }
    return mapping[cur]?.value || cur
  }
  const prettyPrice = (v: number): string => getFormattedPrice(v, 0, ' ', ' ')

export const getTable2017v1Html = ({ cfg, originalDataCases, classNameMap }: TProps): string => {
  const memory = cfg.memory || 'NO_MEMORY'
  const color = cfg.color || 'NO_COLOR'

  const getColumnSubHeader = (cond: string) => {
    const item = cfg.possibleConditionCodes.find(({ value }) => value === cond)
    return item?.label || cond
  }
  // const getClassesStr = (className) => {
  //   switch (true) {
  //     case Array.isArray(className):
  //       return className.filter((c) => typeof c === 'string').join(' ')
  //     case !className:
  //     default:
  //       return ''
  //   }
  // }
  // const classNameStr = getClassesStr(cfg.tableClassName)
  let html: string = ''

  if (originalDataCases.possiblePricesStruct.prices) {
    try {
      const priceMapping: {
        [key: string]: {
          isOk: boolean;
          value: number;
          message?: string;
        };
      } = Object.values(cfg.enabledConditionsCodes).reduce((acc: any, key: string) => {
        if (originalDataCases.possiblePricesStruct.prices[key]?.[memory]?.[color])
          acc[key] = {
            isOk: true,
            value: originalDataCases.possiblePricesStruct.prices[key][memory][color]
          }
        else acc[key] = {
          isOk: false,
          value: 0,
          message: `Unknown case for imeiResponse.possible_prices[${key}]?.[${memory}]?.[${color}]`, // `!originalDataCases.possiblePricesStruct.prices[${key}]?.[${memory}]?.[${color}]`
        }
        return acc
      }, {})

      html += `
<table${classNameMap?.table.main ? ` class="${classNameMap?.table.main}"` : ''}>
  <thead${classNameMap ? ` class="${classNameMap.table.thead.main}"` : ''}>
    <tr>
      <th colspan="${cfg.enabledConditionsCodes.length + 1}"${classNameMap ? ` class="${classNameMap.table.thead.tr.th}"` : ''}>
        ${originalDataCases.possiblePricesStruct.tableHeader}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
      <th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}></th>
      <th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}>
        ${cfg.enabledConditionsCodes.map(getColumnSubHeader).join(`</th><th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}>`)}
      </th>
    </tr>
    <tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
      <td${classNameMap ? ` class="${classNameMap.table.tbody.tr.td}"` : ''}>
        <b>Цена SmartPrice</b>
      </td>
      <td${classNameMap ? ` class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}>
        ${Object.keys(priceMapping)
          .map((cond) =>
              `${
                priceMapping[cond].isOk
                ? `${prettyPrice(priceMapping[cond].value)} ${getCurrencySymbol(cfg.currency)}`
                : `<span title="${priceMapping[cond].message}" class="text-red-500">ERR</span>`
            }`)
          .join(`</td><td${classNameMap ? ` class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}>`)}
      </td>
    </tr>
  </tbody>
</table>
`
    } catch (err) {
      console.log('- - -')
      console.log(err)
      console.log('- - -')
    }
  }

  if (originalDataCases?.subsidiesStruct?.subsidies) {
    const priceMapping: {
      [key: string]: {
        isOk: boolean;
        value: number;
        message?: string;
      };
    } = Object.values(cfg.enabledConditionsCodes).reduce((acc: any, key: string) => {
      if (originalDataCases.subsidiesStruct.prices[key]?.[memory]?.[color])
        acc[key] = {
          isOk: true,
          value: originalDataCases.subsidiesStruct.prices[key][memory][color]
        }
      else acc[key] = {
        isOk: false,
        value: 0,
        message: `Unknown case #2 for imeiResponse.possible_subsidies[${key}]?.[${memory}]?.[${color}]`
      }

      return acc
    }, {})

    let tbody = ''
    try {
      tbody = originalDataCases.subsidiesStruct.subsidies
        .map((item) => {
          try {
            if (
              !!originalDataCases.subsidiesStruct.itemValidation &&
              !originalDataCases.subsidiesStruct.itemValidation(item)
            )
              return ''

            const { title, prices } = item // vendor, model,

            try {
              if (!prices?.[memory]?.[color]) throw new Error(`🚫 Не существует комбинации prices?.[${memory}]?.[${color}] для ${title}`)
              else if (
                originalDataCases.subsidiesStruct.noAllZeroSubsidies &&
                Object.values(prices[memory][color]).every((val) => !val)
              )
                return ''
            } catch (err: any) {
              groupLog({
                namespace: err.message || 'ERR#2',
                items: [
                  `Incorrect data for ${cfg.memory} ${cfg.color}`,
                  prices,
                  err,
                ]
              })
              return '' // `<tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}><td>ERR for ${cfg.color}</td></tr>`
            }

            return `
    <tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
      <td${classNameMap ? ` class="${classNameMap.table.tbody.tr.td}"` : ''}>${title}</td>
      <td${classNameMap ? `
        class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}
      >
        ${cfg.enabledConditionsCodes
          .map(
            (enabledCond) =>
              `${prettyPrice(
                prices[memory][color][enabledCond] +
                  (originalDataCases.subsidiesStruct.price || priceMapping[enabledCond].value)
              )} ${getCurrencySymbol(cfg.currency)}${!priceMapping[enabledCond].isOk ? `<span class="text-red-500" title="${priceMapping[enabledCond].message}">ERR #2</span>` : ''}`
          )
          .join(`</td><td${classNameMap ? ` class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}>`)}
      </td>
    </tr>`
          } catch (err) {
            return ''
          }
        })
        .join('')
    } catch (err) {
      // console.warn(err)
    }

    if (tbody)
      html += `
<table${classNameMap?.table.main ? ` class="${classNameMap?.table.main}"` : ''}>
  <thead${classNameMap ? ` class="${classNameMap.table.thead.main}"` : ''}>
    <tr>
      <th colspan="${cfg.enabledConditionsCodes.length + 1}"${classNameMap ? ` class="${classNameMap.table.thead.tr.th}"` : ''}>
        ${originalDataCases.subsidiesStruct.tableHeader}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
      <th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}></th>
      <th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}>
        ${
          cfg.enabledConditionsCodes.map(getColumnSubHeader)
            .join(`</th><th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}>`)
        }
      </th>
    </tr>
    ${tbody}
  </tbody>
</table>`
  }

  if (originalDataCases.subsidiesStruct2?.subsidies) {
    // if (!originalDataCases?.subsidiesStruct2?.price)
    //   throw new Error('Missing param: !originalDataCases?.subsidiesStruct2?.price')

    const tbody = originalDataCases.subsidiesStruct2.subsidies
      .map((item: any) => {
        // NOTE: { title: string; vendor: string; model; price: number }
        if (
          !!originalDataCases.subsidiesStruct2?.itemValidation &&
          !originalDataCases.subsidiesStruct2?.itemValidation(item)
        )
          return ''

        if (originalDataCases.subsidiesStruct2?.noAllZeroSubsidies && !item.price) return ''

        return `
<tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
  <td${classNameMap ? ` class="${classNameMap.table.tbody.tr.td}"` : ''}>${item.title}</td>
  <td${classNameMap ? ` class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}>${
    cfg.enabledConditionsCodes
      .map(
        (_enabledCond) =>
          `${prettyPrice(
            item.price + (originalDataCases.subsidiesStruct2?.price || 0)
          )} ${getCurrencySymbol(cfg.currency)}`
      )
      .join(`</td><td${classNameMap ? ` class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}>`)}
  </td>
</tr>`})
      .join('')
    if (tbody)
      html += `
<table${classNameMap?.table.main ? ` class="${classNameMap?.table.main} mt-6"` : ''}>
  <thead${classNameMap ? ` class="${classNameMap.table.thead.main}"` : ''}>
    <tr>
      <th colspan="${cfg.enabledConditionsCodes.length + 1}"${classNameMap ? ` class="${classNameMap.table.thead.tr.th}"` : ''}>
        ${originalDataCases.subsidiesStruct2.tableHeader}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
      <th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}></th>
      <th${classNameMap ? ` class="${classNameMap.table.tbody.tr.th}"` : ''}>
        ${cfg.enabledConditionsCodes.map(getColumnSubHeader).join('</th><th>')}
      </th>
    </tr>
    ${tbody}
  </tbody>
</table>`
  }
  if (originalDataCases?.subsidiesStruct3?.price) {
    html += `
<table${classNameMap?.table.main ? ` class="${classNameMap?.table.main} mt-6"` : ''}>
  <thead${classNameMap ? ` class="${classNameMap.table.thead.main}"` : ''}>
    <tr>
      <th colspan="${cfg.enabledConditionsCodes.length + 1}"${classNameMap ? ` class="${classNameMap.table.thead.tr.th}"` : ''}>
        ${
          originalDataCases.subsidiesStruct3.tableHeader || 'No subsidiesStruct3.tableHeader'
        }
      </th>
    </tr>
  </thead>
  <tbody>
    <tr${classNameMap ? ` class="${classNameMap.table.tbody.tr.main}"` : ''}>
      <td${classNameMap ? ` class="${classNameMap.table.tbody.tr.td}"` : ''}>${originalDataCases?.subsidiesStruct3?.modelTitle || 'No subsidy.title'}</td>
      <td${classNameMap ? ` class="${clsx(classNameMap.table.tbody.tr.td, classNameMap.table.tbody.tr.numCell)}"` : ''}>${prettyPrice(
          originalDataCases?.subsidiesStruct3.price
        )} ${getCurrencySymbol(cfg.currency)}
      </td>
    </tr>
  </tbody>
</table>`
  }

  return classNameMap?.tablesWrapper?.main ? `<div class="${classNameMap?.tablesWrapper?.main}">${html}</div>` : html
}
