/* eslint-disable no-empty-pattern */
import { TCfg, TDataCases } from './types'
import { getTable2017v1Html } from './getTable2017v1Html'
import baseClasses from '~/App.module.scss'
import clsx from 'clsx'

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
      tablesWrapper: {
        main: clsx(
          'w-full',
          baseClasses.stack4,
        ),
      },
      table: {
        main: clsx(
          'w-full',
          'text-sm',
          'text-left',
          'text-gray-500',

          // 'border-solid',
          // 'border-slate-50',
        ),
        thead: {
          main: clsx(
            'text-xs',
            // 'text-gray-700',
            'text-slate-600',
            'uppercase',
            // 'bg-gray-50',
            'bg-slate-50',
          ),
          tr: {
            th: clsx('px-2', 'py-2'),
          },
        },
        tbody: {
          tr: {
            main: clsx(
              'bg-white',
              'border-b',
              // 'red-border',
            ),
            th: clsx(
              'px-2',
              'py-2',
              'font-medium',
              'text-gray-900',
              'whitespace-nowrap',
              'text-center',
            ),
            td: clsx('px-2', 'py-2'),
            numCell: clsx(
              'whitespace-no-wrap',
              'font-weight-bold',
              'min-cell',
              'text-right',
            ),
          },
        },
      },
    },
    // NOTE: From legacy classNameStr: 'w-full text-sm text-left text-gray-500 dark:text-gray-400',
  })
}
