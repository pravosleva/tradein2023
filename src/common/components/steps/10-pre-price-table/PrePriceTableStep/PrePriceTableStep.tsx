import { ResponsiveBlock } from '~/common/components/sp-custom'
import { PriceTable, TPriceTableProps } from '~/common/components/sp-custom'

export const PrePriceTableStep = (props: TPriceTableProps) => {
  return (
    <>
      {/* <ResponsiveBlock
        isPaddedMobile
        isLimitedForDesktop
        style={{
          border: '1px dashed lightgray',
        }}
      >
        Descr
      </ResponsiveBlock> */}

      <ResponsiveBlock
        isPaddedMobile
        isLimitedForDesktop
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <PriceTable
            {...props}
          />
        </div>
      </ResponsiveBlock>

      {/* <ResponsiveBlock
        isPaddedMobile
        isLimitedForDesktop
        style={{
          border: '1px dashed lightgray',
        }}
      >
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </ResponsiveBlock> */}
    </>
  )
}
