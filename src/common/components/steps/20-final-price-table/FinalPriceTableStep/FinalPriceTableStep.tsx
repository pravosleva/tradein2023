import { ResponsiveBlock } from "~/common/components/sp-custom"
import { PriceTable, TPriceTableProps } from '~/common/components/sp-custom'
import {
  getTranslatedConditionCode,
  getTranslatedConditionSuffixCode,
  getTranslatedDefectReasonCode,
} from "~/common/components/sp-custom/PriceTable/utils"
import baseClasses from '~/App.module.scss'
import { NSP } from "~/utils/httpClient"

type TFinalPriceTableProps = (TPriceTableProps & { photoStatusResponse?: NSP.TPhotoStatusResponse | null })

export const FinalPriceTableStep = (props: TFinalPriceTableProps) => {
  return (
    <div className={baseClasses.stack7}>
      <ResponsiveBlock
        isPaddedMobile
        isLimitedForDesktop
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'gray',
          }}
        >
          {
            !!props.checkPhoneResponse?.condition && (
              <b>Состояние: {
                getTranslatedConditionCode(props.checkPhoneResponse.condition)
              }{
                props.photoStatusResponse?.condition_limit_reason
                  ? ` ${getTranslatedConditionSuffixCode({ suffixCode: props.photoStatusResponse.condition_limit_reason })}`
                  : ''
              }</b>
            )
          }
          {
            !!props?.photoStatusResponse?.condition_limit_reason && (
              <b>Дефекты: {getTranslatedDefectReasonCode({
                deviceType: props.imeiResponse.phone.type || 'NO DEVICE TYPE',
                defectCode: props.photoStatusResponse.condition_limit_reason,
              })}</b>
            )
          }
          {/* <pre>{JSON.stringify(props.photoStatusResponse, null, 2)}</pre> */}
        </div>
      </ResponsiveBlock>

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
        style={{ border: '1px dashed lightgray' }}
      >
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </ResponsiveBlock> */}
    </div>
  )
}
