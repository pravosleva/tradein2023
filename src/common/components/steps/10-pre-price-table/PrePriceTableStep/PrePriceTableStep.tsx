import { ResponsiveBlock } from '~/common/components/sp-custom'
import { PriceTable, TPriceTableProps } from '~/common/components/sp-custom'

export const PrePriceTableStep = (props: TPriceTableProps) => {
  return (
    <>
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
          <PriceTable {...props} />
        </div>
      </ResponsiveBlock>
    </>
  )
}
