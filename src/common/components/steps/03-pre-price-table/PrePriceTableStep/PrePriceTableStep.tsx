import { ResponsiveBlock } from "~/common/components/sp-custom"

export const PrePriceTableStep = () => {
  return (
    <>
      <ResponsiveBlock
        isPaddedMobile
        isLimitedForDesktop
        style={{
          border: '1px dashed lightgray',
        }}
      >
        Descr
      </ResponsiveBlock>

      <div
        style={{
          border: '1px dashed red',
        }}
      >
        TODO: Table will be set here
      </div>

      <ResponsiveBlock
        isPaddedMobile
        isLimitedForDesktop
        style={{
          border: '1px dashed lightgray',
        }}
      >
        Etc.
      </ResponsiveBlock>
    </>
  )
}
