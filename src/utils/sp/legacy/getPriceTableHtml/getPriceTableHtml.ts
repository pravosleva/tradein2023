/* eslint-disable no-empty-pattern */
import { TCfg, TDataCases } from './types'
import { getTable2017v1Html } from './getTable2017v1Html'

export const getPriceTableHtml = ({
  cfg,
  dataCases,
}: {
  cfg: TCfg;
  dataCases: TDataCases;
}): string => {
  if (!cfg.color) return 'color is required!'
  if (!cfg.memory) return 'memory is required!'

  return getTable2017v1Html({
    cfg,
    originalDataCases: dataCases,
    // classNameStr: 'nw-2022-small-table-text',
    classNameMap: {
      // table: {
      //   main: 'w-full text-sm text-left text-gray-500',
      //   thead: {
      //     main: 'text-xs text-gray-700 uppercase bg-gray-50',
      //     tr: {
      //       th: 'px-6 py-3',
      //     },
      //   },
      //   tbody: {
      //     tr: {
      //       main: 'bg-white border-b',
      //       th: 'px-6 py-4 font-medium text-gray-900 whitespace-nowrap',
      //       td: 'px-6 py-4',
      //     },
      //   },
      // },
      table: {
        main: 'w-full text-sm text-left text-gray-500',
        thead: {
          main: 'text-xs text-gray-700 uppercase bg-gray-50',
          tr: {
            th: 'px-3 py-3',
          },
        },
        tbody: {
          tr: {
            main: 'bg-white border-b',
            th: 'px-3 py-2 font-medium text-gray-900 whitespace-nowrap',
            td: 'px-3 py-2',
          },
        },
      },
    },
    // NOTE: From legacy classNameStr: 'w-full text-sm text-left text-gray-500 dark:text-gray-400',
  })
}
